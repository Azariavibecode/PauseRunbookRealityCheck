# Test resource manifest

## RUNBOOK-EXECUTABLE

- purpose: positive
- authority: GitHub-controlled commit/tree/blob/raw APIs
- path: `/fixtures/runbook/executable.md`
- expected deterministic facts: exact commit/path/blob/bytes/digest/unique marker
- expected semantic result: `RUNBOOK_EXECUTABLE / FULL_ALIGNMENT`
- boundary: proves committed runbook bytes, not operator execution or current permissions

## RUNBOOK-INCOMPLETE

- purpose: negative semantic control
- authority: GitHub-controlled commit/tree/blob/raw APIs
- path: `/fixtures/runbook/incomplete.md`
- expected semantic result: `RUNBOOK_INCOMPLETE / RECOVERY_MISSING`

## RUNBOOK-DANGEROUS

- purpose: adversarial semantic control
- authority: GitHub-controlled commit/tree/blob/raw APIs
- path: `/fixtures/runbook/dangerous.md`
- expected semantic result: `RUNBOOK_DANGEROUS / UNSAFE_SCOPE`

## CONTRACT-OBSERVATION

- purpose: independent deployed-interface observation
- authority: Ethereum Blockscout smart-contract API
- canonical origin: `https://eth.blockscout.com`
- object binding: `chain_id=1 + exact contract address`
- required facts: response address match, `is_verified=true`, non-empty bounded ABI functions and verified source
- recorded commitments: normalized ABI SHA-256 and source SHA-256
- boundary: does not prove current roles, storage, call success or production readiness

## Required failure controls

- wrong GitHub digest, blob identity, path and unavailable raw source;
- wrong Blockscout address, unverified source, empty ABI and empty source;
- missing method and parameter mismatch;
- unsupported scope and missing recovery;
- malformed/internally inconsistent positive model output;
- post-seal observation replay and terminal audit replay;
- cross-drill/object evidence reuse.

Exact public commit, digests, target deployment and availability timestamp must be filled before StudioNet execution. Expected semantic results must be frozen before observing validator output.
