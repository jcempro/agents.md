const assert = require("assert");
const { buildFront, correlatedFronts, normalizeFt, normalizeVersion } = require("../.agents/core/runtime/scripts/issue-lifecycle");

function main() {
  const block = buildFront({ ft: "FT-030", issue: { number: 81, title: "Corrigir | fluxo\nexterno" }, issueId: "github:owner/repository#81", repository: "owner/repository" });
  const fronts = correlatedFronts(`${block}\n`);
  assert.equal(fronts.length, 1);
  assert.deepEqual({ ft: fronts[0].ft, issue: fronts[0].issue, issueId: fronts[0].issueId, issueState: fronts[0].issueState, release: fronts[0].release, repository: fronts[0].repository, status: fronts[0].status }, {
    ft: "FT-030", issue: 81, issueId: "github:owner/repository#81", issueState: "aprovada", release: "pendente", repository: "owner/repository", status: "em_andamento",
  });
  assert.equal(normalizeFt("ft-030"), "FT-030");
  assert.equal(normalizeVersion("0.0.9"), "0.0.9");
  assert.throws(() => normalizeVersion("v0.0.9"), /PARAMETRO_INVALIDO:version/u);
}

main();
