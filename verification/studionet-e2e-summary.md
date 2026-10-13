# StudioNet E2E — verified negative control

- executed: 2026-10-13
- GenLayer contract: `0xc502654bB57dEAA37f106AfaE5260704a474846A`
- public Ethereum target: ENS Registry `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`
- frozen expectation: `INTERFACE_MISMATCH / METHOD_MISSING`
- observed terminal state: `HAZARD_RECORDED`
- counters: `drill_count 0 → 1`, `hazard_count 0 → 1`, all other terminal counters unchanged
- actors: two auxiliary wallets; the deployer performed no lifecycle action
- consensus: all six writes finalized with `MAJORITY_AGREE`

The GitHub runbook names `pauseWithdrawals(bytes32)` and `unpauseWithdrawals(bytes32)`. The independently observed verified ENS Registry ABI contains neither method, so the contract correctly rejected compatibility. A terminal replay finalized without changing the drill or counters.

Exact transaction hashes, actors, source commitments, ABI digest, source digest and readbacks are preserved in [`studionet-e2e.json`](studionet-e2e.json).
