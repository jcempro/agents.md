const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { installWorkflows, loadCatalog, verifyInstalled } = require("../.ia.rules/core/runtime/scripts/workflow-manager");

function copyCatalog(root) {
  fs.mkdirSync(path.join(root, ".ia.rules", "workflows", "github"), { recursive: true });
  for (const name of ["index.json", "github/normative-graph.yml", "github/rcf-trace.yml"]) {
    const source = path.join(__dirname, "..", "dist", ".ia.rules", "workflows", name);
    const target = path.join(root, ".ia.rules", "workflows", name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(source, target);
  }
}

function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-workflows-"));
  try {
    copyCatalog(root);
    assert.equal(loadCatalog(root).workflows.length, 2);
    assert.deepEqual(installWorkflows(root, ["normative-graph"], { dryRun: true }).changed, ["normative-graph"]);
    assert.deepEqual(installWorkflows(root, ["normative-graph"]).changed, ["normative-graph"]);
    assert.equal(verifyInstalled(root).installed, 1);
    const target = path.join(root, ".github", "workflows", "agents-normative-graph.yml");
    assert.equal(fs.existsSync(target), true);
    fs.writeFileSync(target, "customizacao local\n");
    assert.throws(() => installWorkflows(root, ["normative-graph"]), /WORKFLOW_CUSTOMIZACAO_CONFLITANTE/u);
    assert.equal(fs.readFileSync(target, "utf8"), "customizacao local\n");
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
  console.log("WORKFLOW_MANAGER_TEST_OK");
}

main();
