# PauseRunbookRealityCheck — StudioNet evidence

Contract: [0xc502654bB57dEAA37f106AfaE5260704a474846A](https://explorer-studio.genlayer.com/address/0xc502654bB57dEAA37f106AfaE5260704a474846A)

Runbook source: [`fixtures/runbook/usdt-live.md`](../fixtures/runbook/usdt-live.md) at commit `03865b5653d2a519747d6773dd06b152fe0a0c4d`. Exact raw-file SHA-256: `de5bac600bcdb72ae0577130011071d6569b77073ce4291323352609943d6185`.

Auxiliary wallet A: `0x67A1A08Fc4cf7D05c859d0d3D8398a3A30B1677e`. Auxiliary wallet B: `0x7C87B10a3d43F3b3551414401F8b26B9F662bAB5`. The deployment wallet performed no test transaction.

Completed on 2026-10-13. The evidence set contains seven drills and 41 finalized transactions. It covers a positive certificate, four independent hazard classes, inconclusive evidence, source-integrity failure, two live validator-disagreement rounds, retry, and terminal replay. Local Direct Mode regression suite: `18 passed`.

## Result matrix

| Drill | Case | Expected | Observed | Counter effect |
| ---: | --- | --- | --- | --- |
| 0 | ENS target lacks runbook methods | `INTERFACE_MISMATCH` | `HAZARD_RECORDED / METHOD_MISSING` | hazard +1 |
| 1 | USDT exact pause and recovery | `RUNBOOK_EXECUTABLE` | `CERTIFIED / FULL_ALIGNMENT` | certified +1 |
| 2 | recovery omitted | `RUNBOOK_INCOMPLETE` | `HAZARD_RECORDED / RECOVERY_MISSING` | hazard +1 |
| 3 | unsupported global pause scope | `RUNBOOK_DANGEROUS` | `HAZARD_RECORDED / UNSAFE_SCOPE` | hazard +1 |
| 4 | wrong `bytes32` parameters | `INTERFACE_MISMATCH` | `HAZARD_RECORDED / PARAMETER_MISMATCH` | hazard +1 |
| 5 | methods and scope unspecified | `INCONCLUSIVE` | `INCONCLUSIVE / AMBIGUOUS_EVIDENCE` | inconclusive +1 |
| 6 | wrong committed SHA-256 | source rejection | remained `OPEN`; no observation; seal rejected | terminal counters unchanged |

Final counters: `drill_count=7`, `certified_count=1`, `hazard_count=4`, `inconclusive_count=1`.

## Drill 0 — missing-method negative control

Target: ENS Registry `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`. Its independently observed verified ABI does not contain `pauseWithdrawals(bytes32)` or `unpauseWithdrawals(bytes32)`.

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0x622030…44bc1](https://explorer-studio.genlayer.com/transactions/0x622030c836ef61fa0c995cd35428446d7b7516ab6f50b4f68f1d785362e44bc1) | `MAJORITY_AGREE` |
| observe runbook | [0x85b228…246a8](https://explorer-studio.genlayer.com/transactions/0x85b2280c4b7493b2ae5ad9a32e2ff58e84e7296d883f74c34933fb840f9246a8) | `VERIFIED` |
| observe contract | [0xc2818c…51c2f](https://explorer-studio.genlayer.com/transactions/0xc2818c029a64e0af33f65d9ed7aec5ec21946e8be18e47f06c24e4f9cfa51c2f) | `VERIFIED` |
| seal | [0x36b54d…da008](https://explorer-studio.genlayer.com/transactions/0x36b54d3d6675387b1411da4890f3ea5d450a17562dd8b7d7b26176bf3afda008) | `SEALED` |
| audit | [0xc0912f…42070](https://explorer-studio.genlayer.com/transactions/0xc0912f11ba64ee4c3e2294d8f8c041d1e7d4da82f72453f49a1c989b6f742070) | `INTERFACE_MISMATCH / METHOD_MISSING` |
| terminal replay | [0x71659f…b1e75](https://explorer-studio.genlayer.com/transactions/0x71659fb1a169cd84defe270dc6187b2b37e00b91708e159032349af8d4cb1e75) | no state or counter mutation |

Raw readbacks: [`studionet-e2e.json`](studionet-e2e.json).

## Drill 1 — happy path

Target: verified Ethereum USDT `0xdAC17F958D2ee523a2206206994597C13D831ec7`. The authenticated runbook names the exact zero-argument `pause()` and `unpause()` methods, limits the claimed scope, and includes recovery.

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0x7a0fc5…8387d](https://explorer-studio.genlayer.com/transactions/0x7a0fc5e89a1b84b4cf73f61f9989109f772c809fa34cd493e65f6bd5b278387d) | `MAJORITY_AGREE` |
| observe runbook | [0x684d06…223e](https://explorer-studio.genlayer.com/transactions/0x684d063f5e433c2ab075f24ba6bc934f000bb0d07cbcd50874cf41e14102223e) | `VERIFIED` |
| observe contract | [0x4b9d88…141c](https://explorer-studio.genlayer.com/transactions/0x4b9d88ae8547b54129988606172379facd86db2413979b5e7a6c5516bbfc141c) | `VERIFIED` |
| seal | [0x363d61…7391c](https://explorer-studio.genlayer.com/transactions/0x363d610f4124c1438abb24e1bcecf2f29da9fecb171e3eba0c95e2e8fa57391c) | `SEALED` |
| audit | [0x31d9cd…870f2](https://explorer-studio.genlayer.com/transactions/0x31d9cd1c93c0d093a3637f3e2066e9c75dc2f32940bdf6424c364e0f6c2870f2) | `CERTIFIED / RUNBOOK_EXECUTABLE / FULL_ALIGNMENT` |
| terminal replay | [0x1c1487…89edc](https://explorer-studio.genlayer.com/transactions/0x1c14872f9d56e7b0be40dc682440c76343a9e29507351b9e0c3a1f54bcb89edc) | no state or counter mutation |

Raw readbacks: [`live/drill-1.json`](live/drill-1.json).

## Drill 2 — missing recovery

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0xc974f6…a5dd](https://explorer-studio.genlayer.com/transactions/0xc974f6b9ef91ff21c36926881e619de65948804c3e6875e51ea92acba980a5dd) | `MAJORITY_AGREE` |
| observe runbook | [0x6bfe80…9998](https://explorer-studio.genlayer.com/transactions/0x6bfe8084af791bca19d71b56b353f9576caec21d6824141739a81f0beb6d9998) | `VERIFIED` |
| observe contract | [0x463f22…ba5f](https://explorer-studio.genlayer.com/transactions/0x463f22fc95c2313aa6dbf36f58bd91812ad04d9f9969c44923f271ee2284ba5f) | `VERIFIED` |
| seal | [0x96c894…0c3c](https://explorer-studio.genlayer.com/transactions/0x96c894da71a1e70af4e47e10d9627916220b9168361417e0ac5374958b660c3c) | `SEALED` |
| audit | [0x9aaca5…8317](https://explorer-studio.genlayer.com/transactions/0x9aaca57e8a5bd7a967b0839a62e6ee3dc6a93f6911193f0101c2f784af1c8317) | `HAZARD_RECORDED / RUNBOOK_INCOMPLETE / RECOVERY_MISSING` |
| terminal replay | [0x65b532…5e01](https://explorer-studio.genlayer.com/transactions/0x65b5324eb6882aa7a3b62eb751d7052fb79a9710f2a7f024733cc328ffcf5e01) | no mutation |

Raw readbacks: [`live/drill-2.json`](live/drill-2.json).

## Drill 3 — dangerous claimed scope

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0x74a2fa…7ce0](https://explorer-studio.genlayer.com/transactions/0x74a2faf22bd04a0f415ee2c83e875aac71798eceba4189ebf64709a253317ce0) | `MAJORITY_AGREE` |
| observe runbook | [0xf902ce…3f73](https://explorer-studio.genlayer.com/transactions/0xf902ce68968608fbcee45a84c51b590905d2888dba5c328252e3fba3d98b3f73) | `VERIFIED` |
| observe contract | [0xda5bfc…eff5](https://explorer-studio.genlayer.com/transactions/0xda5bfc73ce66f7369b4702cfa644909eec32e4d2e5dc0c369d2f1dee27e0eff5) | `VERIFIED` |
| seal | [0xde5e9d…1884](https://explorer-studio.genlayer.com/transactions/0xde5e9de4b3a61a2246766f8e5d4335355c5e9b841c1fed927f630f98ce021884) | `SEALED` |
| audit | [0xeb1782…c863](https://explorer-studio.genlayer.com/transactions/0xeb1782a45c0cff9375313674233e2e2c68d59dbc0e5a2f3b17c02e6b61fec863) | `HAZARD_RECORDED / RUNBOOK_DANGEROUS / UNSAFE_SCOPE` |
| terminal replay | [0x9734df…235a](https://explorer-studio.genlayer.com/transactions/0x9734df541d629fcf156cd73e946d131012c1a49d9d1d10e8ee78de4086a6235a) | no mutation |

Raw readbacks: [`live/drill-3.json`](live/drill-3.json).

## Drill 4 — parameter mismatch and live disagreement

The runbook claims `pause(bytes32)` and `unpause(bytes32)`, while the verified ABI exposes both methods with zero inputs. The first two audit rounds finalized as `MAJORITY_DISAGREE`; the drill remained `SEALED / PENDING` and counters did not change. The third independent round reached agreement.

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0xb700cd…0848](https://explorer-studio.genlayer.com/transactions/0xb700cd1551024e066b50df859853f90e65d1019bbf7cd6259f14aad8cded0848) | `MAJORITY_AGREE` |
| observe runbook | [0xfad1d5…560d](https://explorer-studio.genlayer.com/transactions/0xfad1d576e6e0f69b25afb17728fcdf895068583da7b7bb061341cbdfc23d560d) | `VERIFIED` |
| observe contract | [0x970d04…55f7](https://explorer-studio.genlayer.com/transactions/0x970d0420c330471cc08187ad22c7d5f482b5ea5c8140950d21b378dd574355f7) | `VERIFIED` |
| seal | [0x4b7d00…251b](https://explorer-studio.genlayer.com/transactions/0x4b7d00363e40a3f41e4630d89cd71675f8572cb1577bb21ee142a284d7c8251b) | `SEALED` |
| audit attempt 1 | [0x5f3ac7…124f](https://explorer-studio.genlayer.com/transactions/0x5f3ac7c804828c0867af3601bf03b6f0ce1c4f53155c5673c71ba023910e124f) | `MAJORITY_DISAGREE`; no mutation |
| audit attempt 2 | [0xdda775…9cc8](https://explorer-studio.genlayer.com/transactions/0xdda77579e06d8571848fc4696d15404e6d4843b57bceb91c10c83ceabfd99cc8) | `MAJORITY_DISAGREE`; no mutation |
| audit attempt 3 | [0x310c04…a7a](https://explorer-studio.genlayer.com/transactions/0x310c040f2cefb291b9941711191ac7516684ca5e32d2f825475beac6a3a46a7a) | `HAZARD_RECORDED / INTERFACE_MISMATCH / PARAMETER_MISMATCH` |
| terminal replay | [0xfa9e06…8b9b](https://explorer-studio.genlayer.com/transactions/0xfa9e069288e73dc049e386bb498bbb4da890fb68786640cba4ea7caeddfc8b9b) | no mutation |

Raw readbacks: [`live/drill-4.json`](live/drill-4.json).

## Drill 5 — ambiguous evidence

The runbook does not identify an exact action, parameters, scope, or recovery method. A transient StudioNet RPC HTML response interrupted the first client submission after the drill had been sealed. The pre-resume readback records `SEALED / PENDING`; resumption then produced the safe terminal result.

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0x1da81d…78fa](https://explorer-studio.genlayer.com/transactions/0x1da81d089f1d5b99e0858c6663cb8c53d2083a73f940e86de17004fc4fcf78fa) | `MAJORITY_AGREE` |
| observe runbook | [0xb978e7…4ce3](https://explorer-studio.genlayer.com/transactions/0xb978e7c70cc25f71184cd28f9068923fbdc4d35d0ff7005770712ea2f2e74ce3) | `VERIFIED` |
| observe contract | [0x717191…5548](https://explorer-studio.genlayer.com/transactions/0x717191c8e2347af0e6eaf6e28dee5e3f7c3185c8aa4878663702202769675548) | `VERIFIED` |
| seal | [0x9bb64b…41ef](https://explorer-studio.genlayer.com/transactions/0x9bb64b799967177a37adb07ccfc9c3c14dd927eeb18fc686e1ebdb15218341ef) | `SEALED` |
| resumed audit | [0x0544ba…2706](https://explorer-studio.genlayer.com/transactions/0x0544ba9beefe475ef455266c193d2bc62587674d9eeed35433db4fa0fa492706) | `INCONCLUSIVE / AMBIGUOUS_EVIDENCE` |
| terminal replay | [0x6cfa47…adcc](https://explorer-studio.genlayer.com/transactions/0x6cfa4727a3316983c98c6a2bb1e294b7a1039ef4831e6cd8a8ecd1b0d7f1adcc) | no mutation |

Raw pre-resume and post-terminal readbacks: [`live/drill-5-resume.json`](live/drill-5-resume.json).

## Drill 6 — source-integrity failure

This drill committed an all-zero SHA-256 while pointing to the real GitHub fixture. The contract recomputed the digest from fetched bytes, returned `SOURCE_UNVERIFIED`, stored no observation, and refused to seal. Terminal result counters remained unchanged.

| Action | Transaction | Consensus / observed result |
| --- | --- | --- |
| create drill | [0xfa8a13…19f2](https://explorer-studio.genlayer.com/transactions/0xfa8a13f484d881c0c4c4547d108f74dabdfc0f793b82c118f72243e9f4fd19f2) | `MAJORITY_AGREE` |
| observe bad digest | [0x6d5df1…0086](https://explorer-studio.genlayer.com/transactions/0x6d5df110b37e8d8b98cb6b5418c7788d7d2fdf30b5a388bc7e6ac0fc39f70086) | `SOURCE_UNVERIFIED`; observation absent |
| attempted seal | [0x435353…4486](https://explorer-studio.genlayer.com/transactions/0x435353a71aaa63183548e01922b235b905225dfd27380db8547956ccac844486) | `OBSERVATIONS_INCOMPLETE`; state remained `OPEN` |

Raw readbacks: [`live/drill-6-source-failure.json`](live/drill-6-source-failure.json).

## Demonstrated effect

The contract authenticated exact commit-pinned runbook bytes, independently observed verified source and ABI for exact Ethereum addresses, and placed consensus only around semantic correspondence. Deterministic checks prevented a certificate when methods were absent, parameters mismatched, recovery was missing, scope was unsafe, evidence was ambiguous, validators disagreed, or the source digest failed. Only the fully aligned runbook reached `CERTIFIED`.

## Proof boundary

The evidence proves source-level runbook/interface correspondence at assessment time. It does not prove current role holders, live Ethereum storage, successful execution of `pause()` or `unpause()`, or that an operator followed the runbook. The contract never calls the Ethereum target. Full source commitments, ABI/source digests, actors, counters and state snapshots are preserved in the linked JSON files.
