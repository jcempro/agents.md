const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { assertRepositoryGit, assertRepositoryTarget, resolveRepositoryBoundary } = require("../.ia.rules/core/runtime/scripts/repository-boundary");

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "agents-boundary-test-"));
const root = path.join(sandbox, "root");
const sibling = path.join(sandbox, "sibling");

try {
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(sibling, { recursive: true });
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# AGENTS\n");
  assert.equal(childProcess.spawnSync("git", ["init"], { cwd: root, encoding: "utf8", windowsHide: true }).status, 0);
  const boundary = resolveRepositoryBoundary(root);

  assert.equal(assertRepositoryTarget(boundary, "src/internal.txt"), path.join(root, "src", "internal.txt"));
  assert.throws(() => assertRepositoryTarget(boundary, path.join("..", "sibling", "external.txt")), /DESTINO_FORA_DO_REPOSITORIO/u);
  assert.throws(() => assertRepositoryTarget(boundary, path.join("node_modules", "dependency", "index.js")), /DESTINO_TERCEIRO_EXCLUIDO/u);
  assert.throws(() => assertRepositoryTarget(boundary, path.join(".git", "config")), /METADADO_GIT_DIRETO_PROIBIDO/u);
  assert.throws(() => resolveRepositoryBoundary(path.join(root, "src")), /RAIZ_ASSOCIADA_DIVERGENTE|REPOSITORIO_CORRENTE_AUSENTE/u);

  const nested = path.join(root, "vendor", "nested");
  fs.mkdirSync(nested, { recursive: true });
  assert.equal(childProcess.spawnSync("git", ["init"], { cwd: nested, encoding: "utf8", windowsHide: true }).status, 0);
  assert.throws(() => assertRepositoryTarget(boundary, path.join("vendor", "nested", "file.txt")), /FRONTEIRA_GIT_ANINHADA/u);

  const hardlinkSource = path.join(root, "hardlink-source.txt");
  const hardlinkTarget = path.join(root, "hardlink-target.txt");
  fs.writeFileSync(hardlinkSource, "same inode\n");
  fs.linkSync(hardlinkSource, hardlinkTarget);
  assert.throws(() => assertRepositoryTarget(boundary, "hardlink-source.txt"), /HARDLINK_NAO_AUTORIZADO/u);

  assert.equal(assertRepositoryGit(boundary, ["status", "--short"]), boundary.root);
  assert.throws(() => assertRepositoryGit(boundary, ["-C", sibling, "status"]), /REDIRECIONAMENTO_GIT_PROIBIDO/u);
  assert.throws(() => assertRepositoryGit(boundary, ["--work-tree", sibling, "status"]), /REDIRECIONAMENTO_GIT_PROIBIDO/u);
  assert.throws(() => assertRepositoryGit(boundary, ["submodule", "foreach", "git status"]), /GIT_RECURSIVO_PROIBIDO/u);
  assert.throws(() => assertRepositoryGit(boundary, ["add", "--", "../sibling/external.txt"]), /PATHSPEC_GIT_FORA_DA_RAIZ/u);

  const link = path.join(root, "external-link");
  try {
    fs.symlinkSync(sibling, link, "junction");
    assert.throws(() => assertRepositoryTarget(boundary, path.join("external-link", "file.txt")), /DESTINO_FORA_DO_REPOSITORIO/u);
  } catch (error) {
    if (!/EPERM|privilege|not permitted/iu.test(String(error.message))) throw error;
  }
} finally {
  fs.rmSync(sandbox, { force: true, recursive: true });
}
