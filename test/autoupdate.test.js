const assert = require("assert");
const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { applyLegacyExtensionMigrations, applyPlan, backupDivergentManagedFiles, collectRemoteGovernanceFiles, compareRemoteFiles, handoffToReleaseRuntime, mergePackageManifest, parseArgs, planLegacyExtensionMigrations, prepareReleaseHandoff, prepareUpdateAnalogFiles, resolveReleaseRuntime, signHandoffPayload, verifyHandoffState } = require("../.ia.rules/core/runtime/scripts/update-agents");
const { extractZip } = require("../.ia.rules/core/runtime/scripts/archive");
const { planPackageMigration, readSuccessorPolicy, withVirtualUpstream } = require("../.ia.rules/core/runtime/scripts/autoupdate");
const { isManagedDistributionFile, isManagedScriptPath } = require("../.ia.rules/core/runtime/scripts/repo-tools");

async function main() {
  assert.deepEqual(parseArgs([]), { check: false, dryRun: false, force: false, help: false });
  assert.deepEqual(parseArgs(["force", "check"]), { check: true, dryRun: false, force: true, help: false });
  const local = Buffer.from(JSON.stringify({
    name: "consumer",
    scripts: {
      "agent:agents": "node scripts/.ia.rules/repo-tools.ts agent:agents",
      build: "vite build",
      check: "eslint . && vitest run",
      prepare: "husky",
      publish: "ruby publish.rb",
      test: "vitest run",
    },
    agentsGovernance: { schema: 1, productVerifyScript: "check:product" },
  }));
  const remote = Buffer.from(JSON.stringify({
    agentsUpstream: { schema: 1, upstreamRepository: "jcempro/agents.md", predecessorRepositories: ["JeanCarloEM/agents.md"] },
    scripts: {
      "agent:autoupdate": "node .ia.rules/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:autoupdate": "node .ia.rules/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agent:agents": "node .ia.rules/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:update": "node .ia.rules/core/runtime/scripts/repo-tools.js agent:autoupdate",
      build: "npm run agent:build",
      check: "npm run agent:verify",
      prepare: "npm run agent:setup",
      publish: "npm run agent:publish",
      test: "npm run agent:test",
    },
    agentsGovernance: {
      schema: 1,
      managedScriptPrefixes: ["agent:"],
      managedScripts: ["agents:autoupdate", "agents:update"],
      installableScripts: ["build", "check", "prepare", "publish", "test"],
      dependencies: [],
      optionalDependencies: [],
    },
  }));
  const merged = JSON.parse(mergePackageManifest(local, remote).toString("utf8"));
  assert.equal(merged.scripts.publish, "ruby publish.rb");
  assert.equal(merged.scripts.build, "vite build");
  assert.equal(merged.scripts.check, "eslint . && vitest run");
  assert.equal(merged.scripts.prepare, "husky");
  assert.equal(merged.scripts.test, "vitest run");
  assert.equal(merged.agentsGovernance.productVerifyScript, "check:product");
  assert.deepEqual(merged.agentsGovernance.installedScripts, {});
  assert.match(merged.scripts["agent:autoupdate"], /agent:autoupdate/u);
  assert.equal(merged.scripts["agent:agents"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:autoupdate"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:update"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.agentsUpstream.upstreamRepository, "jcempro/agents.md");
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", "src", ".ia.rules", "core", "runtime", "scripts", "repo-tools.js")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", "src", ".ia.rules", "core", "update", "migrations", "v1-to-v2.ts")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", "src", ".ia.rules", "scenarios", "release", "scripts", "release-hooks.ts")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", "src", ".ia.rules", "cache", "legacy-consumer", ".ia.rules", "core", "runtime", "scripts", "to-ia.js")), false);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", "src", ".ia.rules", "local", "custom.js")), false);
  assert.equal(isManagedDistributionFile(path.join(__dirname, "..", "src", ".ia.rules", "core", "runtime", "scripts", "package.json")), true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", ".ia.rules", "core", "runtime", "scripts", "package.json"), "utf8")).type, "commonjs");
  const absentDefaults = JSON.parse(mergePackageManifest(Buffer.from(JSON.stringify({ name: "new-consumer" })), remote).toString("utf8"));
  assert.equal(absentDefaults.scripts.build, "npm run agent:build");
  assert.match(absentDefaults.agentsGovernance.installedScripts.build, /^[a-f0-9]{64}$/u);
  const previousDefault = absentDefaults.scripts.build;
  const updatedRemote = JSON.parse(remote.toString("utf8"));
  updatedRemote.scripts.build = "npm run agent:build -- --new";
  const upgradedDefaults = JSON.parse(mergePackageManifest(Buffer.from(JSON.stringify(absentDefaults)), Buffer.from(JSON.stringify(updatedRemote))).toString("utf8"));
  assert.notEqual(upgradedDefaults.scripts.build, previousDefault);
  absentDefaults.scripts.build = "rollup -c";
  const customizedDefault = JSON.parse(mergePackageManifest(Buffer.from(JSON.stringify(absentDefaults)), Buffer.from(JSON.stringify(updatedRemote))).toString("utf8"));
  assert.equal(customizedDefault.scripts.build, "rollup -c");
  assert.equal(customizedDefault.agentsGovernance.installedScripts.build, undefined);
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-autoupdate-test-"));
  try {
    initGovernedRepository(root);
    fs.writeFileSync(path.join(root, ".gitignore"), ".ia.rules\nnode_modules/\n", "utf8");
    fs.mkdirSync(path.join(root, ".ia.rules", "core", "update"), { recursive: true });
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ agentsUpstream: { schema: 1, upstreamRepository: "old/repository" } }));
    fs.writeFileSync(path.join(root, ".ia.rules", "core", "update", "upstream.json"), JSON.stringify({ schema: 1, upstreamRepository: "new/repository", predecessorRepositories: ["old/repository"] }));
    const policy = readSuccessorPolicy(root);
    assert.equal(policy.upstreamRepository, "new/repository");
    const migration = planPackageMigration(root, policy);
    assert.equal(migration.changed, true);
    const migrated = JSON.parse(migration.content);
    assert.equal(migrated.scripts["agent:autoupdate"], migrated.scripts["agent:agents"]);
    assert.equal(migrated.agentsUpstream.upstreamRepository, "new/repository");
    const local = path.join(root, ".ia.rules", "upstream.json");
    await withVirtualUpstream(policy, root, async () => {
      assert.equal(fs.existsSync(local), true);
      assert.equal(JSON.parse(fs.readFileSync(local, "utf8")).upstreamRepository, "new/repository");
    });
    assert.equal(fs.existsSync(local), false);

    const collision = path.join(root, ".ia.rules", "meta", "build.md");
    fs.mkdirSync(path.dirname(collision), { recursive: true });
    fs.writeFileSync(collision, "customizacao local\n", "utf8");
    const backupRoot = path.join(root, "agents-governance-backups");
    const updatePlan = {
      changes: [{ action: "update", content: Buffer.from("governanca oficial\n"), relativePath: ".ia.rules/meta/build.md" }],
      lock: { files: { ".ia.rules/meta/build.md": "novo-hash" }, managedFiles: [{ path: ".ia.rules/meta/build.md" }] },
      source: { label: "release:v9.9.9", ref: "v9.9.9", type: "release" },
    };
    const backupPath = backupDivergentManagedFiles(root, updatePlan, { now: new Date("2026-07-18T12:34:56.000Z") });
    assert.equal(backupPath, path.join(backupRoot, "2026-07-18", `agents-update-${path.basename(root)}-v9.9.9-20260718T123456Z.zip`));
    assert.equal(fs.existsSync(backupPath), true);
    const extracted = path.join(root, "extracted-backup");
    extractZip(fs.readFileSync(backupPath), extracted);
    assert.equal(fs.readFileSync(path.join(extracted, ".ia.rules", "meta", "build.md"), "utf8"), "customizacao local\n");
    const backupManifest = JSON.parse(fs.readFileSync(path.join(extracted, "backup-manifest.json"), "utf8"));
    assert.deepEqual(backupManifest.files.map((entry) => entry.path), [".ia.rules/meta/build.md"]);
    applyPlan(root, updatePlan);
    assert.equal(fs.readFileSync(collision, "utf8"), "governanca oficial\n");
    assert.equal(fs.existsSync(backupPath), true);
    assert.match(fs.readFileSync(path.join(__dirname, "..", ".gitignore"), "utf8"), /^agents-governance-backups\/$/mu);
    const analogs = prepareUpdateAnalogFiles(root, {
      changes: [{ action: "add", relativePath: ".ia.rules/core/runtime/scripts/repo-tools.js" }],
    });
    assert.deepEqual(analogs, [".gitignore"]);
    const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
    assert.match(gitignore, /BEGIN agents-governance managed/u);
    assert.match(gitignore, /^!\/\.ia\.rules\/$/mu);
    assert.match(gitignore, /^!\/\.ia\.rules\/\*\*$/mu);
    assert.match(gitignore, /^\/\.ia\.rules\/cache\/$/mu);
    assert.deepEqual(prepareUpdateAnalogFiles(root, {
      changes: [{ action: "add", relativePath: ".ia.rules/core/runtime/scripts/repo-tools.js" }],
    }), []);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }

  const repositoryRoot = path.join(__dirname, "..");
  const distRoot = path.join(repositoryRoot, "dist");
  const release = JSON.parse(fs.readFileSync(path.join(distRoot, "release.json"), "utf8"));
  const distributionPackage = JSON.parse(fs.readFileSync(path.join(distRoot, "package.json"), "utf8"));
  const dispatcher = distributionPackage.scripts["shared:update:agents"];
  assert.ok(dispatcher.indexOf("scripts/.agents/autoupdate.js") < dispatcher.indexOf(".agents/core/runtime/scripts/autoupdate.js"));
  const legacyBridgeEntries = release.canonicalUpdate.files.filter((entry) => entry.condition === "legacy-update-bridge");
  assert.ok(legacyBridgeEntries.length >= 7);
  assert.ok(legacyBridgeEntries.some((entry) => entry.path === "scripts/.agents/autoupdate.js"));
  assert.ok(legacyBridgeEntries.some((entry) => entry.path === "scripts/.agents/package.json"));
  assert.ok(release.update.files.every((entry) => [".js", ".json", ".md"].includes(path.extname(entry.path))));
  assert.ok(release.update.files.some((entry) => entry.path === "scripts/.agents/autoupdate.js"));
  for (const handoffPath of release.handoff.files) {
    assert.ok(release.update.files.some((entry) => entry.path === handoffPath), `bootstrap omite runtime de handoff: ${handoffPath}`);
  }
  const remoteFiles = collectRemoteGovernanceFiles(distRoot);
  assert.equal(remoteFiles.some((entry) => entry.relativePath.startsWith(".agents")), false);
  assert.equal(remoteFiles.some((entry) => entry.relativePath.startsWith(path.join("scripts", ".agents"))), false);
  assert.equal(remoteFiles.length, release.canonicalUpdate.files.length - legacyBridgeEntries.length);

  const extensionRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-extension-migration-"));
  try {
    initGovernedRepository(extensionRoot);
    const fixtures = {
      ".agents/hooks/pre-release.js": "module.exports = () => 'hook antigo';\n",
      ".agents/local/team.json": "{\"team\":true}\n",
      ".agents/agents.local.md": "# Diretrizes locais antigas\n",
      ".agents/roles/custom.md": "# Papel local desconhecido\n",
      "scripts/.agents/hooks/post-release.js": "module.exports = () => 'hook scripts';\n",
    };
    for (const [relativePath, content] of Object.entries(fixtures)) {
      const target = path.join(extensionRoot, relativePath);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    }
    fs.writeFileSync(path.join(extensionRoot, "agents.local.md"), "# Diretrizes locais atuais\n");
    const migrations = planLegacyExtensionMigrations(extensionRoot, remoteFiles);
    assert.equal(migrations.length, Object.keys(fixtures).length);
    assert.ok(migrations.some((entry) => entry.source === ".agents/hooks/pre-release.js" && entry.target === ".ia.rules/hooks/pre-release.js"));
    assert.ok(migrations.some((entry) => entry.source === ".agents/local/team.json" && entry.target === ".ia.rules/local/team.json"));
    assert.ok(migrations.some((entry) => entry.source === ".agents/agents.local.md" && entry.collision && entry.target.startsWith(".ia.rules/local/inherited/")));
    assert.ok(migrations.some((entry) => entry.source === ".agents/roles/custom.md" && entry.target.startsWith(".ia.rules/local/inherited/")));
    applyLegacyExtensionMigrations(extensionRoot, migrations);
    for (const relativePath of Object.keys(fixtures)) assert.equal(fs.existsSync(path.join(extensionRoot, relativePath)), false);
    assert.equal(fs.readFileSync(path.join(extensionRoot, ".ia.rules", "hooks", "pre-release.js"), "utf8"), fixtures[".agents/hooks/pre-release.js"]);
    assert.equal(fs.readFileSync(path.join(extensionRoot, ".ia.rules", "local", "team.json"), "utf8"), fixtures[".agents/local/team.json"]);
    assert.equal(fs.readFileSync(path.join(extensionRoot, "agents.local.md"), "utf8"), "# Diretrizes locais atuais\n");
    const extensionManifest = JSON.parse(fs.readFileSync(path.join(extensionRoot, ".ia.rules", "local", "inherited", "extensions.json"), "utf8"));
    assert.equal(extensionManifest.entries.length, Object.keys(fixtures).length);
    for (const entry of extensionManifest.entries) assert.match(entry.sha256, /^[a-f0-9]{64}$/u);
  } finally {
    fs.rmSync(extensionRoot, { force: true, recursive: true });
  }

  const partialRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-partial-consumer-"));
  try {
    initGovernedRepository(partialRoot, fs.readFileSync(path.join(distRoot, "AGENTS.md")));
    fs.writeFileSync(path.join(partialRoot, "package.json"), `${JSON.stringify({ name: "partial", scripts: { "custom:publish": "ruby publish.rb" } }, null, 2)}\n`);
    const legacyContract = path.join(partialRoot, ".agents", "core", "contracts.md");
    const legacyRuntime = path.join(partialRoot, ".agents", "core", "runtime", "scripts", "repo-tools.js");
    const legacyScenario = path.join(partialRoot, ".agents", "scenarios", "release", "scenario.md");
    const legacyScriptBoundary = path.join(partialRoot, "scripts", ".agents", "package.json");
    fs.mkdirSync(path.dirname(legacyContract), { recursive: true });
    fs.mkdirSync(path.dirname(legacyRuntime), { recursive: true });
    fs.mkdirSync(path.dirname(legacyScenario), { recursive: true });
    fs.mkdirSync(path.dirname(legacyScriptBoundary), { recursive: true });
    fs.writeFileSync(legacyContract, "bridge antigo\n");
    fs.writeFileSync(legacyRuntime, "runtime oficial antigo\n");
    fs.writeFileSync(legacyScenario, "cenario oficial antigo\n");
    fs.writeFileSync(legacyScriptBoundary, "{\"type\":\"commonjs\"}\n");
    const changes = compareRemoteFiles(partialRoot, remoteFiles, null);
    assert.ok(changes.some((entry) => entry.action === "add" && entry.relativePath === path.join(".ia.rules", "normative-index.json")));
    assert.ok(changes.some((entry) => entry.action === "update" && entry.relativePath === "package.json"));
    assert.ok(changes.some((entry) => entry.action === "remove" && entry.relativePath === ".agents/core/contracts.md"));
    assert.ok(changes.some((entry) => entry.action === "remove" && entry.relativePath === ".agents/core/runtime/scripts/repo-tools.js"));
    assert.ok(changes.some((entry) => entry.action === "remove" && entry.relativePath === ".agents/scenarios/release/scenario.md"));
    assert.ok(changes.some((entry) => entry.action === "remove" && entry.relativePath === "scripts/.agents/package.json"));
    applyPlan(partialRoot, {
      changes,
      lock: {
        files: Object.fromEntries(remoteFiles.map((entry) => [entry.relativePath.split(path.sep).join("/"), crypto.createHash("sha256").update(entry.content).digest("hex")])),
        format: "agents-governance-manifest",
        managedFiles: remoteFiles.map((entry) => ({ path: entry.relativePath.split(path.sep).join("/") })),
        marker: "governance-manifest/v2",
        schema: 2,
      },
      source: { label: "release:v-test", ref: "v-test", type: "release" },
    });
    assert.equal(fs.existsSync(path.join(partialRoot, ".ia.rules", "normative-index.json")), true);
    assert.equal(fs.existsSync(path.join(partialRoot, ".agents")), false);
    assert.equal(fs.existsSync(path.join(partialRoot, "scripts", ".agents")), false);
    const migratedPackage = JSON.parse(fs.readFileSync(path.join(partialRoot, "package.json"), "utf8"));
    assert.equal(migratedPackage.scripts["custom:publish"], "ruby publish.rb");
    assert.ok(migratedPackage.scripts["update:agents"]);
  } finally {
    fs.rmSync(partialRoot, { force: true, recursive: true });
  }

  const bridgeHelp = childProcess.spawnSync(process.execPath, [path.join(distRoot, "scripts", ".agents", "autoupdate.js"), "force", "--help"], { encoding: "utf8", windowsHide: true });
  assert.equal(bridgeHelp.status, 0, bridgeHelp.stderr || bridgeHelp.stdout);
  assert.match(bridgeHelp.stdout, /Uso: update:agents/u);
  const runtime = resolveReleaseRuntime(distRoot);
  assert.equal(runtime.entryPath, fs.realpathSync(path.join(distRoot, ".ia.rules", "core", "runtime", "scripts", "update-agents.js")));
  assert.equal(Object.keys(runtime.runtimeHashes).length, 6);

  const previousCandidateRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-previous-candidate-"));
  try {
    fs.cpSync(distRoot, previousCandidateRoot, { recursive: true });
    const previousCandidateReleasePath = path.join(previousCandidateRoot, "release.json");
    const previousCandidateRelease = JSON.parse(fs.readFileSync(previousCandidateReleasePath, "utf8"));
    delete previousCandidateRelease.canonicalUpdate;
    fs.writeFileSync(previousCandidateReleasePath, `${JSON.stringify(previousCandidateRelease)}\n`, "utf8");
    const previousCandidateRuntime = resolveReleaseRuntime(previousCandidateRoot);
    assert.equal(previousCandidateRuntime.entryPath, fs.realpathSync(path.join(previousCandidateRoot, ".ia.rules", "core", "runtime", "scripts", "update-agents.js")));
    assert.equal(Object.keys(previousCandidateRuntime.runtimeHashes).length, 6);
  } finally {
    fs.rmSync(previousCandidateRoot, { force: true, recursive: true });
  }

  const handoffRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-handoff-test-"));
  try {
    const releaseRoot = path.join(handoffRoot, "release");
    const targetRoot = path.join(handoffRoot, "target");
    fs.cpSync(distRoot, releaseRoot, { recursive: true });
    fs.mkdirSync(targetRoot, { recursive: true });
    initGovernedRepository(targetRoot);
    const targetEntriesBeforeResume = fs.readdirSync(targetRoot).sort();
    const copiedRuntime = resolveReleaseRuntime(releaseRoot);
    const key = crypto.randomBytes(32).toString("hex");
    const statePath = path.join(handoffRoot, "handoff-state.json");
    const payload = {
      argv: ["--dry-run"],
      entryPath: copiedRuntime.entryPath,
      format: "agents-update-handoff/v1",
      governanceRoot: fs.realpathSync(releaseRoot),
      phase: "release-runtime-ready",
      releaseRoot: fs.realpathSync(releaseRoot),
      runtimeHashes: copiedRuntime.runtimeHashes,
      schema: 1,
      source: { archiveSha256: "", archiveUrl: "https://example.invalid/agents.zip", label: "release:v-test", ref: "v-test", repository: "test/agents", type: "release" },
      targetRoot: fs.realpathSync(targetRoot),
    };
    fs.writeFileSync(statePath, JSON.stringify(signHandoffPayload(payload, key)), { mode: 0o600 });
    assert.equal(verifyHandoffState(statePath, key, copiedRuntime.entryPath).phase, "release-runtime-ready");
    const resumed = childProcess.spawnSync(process.execPath, [copiedRuntime.entryPath, "--check"], {
      cwd: targetRoot,
      encoding: "utf8",
      env: { ...process.env, AGENTS_UPDATE_HANDOFF_KEY: key, AGENTS_UPDATE_HANDOFF_STATE: statePath, NODE_PATH: "" },
      windowsHide: true,
    });
    assert.equal(resumed.status, 0, resumed.stderr || resumed.stdout);
    assert.match(resumed.stdout, /agent:autoupdate dry-run: release:v-test/u);
    assert.deepEqual(fs.readdirSync(targetRoot).sort(), targetEntriesBeforeResume);

    const tampered = JSON.parse(fs.readFileSync(statePath, "utf8"));
    tampered.payload.phase = "download-pending";
    fs.writeFileSync(statePath, JSON.stringify(tampered));
    assert.throws(() => verifyHandoffState(statePath, key, copiedRuntime.entryPath), /HMAC do handoff divergente/u);

    fs.writeFileSync(statePath, JSON.stringify(signHandoffPayload(payload, key)));
    const invalidRoots = { ...payload, targetRoot: payload.releaseRoot };
    fs.writeFileSync(statePath, JSON.stringify(signHandoffPayload(invalidRoots, key)));
    assert.throws(() => verifyHandoffState(statePath, key, copiedRuntime.entryPath), /Roots de release e target nao estao segregados/u);

    fs.writeFileSync(statePath, JSON.stringify(signHandoffPayload(payload, key)));
    const archiveDependency = path.join(releaseRoot, ".ia.rules", "core", "runtime", "scripts", "archive.js");
    fs.appendFileSync(archiveDependency, "\n// adulterado\n");
    assert.throws(() => verifyHandoffState(statePath, key, copiedRuntime.entryPath), /Runtime alterado apos handoff/u);
  } finally {
    fs.rmSync(handoffRoot, { force: true, recursive: true });
  }

  const archivePath = path.join(distRoot, `agents-v${JSON.parse(fs.readFileSync(path.join(repositoryRoot, "package.json"), "utf8")).version}.zip`);
  const archiveBody = fs.readFileSync(archivePath);
  let binaryDownloads = 0;
  const prepared = await prepareReleaseHandoff(repositoryRoot, async (_url, options = {}) => {
    if (options.binary) {
      binaryDownloads += 1;
      return { body: archiveBody, headers: {}, statusCode: 200 };
    }
    return {
      body: Buffer.from(JSON.stringify({ assets: [{ browser_download_url: "https://example.invalid/agents.zip", digest: `sha256:${crypto.createHash("sha256").update(archiveBody).digest("hex")}`, name: "agents.zip" }], tag_name: "v-test" })),
      headers: {},
      statusCode: 200,
    };
  }, { argv: ["--check"] });
  try {
    assert.equal(binaryDownloads, 1);
    assert.equal(prepared.payload.phase, "release-runtime-ready");
    assert.equal(prepared.payload.targetRoot, fs.realpathSync(repositoryRoot));
    assert.equal(fs.existsSync(prepared.statePath), true);
  } finally {
    fs.rmSync(prepared.handoffRoot, { force: true, recursive: true });
  }

  await assert.rejects(() => prepareReleaseHandoff(repositoryRoot, async (_url, options = {}) => {
    if (options.binary) return { body: archiveBody, headers: {}, statusCode: 200 };
    return {
      body: Buffer.from(JSON.stringify({ assets: [{ browser_download_url: "https://example.invalid/agents.zip", digest: `sha256:${"0".repeat(64)}`, name: "agents.zip" }], tag_name: "v-test" })),
      headers: {},
      statusCode: 200,
    };
  }), /SHA-256 do arquivo de release divergente/u);

  let cleanedHandoffRoot = "";
  const handoffResult = await handoffToReleaseRuntime(["--dry-run"], repositoryRoot, async (_url, options = {}) => {
    if (options.binary) return { body: archiveBody, headers: {}, statusCode: 200 };
    return {
      body: Buffer.from(JSON.stringify({ assets: [{ browser_download_url: "https://example.invalid/agents.zip", digest: `sha256:${crypto.createHash("sha256").update(archiveBody).digest("hex")}`, name: "agents.zip" }], tag_name: "v-test" })),
      headers: {},
      statusCode: 200,
    };
  }, {
    captureRuntime: true,
    spawnRuntime: (_executable, args, options) => {
      cleanedHandoffRoot = path.dirname(options.env.AGENTS_UPDATE_HANDOFF_STATE);
      const verified = verifyHandoffState(options.env.AGENTS_UPDATE_HANDOFF_STATE, options.env.AGENTS_UPDATE_HANDOFF_KEY, args[0]);
      assert.deepEqual(verified.argv, ["--dry-run"]);
      return { status: 0, stderr: "", stdout: "" };
    },
  });
  assert.equal(handoffResult.handoff, true);
  assert.equal(fs.existsSync(cleanedHandoffRoot), false);
}

function initGovernedRepository(root, agents = Buffer.from("# AGENTS\n")) {
  fs.mkdirSync(root, { recursive: true });
  if (!fs.existsSync(path.join(root, "AGENTS.md"))) fs.writeFileSync(path.join(root, "AGENTS.md"), agents);
  const init = childProcess.spawnSync("git", ["init"], { cwd: root, encoding: "utf8", windowsHide: true });
  assert.equal(init.status, 0, init.stderr || init.stdout);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
