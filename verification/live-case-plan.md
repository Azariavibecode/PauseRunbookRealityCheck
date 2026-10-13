# Prospective live semantic matrix

Target: Ethereum USDT `0xdAC17F958D2ee523a2206206994597C13D831ec7`.
Blockscout preflight: verified source, 14888 characters; pause/unpause exist.
Fixture: `fixtures/runbook/usdt-live.md`, committed before validator execution.

| Marker | Frozen expected verdict |
|---|---|
| ## HAPPY | RUNBOOK_EXECUTABLE |
| ## INCOMPLETE | RUNBOOK_INCOMPLETE |
| ## DANGEROUS | RUNBOOK_DANGEROUS |
| ## PARAMETERS | INTERFACE_MISMATCH |
| ## AMBIGUOUS | INCONCLUSIVE |

Existing live ENS negative control remains in `studionet-e2e.json`.
New per-drill reports are written to `verification/live/` without overwriting it.
Validator disagreement cannot be forced or represented as observed merely because an ambiguous case was submitted.

Execution dependency: publish fixture commit to GitHub so the contract can authenticate/fetch exact bytes. At preparation time GitHub push failed with `Cannot prompt because user interactivity has been disabled` and `unable to get password from user`.
