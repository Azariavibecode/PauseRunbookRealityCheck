# Emergency Operations

## DRILL WITHDRAWAL-PAUSE-001

On Ethereum mainnet, call `pauseWithdrawals(bytes32 reason)` on the registered vault address. The `reason` argument records the incident identifier. This pauses withdrawals only; repayments remain available. After the incident is resolved, call `unpauseWithdrawals(bytes32 reason)` with the same incident identifier. Do not call the global emergency shutdown function.
