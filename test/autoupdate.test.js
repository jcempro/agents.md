const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { applyPlan, backupDivergentManagedFiles, mergePackageManifest, parseArgs } = require("../.agents/core/runtime/scripts/update-agents");
const { extractZip } = require("../.agents/core/runtime/scripts/archive");
const { planPackageMigration, readSuccessorPolicy, withVirtualUpstream } = require("../.agents/core/runtime/scripts/autoupdate");
const { isManagedDistributionFile, isManagedScriptPath } = require("../.agents/core/runtime/scripts/repo-tools");

async function main() {
  assert.deepEqual(parseArgs([]), { check: false, dryRun: false, force: false, help: false });
  const local = Buffer.from(JSON.stringify({ name: "consumer", scripts: { "agent:agents": "node scripts/.agents/repo-tools.js agent:agents", publish: "ruby publish.rb" } }));
  const remote = Buffer.from(JSON.stringify({
    scripts: {
      "agent:autoupdate": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:autoupdate": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agent:agents": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
      "agents:update": "node .agents/core/runtime/scripts/repo-tools.js agent:autoupdate",
    },
    agentsGovernance: { schema: 1, managedScriptPrefixes: ["agent:"], managedScripts: ["agents:autoupdate", "agents:update"], dependencies: [], optionalDependencies: [] },
  }));
  const merged = JSON.parse(mergePackageManifest(local, remote).toString("utf8"));
  assert.equal(merged.scripts.publish, "ruby publish.rb");
  assert.match(merged.scripts["agent:autoupdate"], /agent:autoupdate/u);
  assert.equal(merged.scripts["agent:agents"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:autoupdate"], merged.scripts["agent:autoupdate"]);
  assert.equal(merged.scripts["agents:update"], merged.scripts["agent:autoupdate"]);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", ".agents", "core", "runtime", "scripts", "repo-tools.js")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", ".agents", "core", "update", "migrations", "v1-to-v2.js")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", ".agents", "scenarios", "release", "scripts", "release-hooks.js")), true);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", ".agents", "cache", "legacy-consumer", ".agents", "core", "runtime", "scripts", "to-ia.js")), false);
  assert.equal(isManagedScriptPath(path.join(__dirname, "..", ".agents", "local", "custom.js")), false);
  assert.equal(isManagedDistributionFile(path.join(__dirname, "..", ".agents", "core", "runtime", "scripts", "package.json")), true);
  assert.equal(isManagedDistributionFile(path.join(__dirname, "..", ".agents", "package.json")), true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".agents", "package.json"), "utf8")).type, "commonjs");
  assert.equal(JSON.parse(fs.readFileSync(path.join(__dirname, "..", ".agents", "core", "runtime", "scripts", "package.json"), "utf8")).type, "commonjs");
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-autoupdate-test-"));
  try {
    fs.mkdirSync(path.join(root, ".agents", "core", "update"), { recursive: true });
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ agentsUpstream: { schema: 1, upstreamRepository: "old/repository" } }));
    fs.writeFileSync(path.join(root, ".agents", "core", "update", "upstream.json"), JSON.stringify({ schema: 1, upstreamRepository: "new/repository", predecessorRepositories: ["old/repository"] }));
    const policy = readSuccessorPolicy(root);
    assert.equal(policy.upstreamRepository, "new/repository");
    const migration = planPackageMigration(root, policy);
    assert.equal(migration.changed, true);
    const migrated = JSON.parse(migration.content);
    assert.equal(migrated.scripts["agent:autoupdate"], migrated.scripts["agent:agents"]);
    assert.equal(migrated.agentsUpstream.upstreamRepository, "new/repository");
    const local = path.join(root, ".agents", "upstream.json");
    await withVirtualUpstream(policy, root, async () => {
      assert.equal(fs.existsSync(local), true);
      assert.equal(JSON.parse(fs.readFileSync(local, "utf8")).upstreamRepository, "new/repository");
    });
    assert.equal(fs.existsSync(local), false);

    const collision = path.join(root, ".agents", "meta", "build.md");
    fs.mkdirSync(path.dirname(collision), { recursive: true });
    fs.writeFileSync(collision, "customizacao local\n", "utf8");
    const backupRoot = path.join(root, "agents-governance-backups");
    const updatePlan = {
      changes: [{ action: "update", content: Buffer.from("governanca oficial\n"), relativePath: ".agents/meta/build.md" }],
      lock: { files: { ".agents/meta/build.md": "novo-hash" }, managedFiles: [{ path: ".agents/meta/build.md" }] },
      source: { label: "release:v9.9.9", ref: "v9.9.9", type: "release" },
    };
    const backupPath = backupDivergentManagedFiles(root, updatePlan, { now: new Date("2026-07-18T12:34:56.000Z") });
    assert.equal(backupPath, path.join(backupRoot, "2026-07-18", `agents-update-${path.basename(root)}-v9.9.9-20260718T123456Z.zip`));
    assert.equal(fs.existsSync(backupPath), true);
    const extracted = path.join(root, "extracted-backup");
    extractZip(fs.readFileSync(backupPath), extracted);
    assert.equal(fs.readFileSync(path.join(extracted, ".agents", "meta", "build.md"), "utf8"), "customizacao local\n");
    const backupManifest = JSON.parse(fs.readFileSync(path.join(extracted, "backup-manifest.json"), "utf8"));
    assert.deepEqual(backupManifest.files.map((entry) => entry.path), [".agents/meta/build.md"]);
    applyPlan(root, updatePlan);
    assert.equal(fs.readFileSync(collision, "utf8"), "governanca oficial\n");
    assert.equal(fs.existsSync(backupPath), true);
    assert.match(fs.readFileSync(path.join(__dirname, "..", ".gitignore"), "utf8"), /^agents-governance-backups\/$/mu);
  } finally {
    fs.rmSync(root, { force: true, recursive: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
