const assert = require("assert");
const { parseTodoItems } = require("../src/.ia.rules/core/runtime/scripts/todo-intake");
const { evaluateCodeAuthorization } = require("../src/.ia.rules/core/runtime/scripts/request-code-gate");
const { releaseCompletionTargets } = require("../src/.ia.rules/core/runtime/scripts/issue-lifecycle");

function main() {
  assert.deepEqual(parseTodoItems("- [ ] Fazer\n- [x] Feito\ntexto solto").map((item) => item.status), ["pendente", "concluido"]);

  const memory = [
    "FT-010|nome=Norma|tipo=implementacao_normativa|status=concluido",
    "FT-011|nome=Codigo|tipo=implementacao_codigo|status=pendente",
    "dependencias=FT-010",
    "autorizacao_codigo=humana",
  ].join("\n");
  assert.equal(evaluateCodeAuthorization(memory, "FT-011").status, "authorized");

  const issueMemory = [
    "FT-020|nome=Norma|tipo=implementacao_normativa|status=concluido",
    "issue_id=github:o/r#1",
    "issue_repo=o/r",
    "issue_number=1",
    "issue_state=em_desenvolvimento",
    "release=0.1.0",
    "1/1 Entrega [concluído]",
    "",
    "FT-021|nome=Codigo|tipo=implementacao_codigo|status=concluido",
    "issue_id=github:o/r#1",
    "issue_repo=o/r",
    "issue_number=1",
    "issue_state=em_desenvolvimento",
    "release=0.1.0",
    "1/1 Entrega [concluído]",
  ].join("\n");
  assert.equal(releaseCompletionTargets(issueMemory, "0.1.0").length, 2);
  assert.equal(releaseCompletionTargets(issueMemory.replace("1/1 Entrega [concluído]", "1/1 Entrega [pendente]"), "0.1.0").length, 0);
}

main();
