const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { collectRemoteGovernanceFiles, compareRemoteFiles, mergePackageManifest } = require("../.ia.rules/core/runtime/scripts/update-agents");

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

function explicitCommonJsBoundary(filePath, rootDir) {
  let current = path.dirname(filePath);
  while (current === rootDir || current.startsWith(`${rootDir}${path.sep}`)) {
    const packagePath = path.join(current, "package.json");
    if (fs.existsSync(packagePath)) {
      return JSON.parse(fs.readFileSync(packagePath, "utf8")).type === "commonjs" ? packagePath : "";
    }
    if (current === rootDir) break;
    current = path.dirname(current);
  }
  return "";
}

function resolveRelativeRequire(fromFile, request) {
  const resolved = path.resolve(path.dirname(fromFile), request);
  return [resolved, `${resolved}.js`, `${resolved}.json`, path.join(resolved, "index.js")]
    .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) || "";
}

function assertCommonJsGraph(rootDir, manifest) {
  const commonJsArtifacts = manifest.entries.filter((entry) => entry.artifact && entry.artifact.format === "commonjs");
  for (const entry of commonJsArtifacts) {
    const artifactPath = path.join(rootDir, entry.artifact.destination);
    assert.ok(explicitCommonJsBoundary(artifactPath, rootDir), `Artefato CommonJS sem fronteira explícita: ${entry.artifact.destination}`);
  }

  const crossings = [];
  for (const scriptPath of listFiles(path.join(rootDir, ".ia.rules")).filter((filePath) => filePath.endsWith(".js"))) {
    const content = fs.readFileSync(scriptPath, "utf8");
    for (const match of content.matchAll(/require\((['"])(\.[^'"]+)\1\)/gu)) {
      const target = resolveRelativeRequire(scriptPath, match[2]);
      assert.ok(target, `Require relativo não resolvido: ${posix(path.relative(rootDir, scriptPath))} -> ${match[2]}`);
      assert.ok(explicitCommonJsBoundary(target, rootDir), `Require saiu da fronteira CommonJS: ${posix(path.relative(rootDir, scriptPath))} -> ${posix(path.relative(rootDir, target))}`);
      const sourceRelative = posix(path.relative(rootDir, scriptPath));
      const targetRelative = posix(path.relative(rootDir, target));
      if (sourceRelative.startsWith(".ia.rules/core/") && targetRelative.startsWith(".ia.rules/scenarios/")) {
        crossings.push(`${sourceRelative}->${targetRelative}`);
      }
    }
  }
  assert.ok(crossings.some((entry) => entry.includes("repo-tools.js->.ia.rules/scenarios/release/scripts/package-registry.js")), "Require runtime -> cenário não validado");
}

function runGit(rootDir, args) {
  const result = childProcess.spawnSync("git", args, { cwd: rootDir, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

function copyCanonicalConsumer(distRoot, consumerRoot) {
  const release = JSON.parse(fs.readFileSync(path.join(distRoot, "release.json"), "utf8"));
  for (const entry of release.canonicalUpdate.files.filter((candidate) => candidate.condition !== "legacy-update-bridge")) {
    const source = path.join(distRoot, entry.path);
    const destination = path.join(consumerRoot, entry.path);
    assert.ok(fs.existsSync(source), `Arquivo canônico ausente: ${entry.path}`);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
  const packagePath = path.join(consumerRoot, "package.json");
  const consumerPackage = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  consumerPackage.type = "module";
  fs.writeFileSync(packagePath, `${JSON.stringify(consumerPackage, null, 2)}\n`, "utf8");
  const remotePackage = collectRemoteGovernanceFiles(distRoot).find((entry) => entry.kind === "package");
  fs.writeFileSync(packagePath, mergePackageManifest(fs.readFileSync(packagePath), remotePackage.content));

  runGit(consumerRoot, ["init"]);
  runGit(consumerRoot, ["add", "-f", "."]);
  runGit(consumerRoot, ["-c", "user.name=Agents Test", "-c", "user.email=agents-test@example.invalid", "commit", "-m", "fixture esm"]);
  return release;
}

function writeHttpsMock(filePath) {
  fs.writeFileSync(filePath, `
const crypto = require("crypto");
const { EventEmitter } = require("events");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { Readable } = require("stream");
const archive = fs.readFileSync(process.env.AGENTS_TEST_RELEASE_ZIP);
const assetUrl = process.env.AGENTS_TEST_ASSET_URL;
const latest = Buffer.from(JSON.stringify({
  assets: [{
    browser_download_url: assetUrl,
    digest: \`sha256:\${crypto.createHash("sha256").update(archive).digest("hex")}\`,
    name: path.basename(process.env.AGENTS_TEST_RELEASE_ZIP),
  }],
  tag_name: process.env.AGENTS_TEST_RELEASE_TAG,
}));
https.request = function request(url, _options, callback) {
  const emitter = new EventEmitter();
  emitter.end = () => process.nextTick(() => {
    const target = String(url);
    const body = target.endsWith("/releases/latest") ? latest : (target === assetUrl ? archive : Buffer.from("not found"));
    const response = Readable.from([body]);
    response.headers = {};
    response.statusCode = target.endsWith("/releases/latest") || target === assetUrl ? 200 : 404;
    callback(response);
  });
  emitter.destroy = (error) => { if (error) emitter.emit("error", error); };
  return emitter;
};
`, "utf8");
}

function assertEsmConsumerUpdateCheck(distRoot) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-esm-consumer-"));
  try {
    const consumerRoot = path.join(temporaryRoot, "consumer");
    fs.mkdirSync(consumerRoot);
    const release = copyCanonicalConsumer(distRoot, consumerRoot);
    const planned = compareRemoteFiles(consumerRoot, collectRemoteGovernanceFiles(distRoot), null)
      .filter((entry) => entry.action !== "unchanged")
      .map((entry) => `${entry.action}:${posix(entry.relativePath)}`);
    assert.deepEqual(planned, []);
    const version = JSON.parse(fs.readFileSync(path.join(distRoot, "package.json"), "utf8")).version;
    const archivePath = path.join(distRoot, `agents-v${version}.zip`);
    const preloadPath = path.join(temporaryRoot, "https-mock.cjs");
    writeHttpsMock(preloadPath);
    const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
    assert.ok(fs.existsSync(npmCli), `npm CLI ausente: ${npmCli}`);
    const result = childProcess.spawnSync(process.execPath, [npmCli, "run", "agents:update", "--", "--check"], {
      cwd: consumerRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        AGENTS_TEST_ASSET_URL: "https://downloads.example.invalid/agents.zip",
        AGENTS_TEST_RELEASE_TAG: `v${version}`,
        AGENTS_TEST_RELEASE_ZIP: archivePath,
        NODE_OPTIONS: `--require=${preloadPath}`,
        npm_config_cache: path.join(temporaryRoot, "npm-cache"),
        npm_config_update_notifier: "false",
      },
      windowsHide: true,
    });
    const output = `${result.stdout || ""}\n${result.stderr || ""}`;
    assert.equal(result.status, 0, output);
    assert.doesNotMatch(output, /module is not defined|ERR_REQUIRE_ESM/iu);
    assert.match(output, /agent:autoupdate|Governanca operacional/iu);
  } finally {
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, ".ia.rules", "distribution", "source-manifest.json"), "utf8"));
  const runtimeMatrix = JSON.parse(fs.readFileSync(path.join(sourceRoot, ".ia.rules", "runtime", "runtime-matrix.json"), "utf8"));
  const byPath = new Map(manifest.entries.map((entry) => [entry.path, entry]));
  assert.equal(JSON.parse(fs.readFileSync(path.join(distRoot, ".ia.rules", "package.json"), "utf8")).type, "commonjs");
  assertCommonJsGraph(distRoot, manifest);
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
  const releaseWorkflow = fs.readFileSync(path.join(root, ".github", "workflows", "release.yml"), "utf8");
  assert.doesNotMatch(releaseWorkflow, /detect-release:\r?\n\s+if:/u);
  assert.match(releaseWorkflow, /if:\s+github\.event_name == 'workflow_dispatch' \|\| needs\.detect-release\.outputs\.triggered == 'true'/u);
  assert.match(releaseWorkflow, /npm ci/u);
  assert.match(releaseWorkflow, /requirements-normative-graph\.txt/u);
  assert.doesNotMatch(releaseWorkflow, /require\(['"]\.\/src\/\.ia\.rules\/core\/runtime\/scripts\/repo-tools/u);

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
  assertEsmConsumerUpdateCheck(distRoot);
}

main();
