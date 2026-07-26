const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { validateRefusedDecisions } = require("../.ia.rules/core/runtime/scripts/refused-decisions");

const repositoryRoot = path.resolve(__dirname, "..");
const canonicalRoot = path.join(repositoryRoot, ".ia.rules", "state", "decisions", "refused");
const canonical = validateRefusedDecisions(repositoryRoot);
assert.deepEqual(canonical, { entries: 2, present: true, records: 2 });

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-refused-decisions-"));
  const target = path.join(root, ".ia.rules", "state", "decisions", "refused");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(canonicalRoot, target, { recursive: true });
  fs.writeFileSync(path.join(root, "evidence.md"), "# Evidence\n", "utf8");
  const indexPath = path.join(target, "index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  for (const entry of index.entries) entry.relatedArtifacts = ["evidence.md#Evidence"];
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
  return { index, indexPath, root, target };
}

function writeIndex(item) {
  fs.writeFileSync(item.indexPath, JSON.stringify(item.index, null, 2), "utf8");
}

function withFixture(run) {
  const item = fixture();
  try {
    run(item);
  } finally {
    fs.rmSync(item.root, { force: true, recursive: true });
  }
}

withFixture((item) => {
  assert.deepEqual(validateRefusedDecisions(item.root), { entries: 2, present: true, records: 2 });
  for (const entry of item.index.entries) {
    const recordPath = path.join(item.target, ...entry.record.split("/"));
    fs.writeFileSync(recordPath, fs.readFileSync(recordPath, "utf8").replace(/\r?\n/gu, "\r\n"), "utf8");
  }
  assert.deepEqual(validateRefusedDecisions(item.root), { entries: 2, present: true, records: 2 });
});

withFixture((item) => {
  item.index.entries.push(JSON.parse(JSON.stringify(item.index.entries[0])));
  writeIndex(item);
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_ID_DUPLICADO/u);
});

withFixture((item) => {
  fs.copyFileSync(
    path.join(item.target, "records", "DEC-20260725-001.md"),
    path.join(item.target, "records", "DEC-20260725-999.md"),
  );
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_REGISTRO_ORFAO/u);
});

withFixture((item) => {
  fs.rmSync(path.join(item.target, ...item.index.entries[0].record.split("/")));
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_REGISTRO_AUSENTE/u);
});

withFixture((item) => {
  item.index.entries[0].status = "ADIADO";
  writeIndex(item);
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_ESTADO_INVALIDO/u);
});

withFixture((item) => {
  item.index.entries[0].absenceConfirmed = false;
  writeIndex(item);
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_AUSENCIA_OU_PROPRIEDADE_INVALIDA/u);
});

withFixture((item) => {
  item.index.entries[0].status = "REABERTO";
  writeIndex(item);
  const recordPath = path.join(item.target, ...item.index.entries[0].record.split("/"));
  const content = fs.readFileSync(recordPath, "utf8").replace(
    "- estado: `RECUSADO_PARA_RECONSIDERACAO`",
    "- estado: `REABERTO`",
  );
  fs.writeFileSync(recordPath, content, "utf8");
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_TRANSICAO_SEM_EVOLUCAO/u);
});

withFixture((item) => {
  item.index.entries[0].lastReviewedAt = "2026-07-26";
  writeIndex(item);
  const recordPath = path.join(item.target, ...item.index.entries[0].record.split("/"));
  const content = fs.readFileSync(recordPath, "utf8").replace(
    "- ultima_revisao: `2026-07-25`",
    "- ultima_revisao: `2026-07-26`",
  );
  fs.writeFileSync(recordPath, content, "utf8");
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_REVISAO_SEM_EVOLUCAO/u);
});

withFixture((item) => {
  item.index.entries[0].relatedArtifacts = ["missing.md"];
  writeIndex(item);
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_REFERENCIA_AUSENTE/u);
});

withFixture((item) => {
  const leaked = path.join(item.root, "dist", ".ia.rules", "state", "decisions", "refused");
  fs.mkdirSync(leaked, { recursive: true });
  fs.writeFileSync(path.join(leaked, "index.json"), "{}", "utf8");
  assert.throws(() => validateRefusedDecisions(item.root), /RECUSAS_ACERVO_PUBLICADO/u);
});

const empty = fs.mkdtempSync(path.join(os.tmpdir(), "agents-refused-empty-"));
try {
  assert.deepEqual(validateRefusedDecisions(empty), { entries: 0, present: false, records: 0 });
} finally {
  fs.rmSync(empty, { force: true, recursive: true });
}

console.log("refused-decisions.test.js: OK");
