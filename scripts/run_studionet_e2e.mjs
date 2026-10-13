import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";
import { privateKeyToAccount } from "viem/accounts";
import { writeFileSync } from "node:fs";


const required = [
  "TEST_WALLET_A_PRIVATE_KEY", "TEST_WALLET_B_PRIVATE_KEY", "CONTRACT_ADDRESS",
  "TARGET_CONTRACT_ADDRESS", "RUNBOOK_OWNER", "RUNBOOK_REPO", "RUNBOOK_COMMIT",
  "RUNBOOK_PATH", "RUNBOOK_DIGEST", "RUNBOOK_MARKER", "EXPECTED_VERDICT",
];
for (const name of required) if (!process.env[name]) throw new Error(`Missing ${name}`);
const keys = [process.env.TEST_WALLET_A_PRIVATE_KEY, process.env.TEST_WALLET_B_PRIVATE_KEY];
if (keys.some((key) => !/^(0x)?[0-9a-fA-F]{64}$/.test(key))) throw new Error("Invalid auxiliary key format");
if (!/^0x[0-9a-fA-F]{40}$/.test(process.env.CONTRACT_ADDRESS) || !/^0x[0-9a-fA-F]{40}$/.test(process.env.TARGET_CONTRACT_ADDRESS)) throw new Error("Invalid address");
if (!/^[0-9a-fA-F]{40}$/.test(process.env.RUNBOOK_COMMIT) || !/^[0-9a-fA-F]{64}$/.test(process.env.RUNBOOK_DIGEST)) throw new Error("Invalid source commitment");

const contract = process.env.CONTRACT_ADDRESS;
const target = process.env.TARGET_CONTRACT_ADDRESS;
const wallets = keys.map((key) => privateKeyToAccount(key.startsWith("0x") ? key : `0x${key}`));
const reader = createClient({ chain: studionet });
const writer = (wallet) => createClient({ chain: studionet, account: wallet });
const explorer = "https://explorer-studio.genlayer.com";
const transactions = [];
const parse = async (name, args = []) => JSON.parse(await reader.readContract({ address: contract, functionName: name, args }));

async function submit(wallet, functionName, args, label, allowDisagree = false) {
  const raw = await writer(wallet).writeContract({ address: contract, functionName, args });
  const hash = typeof raw === "string" ? raw : raw?.txId || raw?.hash;
  if (!hash) throw new Error(`${label}: missing transaction hash`);
  console.log(`${label}_submitted: ${hash}`);
  const receipt = await reader.waitForTransactionReceipt({ hash, status: TransactionStatus.FINALIZED, interval: 3000, retries: 140 });
  const tx = await reader.getTransaction({ hash });
  const status = receipt.status_name || receipt.status;
  const resultName = tx?.result_name || tx?.resultName || tx?.result?.name || "";
  if (status !== TransactionStatus.FINALIZED) throw new Error(`${label}: ${status}/${resultName}`);
  if (!allowDisagree && resultName && resultName !== "MAJORITY_AGREE") throw new Error(`${label}: ${resultName}`);
  transactions.push({ label, hash, actor: wallet.address, status, result_name: resultName || "FINALIZED", explorer_url: `${explorer}/transactions/${hash}` });
  return resultName || "FINALIZED";
}

const source = JSON.stringify({
  owner: process.env.RUNBOOK_OWNER,
  repo: process.env.RUNBOOK_REPO,
  commit: process.env.RUNBOOK_COMMIT.toLowerCase(),
  path: process.env.RUNBOOK_PATH,
  digest: process.env.RUNBOOK_DIGEST.toLowerCase(),
  marker: process.env.RUNBOOK_MARKER,
});

const before = await parse("get_counts");
const drillId = BigInt(before.drill_count);
await submit(wallets[0], "create_drill", ["public-emergency-drill", 1n, target, source], "create_drill");
await submit(wallets[1], "observe_runbook", [drillId], "observe_runbook");
await submit(wallets[0], "observe_contract", [drillId], "observe_contract");
const runbookObservation = await parse("get_observation", [drillId, "RUNBOOK"]);
const contractObservation = await parse("get_observation", [drillId, "CONTRACT"]);
if (runbookObservation.status !== "VERIFIED" || contractObservation.status !== "VERIFIED") throw new Error("Observation readback failed");
await submit(wallets[1], "seal_drill", [drillId], "seal_drill");

let finalDrill;
for (let attempt = 1; attempt <= 4; attempt += 1) {
  const result = await submit(wallets[attempt % 2], "audit_drill", [drillId], `audit_${attempt}`, true);
  finalDrill = await parse("get_drill", [drillId]);
  if (result === "MAJORITY_AGREE" && ["CERTIFIED", "HAZARD_RECORDED", "INCONCLUSIVE"].includes(finalDrill.state)) break;
  if (finalDrill.state !== "SEALED") throw new Error(`Unsafe audit state after ${result}`);
}
if (!finalDrill || finalDrill.verdict !== process.env.EXPECTED_VERDICT) throw new Error(`Expected ${process.env.EXPECTED_VERDICT}, got ${finalDrill?.verdict}`);
const terminalBeforeReplay = JSON.stringify({ drill: finalDrill, counts: await parse("get_counts") });
await submit(wallets[1], "audit_drill", [drillId], "terminal_replay_attempt");
const terminalAfterReplay = JSON.stringify({ drill: await parse("get_drill", [drillId]), counts: await parse("get_counts") });
if (terminalBeforeReplay !== terminalAfterReplay) throw new Error("Terminal replay mutated state");

const report = {
  generated_at: new Date().toISOString(), network: "StudioNet", chain_id: 61999,
  contract, contract_explorer_url: `${explorer}/address/${contract}`,
  target_contract: target,
  wallets: { auxiliary_a: wallets[0].address, auxiliary_b: wallets[1].address },
  source: JSON.parse(source), before, after: await parse("get_counts"),
  runbook_observation: runbookObservation,
  contract_observation: { ...contractObservation, source: `[omitted ${contractObservation.source.length} chars]` },
  drill: await parse("get_drill", [drillId]), transactions,
};
writeFileSync("verification/studionet-e2e.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
