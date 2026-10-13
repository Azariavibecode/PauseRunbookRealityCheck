# PauseRunbookRealityCheck

PauseRunbookRealityCheck is a contract-only GenLayer audit protocol that checks whether an emergency runbook accurately describes the callable pause and recovery interface of one exact Ethereum deployment.

The contract authenticates a commit-pinned GitHub runbook section and independently observes verified source code plus ABI from Ethereum Blockscout. GenLayer validators judge the semantic correspondence. Deterministic code validates every consequential finding and records either a positive certificate, a hazard, or an inconclusive result.

## Why GenLayer

ABI equality can show that a function exists, but it cannot determine whether natural-language instructions accurately describe parameter meaning, pause scope, operational hazards, and a usable recovery path. GenLayer performs this bounded comparison. It never calls the target contract, chooses an administrator, or infers live permissions.

## Proof boundary

The protocol can establish that an exact runbook section is semantically aligned with the verified source and ABI observed for an exact address at assessment time. It does not prove current role holders, storage state, transaction success, production readiness, or that an operator followed the runbook. Blockscout verification is trusted only for its deployed-source/interface observation; GitHub is trusted only for exact committed runbook bytes.

## Distinct architecture

```text
independent audit drill
  → authenticate runbook observation
  → observe verified deployment interface/source
  → seal both immutable observations
  → bounded semantic audit
  → CERTIFIED | HAZARD_RECORDED | INCONCLUSIVE
```

This is an append-only audit drill, not a release head, namespace registry, challenge court, authorization permit, custody flow, or uniqueness lock. Each drill is independent and never replaces another drill.

## Positive gate

`RUNBOOK_EXECUTABLE` requires all five findings to be exact JSON booleans and true:

- named method exists;
- parameter mapping matches;
- claimed pause scope is supported;
- a usable recovery action is described;
- no unsupported or dangerous action is presented as safe.

Malformed or cross-field-inconsistent model output becomes `INCONCLUSIVE`. Source failure stores no observation and cannot reach `SEALED`.

## Public methods

```text
create_drill(project, chain_id, contract_address, runbook_source_json)
observe_runbook(drill_id)
observe_contract(drill_id)
seal_drill(drill_id)
audit_drill(drill_id)
get_drill(drill_id)
get_observation(drill_id, slot)
get_counts()
```

The first release deliberately supports only Ethereum mainnet (`chain_id=1`) and the fixed Ethereum Blockscout origin. Multi-chain support requires explicit per-chain authority adapters and tests.

## Roles

- Main wallet: deploy only; it receives no owner/admin power.
- Auxiliary wallet A: creates test drills and records one observation.
- Auxiliary wallet B: records the other observation, seals, and triggers audits.
- Any steward may create and audit a new drill using public evidence without permission.

## Local verification

```bash
python -m pytest -q
```

Current local result: `18 passed`. Target runtime: GenLayer `0.2.16`. No frontend is included.

## StudioNet E2E

After the main wallet deploys the contract, copy `.env.studionet.example` to a local `.env`, fill it with the two auxiliary test keys and frozen public-source commitments, then export those variables and run:

```bash
npm run e2e:studionet
```

The runner makes every lifecycle write from the auxiliary wallets, checks finalized transactions and readbacks, verifies terminal replay cannot mutate state, and writes `verification/studionet-e2e.json`. The report is ignored by default so incomplete or secret-adjacent output is not accidentally committed; add it explicitly only after review. Private keys are never written to the report.

See [architecture](docs/ARCHITECTURE.md), [threat model](docs/THREAT_MODEL.md), [test resource manifest](verification/test-resource-manifest.md), [local verification](verification/local-verification.md), and the [release checklist](verification/release-checklist.md).
