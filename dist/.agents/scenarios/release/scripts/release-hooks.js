// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido "AS IS", sem garantias de qualquer tipo.

const fs = require("fs");
const path = require("path");
const { runHookChain } = require("../../../core/runtime/scripts/extension-contract");

const ROOT_DIR = path.resolve(__dirname, "..", "..", "..", "..");
const HOOK_PATH = path.join(ROOT_DIR, ".agents", "hooks", "release.js");
const CORE_HOOK_PATH = path.join(ROOT_DIR, ".agents", "hooks", "core.js");
const EVENTS = new Set(["prepare", "verify", "published"]);

class UsageError extends Error {}

function runReleaseHook(event, payload = {}) {
  if (!EVENTS.has(event)) {
    throw new UsageError(`EVENTO_HOOK_INVALIDO:${event || "(vazio)"}`);
  }
  const layers = [optionalHook("core", CORE_HOOK_PATH, event), optionalHook("release", HOOK_PATH, event)].filter(Boolean);
  if (!layers.length) return { event, executed: false };
  const result = runHookChain(event, payload, layers);
  return { event, executed: true, result: result.observations };
}

function optionalHook(id, hookPath, event) {
  if (!fs.existsSync(hookPath)) return null;
  const hook = require(hookPath);
  const handler = typeof hook === "function" ? hook : hook && hook[event];
  return typeof handler === "function" ? { id, handler } : null;
}

if (require.main === module) {
  const [event, version = "", asset = ""] = process.argv.slice(2);
  try {
    if (event === "--help") {
      process.stdout.write("Uso: release-hooks <prepare|verify|published> [versao] [asset]\n");
      return;
    }
    const result = runReleaseHook(event, { asset, version });
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = error instanceof UsageError ? 2 : 1;
  }
}

module.exports = { CORE_HOOK_PATH, EVENTS, HOOK_PATH, runReleaseHook };
