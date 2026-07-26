const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { finalize, migrateConstructor, prepare, validate } = require("../.ia.rules/core/runtime/scripts/rcf-trace");

function git(root, args) {
  const result = childProcess.spawnSync("git", args, { cwd: root, encoding: "utf8", shell: false });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function main() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-rcf-trace-"));
  try {
    fs.writeFileSync(path.join(root, "AGENTS.md"), "# AGENTS\n");
    fs.writeFileSync(path.join(root, "package.json"), "{}\n");
    fs.writeFileSync(path.join(root, "RCF.md"), "# RCF\n\nO runtime DEVE preservar o contrato.\n\nTexto explicativo.\n");
    git(root, ["init"]);
    git(root, ["config", "user.email", "test@example.invalid"]);
    git(root, ["config", "user.name", "Test"]);
    git(root, ["add", "."]);
    git(root, ["commit", "-m", "Materializa contrato"]);
    const commit = git(root, ["rev-parse", "HEAD"]);
    const migrated = migrateConstructor(root, "RCF.md", { constructorNormative: true, ft: "FT-TEST" });
    assert.equal(migrated.entries, 1);
    assert.match(fs.readFileSync(path.join(root, "RCF.md"), "utf8"), new RegExp(`\\[${commit.slice(-7)}\\]`, "u"));
    assert.deepEqual(validate(root), { entries: 1, material: 1 });
    prepare(root, "RCF.md", ["code.js"], { ft: "FT-CODE", lines: [3] });
    fs.writeFileSync(path.join(root, "code.js"), "module.exports = true;\n");
    git(root, ["add", "."]);
    git(root, ["commit", "-m", "Implementa runtime"]);
    const materialCommit = git(root, ["rev-parse", "HEAD"]);
    assert.equal(finalize(root, materialCommit).synchronized, 1);
    assert.match(fs.readFileSync(path.join(root, "RCF.md"), "utf8"), new RegExp(`\\[${materialCommit.slice(-7)}\\]`, "u"));
    assert.deepEqual(validate(root), { entries: 1, material: 1 });
    fs.appendFileSync(path.join(root, "RCF.md"), "\nNova unidade DEVE existir.\n");
    assert.throws(() => validate(root), /RCF_SENTENCA_NAO_MAPEADA/u);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
  console.log("RCF_TRACE_TEST_OK");
}

main();
