# Local verification

Command:

```bash
python -m pytest -q
```

Current result: `18 passed`.

Coverage includes:

- executable, incomplete, dangerous and interface-mismatch semantic branches;
- GitHub digest, blob and availability failures;
- Blockscout wrong-address, unverified, empty-ABI and empty-source failures;
- inconsistent positive output downgraded to `INCONCLUSIVE`;
- observation immutability, terminal replay and counter preservation;
- chain/address input guards and absence of deployer privilege;
- static checks for fixed authorities, digest binding, positive gate and architecture distinction.

These Direct Mode tests use mocked network/LLM responses. They validate the real public contract methods and state transitions but do not claim StudioNet finality or live external-source availability.
