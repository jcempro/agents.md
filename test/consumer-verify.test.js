const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const repositoryRoot = path.join(__dirname, "..");
const consumerRoot = fs.mkdtempSync(path.join(os.tmpdir(), "agents-consumer-verify-"));

try {
  fs.cpSync(path.join(repositoryRoot, "dist"), consumerRoot, { recursive: true });
  assert.equal(childProcess.spawnSync("git", ["init"], { cwd: consumerRoot, encoding: "utf8", windowsHide: true }).status, 0);
  const manifestPath = path.join(consumerRoot, "package.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.name = "consumer-product";
  manifest.scripts.build = "vite build";
  manifest.scripts.check = "eslint . && vitest run";
  manifest.scripts.test = "vitest run";
  manifest.agentsGovernance.productVerifyScript = "check";
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  fs.mkdirSync(path.join(consumerRoot, "src"), { recursive: true });
  fs.writeFileSync(path.join(consumerRoot, "src", "product.js"), "export const product = true;\n");

  const verified = childProcess.spawnSync(process.execPath, [path.join(consumerRoot, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js"), "agent:verify"], {
    cwd: consumerRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(verified.status, 0, verified.stderr || verified.stdout);
  assert.match(verified.stdout, /VERIFY_CONSUMER_OK/u);
  assert.match(verified.stdout, /declarado-nao-executado/u);
  assert.doesNotMatch(verified.stdout, /TYPECHECK_OK|VERIFY_OK/u);

  fs.rmSync(path.join(consumerRoot, ".ia.rules", "core", "authority.md"));
  const invalid = childProcess.spawnSync(process.execPath, [path.join(consumerRoot, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js"), "agent:verify"], {
    cwd: consumerRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  assert.notEqual(invalid.status, 0);
  assert.match(`${invalid.stdout}\n${invalid.stderr}`, /ARQUIVO_INSTALADO_AUSENTE|GOVERNANCA_INSTALADA/u);
} finally {
  fs.rmSync(consumerRoot, { force: true, recursive: true });
}
