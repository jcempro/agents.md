const assert = require("assert");
const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function hash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function main() {
  const root = path.join(__dirname, "..");
  const indexPath = path.join(root, "src", ".ia.rules", "normative-index.json");
  const mapPath = path.join(root, "src", ".ia.rules", "generated", "normative-map.md");
  const before = [hash(indexPath), hash(mapPath), hash(path.join(root, "README.md"))];
  const result = childProcess.spawnSync("python", [
    path.join(root, "src", ".ia.rules", "scenarios", "governance", "scripts", "normative-graph.py"),
    "--check",
  ], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      PYTHONIOENCODING: "utf-8",
      PYTHONPATH: path.join(root, ".ia.rules", "cache", "python"),
      PYTHONUTF8: "1",
    },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /NORMATIVE_GRAPH_OK/u);
  assert.match(result.stdout, /\| tipo \| mínimo \| média \| mediana \| desvio padrão \| máximo \|/u);
  assert.deepEqual([hash(indexPath), hash(mapPath), hash(path.join(root, "README.md"))], before);
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  assert.equal(index.generated, true);
  assert.equal(index.generation.tokenizer, "tiktoken");
  assert.equal(index.generation.tokenizerVersion, "0.13.0");
  assert.equal(index.generation.encoding, "o200k_base");
  assert.equal(index.paths.length, 35);
  assert.equal(index.nodes.every((node) => Number.isInteger(node.tokens) && node.tokens > 0), true);
  for (const kind of ["leaf", "hybrid"]) {
    assert.equal(typeof index.metrics[kind].median, "number");
    assert.equal(typeof index.metrics[kind].populationStandardDeviation, "number");
  }
  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  const map = fs.readFileSync(mapPath, "utf8");
  assert.match(readme, /\| Terminal \| Rotas \| Mínimo \| Média \| Mediana \| Desvio padrão \| Máximo \|/u);
  assert.match(map, /O desvio padrão é populacional/u);

  const unitCode = [
    "import importlib.util,json,sys",
    "spec=importlib.util.spec_from_file_location('normative_graph',sys.argv[1])",
    "module=importlib.util.module_from_spec(spec)",
    "spec.loader.exec_module(module)",
    "paths=lambda kind,values:[{'terminalType':kind,'tokens':value} for value in values]",
    "cases={'even':module.summarize(paths('leaf',[1,2,3,4]))['leaf'],'odd':module.summarize(paths('leaf',[1,3,9]))['leaf'],'single':module.summarize(paths('hybrid',[7]))['hybrid'],'empty':module.summarize([])['leaf']}",
    "print(json.dumps(cases,separators=(',',':')))",
  ].join(";");
  const unit = childProcess.spawnSync("python", ["-c", unitCode, path.join(
    root,
    "src",
    ".ia.rules",
    "scenarios",
    "governance",
    "scripts",
    "normative-graph.py",
  )], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      PYTHONDONTWRITEBYTECODE: "1",
      PYTHONIOENCODING: "utf-8",
      PYTHONPATH: path.join(root, ".ia.rules", "cache", "python"),
      PYTHONUTF8: "1",
    },
  });
  assert.equal(unit.status, 0, unit.stderr || unit.stdout);
  const cases = JSON.parse(unit.stdout);
  assert.deepEqual(cases.even, {
    count: 4,
    min: 1,
    average: 2.5,
    median: 2.5,
    populationStandardDeviation: 1.12,
    max: 4,
  });
  assert.deepEqual(cases.odd, {
    count: 3,
    min: 1,
    average: 4.33,
    median: 3,
    populationStandardDeviation: 3.4,
    max: 9,
  });
  assert.deepEqual(cases.single, {
    count: 1,
    min: 7,
    average: 7,
    median: 7,
    populationStandardDeviation: 0,
    max: 7,
  });
  assert.deepEqual(cases.empty, {
    count: 0,
    min: null,
    average: null,
    median: null,
    populationStandardDeviation: null,
    max: null,
  });
  console.log("NORMATIVE_GRAPH_TEST_OK");
}

main();
