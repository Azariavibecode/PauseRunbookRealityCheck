# Architecture

## Proof obligation

Claim: one exact emergency-runbook section accurately identifies callable methods and parameters, describes a source-supported pause scope, avoids presenting a broader hazardous action as narrow, and includes a usable recovery action for one exact Ethereum contract address.

Falsifiers include a missing method, mismatched parameter types, unsupported scope claim, global shutdown described as a partial pause, missing recovery instruction, wrong address, unverified explorer source, wrong GitHub object/revision/blob, digest mismatch, or ambiguous correspondence.

## Evidence topology

The two authorities are intentionally different:

1. GitHub commit/tree/blob/raw APIs authenticate the runbook bytes at a full commit.
2. Ethereum Blockscout independently identifies the exact address and supplies its verified ABI and source observation.

Neither source alone can create a certificate. GitHub does not prove runtime interface facts; Blockscout does not prove what the runbook says.

## State topology

```text
OPEN
 ├─ RUNBOOK observation
 └─ CONTRACT observation
       ↓ both present
     SEALED
       ↓ consensus audit
 ├─ CERTIFIED
 ├─ HAZARD_RECORDED
 └─ INCONCLUSIVE
```

Observations can arrive in either order and are immutable once stored. Sealing requires both. Audit is terminal and cannot be replayed. Validator disagreement rolls back the write, leaving the drill `SEALED` for permissionless retry.

## Judgment and execution boundary

Validators compare untrusted runbook prose with the authenticated function inventory and verified source. They return only a fixed verdict, fixed reason code, drill identity, and five booleans. Deterministic contract logic validates schema, identity and cross-field consistency before selecting terminal state and counters.

The contract never calls the observed deployment. A certificate is an exact audit record, not transaction authority.

## Originality boundary

There is no active head, candidate activation, compare-and-swap release lineage, tuple reservation, evidence challenge, escrow, payout, or consumable permit. Persistent behavior is one immutable audit certificate or hazard record per independent drill.
