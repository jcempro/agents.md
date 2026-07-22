// Autor: JeanCarloEM.com
// Site do Autor: https://jeancarloem.com
// Repositorio: https://github.com/jcempro/agents.md
// Licenca: Mozilla Public License 2.0
// Site da Licenca: https://www.mozilla.org/MPL/2.0/
// Resumo da Licenca: uso, copia, modificacao e distribuicao permitidos conforme os termos da MPL-2.0.
// Disclaimer: fornecido AS IS, sem garantias de qualquer tipo.

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const CANONICAL_TODO = path.join(".ia.rules", "state", "TODO.ia.md");

function inspectTodoIa(rootDir, options = {}) {
  const files = locateTodoFiles(rootDir, options);
  const records = files.map((relativePath) => {
    const absolute = path.join(rootDir, relativePath);
    const content = fs.readFileSync(absolute, "utf8");
    return { hash: sha256(content), items: parseTodoItems(content), path: toPosix(relativePath) };
  });
  return {
    code: records.length ? "TODO_IA_FOUND" : "TODO_IA_EMPTY",
    records,
    status: records.some((record) => record.path !== toPosix(CANONICAL_TODO)) ? "triagem_requerida" : "ok",
  };
}

function assertTodoIaTriaged(rootDir, options = {}) {
  const result = inspectTodoIa(rootDir, options);
  const pending = result.records.filter((record) => record.path !== toPosix(CANONICAL_TODO) || record.items.some((item) => item.status === "pendente"));
  if (pending.length) throw new Error(`TODO_IA_TRIAGEM_PENDENTE:${pending.map((record) => record.path).join(",")}`);
  return result;
}

function locateTodoFiles(rootDir, options = {}) {
  const candidates = [options.path || CANONICAL_TODO, "TODO.ia.md"].map((value) => path.normalize(String(value)));
  return [...new Set(candidates)]
    .filter((relativePath) => !path.isAbsolute(relativePath) && fs.existsSync(path.join(rootDir, relativePath)))
    .sort((a, b) => toPosix(a).localeCompare(toPosix(b), "en"));
}

function parseTodoItems(content) {
  return String(content).split(/\r?\n/u).map((line, index) => ({ line, number: index + 1 }))
    .filter((entry) => /^\s*[-*]\s+(?:\[[ xX-]\]\s+)?\S/u.test(entry.line))
    .map((entry) => ({
      line: entry.number,
      status: /\[[xX]\]/u.test(entry.line) ? "concluido" : "pendente",
      text: entry.line.replace(/^\s*[-*]\s+(?:\[[ xX-]\]\s+)?/u, "").trim(),
    }));
}

function sha256(content) {
  return crypto.createHash("sha256").update(String(content).replace(/\r\n/gu, "\n"), "utf8").digest("hex");
}

function toPosix(value) {
  return String(value).replace(/\\/gu, "/");
}

module.exports = { CANONICAL_TODO, assertTodoIaTriaged, inspectTodoIa, locateTodoFiles, parseTodoItems };
