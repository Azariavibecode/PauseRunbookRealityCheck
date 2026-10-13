import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import { privateKeyToAccount } from "viem/accounts";
import { writeFileSync } from "node:fs";

for (const name of ["TEST_WALLET_A_PRIVATE_KEY", "TEST_WALLET_B_PRIVATE_KEY", "CONTRACT_ADDRESS"])
  if (!process.env[name]) throw new Error(`Missing ${name}`);
const wallets = [process.env.TEST_WALLET_A_PRIVATE_KEY, process.env.TEST_WALLET_B_PRIVATE_KEY].map((key) => privateKeyToAccount(key.startsWith("0x") ? key : `0x${key}`));
const address = process.env.CONTRACT_ADDRESS;
const reader = createClient({ chain: studionet });
const client = (account) => createClient({ chain: studionet, account });
const parse = async (name, args = []) => JSON.parse(await reader.readContract({ address, functionName: name, args }));
const transactions = [];
async function submit(account, functionName, args) {
  const hash = await client(account).writeContract({ address, functionName, args });
  const receipt = await reader.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 3000, retries: 140 });
  const tx = await reader.getTransaction({ hash });
  transactions.push({ function: functionName, hash, actor: account.address, status: receipt.status_name || receipt.status, result_name: tx?.result_name || "FINALIZED", explorer_url: `https://explorer-studio.genlayer.com/transactions/${hash}` });
  console.log(`${functionName}: ${hash}`);
}
const before = await parse("get_counts");
const drillId = BigInt(before.drill_count);
const source = JSON.stringify({ owner: "Azariavibecode", repo: "PauseRunbookRealityCheck", commit: "03865b5653d2a519747d6773dd06b152fe0a0c4d", path: "/fixtures/runbook/usdt-live.md", digest: "0".repeat(64), marker: "## HAPPY" });
await submit(wallets[0], "create_drill", ["bad-digest-control", 1n, "0xdAC17F958D2ee523a2206206994597C13D831ec7", source]);
await submit(wallets[1], "observe_runbook", [drillId]);
await submit(wallets[0], "seal_drill", [drillId]);
const observation = await parse("get_observation", [drillId, "RUNBOOK"]);
const drill = await parse("get_drill", [drillId]);
const after = await parse("get_counts");
if (!observation.error || drill.state !== "OPEN" || JSON.stringify(after) !== JSON.stringify({ ...before, drill_count: before.drill_count + 1 })) throw new Error("Source failure safety invariant failed");
const report = { generated_at: new Date().toISOString(), network: "StudioNet", contract: address, drill_id: Number(drillId), expected: "SOURCE_UNVERIFIED and OBSERVATIONS_INCOMPLETE", before, after, observation, drill, transactions };
writeFileSync(`verification/live/drill-${drillId}-source-failure.json`, JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
