from pathlib import Path


SOURCE = (Path(__file__).parents[1] / "contracts/PauseRunbookRealityCheck.py").read_text(encoding="utf-8")


def test_runtime_and_authorities_are_pinned():
    assert SOURCE.startswith("# v0.2.16")
    for item in ["https://api.github.com/repos/", "https://raw.githubusercontent.com/", "https://eth.blockscout.com/api/v2/smart-contracts/"]:
        assert item in SOURCE


def test_fetched_bytes_and_runtime_observation_are_bound():
    for item in ["_blob_sha1(raw.body)", "hashlib.sha256(raw.body)", 'observed_address != address', 'item.get("is_verified") is not True', "source_digest", "abi_digest"]:
        assert item in SOURCE


def test_architecture_is_audit_drill_not_release_head_or_registry_lock():
    for item in ["create_drill", "observe_runbook", "observe_contract", "seal_drill", "audit_drill", "HAZARD_RECORDED"]:
        assert item in SOURCE
    for forbidden in ["active_source", "head_revision", "activate_compatible_release", "namespace_count", "release_keys", "consume_authorization", "transfer("]:
        assert forbidden not in SOURCE


def test_positive_gate_and_no_admin():
    assert 'result["verdict"] == "RUNBOOK_EXECUTABLE"' in SOURCE
    assert "all_true" in SOURCE and "FULL_ALIGNMENT" in SOURCE
    for forbidden in ["self.owner", "only_owner", "deployer", "allowlist"]:
        assert forbidden not in SOURCE
