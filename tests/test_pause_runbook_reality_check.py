import hashlib
import json
from pathlib import Path

import pytest


ROOT = Path(__file__).parents[1]
OWNER, REPO = "AzariaFixture", "PauseRunbookSources"
COMMIT, TREE = "1" * 40, "a" * 40
ADDRESS = "0x2222222222222222222222222222222222222222"
PATHS = {
    "executable": "/fixtures/runbook/executable.md",
    "incomplete": "/fixtures/runbook/incomplete.md",
    "dangerous": "/fixtures/runbook/dangerous.md",
}
BODIES = {name: (ROOT / path[1:]).read_bytes() for name, path in PATHS.items()}
MARKERS = {
    "executable": "## DRILL WITHDRAWAL-PAUSE-001",
    "incomplete": "## DRILL WITHDRAWAL-PAUSE-002",
    "dangerous": "## DRILL WITHDRAWAL-PAUSE-003",
}
SOURCE_CODE = """contract Vault {
 function pauseWithdrawals(bytes32 reason) external { withdrawalsPaused = true; }
 function unpauseWithdrawals(bytes32 reason) external { withdrawalsPaused = false; }
 function emergencyShutdown() external { globalShutdown = true; }
 bool withdrawalsPaused; bool globalShutdown;
}"""
ABI = [
    {"type": "function", "name": "pauseWithdrawals", "inputs": [{"name": "reason", "type": "bytes32"}], "outputs": [], "stateMutability": "nonpayable"},
    {"type": "function", "name": "unpauseWithdrawals", "inputs": [{"name": "reason", "type": "bytes32"}], "outputs": [], "stateMutability": "nonpayable"},
    {"type": "function", "name": "emergencyShutdown", "inputs": [], "outputs": [], "stateMutability": "nonpayable"},
]


def sha256(body): return hashlib.sha256(body).hexdigest()
def blob(body): return hashlib.sha1((f"blob {len(body)}\0").encode() + body).hexdigest()


def source(name, digest=None):
    return json.dumps({
        "owner": OWNER, "repo": REPO, "commit": COMMIT, "path": PATHS[name],
        "digest": digest or sha256(BODIES[name]), "marker": MARKERS[name],
    })


def mock_runbook(vm, name, status=200, bad_blob=False):
    api = f"https://api.github.com/repos/{OWNER}/{REPO}"
    body = BODIES[name]
    entries = [{"path": PATHS[name][1:], "type": "blob", "mode": "100644", "size": len(body), "sha": "0" * 40 if bad_blob else blob(body)}]
    vm.mock_web((api + "/git/commits/" + COMMIT).replace(".", r"\.") + "$", {"status": 200, "body": json.dumps({"sha": COMMIT, "tree": {"sha": TREE}}).encode()})
    vm.mock_web((api + "/git/trees/" + TREE + r"\?recursive=1$").replace(".", r"\."), {"status": 200, "body": json.dumps({"truncated": False, "tree": entries}).encode()})
    raw = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{COMMIT}{PATHS[name]}"
    vm.mock_web(raw.replace(".", r"\.") + "$", {"status": status, "body": body})


def mock_contract(vm, address=ADDRESS, verified=True, abi=None, source_code=SOURCE_CODE):
    url = "https://eth.blockscout.com/api/v2/smart-contracts/" + ADDRESS.lower()
    vm.mock_web(url.replace(".", r"\.") + "$", {"status": 200, "body": json.dumps({
        "address_hash": address, "is_verified": verified, "abi": ABI if abi is None else abi, "source_code": source_code,
    }).encode()})


def model_result(verdict="RUNBOOK_EXECUTABLE", reason="FULL_ALIGNMENT", **overrides):
    item = {
        "drill_id": 0, "hazard_free": True, "method_exists": True,
        "parameters_match": True, "reason_code": reason,
        "recovery_described": True, "scope_supported": True, "verdict": verdict,
    }
    item.update(overrides)
    return json.dumps(item)


def deploy(vm, direct_deploy, actor):
    vm.strict_mocks = True; vm.check_pickling = True
    with vm.prank(actor): return direct_deploy("contracts/PauseRunbookRealityCheck.py")


@pytest.fixture
def setup(direct_vm, direct_deploy, direct_alice):
    return direct_vm, deploy(direct_vm, direct_deploy, direct_alice), direct_alice


def create(vm, contract, actor, name="executable", digest=None, address=ADDRESS):
    with vm.prank(actor): return contract.create_drill("vault-pause", 1, address, source(name, digest))


def observe_and_seal(vm, contract, name="executable", **contract_kwargs):
    mock_runbook(vm, name); mock_contract(vm, **contract_kwargs)
    assert contract.observe_runbook(0) == "RUNBOOK_OBSERVED"
    assert contract.observe_contract(0) == "CONTRACT_OBSERVED"
    assert contract.seal_drill(0) == "SEALED"


