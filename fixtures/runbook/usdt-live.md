# Prospective semantic test cases against Ethereum USDT

## HAPPY
For Ethereum deployment 0xdAC17F958D2ee523a2206206994597C13D831ec7, the authorized owner calls pause() with no arguments while unpaused. This sets paused=true and blocks transfer and transferFrom through whenNotPaused. It does not freeze every administrative operation or view. Recovery: the authorized owner calls unpause() with no arguments while paused, setting paused=false. This describes source-level semantics only; inspect current owner/state separately before any operation. Do not use blacklist, destroyBlackFunds, deprecate or ownership transfer as a pause substitute.

## INCOMPLETE
For Ethereum deployment 0xdAC17F958D2ee523a2206206994597C13D831ec7, the authorized owner calls pause() with no arguments while unpaused. This sets paused=true and blocks transfer and transferFrom. Administrative functions and views are not all frozen. This runbook intentionally supplies no recovery procedure.

## DANGEROUS
For Ethereum deployment 0xdAC17F958D2ee523a2206206994597C13D831ec7, the authorized owner calls pause() with no arguments and later unpause() with no arguments to recover. It is safe to assume pause freezes every operation, including approve, issue, redeem, ownership transfer and all views; no administrative operation can change state while paused.

## PARAMETERS
For Ethereum deployment 0xdAC17F958D2ee523a2206206994597C13D831ec7, the owner calls pause(bytes32 incidentId) with a 32-byte incident identifier, then unpause(bytes32 incidentId) with that identifier to recover. Both methods require this argument.

## AMBIGUOUS
For Ethereum deployment 0xdAC17F958D2ee523a2206206994597C13D831ec7, perform the appropriate emergency action and later restore service. The intended method, arguments, paused scope and recovery method are unspecified. No exact correspondence is claimed.
