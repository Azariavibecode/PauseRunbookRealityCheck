# Complete StudioNet scenario matrix

Contract: `0xc502654bB57dEAA37f106AfaE5260704a474846A`

All lifecycle writes were made by the two auxiliary wallets. The deployment wallet was not used for testing. Every listed transaction finalized on StudioNet.

| Drill | Scenario | Expected | Observed state / verdict | Counter effect |
|---:|---|---|---|---|
| 0 | ENS missing methods | `INTERFACE_MISMATCH` | `HAZARD_RECORDED / METHOD_MISSING` | hazard +1 |
| 1 | USDT exact pause/recovery | `RUNBOOK_EXECUTABLE` | `CERTIFIED / FULL_ALIGNMENT` | certified +1 |
| 2 | recovery omitted | `RUNBOOK_INCOMPLETE` | `HAZARD_RECORDED / RECOVERY_MISSING` | hazard +1 |
| 3 | unsupported global scope | `RUNBOOK_DANGEROUS` | `HAZARD_RECORDED / UNSAFE_SCOPE` | hazard +1 |
| 4 | wrong bytes32 parameters | `INTERFACE_MISMATCH` | `HAZARD_RECORDED / PARAMETER_MISMATCH` | hazard +1 |
| 5 | unspecified operation | `INCONCLUSIVE` | `INCONCLUSIVE / AMBIGUOUS_EVIDENCE` | inconclusive +1 |
| 6 | wrong source SHA-256 | source rejection | stayed `OPEN`; no observation stored; seal rejected | terminal counters unchanged |

Drill 4 also exercised live validator conflict: audit attempts 1 and 2 finalized as `MAJORITY_DISAGREE`. The drill remained `SEALED` with unchanged counters. Attempt 3 reached `MAJORITY_AGREE` and recorded the expected parameter mismatch.

Every terminal scenario includes a replay transaction and an exact before/after state-and-counter comparison. The replay did not mutate terminal state. Drill 5 was resumed after a transient StudioNet RPC HTML response interrupted submission; its pre-resume readback proves it remained safely `SEALED / PENDING`.

Evidence files:

- `../studionet-e2e.json`: drill 0 ENS missing-method control.
- `drill-1.json`: happy path.
- `drill-2.json`: missing recovery.
- `drill-3.json`: dangerous scope.
- `drill-4.json`: parameter mismatch plus two disagreement rounds.
- `drill-5-resume.json`: ambiguous/inconclusive result and replay.
- `drill-6-source-failure.json`: bad-digest provenance failure.

Final contract counters after drill 6: `drill_count=7`, `certified_count=1`, `hazard_count=4`, `inconclusive_count=1`.
