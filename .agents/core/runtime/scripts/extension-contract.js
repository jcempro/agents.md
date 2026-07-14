const REQUIRED_CAPABILITY_FIELDS = ["id", "kind", "version", "requires", "provides", "events", "validate", "execute"];

class ContractError extends Error {}

function validateCapability(capability) {
  if (!capability || typeof capability !== "object") throw new ContractError("CAPACIDADE_INVALIDA");
  for (const field of REQUIRED_CAPABILITY_FIELDS) {
    if (!(field in capability)) throw new ContractError(`CAMPO_CONTRATO_AUSENTE:${field}`);
  }
  for (const field of ["id", "kind", "version"]) {
    if (typeof capability[field] !== "string" || !capability[field]) throw new ContractError(`CAMPO_CONTRATO_INVALIDO:${field}`);
  }
  for (const field of ["requires", "provides", "events"]) {
    if (!Array.isArray(capability[field]) || capability[field].some((value) => typeof value !== "string" || !value)) {
      throw new ContractError(`CAMPO_CONTRATO_INVALIDO:${field}`);
    }
  }
  if (typeof capability.validate !== "function" || typeof capability.execute !== "function") {
    throw new ContractError("METODO_CONTRATO_INVALIDO");
  }
  if ("dispose" in capability && typeof capability.dispose !== "function") throw new ContractError("METODO_CONTRATO_INVALIDO:dispose");
  return freezeClone(capability);
}

function createHookContext(event, payload = {}) {
  if (typeof event !== "string" || !event) throw new ContractError("EVENTO_CONTRATO_INVALIDO");
  return freezeClone({ event, payload });
}

function runHookChain(event, payload, layers) {
  const context = createHookContext(event, payload);
  const observations = [];
  const failures = [];
  for (const layer of layers) {
    if (!layer || typeof layer.id !== "string" || !layer.id || typeof layer.handler !== "function") {
      throw new ContractError("CAMADA_HOOK_INVALIDA");
    }
    try {
      const result = layer.handler(context);
      if (result && typeof result.then === "function") throw new ContractError(`HOOK_ASSINCRONO_NAO_SUPORTADO:${layer.id}`);
      observations.push({ id: layer.id, result: result || null });
    } catch (error) {
      failures.push({ id: layer.id, message: error.message });
    }
  }
  if (failures.length) {
    const error = new ContractError(`FALHA_CADEIA_HOOK:${failures.map((failure) => `${failure.id}:${failure.message}`).join(";")}`);
    error.observations = observations;
    throw error;
  }
  return freezeClone({ context, observations });
}

function freezeClone(value) {
  const clone = JSON.parse(JSON.stringify(value));
  return deepFreeze(clone);
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return value;
}

module.exports = { ContractError, createHookContext, runHookChain, validateCapability };
