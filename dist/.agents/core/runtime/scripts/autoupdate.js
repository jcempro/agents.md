const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const BACKEND_PATH = path.join(__dirname, "update-agents.js");

async function main(argv = process.argv.slice(2), options = {}) {
  const rootDir = options.rootDir || ROOT_DIR;
  const policy = readSuccessorPolicy(rootDir);
  global.SOURCE_OWNER = policy.upstreamRepository.split("/")[0];
  global.SOURCE_REPO = policy.upstreamRepository.split("/")[1];
  return withVirtualUpstream(policy, rootDir, async () => require(BACKEND_PATH).main(argv, options));
}

function readSuccessorPolicy(rootDir) {
  const packagePath = path.join(rootDir, "package.json");
  const managedPath = path.join(rootDir, ".agents", "core", "update", "upstream.json");
  const managed = fs.existsSync(managedPath) ? JSON.parse(fs.readFileSync(managedPath, "utf8")) : {};
  const declared = fs.existsSync(packagePath) ? JSON.parse(fs.readFileSync(packagePath, "utf8")).agentsUpstream || {} : {};
  const policy = managed.schema === 1 ? managed : declared;
  if (policy.schema !== 1 || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(String(policy.upstreamRepository || ""))) {
    throw new Error("UPSTREAM_AGENTS_NAO_RESOLVIDO: metadado de sucessor ausente ou invalido.");
  }
  return policy;
}

async function withVirtualUpstream(policy, rootDir, operation) {
  const localPath = path.join(rootDir, ".agents", "upstream.json");
  if (fs.existsSync(localPath)) return operation();
  const originalExists = fs.existsSync;
  const originalRead = fs.readFileSync;
  const virtual = JSON.stringify({ schema: 1, upstreamRepository: policy.upstreamRepository });
  fs.existsSync = function patchedExists(target) { return path.resolve(String(target)) === path.resolve(localPath) || originalExists.call(fs, target); };
  fs.readFileSync = function patchedRead(target, ...args) {
    if (path.resolve(String(target)) === path.resolve(localPath)) return virtual;
    return originalRead.call(fs, target, ...args);
  };
  try {
    return await operation();
  } finally {
    fs.existsSync = originalExists;
    fs.readFileSync = originalRead;
  }
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = error.exitCode || 1; });

module.exports = { main, readSuccessorPolicy, withVirtualUpstream };
