import test from "node:test";
import assert from "node:assert/strict";
import { parseHomeDependencies } from "../../src/research/home-dependencies-parser.mjs";

const base = "http://localhost:12345/scfs/root.html";

function kinds(result) {
  return result.graph.nodes.map((node) => node.kind);
}

test("HTML parser ignores comments and templates, decodes entities, deduplicates, and preserves order and mode", () => {
  const result = parseHomeDependencies({
    source:
      '<!doctype html><!-- <script src="/scfs/comment.js"></script> --><template><script src="/scfs/template.js"></script></template><script type="module" src="/scfs/b&#46;js"></script><script src="/scfs/a.js"></script><script src="/scfs/a.js"></script>',
    mime: "html",
    base,
  });
  assert.equal(result.parse, "parsed");
  assert.equal(result.reason, "ready");
  assert.deepEqual(
    result.scriptCandidates.map(({ href, mode }) => [href, mode]),
    [
      ["http://localhost:12345/scfs/b.js", "module"],
      ["http://localhost:12345/scfs/a.js", "classic"],
    ],
  );
  assert.deepEqual(
    [
      result.shape.scripts,
      result.shape.srcScripts,
      result.shape.uniqueDirectScripts,
    ],
    [3, 3, 2],
  );
});

test("invalid bases, frames, navigation, and mixed duplicate modes block a ready candidate set", () => {
  const scripts =
    '<!doctype html><script src="/scfs/a.js"></script><script src="/scfs/b.js"></script>';
  for (const [source, reason] of [
    [
      '<!doctype html><base href="https://example.org/">' + scripts.slice(15),
      "policyDenied",
    ],
    ["<!doctype html><iframe></iframe>" + scripts.slice(15), "ambiguous"],
    [
      '<!doctype html><script>location.replace("/next")</script>' +
        scripts.slice(15),
      "ambiguous",
    ],
    [
      '<!doctype html><script src="/scfs/a.js"></script><script type="module" src="/scfs/a.js"></script><script src="/scfs/b.js"></script>',
      "ambiguous",
    ],
  ]) {
    const result = parseHomeDependencies({ source, mime: "html", base });
    assert.equal(result.reason, reason);
    if (reason === "ambiguous") assert.equal(result.scriptCandidates.length, 2);
  }
});

test("network, response, storage, and SDK decoys remain scoped and conservative", () => {
  const result = parseHomeDependencies({
    source: [
      'const text = "fetch(\\"/decoy\\") localStorage.setItem(\\"x\\",\\"y\\")";',
      "function shadow(fetch, localStorage, VIZIO_MODULES) {",
      " fetch('/shadow'); localStorage.setItem('x','y');",
      " VIZIO_MODULES.System.getTvStoreProperty('x');",
      "}",
      "async function read() { const response = await fetch('/read'); response.json(); }",
      "fetch('/post', {method:'POST'});",
    ].join("\n"),
    mime: "javascript",
    base,
  });
  assert.equal(result.parse, "parsed");
  assert.equal(
    kinds(result).filter((kind) => kind === "networkRead").length,
    1,
  );
  assert.equal(
    kinds(result).filter((kind) => kind === "responseConsume").length,
    1,
  );
  assert.equal(
    kinds(result).filter((kind) => kind === "storageWrite").length,
    0,
  );
  assert.equal(result.methods.length, 0);
  assert.ok(result.unsupportedCount > 0);
  assert.ok(
    result.graph.edges.some((edge) => edge.relationship === "responseConsumer"),
  );
});

test("reassignment invalidates response, callback, and DOM bindings", () => {
  const result = parseHomeDependencies({
    source: [
      "async function changed() { let response = await fetch('/read');",
      " response = {json(){}}; response.json(); }",
      "function save() { localStorage.setItem('x','y'); }",
      "save = function() {}; document.addEventListener('click', save);",
      "function render() { const node = document.createElement('div');",
      " node = {}; document.body.appendChild(node); }",
    ].join("\n"),
    mime: "javascript",
    base,
  });
  assert.equal(result.parse, "parsed");
  assert.equal(
    kinds(result).filter((kind) => kind === "responseConsume").length,
    0,
  );
  assert.equal(
    kinds(result).filter((kind) => kind === "storageWrite").length,
    1,
  );
  assert.equal(
    result.graph.edges.filter(
      (edge) => edge.relationship === "registersCallback",
    ).length,
    0,
  );
  assert.equal(
    result.graph.edges.filter((edge) => edge.relationship === "inserts").length,
    0,
  );
});

test("direct event registration and response-to-render syntax are represented without claiming wider dataflow", () => {
  const result = parseHomeDependencies({
    source: [
      "function save() { localStorage.setItem('x','y'); }",
      "document.addEventListener('click', save);",
      "async function render() {",
      " const response = await fetch('/read'); response.json();",
      " document.body.appendChild(document.createElement('div'));",
      "}",
    ].join("\n"),
    mime: "javascript",
    base,
  });
  assert.equal(result.parse, "parsed");
  const nodeById = new Map(result.graph.nodes.map((node) => [node.id, node]));
  assert.ok(
    result.graph.edges.some(
      (edge) =>
        edge.relationship === "registersCallback" &&
        nodeById.get(edge.from)?.kind === "eventRegistration" &&
        nodeById.get(edge.to)?.kind === "function",
    ),
  );
  assert.ok(
    result.graph.edges.some(
      (edge) =>
        edge.relationship === "responseConsumer" &&
        nodeById.get(edge.from)?.kind === "networkRead" &&
        nodeById.get(edge.to)?.kind === "responseConsume",
    ),
  );
  assert.ok(
    result.graph.edges.some(
      (edge) =>
        edge.relationship === "inserts" &&
        nodeById.get(edge.from)?.kind === "domCreate" &&
        nodeById.get(edge.to)?.kind === "domInsert",
    ),
  );
  assert.equal(
    result.graph.edges.some(
      (edge) =>
        edge.relationship === "responseConsumer" &&
        nodeById.get(edge.from)?.resource !== nodeById.get(edge.to)?.resource,
    ),
    false,
  );
});

