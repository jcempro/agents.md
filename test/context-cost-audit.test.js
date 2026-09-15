const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const script = path.join(root, "src", ".ia.rules", "skills", "context-cost-audit", "scripts", "context_cost_audit.py");
const fixture = path.join(root, "test", "fixtures", "context-cost-experiment.json");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "agents-context-audit-"));
try {
  const jsonPath = path.join(temporary, "report.json");
  const markdownPath = path.join(temporary, "report.md");
  const environment = { ...process.env, PYTHONPATH: [path.join(root, ".ia.rules", "cache", "python"), process.env.PYTHONPATH || ""].filter(Boolean).join(path.delimiter), PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };
  const execution = childProcess.spawnSync("python", [script, fixture, "--json", jsonPath, "--markdown", markdownPath], { cwd: root, encoding: "utf8", env: environment, windowsHide: true });
  assert.equal(execution.status, 0, execution.stderr);
  const stdout = JSON.parse(execution.stdout);
  const persisted = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  assert.deepEqual(persisted, stdout);
  assert.equal(stdout.schema, "agents-context-cost-report/v1");
  assert.equal(stdout.baseline.weightedTokens, 590);
  assert.equal(stdout.experiments.length, 7);
  assert.equal(stdout.experiments.find((entry) => entry.id === "lossy-snapshot").equivalent, false);
  assert.equal(stdout.experiments.find((entry) => entry.id === "session-cache+state-snapshot").weightedSavings, 360);
  assert.equal(stdout.recommendation.candidate, "session-cache+state-snapshot");
  assert.equal(stdout.recommendation.applied, false);
  assert.equal(stdout.recommendation.requiresLaterFt, true);
  assert.match(fs.readFileSync(markdownPath, "utf8"), /A recomendação não foi aplicada e exige FT posterior/u);

  const second = childProcess.spawnSync("python", [script, fixture], { cwd: root, encoding: "utf8", env: environment, windowsHide: true });
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(JSON.parse(second.stdout), stdout);
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}

console.log("context-cost-audit.test.js: OK");
