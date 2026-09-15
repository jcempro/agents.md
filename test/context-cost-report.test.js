const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const evaluation = path.join(root, "constructor", "evaluations", "context-cost-audit");
const experiment = path.join(evaluation, "experiment.json");
const script = path.join(root, "src", ".ia.rules", "skills", "context-cost-audit", "scripts", "context_cost_audit.py");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "agents-context-report-"));
try {
  const jsonPath = path.join(temporary, "report.json");
  const markdownPath = path.join(temporary, "report.md");
  const environment = { ...process.env, PYTHONPATH: [path.join(root, ".ia.rules", "cache", "python"), process.env.PYTHONPATH || ""].filter(Boolean).join(path.delimiter), PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };
  const execution = childProcess.spawnSync("python", [script, experiment, "--json", jsonPath, "--markdown", markdownPath], { cwd: root, encoding: "utf8", env: environment, windowsHide: true });
  assert.equal(execution.status, 0, execution.stderr);
  assert.equal(fs.readFileSync(jsonPath, "utf8"), fs.readFileSync(path.join(evaluation, "report.json"), "utf8"));
  assert.equal(fs.readFileSync(markdownPath, "utf8"), fs.readFileSync(path.join(evaluation, "report.md"), "utf8"));

  const report = JSON.parse(execution.stdout);
  assert.equal(report.metadata.revision, "c60fcc7");
  assert.equal(report.baseline.weightedTokens, 85173);
  assert.equal(report.unitEvidence.reduce((total, unit) => total + unit.atoms, 0), 688);
  assert.equal(report.unitEvidence.reduce((total, unit) => total + unit.relations, 0), 16);
  assert.ok(report.unitEvidence.every((unit) => unit.sha256 && /^[a-f0-9]{64}$/u.test(unit.sha256)));
  const valid = report.experiments.filter((entry) => entry.equivalent);
  assert.ok(valid.every((entry) => entry.regressions.length === 0));
  assert.ok(valid.flatMap((entry) => entry.scenarios).every((scenario) => scenario.atomCoverage === 1 && scenario.relationCoverage === 1));
  assert.equal(report.experiments.find((entry) => entry.id === "handoff-replaces-state").equivalent, false);
  assert.equal(report.recommendation.candidate, "validated-session-cache");
  assert.equal(report.recommendation.applied, false);
  assert.equal(report.recommendation.requiresLaterFt, true);

  const state = fs.readFileSync(path.join(root, ".ia.rules", "continue.ia"), "utf8");
  assert.match(state, /^FT-099\|[^\r\n]*status=(?:em_desenvolvimento|concluida)[^\r\n]*autorizacao=humana/mu);
  const refused = JSON.parse(fs.readFileSync(path.join(root, ".ia.rules", "state", "decisions", "refused", "index.json"), "utf8"));
  assert.ok(refused.entries.some((entry) => entry.semanticKey === "advanced-rag-vector-semantic-retrieval" && entry.absenceConfirmed === true));
} finally {
  fs.rmSync(temporary, { recursive: true, force: true });
}

console.log("context-cost-report.test.js: OK");
