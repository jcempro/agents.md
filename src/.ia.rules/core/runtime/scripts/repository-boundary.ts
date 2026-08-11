// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const EXCLUDED_SEGMENTS = new Set(["node_modules"]);

/** Representa violação crítica de fronteira antes de qualquer efeito material. */
class RepositoryBoundaryError extends Error {
  /** Constrói diagnóstico estável sem expor conteúdo do arquivo recusado. */
  constructor(code, target = "") {
    super(`${code}${target ? `:${target}` : ""}`);
    this.code = code;
  }
}

/** Resolve e valida a única raiz Git autorizada associada à operação. */
function resolveRepositoryBoundary(rootDir) {
  const requested = realDirectory(rootDir, "REPOSITORIO_CORRENTE_AUSENTE");
  const result = childProcess.spawnSync("git", ["-C", requested, "rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) throw new RepositoryBoundaryError("REPOSITORIO_GIT_AUSENTE", requested);
  const gitRoot = realDirectory(result.stdout.trim(), "RAIZ_GIT_INVALIDA");
  if (!samePath(requested, gitRoot)) throw new RepositoryBoundaryError("RAIZ_ASSOCIADA_DIVERGENTE", requested);
  const agents = path.join(gitRoot, "AGENTS.md");
  if (!fs.existsSync(agents) || !fs.statSync(agents).isFile()) throw new RepositoryBoundaryError("AGENTS_APLICAVEL_AUSENTE", agents);
  return Object.freeze({ agents: fs.realpathSync(agents), root: gitRoot });
}

/** Autoriza um destino somente quando seu path físico permanece no repositório e não cruza exclusão. */
function assertRepositoryTarget(boundaryOrRoot, candidate, options = {}) {
  const boundary = typeof boundaryOrRoot === "string" ? resolveRepositoryBoundary(boundaryOrRoot) : boundaryOrRoot;
  if (!boundary || !boundary.root) throw new RepositoryBoundaryError("FRONTEIRA_INVALIDA");
  const requested = path.resolve(boundary.root, String(candidate || ""));
  const physical = resolveProspectiveRealPath(requested);
  if (!isInside(boundary.root, physical)) throw new RepositoryBoundaryError("DESTINO_FORA_DO_REPOSITORIO", requested);

  const relative = path.relative(boundary.root, requested);
  const segments = relative.split(path.sep).filter(Boolean);
  if (segments.some((segment) => EXCLUDED_SEGMENTS.has(segment.toLocaleLowerCase("en-US")))) {
    throw new RepositoryBoundaryError("DESTINO_TERCEIRO_EXCLUIDO", relative);
  }
  if (segments[0] === ".git" && !options.allowGitMetadata) throw new RepositoryBoundaryError("METADADO_GIT_DIRETO_PROIBIDO", relative);
  assertNoNestedRepository(boundary.root, requested);
  if (fs.existsSync(requested) && !options.allowHardlink) {
    const stat = fs.statSync(requested);
    if (stat.isFile() && Number(stat.nlink) > 1) throw new RepositoryBoundaryError("HARDLINK_NAO_AUTORIZADO", relative);
  }
  return requested;
}

/** Valida que uma invocação Git não redireciona raiz, worktree, submódulo ou pathspec para fora. */
function assertRepositoryGit(boundaryOrRoot, args = []) {
  const boundary = typeof boundaryOrRoot === "string" ? resolveRepositoryBoundary(boundaryOrRoot) : boundaryOrRoot;
  const values = args.map(String);
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (["-C", "--git-dir", "--work-tree"].includes(value) || /^--(?:git-dir|work-tree)=/u.test(value)) {
      throw new RepositoryBoundaryError("REDIRECIONAMENTO_GIT_PROIBIDO", value);
    }
    if (value === "submodule" && values[index + 1] === "foreach") throw new RepositoryBoundaryError("GIT_RECURSIVO_PROIBIDO", "submodule foreach");
    if (/(?:^|[\\/])\.\.(?:[\\/]|$)/u.test(value)) throw new RepositoryBoundaryError("PATHSPEC_GIT_FORA_DA_RAIZ", value);
  }
  const separator = values.indexOf("--");
  if (separator >= 0) {
    for (const value of values.slice(separator + 1)) assertRepositoryTarget(boundary, value, { allowHardlink: true });
  }
  return boundary.root;
}

/** Recusa submódulo, worktree ou repositório aninhado em qualquer ancestral do destino. */
function assertNoNestedRepository(rootDir, candidate) {
  let current = nearestExisting(candidate);
  if (!fs.statSync(current).isDirectory()) current = path.dirname(current);
  while (!samePath(current, rootDir)) {
    if (fs.existsSync(path.join(current, ".git"))) {
      throw new RepositoryBoundaryError("FRONTEIRA_GIT_ANINHADA", path.relative(rootDir, current));
    }
    const parent = path.dirname(current);
    if (samePath(parent, current) || !isInside(rootDir, parent)) break;
    current = parent;
  }
}

/** Resolve destino existente ou recompõe destino novo a partir do ancestral físico mais próximo. */
function resolveProspectiveRealPath(candidate) {
  if (fs.existsSync(candidate)) return fs.realpathSync(candidate);
  const ancestor = nearestExisting(candidate);
  return path.resolve(fs.realpathSync(ancestor), path.relative(ancestor, candidate));
}

/** Localiza o ancestral existente sem criar diretório nem seguir path inexistente por inferência. */
function nearestExisting(candidate) {
  let current = candidate;
  while (!fs.existsSync(current)) {
    const parent = path.dirname(current);
    if (samePath(parent, current)) throw new RepositoryBoundaryError("ANCESTRAL_FISICO_AUSENTE", candidate);
    current = parent;
  }
  return current;
}

/** Resolve diretório físico e preserva diagnóstico específico do chamador. */
function realDirectory(value, code) {
  const absolute = path.resolve(String(value || ""));
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isDirectory()) throw new RepositoryBoundaryError(code, absolute);
  return fs.realpathSync(absolute);
}

/** Compara paths segundo a normalização do filesystem corrente. */
function samePath(left, right) {
  const resolvedLeft = path.resolve(left);
  const resolvedRight = path.resolve(right);
  return process.platform === "win32"
    ? resolvedLeft.toLocaleLowerCase("en-US") === resolvedRight.toLocaleLowerCase("en-US")
    : resolvedLeft === resolvedRight;
}

/** Verifica contenção por relação de path, nunca por prefixo textual. */
function isInside(rootDir, candidate) {
  const relative = path.relative(rootDir, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

module.exports = {
  RepositoryBoundaryError,
  assertRepositoryGit,
  assertRepositoryTarget,
  resolveProspectiveRealPath,
  resolveRepositoryBoundary,
};