def test_executable_runbook_certifies(setup, direct_bob):
    vm, contract, _ = setup; assert create(vm, contract, direct_bob) == 0
    observe_and_seal(vm, contract)
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result())
    assert contract.audit_drill(0) == "RUNBOOK_EXECUTABLE"
    drill = json.loads(contract.get_drill(0)); counts = json.loads(contract.get_counts())
    assert drill["state"] == "CERTIFIED" and drill["reason_code"] == "FULL_ALIGNMENT"
    assert counts["certified_count"] == 1 and counts["hazard_count"] == 0


def test_incomplete_runbook_records_hazard(setup, direct_bob):
    vm, contract, _ = setup; create(vm, contract, direct_bob, "incomplete"); observe_and_seal(vm, contract, "incomplete")
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result(
        "RUNBOOK_INCOMPLETE", "RECOVERY_MISSING", recovery_described=False
    ))
    assert contract.audit_drill(0) == "RUNBOOK_INCOMPLETE"
    assert json.loads(contract.get_drill(0))["state"] == "HAZARD_RECORDED"


def test_dangerous_scope_records_hazard(setup, direct_bob):
    vm, contract, _ = setup; create(vm, contract, direct_bob, "dangerous"); observe_and_seal(vm, contract, "dangerous")
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result(
        "RUNBOOK_DANGEROUS", "UNSAFE_SCOPE", hazard_free=False, scope_supported=False
    ))
    assert contract.audit_drill(0) == "RUNBOOK_DANGEROUS"
    assert json.loads(contract.get_counts())["hazard_count"] == 1


def test_interface_mismatch_records_hazard(setup, direct_bob):
    vm, contract, _ = setup; create(vm, contract, direct_bob); observe_and_seal(vm, contract)
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result(
        "INTERFACE_MISMATCH", "METHOD_MISSING", method_exists=False, parameters_match=False,
        recovery_described=False, scope_supported=False, hazard_free=False,
    ))
    assert contract.audit_drill(0) == "INTERFACE_MISMATCH"


@pytest.mark.parametrize("failure", ["digest", "blob", "missing"])
def test_runbook_source_failures_never_seal(setup, direct_bob, failure):
    vm, contract, _ = setup
    create(vm, contract, direct_bob, digest="0" * 64 if failure == "digest" else None)
    mock_runbook(vm, "executable", status=404 if failure == "missing" else 200, bad_blob=failure == "blob")
    assert contract.observe_runbook(0) == "SOURCE_UNVERIFIED"
    assert "error" in json.loads(contract.get_observation(0, "RUNBOOK"))
    assert contract.seal_drill(0) == "OBSERVATIONS_INCOMPLETE"


@pytest.mark.parametrize("failure", ["address", "verified", "abi", "source"])
def test_contract_observation_failures_never_store(setup, direct_bob, failure):
    vm, contract, _ = setup; create(vm, contract, direct_bob)
    kwargs = {}
    if failure == "address": kwargs["address"] = "0x3333333333333333333333333333333333333333"
    if failure == "verified": kwargs["verified"] = False
    if failure == "abi": kwargs["abi"] = []
    if failure == "source": kwargs["source_code"] = ""
    mock_contract(vm, **kwargs)
    assert contract.observe_contract(0) == "SOURCE_UNVERIFIED"
    assert "error" in json.loads(contract.get_observation(0, "CONTRACT"))


def test_inconsistent_positive_output_becomes_inconclusive(setup, direct_bob):
    vm, contract, _ = setup; create(vm, contract, direct_bob); observe_and_seal(vm, contract)
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result(method_exists=False))
    assert contract.audit_drill(0) == "INCONCLUSIVE"
    drill = json.loads(contract.get_drill(0))
    assert drill["state"] == "INCONCLUSIVE" and drill["reason_code"] == "AMBIGUOUS_EVIDENCE"


def test_post_seal_and_terminal_replay_preserve_state(setup, direct_bob):
    vm, contract, _ = setup; create(vm, contract, direct_bob); observe_and_seal(vm, contract)
    before = (contract.get_observation(0, "RUNBOOK"), contract.get_observation(0, "CONTRACT"))
    assert contract.observe_runbook(0) == "DRILL_NOT_OPEN"
    assert contract.observe_contract(0) == "DRILL_NOT_OPEN"
    assert before == (contract.get_observation(0, "RUNBOOK"), contract.get_observation(0, "CONTRACT"))
    vm.mock_llm(r"Audit one emergency runbook section.*", model_result())
    contract.audit_drill(0); terminal = (contract.get_drill(0), contract.get_counts())
    assert contract.audit_drill(0) == "DRILL_NOT_SEALED"
    assert terminal == (contract.get_drill(0), contract.get_counts())


def test_input_guards_and_deployer_has_no_privilege(setup, direct_bob):
    vm, contract, deployer = setup
    with vm.prank(direct_bob):
        assert contract.create_drill("vault-pause", 137, ADDRESS, source("executable")) == "INVALID_DRILL"
        assert contract.create_drill("vault-pause", 1, "0x1234", source("executable")) == "INVALID_DRILL"
    assert create(vm, contract, direct_bob) == 0
    assert json.loads(contract.get_drill(0))["creator"].lower() != str(deployer).lower()
    assert "owner" not in json.loads(contract.get_counts())
