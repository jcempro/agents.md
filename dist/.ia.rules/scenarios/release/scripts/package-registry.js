// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const PHASES = ["prepare-package", "verify-package", "publish-package", "confirm-package"];

function runPackageRegistryLifecycle(event, payload = {}, options = {}) {
  const config = resolvePackageRegistryConfig(payload, options);
  if (!config.enabled) return { code: "PACKAGE_REGISTRY_SKIPPED", enabled: false, reason: config.reason || "capacidade_nao_declarada" };
  const phases = event === "release" ? PHASES : [normalizePhase(event)];
  const effects = [];
  for (const phase of phases) {
    effects.push(runPackageRegistryPhase(phase, config, payload, options));
  }
  return { code: options.dryRun ? "PACKAGE_REGISTRY_DRY_RUN" : "PACKAGE_REGISTRY_OK", enabled: true, effects };
}

function runPackageRegistryPhase(phase, config, payload = {}, options = {}) {
  const normalized = normalizePhase(phase);
  if (options.dryRun) return { phase: normalized, status: "planned" };
  const adapter = resolveAdapter(config, options);
  const method = phaseMethod(normalized);
  if (typeof adapter[method] !== "function") throw new Error(`PACKAGE_REGISTRY_ADAPTER_METHOD_REQUIRED:${method}`);
  const result = adapter[method]({ config, payload });
  if (result && typeof result.then === "function") throw new Error(`PACKAGE_REGISTRY_ASYNC_ADAPTER_UNSUPPORTED:${method}`);
  if (result && result.ok === false) throw new Error(`PACKAGE_REGISTRY_PHASE_FAILED:${normalized}`);
  return { phase: normalized, status: "done", result: sanitizeResult(result) };
}

function resolvePackageRegistryConfig(payload = {}, options = {}) {
  const declared = options.config || payload.packageRegistry || {};
  if (!declared || declared.enabled !== true) return { enabled: false, reason: "opt_in_ausente" };
  const registry = String(declared.registry || "").trim();
  const packageName = String(declared.packageName || declared.name || "").trim();
  if (!registry || !packageName) throw new Error("PACKAGE_REGISTRY_CONFIG_INVALID");
  return { ...declared, packageName, registry };
}

function resolveAdapter(config, options = {}) {
  if (options.adapter) return options.adapter;
  if (options.adapters && options.adapters[config.registry]) return options.adapters[config.registry];
  throw new Error(`PACKAGE_REGISTRY_ADAPTER_REQUIRED:${config.registry}`);
}

function normalizePhase(value) {
  const phase = String(value || "").trim();
  if (!PHASES.includes(phase)) throw new Error(`PACKAGE_REGISTRY_PHASE_INVALID:${phase || "(vazio)"}`);
  return phase;
}

function phaseMethod(phase) {
  return {
    "confirm-package": "confirmPackage",
    "prepare-package": "preparePackage",
    "publish-package": "publishPackage",
    "verify-package": "verifyPackage",
  }[phase];
}

function sanitizeResult(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => !/token|secret|password|authorization/iu.test(key)));
}

module.exports = { PHASES, resolvePackageRegistryConfig, runPackageRegistryLifecycle, runPackageRegistryPhase };
