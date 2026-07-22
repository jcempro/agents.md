const assert = require("assert");
const { applyTextTemplate, mergeJsonTemplate } = require("../src/.ia.rules/core/runtime/scripts/template-merge");

function main() {
  const first = applyTextTemplate("local\n", "managed", { id: "bloco", version: 1 });
  assert.equal(first.changed, true);
  assert.match(first.content.toString("utf8"), /ia-rules-template:bloco:v1:begin/u);
  const second = applyTextTemplate(first.content.toString("utf8"), "novo", { id: "bloco", version: 1 });
  assert.match(second.content.toString("utf8"), /novo/u);
  assert.doesNotMatch(second.content.toString("utf8"), /managed/u);

  const json = mergeJsonTemplate("{\"local\":true,\"nested\":{\"keep\":1}}\n", "{\"nested\":{\"managed\":2}}\n", { id: "json", type: "json" });
  assert.deepEqual(JSON.parse(json.content.toString("utf8")), { local: true, nested: { keep: 1, managed: 2 } });
}

main();
