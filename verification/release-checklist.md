# Release checklist

## Before deployment

- [x] Contract targets GenLayer runtime `0.2.16`.
- [x] No deployer, owner, admin, upgrade or withdrawal privilege exists.
- [x] GitHub acquisition is bound to owner, repository, 40-hex commit, exact path, blob identity, SHA-256 and unique marker.
- [x] Deployment acquisition is bound to Ethereum mainnet, the exact address and fixed Ethereum Blockscout origin.
- [x] Positive certification requires every consequential boolean to be true and all cross-fields to agree.
- [x] Source failures write no observation; malformed validator output cannot certify.
- [x] Local happy, failure, conflict, adversarial and replay tests pass.

## Required before claiming live E2E

- [x] Choose a public verified Ethereum target and commit a public runbook.
- [x] Freeze the expected negative-control result and record the exact SHA-256 before validator execution.
- [x] Deploy only from the main wallet and record the Studio Explorer contract URL.
- [x] Run `npm run e2e:studionet` using two auxiliary wallets.
- [x] Inspect every finalized transaction and all contract readbacks.
- [x] Commit the generated `verification/studionet-e2e.json` intentionally as evidence.

Live execution on 2026-10-13 used ENS Registry as a frozen negative control. Its verified interface deliberately lacks the runbook methods. The expected and observed result was `INTERFACE_MISMATCH / METHOD_MISSING`; this is failure-path evidence, not a positive certificate claim. Local mocks remain distinct from StudioNet evidence.
