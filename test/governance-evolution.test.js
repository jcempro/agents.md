const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const units = require("../.ia.rules/core/runtime/scripts/unit-manager");
const todo = require("../.ia.rules/core/runtime/scripts/todo-intake");
const longRun = require("../.ia.rules/core/runtime/scripts/long-running");
const visual = require("../.ia.rules/core/runtime/scripts/visual-evidence");

const root = path.resolve(__dirname, "..");

async function main() {
  assert.equal(units.loadCatalog(root).units.length, 3);
  assert.deepEqual(units.discoverUnits("executar TODO.ia.md", root).map((unit) => unit.id), ["governed-state"]);
  assert.deepEqual(units.discoverUnits("lista informal", root), []);
  const inventory = units.inventoryMechanisms(root);
  assert.ok(inventory.entries.length >= 49);
  assert.ok(inventory.entries.every((entry) => ["manter-script", "manter-cenario"].includes(entry.classification)));

  const consumer = fs.mkdtempSync(path.join(os.tmpdir(), "agents-units-"));
  try {
    fs.cpSync(path.join(root, "dist", ".ia.rules"), path.join(consumer, ".ia.rules"), { recursive: true });
    const first = units.applyInstallation(consumer, "governed-state", "codex");
    assert.ok(first.files.some((file) => file.action === "create"));
    const second = units.applyInstallation(consumer, "governed-state", "codex");
    assert.ok(second.files.every((file) => file.action === "unchanged"));
    const removed = units.removeInstallation(consumer, "governed-state", "codex");
    assert.ok(removed.removed.includes(".agents/skills/governed-state/SKILL.md"));

    const conflict = path.join(consumer, ".codex", "agents", "validation-audit.toml");
    fs.mkdirSync(path.dirname(conflict), { recursive: true });
    fs.writeFileSync(conflict, "unmanaged=true\n", "utf8");
    assert.throws(() => units.applyInstallation(consumer, "validation-audit", "codex"), /UNIT_DESTINO_NAO_GERENCIADO/u);
  } finally { fs.rmSync(consumer, { recursive: true, force: true }); }

  const todoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-state-"));
  try {
    fs.mkdirSync(path.join(todoRoot, ".ia.rules"), { recursive: true });
    const sourceTodo = fs.readFileSync(path.join(root, "TODO.ia.md"), "utf8");
    fs.writeFileSync(path.join(todoRoot, "TODO.ia.md"), sourceTodo);
    fs.writeFileSync(path.join(todoRoot, ".ia.rules", "continue.ia"), "FT-001|status=pendente\n");
    const parsed = todo.parseGovernedTodo(sourceTodo);
    assert.ok(parsed.roots.some((item) => item.text.startsWith("Evoluir a governança")));
    const migrated = todo.migrateCanonicalState(todoRoot);
    assert.equal(migrated.code, "STATE_MIGRATED");
    assert.equal(fs.readFileSync(path.join(todoRoot, "TODO.ia.md"), "utf8"), fs.readFileSync(path.join(todoRoot, ".ia.rules", "state", "TODO.ia.md"), "utf8"));
  } finally { fs.rmSync(todoRoot, { recursive: true, force: true }); }

  assert.equal(longRun.deriveTimeout([100, 200, 300], { minimumMs: 1, maximumMs: 1000 }), 450);
  const longRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-long-"));
  try {
    const statePath = path.join(longRoot, "state.json");
    const success = await longRun.runLongProcess(process.execPath, ["-e", "process.exit(0)"], { statePath, timeoutMs: 5000 });
    assert.equal(success.status, "completed");
    const reused = await longRun.resumeLongProcess(process.execPath, ["-e", "process.exit(0)"], { statePath, timeoutMs: 5000 });
    assert.equal(reused.reused, true);
    await assert.rejects(longRun.runLongProcess(process.execPath, ["-e", "setTimeout(()=>{},5000)"], { timeoutMs: 50 }), (error) => error.result.status === "timed_out");
    const controller = new AbortController();
    const cancelled = longRun.runLongProcess(process.execPath, ["-e", "setTimeout(()=>{},5000)"], { timeoutMs: 5000, signal: controller.signal });
    controller.abort();
    await assert.rejects(cancelled, (error) => error.result.status === "cancelled");
  } finally { fs.rmSync(longRoot, { recursive: true, force: true }); }

  const before = visual.encodePpm(2, 2, Buffer.from([0, 0, 0, 255, 255, 255, 10, 20, 30, 40, 50, 60]));
  const after = visual.encodePpm(2, 2, Buffer.from([0, 0, 0, 255, 255, 255, 10, 20, 30, 41, 50, 60]));
  assert.deepEqual(visual.imageDimensions(before), { format: "ppm", width: 2, height: 2 });
  assert.deepEqual(visual.imageDimensions(visual.cropPpm(before, { x: 1, y: 1, width: 1, height: 1 })), { format: "ppm", width: 1, height: 1 });
  assert.deepEqual(visual.diffPpm(before, after).region, { x: 1, y: 1, width: 1, height: 1 });
  assert.ok(visual.contrastRatio("#000000", "#ffffff") > 20);
  assert.equal(visual.auditFluidUnits("width: 10px;\nfont-size: 1rem;").findings.length, 1);
  assert.equal(visual.auditFluidUnits("width: 1px; /* agents-fluid-exception: border */").findings.length, 0);
  const pdf = Buffer.from("%PDF-1.7\n1 0 obj << /Type /Page /MediaBox [0 0 612 792] >> endobj\n", "latin1");
  assert.deepEqual(visual.inspectPdf(pdf), { format: "pdf", pages: 1, boxes: [{ widthPt: 612, heightPt: 792 }] });
  assert.equal(visual.validateLedger([{ artifact: "a.ppm", region: "1,1,1,1", observation: "delta", rule: "ref", expected: "igual", criterion: "0", before: "a", after: "b" }]).code, "LEDGER_OK");

  console.log("governance-evolution.test.js: OK");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
