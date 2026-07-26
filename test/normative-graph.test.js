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
  assert.deepEqual([hash(indexPath), hash(mapPath), hash(path.join(root, "README.md"))], before);
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  assert.equal(index.generated, true);
  assert.equal(index.generation.tokenizer, "tiktoken");
  assert.equal(index.generation.tokenizerVersion, "0.13.0");
  assert.equal(index.generation.encoding, "o200k_base");
  assert.equal(index.paths.length, 35);
  assert.equal(index.nodes.every((node) => Number.isInteger(node.tokens) && node.tokens > 0), true);
  console.log("NORMATIVE_GRAPH_TEST_OK");
}

main();
