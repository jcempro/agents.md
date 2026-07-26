// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const REQUIRED_CAPABILITY_FIELDS = ["id", "kind", "version", "requires", "provides", "events", "validate", "execute"];

/** Representa violação reutilizável do contrato de extensão e preserva classificação explícita da falha. */
class ContractError extends Error {}

/** Executa validateCapability no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa createHookContext no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function createHookContext(event, payload = {}) {
  if (typeof event !== "string" || !event) throw new ContractError("EVENTO_CONTRATO_INVALIDO");
  return freezeClone({ event, payload });
}

/** Executa runHookChain no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
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

/** Executa freezeClone no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function freezeClone(value) {
  const clone = JSON.parse(JSON.stringify(value));
  return deepFreeze(clone);
}

/** Executa deepFreeze no fluxo deste módulo; centraliza contrato reutilizável e preserva validações do chamador. */
function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const item of Object.values(value)) deepFreeze(item);
  }
  return value;
}

module.exports = { ContractError, createHookContext, runHookChain, validateCapability };