test("Promise-like fetch results are not treated as responses, while awaited and direct then consumers are", () => {
  const promiseOnly = parseHomeDependencies({
    source: "const response = fetch('/read'); response.json();",
    mime: "javascript",
    base,
  });
  assert.equal(kinds(promiseOnly).includes("responseConsume"), false);

  const awaitedModule = parseHomeDependencies({
    source: "const response = await fetch('/read'); response.json();",
    mime: "javascript",
    base,
    module: true,
  });
  assert.equal(awaitedModule.graph.nodes[0]?.kind, "networkRead");
  assert.ok(
    awaitedModule.graph.edges.some(
      (edge) =>
        edge.from === 0 &&
        edge.relationship === "responseConsumer" &&
        awaitedModule.graph.nodes.find((node) => node.id === edge.to)?.kind ===
          "responseConsume",
    ),
  );

  const thenConsumer = parseHomeDependencies({
    source: "fetch('/read').then((response) => response.text());",
    mime: "javascript",
    base,
  });
  assert.ok(kinds(thenConsumer).includes("responseConsume"));
});

test("navigation is retained and computed navigation is unknown", () => {
  const direct = parseHomeDependencies({
    source: 'location.replace("/next")',
    mime: "javascript",
    base,
  });
  assert.equal(direct.shape.navigation, 1);
  assert.equal(direct.shape.navigationState, "present");
  const computed = parseHomeDependencies({
    source: 'window.location["assign"]("/next")',
    mime: "javascript",
    base,
  });
  assert.equal(computed.shape.navigationState, "unknown");
});

test("source, AST, and graph caps distinguish truncation from saturation", () => {
  const sourceLimit = parseHomeDependencies({
    source: "x".repeat(524289),
    mime: "javascript",
    base,
  });
  assert.equal(sourceLimit.sourceTruncated, true);
  assert.equal(sourceLimit.parseIncomplete, false);
  assert.equal(sourceLimit.saturated, false);

  const astLimit = parseHomeDependencies({
    source: "[" + "0,".repeat(8300) + "0]",
    mime: "javascript",
    base,
  });
  assert.equal(astLimit.parseIncomplete, true);
  assert.equal(astLimit.truncated, true);
  assert.equal(astLimit.saturated, false);
  assert.equal(astLimit.failureReason, "astNodeLimit");

  const depthLimit = parseHomeDependencies({
    source: "[".repeat(70) + "0" + "]".repeat(70),
    mime: "javascript",
    base,
  });
  assert.equal(depthLimit.parse, "limit");
  assert.equal(depthLimit.failureReason, "astDepthLimit");

  const graphLimit = parseHomeDependencies({
    source: Array.from({ length: 50 }, () => "unknownCall();").join("\n"),
    mime: "javascript",
    base,
  });
  assert.equal(graphLimit.graph.nodes.length, 32);
  assert.equal(graphLimit.saturated, true);
  assert.equal(graphLimit.truncated, true);
});

test("malformed JavaScript reports a fixed syntax reason without retaining source", () => {
  const source = "const PRIVATE_SOURCE_SENTINEL = ;";
  const result = parseHomeDependencies({ source, mime: "javascript", base });
  assert.equal(result.parse, "failed");
  assert.equal(result.shape.jsParse, "failed");
  assert.equal(result.failureReason, "syntaxError");
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SOURCE_SENTINEL/);
});

test("script and inline retention caps keep shape counts consistent and explicit", () => {
  const html =
    "<!doctype html>" +
    Array.from({ length: 10 }, () => "<script>small()</script>").join("") +
    '<script src="/scfs/one.js"></script><script src="/scfs/two.js"></script>';
  const inlineLimit = parseHomeDependencies({
    source: html,
    mime: "html",
    base,
  });
  assert.equal(inlineLimit.shape.scripts, 12);
  assert.equal(inlineLimit.shape.inlineScripts, 10);
  assert.equal(
    inlineLimit.shape.inlineScripts +
      inlineLimit.shape.dataScripts +
      inlineLimit.shape.srcScripts,
    inlineLimit.shape.scripts,
  );
  assert.equal(inlineLimit.parse, "limit");
  assert.equal(inlineLimit.saturated, true);

  const tooMuchInline = parseHomeDependencies({
    source:
      "<!doctype html><script>" +
      "/*" +
      "x".repeat(65537) +
      "*/</script><script src='/scfs/one.js'></script><script src='/scfs/two.js'></script>",
    mime: "html",
    base,
  });
  assert.equal(tooMuchInline.parse, "limit");
  assert.equal(tooMuchInline.saturated, true);
  assert.equal(tooMuchInline.shape.scripts, 3);
  assert.equal(tooMuchInline.shape.inlineScripts, 1);
});
