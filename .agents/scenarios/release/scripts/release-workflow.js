// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const ZERO_SHA = "0000000000000000000000000000000000000000";

class UsageError extends Error {}

function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;

  if (command === "--help") {
    console.log("Uso: release-workflow <detect <before> <after>|finalize <versao> [arquivo]> ");
    return 0;
  }

  if (command === "detect") {
    return detectReleaseTrigger(args);
  }

  if (command === "finalize") {
    return finalizeRelease(args);
  }

  throw new UsageError(`COMANDO_RELEASE_INVALIDO:${command || "(vazio)"}`);
}

function detectReleaseTrigger(args = []) {
  const before = String(args[0] || "").trim();
  const after = String(args[1] || "").trim() || "HEAD";
  const commits = listRangeCommits(before, after);
  const match = commits
    .map((commit) => inspectCommitForRelease(commit))
    .filter(Boolean)
    .pop();

  if (!match) {
    printJson({ triggered: false });
    return 0;
  }

  printJson({
    commit: match.commit,
    file: match.file,
    triggered: true,
    version: match.version,
  });
  return 0;
}

function finalizeRelease(args = []) {
  const version = normalizeReleaseVersion(args[0] || "");
  const releaseFile = String(args.length > 1 ? args[1] : "release").trim();
  const relativeReleaseFile = releaseFile ? safeRelativePath(releaseFile) : "";
  let removed = false;

  if (relativeReleaseFile) {
    const releasePath = path.join(ROOT_DIR, relativeReleaseFile);
    if (fs.existsSync(releasePath)) {
      fs.rmSync(releasePath, { force: true });
      removed = true;
      runGit(["add", "--", relativeReleaseFile]);
    }
  }

  if (!removed) {
    runGit(["commit", "--allow-empty", "-m", `release: v${version}`]);
  } else {
    runGit(["commit", "-m", `release: v${version}`]);
  }

  printJson({
    commit: runGit(["rev-parse", "HEAD"]).stdout.trim(),
    removed,
    version,
  });
  return 0;
}

function listRangeCommits(before, after) {
  if (!after) {
    return [];
  }

  if (!before || before === ZERO_SHA) {
    return [after];
  }

  const result = runGit(["rev-list", "--reverse", `${before}..${after}`], { optional: true });
  return result.stdout.trim().split(/\r?\n/u).filter(Boolean);
}

function inspectCommitForRelease(commit) {
  const changed = runGit(["diff-tree", "--no-commit-id", "--name-status", "-r", commit], { optional: true }).stdout
    .trim()
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => {
      const [status, ...rest] = line.split(/\s+/u);
      return {
        path: rest.join(" ").trim(),
        status: status.trim(),
      };
    });

  if (changed.length !== 1) {
    return null;
  }

  const entry = changed[0];

  if (entry.status !== "A" || !isReleaseTriggerPath(entry.path)) {
    return null;
  }

  const version = normalizeReleaseVersion(runGit(["show", `${commit}:${entry.path}`]).stdout.trim());
  return {
    commit,
    file: entry.path,
    version,
  };
}

function isReleaseTriggerPath(filePath) {
  return String(filePath || "").trim() === "release";
}

function normalizeReleaseVersion(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d+)\.(\d+)(?:\.(\d+))?(?:-([0-9A-Za-z.-]+))?$/u);

  if (!match) {
    throw new Error(`Versao de release invalida: ${value}`);
  }

  const major = match[1];
  const minor = match[2];
  const patch = match[3] || "0";
  const suffix = match[4] ? `-${match[4]}` : "";
  return `${major}.${minor}.${patch}${suffix}`;
}

function safeRelativePath(value) {
  const normalized = path.normalize(String(value || ""));

  if (!normalized || path.isAbsolute(normalized) || normalized.startsWith("..") || normalized.includes(`..${path.sep}`)) {
    throw new Error(`Path de release inseguro: ${value}`);
  }

  return normalized;
}

function runGit(args, options = {}) {
  const result = childProcess.spawnSync("git", ["-C", ROOT_DIR, ...args], {
    encoding: "utf8",
  });

  if (!options.optional && result.status !== 0) {
    throw new Error(`git ${args.join(" ")} falhou: ${result.stderr || result.stdout}`);
  }

  return result;
}

function printJson(value) {
  console.log(JSON.stringify(value));
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (err) {
    console.error(err.message);
    process.exitCode = error instanceof UsageError ? 2 : 1;
  }
}

module.exports = {
  detectReleaseTrigger,
  finalizeRelease,
  inspectCommitForRelease,
  isReleaseTriggerPath,
  normalizeReleaseVersion,
};
