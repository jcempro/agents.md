// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const { extractZip } = require("../lib/archive");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const SOURCE_OWNER = "JeanCarloEM";
const SOURCE_REPO = "agents.md";
const SOURCE_API = `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}`;
const LOCK_FILE = path.join(".agents", "agents-update.lock.json");
const TEXT_EXTENSIONS = new Set([".md", ".json"]);

async function main(argv = process.argv.slice(2), options = {}) {
  const parsed = parseArgs(argv);
  const rootDir = options.rootDir || ROOT_DIR;
  const httpClient = options.httpClient || defaultHttpClient;
  const plan = await buildUpdatePlan(rootDir, httpClient);

  if (parsed.dryRun) {
    printPlan(plan, "dry-run");
    return plan;
  }

  if (parsed.check) {
    printPlan(plan, plan.changed ? "desatualizado" : "atualizado");
    if (plan.changed) {
      process.exitCode = 2;
    }
    return plan;
  }

  if (!plan.changed) {
    console.log("Governanca operacional ja esta atualizada.");
    return plan;
  }

  assertManagedFilesClean(rootDir, parsed.force, plan);
  applyPlan(rootDir, plan);
  commitAndPushNormativeUpdate(rootDir, plan);
  console.log(`Governanca operacional atualizada de ${plan.source.label}.`);
  return plan;
}

function parseArgs(argv = []) {
  return {
    check: argv.includes("--check"),
    dryRun: argv.includes("--dry-run"),
    force: argv.includes("--force"),
  };
}

async function buildUpdatePlan(rootDir, httpClient = defaultHttpClient) {
  const source = await resolveRemoteSource(httpClient);
  const archive = await httpClient(source.archiveUrl, { binary: true });
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-update-"));

  try {
    extractZip(archive.body, tempRoot);
    const remoteRoot = discoverRemoteRoot(tempRoot);
    const remoteFiles = collectRemoteGovernanceFiles(remoteRoot);
    const previousLock = readUpdateLock(rootDir);
    const changes = compareRemoteFiles(rootDir, remoteFiles, previousLock);

    return {
      changed: changes.some((change) => change.action !== "unchanged"),
      changes,
      remoteRoot,
      source,
      lock: createUpdateLock(source, remoteFiles),
    };
  } finally {
    fs.rmSync(tempRoot, { force: true, recursive: true });
  }
}

async function resolveRemoteSource(httpClient = defaultHttpClient) {
  const latest = await requestJsonAllow404(httpClient, `${SOURCE_API}/releases/latest`);

  if (latest && latest.statusCode !== 404) {
    const asset = selectReleaseZipAsset(latest.json);
    return {
      archiveUrl: asset ? asset.browser_download_url : latest.json.zipball_url,
      label: `release:${latest.json.tag_name || "latest"}`,
      ref: latest.json.tag_name || "latest",
      type: "release",
    };
  }

  for (const branch of ["main", "master"]) {
    const response = await requestJsonAllow404(httpClient, `${SOURCE_API}/branches/${branch}`);

    if (response && response.statusCode !== 404) {
      const sha = response.json && response.json.commit && response.json.commit.sha;

      if (!sha) {
        throw new Error(`Branch ${branch} sem commit SHA.`);
      }

      return {
        archiveUrl: `${SOURCE_API}/zipball/${sha}`,
        label: `branch:${branch}:${sha}`,
        ref: sha,
        type: "branch",
      };
    }
  }

  throw new Error("Nenhuma release latest ou branch main/master encontrada para AGENTS.");
}

