const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, "src");
const distRoot = path.join(root, "dist");

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name, "en"))
    .flatMap((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(target) : [target];
    });
}

function posix(relativePath) {
  return relativePath.split(path.sep).join("/");
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, ".ia.rules", "distribution", "source-manifest.json"), "utf8"));
  const runtimeMatrix = JSON.parse(fs.readFileSync(path.join(sourceRoot, ".ia.rules", "runtime", "runtime-matrix.json"), "utf8"));
  const byPath = new Map(manifest.entries.map((entry) => [entry.path, entry]));
  const executableSources = listFiles(path.join(sourceRoot, ".ia.rules"))
    .map((filePath) => posix(path.relative(sourceRoot, filePath)))
    .filter((relativePath) => relativePath.endsWith(".ts") || relativePath.endsWith(".py"));

  assert.ok(executableSources.length > 0);
  for (const relativePath of executableSources) {
    const entry = byPath.get(relativePath);
    assert.ok(entry, `Fonte executável sem manifesto: ${relativePath}`);
    if (relativePath.endsWith(".ts")) {
      assert.equal(entry.language, "typescript");
      assert.match(runtimeMatrix.node.minimum, /^24(?:\.|$)/u);
      assert.ok(entry.artifact && entry.artifact.destination.endsWith(".js"), `Artefato JS ausente: ${relativePath}`);
      assert.equal(fs.existsSync(path.join(distRoot, entry.artifact.destination)), true);
    } else {
      assert.ok(runtimeMatrix.python.resources.some((resource) => resource.id === "normative-graph"));
      assert.match(runtimeMatrix.python.minimum, /^3\.9(?:\.|$)/u);
    }
  }

  const forbiddenPrefixes = ["constructor/", "test/", ".github/", ".ia.rules/state/decisions/"];
  const distributed = listFiles(distRoot).map((filePath) => posix(path.relative(distRoot, filePath)));
  assert.equal(distributed.some((relativePath) => forbiddenPrefixes.some((prefix) => relativePath.startsWith(prefix))), false);
  for (const workflowPath of listFiles(path.join(root, ".github", "workflows"))) {
    const workflow = fs.readFileSync(workflowPath, "utf8");
    assert.doesNotMatch(workflow, /\bnode\s+src\/\.ia\.rules\/[^\s'"]+\.js\b/u, `Workflow aponta a JavaScript removido: ${workflowPath}`);
  }

  for (const scriptPath of listFiles(path.join(distRoot, ".ia.rules")).filter((filePath) => filePath.endsWith(".js"))) {
    const checked = childProcess.spawnSync(process.execPath, ["--check", scriptPath], {
      cwd: distRoot,
      encoding: "utf8",
      windowsHide: true,
    });
    assert.equal(checked.status, 0, checked.stderr || scriptPath);
  }

  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-runtime-"));
  try {
    const relocated = path.join(temporaryRoot, "release with spaces");
    fs.cpSync(distRoot, relocated, { recursive: true });
    const unicodeProbe = path.join(relocated, "prova-ç-漢字.txt");
    fs.writeFileSync(unicodeProbe, "UTF-8\n", "utf8");
    assert.equal(fs.readFileSync(unicodeProbe, "utf8"), "UTF-8\n");
    const status = childProcess.spawnSync(process.execPath, [
      path.join(relocated, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js"),
      "agent:status",
    ], {
      cwd: relocated,
      encoding: "utf8",
      env: { ...process.env, LANG: "pt_BR.UTF-8", LC_ALL: "pt_BR.UTF-8", NODE_PATH: "" },
      windowsHide: true,
    });
    assert.equal(status.status, 0, status.stderr || status.stdout);
    assert.equal(JSON.parse(status.stdout.split(/\r?\n/u)[0]).status, "ok");
  } finally {
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

main();
