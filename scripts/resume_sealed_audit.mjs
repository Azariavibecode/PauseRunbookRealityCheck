import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import { privateKeyToAccount } from "viem/accounts";
import { mkdirSync, writeFileSync } from "node:fs";

for (const name of ["TEST_WALLET_A_PRIVATE_KEY", "TEST_WALLET_B_PRIVATE_KEY", "CONTRACT_ADDRESS", "DRILL_ID", "EXPECTED_VERDICT"])
  if (!process.env[name]) throw new Error(`Missing ${name}`);

const keys = [process.env.TEST_WALLET_A_PRIVATE_KEY, process.env.TEST_WALLET_B_PRIVATE_KEY];
const wallets = keys.map((key) => privateKeyToAccount(key.startsWith("0x") ? key : `0x${key}`));
const address = process.env.CONTRACT_ADDRESS;
const drillId = BigInt(process.env.DRILL_ID);
const reader = createClient({ chain: studionet });
const writer = (account) => createClient({ chain: studionet, account });
const parse = async (name, args = []) => JSON.parse(await reader.readContract({ address, functionName: name, args }));
const transactions = [];

async function submit(account, label) {
  let hash;
  for (let rpcAttempt = 1; rpcAttempt <= 5; rpcAttempt += 1) {
    try {
      hash = await writer(account).writeContract({ address, functionName: "audit_drill", args: [drillId] });
      break;
    } catch (error) {
      if (rpcAttempt === 5) throw error;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
  console.log(`${label}_submitted: ${hash}`);
  const receipt = await reader.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 3000, retries: 140 });
  const tx = await reader.getTransaction({ hash });
  transactions.push({ label, hash, actor: account.address, status: receipt.status_name || receipt.status, result_name: tx?.result_name || "FINALIZED", explorer_url: `https://explorer-studio.genlayer.com/transactions/${hash}` });
  return tx?.result_name || "FINALIZED";
}

const before = { drill: await parse("get_drill", [drillId]), counts: await parse("get_counts") };
if (before.drill.state !== "SEALED") throw new Error(`Drill ${drillId} is ${before.drill.state}, expected SEALED`);
let drill;
for (let attempt = 1; attempt <= 4; attempt += 1) {
  const result = await submit(wallets[attempt % 2], `audit_resume_${attempt}`);
  drill = await parse("get_drill", [drillId]);
  if (result === "MAJORITY_AGREE" && drill.state !== "SEALED") break;
  if (drill.state !== "SEALED") throw new Error(`Unsafe state after ${result}`);
}
if (drill?.verdict !== process.env.EXPECTED_VERDICT) throw new Error(`Expected ${process.env.EXPECTED_VERDICT}, got ${drill?.verdict}`);
const terminalBefore = JSON.stringify({ drill, counts: await parse("get_counts") });
await submit(wallets[1], "terminal_replay_attempt");
const after = { drill: await parse("get_drill", [drillId]), counts: await parse("get_counts") };
if (terminalBefore !== JSON.stringify(after)) throw new Error("Terminal replay mutated state");
mkdirSync("verification/live", { recursive: true });
const report = { generated_at: new Date().toISOString(), network: "StudioNet", contract: address, resumed_drill_id: Number(drillId), before, after, transactions };
writeFileSync(`verification/live/drill-${drillId}-resume.json`, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
