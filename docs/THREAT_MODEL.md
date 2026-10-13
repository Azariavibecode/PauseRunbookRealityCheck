# Threat model

| Threat | Control |
|---|---|
| Claimant supplies arbitrary runbook text | Contract derives fixed GitHub API/raw URLs from owner, repo, full commit and validated path |
| Mutable branch or digest assertion | Full commit, Git tree entry, blob SHA-1, raw length and recomputed SHA-256 are checked |
| Evidence from another repository/path | Exact commit tree must contain the registered path once |
| Fake explorer or deceptive origin | Contract constructs the fixed `https://eth.blockscout.com` endpoint |
| Interface response belongs to another address | Response address must equal the drill address exactly |
| Unverified or empty source | `is_verified=true`, non-empty bounded source and non-empty bounded ABI function inventory are mandatory |
| Prompt injection in runbook/source | Both are labeled untrusted evidence; output schema and cross-field invariants are enforced in code |
| Model invents a positive certificate | `RUNBOOK_EXECUTABLE` requires five exact true booleans and `FULL_ALIGNMENT` |
| Global shutdown described as narrow pause | Unsupported scope or hazard produces `RUNBOOK_DANGEROUS` |
| Missing recovery step | Callable pause with no recovery produces `RUNBOOK_INCOMPLETE` |
| Source outage or ambiguous evidence | No observation is stored, or terminal result is `INCONCLUSIVE`; never certified |
| Evidence mutation after seal | Observation registration requires `OPEN`; audit requires `SEALED` |
| Audit replay | Terminal state is not `SEALED`, so a second audit cannot mutate counters |
| Deployer privilege | No owner/admin/allowlist storage or privileged method exists |

## Explicit limitations

- Source/ABI verification does not prove current role membership or live storage.
- This version does not execute pause or recovery transactions.
- A certificate does not prove operators followed the runbook.
- GitHub fixtures are synthetic test material, not a production incident policy.
- Local mocked tests are not StudioNet finality evidence; fresh live evidence is required after deployment.
