const assert = require("assert");
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "agents-clean-consumer-"));

try {
  fs.cpSync(dist, temporary, { recursive: true });
  const repositoryPath = path.join(temporary, ".ia.rules", "config", "repository.json");
  const auxiliaryPath = path.join(temporary, ".ia.rules", "agents.inc.md");
  assert.ok(fs.existsSync(repositoryPath));
  assert.ok(fs.existsSync(auxiliaryPath));

  const configurationModule = path.join(temporary, ".ia.rules", "core", "runtime", "scripts", "configuration.js");
  const { loadConfiguration } = require(configurationModule);
  const configuration = loadConfiguration(temporary);
  assert.equal(configuration.metadata.repository, "https://github.com/jcempro/agents.md");
  assert.equal(configuration.metadata.licenseId, "MPL-2.0");

  const status = childProcess.spawnSync(process.execPath, [
    path.join(temporary, ".ia.rules", "core", "runtime", "scripts", "repo-tools.js"),
    "agent:status",
  ], { cwd: temporary, encoding: "utf8", env: { ...process.env, NODE_PATH: "" }, windowsHide: true });
  assert.equal(status.status, 0, status.stderr || status.stdout);

  const release = JSON.parse(fs.readFileSync(path.join(temporary, "release.json"), "utf8"));
  for (const requiredPath of [".ia.rules/config/repository.json", ".ia.rules/agents.inc.md"]) {
    const published = release.files.find((entry) => entry.path === requiredPath);
    assert.equal(published.profile, "consumer-core");
    const managed = release.update.files.find((entry) => entry.path === requiredPath);
    assert.ok(managed && /^[a-f0-9]{64}$/u.test(managed.sha256), `Entrada gerenciada ausente: ${requiredPath}`);
  }

  for (const filePath of listFiles(path.join(temporary, ".ia.rules")).filter((item) => item.endsWith(".js"))) {
    const header = fs.readFileSync(filePath, "utf8").split(/\r?\n/u).slice(0, 10).join("\n");
    for (const value of [configuration.metadata.author, configuration.metadata.contact, configuration.metadata.repository, configuration.metadata.license, configuration.metadata.licenseUrl, configuration.metadata.licenseNotice]) {
      assert.ok(header.includes(value), `Cabeçalho inválido: ${filePath}`);
    }
  }

  fs.unlinkSync(repositoryPath);
  assert.throws(() => loadConfiguration(temporary), /CONFIGURACAO_AUSENTE:repository\.json/u);
} finally {
  fs.rmSync(temporary, { force: true, recursive: true });
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(target) : [target];
  });
}

console.log("clean-consumer.test.js: OK");