async function requestJsonAllow404(httpClient, url) {
  const response = await httpClient(url);

  if (response.statusCode === 404) {
    return response;
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Falha ao consultar ${url}: HTTP ${response.statusCode}.`);
  }

  return {
    ...response,
    json: JSON.parse(response.body.toString("utf8")),
  };
}

function selectReleaseZipAsset(release) {
  const assets = Array.isArray(release && release.assets) ? release.assets : [];
  const candidates = assets.filter((asset) => {
    const name = String(asset.name || "").toLocaleLowerCase("en-US");
    return name.endsWith(".zip") && asset.browser_download_url;
  });

  if (candidates.length > 1) {
    throw new Error("Release latest possui múltiplos ZIPs normativos possíveis.");
  }

  return candidates[0] || null;
}

function discoverRemoteRoot(tempRoot) {
  const agentsFiles = listFiles(tempRoot)
    .filter((filePath) => path.basename(filePath).toLocaleLowerCase("en-US") === "agents.md")
    .filter((filePath) => fs.readFileSync(filePath, "utf8").includes("AGENTS.md"));

  if (agentsFiles.length === 0) {
    throw new Error("AGENTS.md remoto não encontrado no pacote normativo.");
  }

  agentsFiles.sort((a, b) => scoreAgentsPath(a).localeCompare(scoreAgentsPath(b)));
  return path.dirname(agentsFiles[0]);
}

function scoreAgentsPath(filePath) {
  const rel = toPosixPath(filePath).toLocaleLowerCase("en-US");

  if (rel.endsWith("/src/agents.md")) {
    return "0";
  }

  return `${String(rel.split("/").length).padStart(4, "0")}:${rel}`;
}

function collectRemoteGovernanceFiles(remoteRoot) {
  const files = new Map();
  const agentsPath = path.join(remoteRoot, "AGENTS.md");

  addRemoteFile(files, remoteRoot, "AGENTS.md");

  for (const rel of discoverReferencedMarkdown(fs.readFileSync(agentsPath, "utf8"))) {
    addRemoteFile(files, remoteRoot, normalizeGovernanceRelativePath(rel));
  }

  for (const rel of [path.join(".agents", ".autoupdate.md"), path.join(".agents", "webPageLike.md")]) {
    const sourcePath = path.join(remoteRoot, rel);

    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
      addRemoteFile(files, remoteRoot, rel);
    }
  }

  return [...files.values()];
}

function discoverReferencedMarkdown(content) {
  const result = [];
  const pattern = /\]\((\.\/[^)#]+\.md)(?:#[^)]+)?\)/giu;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    result.push(match[1]);
  }

  return result;
}

function normalizeGovernanceRelativePath(value) {
  const normalized = toPosixPath(value).replace(/^\.\//u, "");

  if (normalized.startsWith("agents/")) {
    return `.agents/${normalized.slice("agents/".length)}`;
  }

  return normalized;
}

function addRemoteFile(files, remoteRoot, relativePath) {
  const safeRel = safeRelativePath(relativePath);
  const sourcePath = path.join(remoteRoot, safeRel);

  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new Error(`Arquivo normativo remoto ausente: ${toPosixPath(safeRel)}`);
  }

  if (!TEXT_EXTENSIONS.has(path.extname(sourcePath).toLocaleLowerCase("en-US"))) {
    throw new Error(`Tipo normativo não permitido: ${toPosixPath(safeRel)}`);
  }

  files.set(toPosixPath(safeRel), {
    content: fs.readFileSync(sourcePath),
    relativePath: safeRel,
  });
}

function compareRemoteFiles(rootDir, remoteFiles, previousLock = null) {
  const changes = [];
  const remotePaths = new Set(remoteFiles.map((entry) => toPosixPath(entry.relativePath)));

  for (const entry of remoteFiles) {
    const localPath = path.join(rootDir, entry.relativePath);
    const localContent = fs.existsSync(localPath) ? fs.readFileSync(localPath) : null;
    const same = localContent && hashBuffer(localContent) === hashBuffer(entry.content);
    changes.push({
      action: same ? "unchanged" : localContent ? "update" : "add",
      content: entry.content,
      relativePath: entry.relativePath,
    });
  }

  for (const localRel of listPreviouslyManagedFiles(previousLock)) {
    if (toPosixPath(localRel) !== toPosixPath(LOCK_FILE) && !remotePaths.has(toPosixPath(localRel))) {
      changes.push({
        action: "remove",
        relativePath: localRel,
      });
    }
  }

  return changes.sort((a, b) => toPosixPath(a.relativePath).localeCompare(toPosixPath(b.relativePath), "en"));
}

function listPreviouslyManagedFiles(lock) {
  if (!lock || !Array.isArray(lock.managedFiles)) {
    return [];
  }

  return lock.managedFiles.map((entry) => safeRelativePath(entry.path || entry.relativePath || entry));
}

function assertManagedFilesClean(rootDir, force, plan) {
  if (force) {
    return;
  }

  const paths = [...new Set(plan.changes
    .filter((change) => change.action !== "unchanged")
    .map((change) => toPosixPath(change.relativePath)))];

  if (paths.length === 0) {
    return;
  }

  const result = childProcess.spawnSync("git", [
    "-C",
    rootDir,
    "status",
    "--porcelain",
    "--",
    ...paths,
  ], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`Falha ao verificar working tree: ${result.stderr || result.stdout}`);
  }

  if (result.stdout.trim()) {
    throw new Error("Arquivos normativos locais modificados; use --force somente após revisar o diff.");
  }
}

function applyPlan(rootDir, plan) {
  for (const change of plan.changes) {
    const target = path.join(rootDir, change.relativePath);

    if (change.action === "unchanged") {
      continue;
    }

    if (change.action === "remove") {
      fs.rmSync(target, { force: true });
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, change.content);
  }

  fs.mkdirSync(path.dirname(path.join(rootDir, LOCK_FILE)), { recursive: true });
  fs.writeFileSync(path.join(rootDir, LOCK_FILE), `${JSON.stringify(plan.lock)}\n`, "utf8");
}

function commitAndPushNormativeUpdate(rootDir, plan) {
  const paths = listChangedNormativePaths(plan);

  if (paths.length === 0) {
    return;
  }

  const upstream = resolveUpstream(rootDir);
  assertNoPendingLocalCommits(rootDir, upstream);
  runGit(rootDir, ["add", "--", ...paths]);

  const staged = runGit(rootDir, ["diff", "--cached", "--name-only"]).stdout
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(toPosixPath);
  const allowed = new Set(paths.map(toPosixPath));
  const invalid = staged.filter((entry) => !allowed.has(entry));

  if (invalid.length > 0) {
    throw new Error(`Staging normativo contem path proibido: ${invalid.join(", ")}`);
  }

  if (staged.length === 0) {
    return;
  }

  runGit(rootDir, ["commit", "-m", `ajuste: sincroniza governanca ${plan.source.ref}`]);

  if (upstream) {
    runGit(rootDir, ["push"]);
  } else {
    runGit(rootDir, ["push", "-u", "origin", currentBranchName(rootDir)]);
  }
}

function listChangedNormativePaths(plan) {
  return plan.changes
    .filter((change) => change.action !== "unchanged")
    .map((change) => toPosixPath(change.relativePath));
}

function resolveUpstream(rootDir) {
  const upstream = childProcess.spawnSync("git", [
    "-C",
    rootDir,
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{u}",
  ], {
    encoding: "utf8",
  });

  if (upstream.status !== 0) {
    return "";
  }

  return upstream.stdout.trim();
}

function assertNoPendingLocalCommits(rootDir, upstream) {
  if (!upstream) {
    return;
  }

  const count = runGit(rootDir, ["rev-list", "--count", `${upstream}..HEAD`]).stdout.trim();

  if (Number(count) > 0) {
    throw new Error("Ha commits locais pendentes; push normativo exclusivo bloqueado.");
  }
}

function currentBranchName(rootDir) {
  return runGit(rootDir, ["branch", "--show-current"]).stdout.trim();
}

function runGit(rootDir, args) {
  const result = childProcess.spawnSync("git", ["-C", rootDir, ...args], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }

  return result;
}

function printPlan(plan, mode) {
  console.log(`agents:update ${mode}: ${plan.source.label}`);

  for (const change of plan.changes) {
    if (change.action !== "unchanged") {
      console.log(`${change.action}: ${toPosixPath(change.relativePath)}`);
    }
  }

  if (!plan.changed) {
    console.log("sem alteracoes normativas");
  } else if (mode === "dry-run") {
    console.log(`commit/push normativo previsto para: ${listChangedNormativePaths(plan).join(", ")}`);
  }
}

function safeRelativePath(value) {
  const normalized = path.normalize(String(value || ""));

  if (!normalized || path.isAbsolute(normalized) || normalized.startsWith("..") || normalized.includes(`..${path.sep}`)) {
    throw new Error(`Path normativo inseguro: ${value}`);
  }

  return normalized;
}

function readUpdateLock(rootDir) {
  const lockPath = path.join(rootDir, LOCK_FILE);

  if (!fs.existsSync(lockPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(lockPath, "utf8"));
}

function createUpdateLock(source, remoteFiles) {
  return {
    files: Object.fromEntries(remoteFiles.map((entry) => [
      toPosixPath(entry.relativePath),
      hashBuffer(entry.content),
    ])),
    managedFiles: remoteFiles.map((entry) => ({ path: toPosixPath(entry.relativePath) })),
    source: {
      label: source.label,
      ref: source.ref,
      type: source.type,
      url: `${SOURCE_OWNER}/${SOURCE_REPO}`,
    },
    updatedAt: new Date().toISOString(),
  };
}

function listFiles(dirPath) {
  const result = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      result.push(...listFiles(entryPath));
    } else if (entry.isFile()) {
      result.push(entryPath);
    }
  }

  return result;
}

function defaultHttpClient(url, options = {}, redirectCount = 0) {
  if (redirectCount > 5) {
    return Promise.reject(new Error(`Redirecionamentos demais: ${url}`));
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      headers: {
        Accept: options.binary ? "*/*" : "application/vnd.github+json",
        "User-Agent": "agents-update",
      },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        resolve(defaultHttpClient(new URL(res.headers.location, url).toString(), options, redirectCount + 1));
        return;
      }

      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          body: Buffer.concat(chunks),
          headers: res.headers,
          statusCode: res.statusCode || 0,
        });
      });
    });

    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error(`Tempo esgotado: ${url}`)));
    req.end();
  });
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function toPosixPath(value) {
  return String(value || "").split(path.sep).join("/");
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`Falha ao atualizar governanca operacional: ${err.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  buildUpdatePlan,
  collectRemoteGovernanceFiles,
  compareRemoteFiles,
  main,
  normalizeGovernanceRelativePath,
  parseArgs,
  resolveRemoteSource,
};
