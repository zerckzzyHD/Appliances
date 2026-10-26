import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHomeDocument } from "../../src/research/home-document-parser.mjs";
import { permittedDocumentURL } from "../../src/research/home-document-policy.mjs";
const base = "http://localhost:12345/scfs/home.html";
const parse = (source) => parseHomeDocument({ source, mime: "html", base });

test("structural parser finds unquoted src but ignores comments, template, data and string decoys", () => {
  const result =
    parse(`<!-- <script src='/scfs/comment.js'></script> --><template><script src=/scfs/inert.js></script></template>
  <script type=application/json>{"private":"SENTINEL"}</script><SCRIPT defer SRC = /scfs/a.js></SCRIPT>
  <script>const text='<script src="/scfs/string.js">'; globalThis.PWNED=true</script>`);
  assert.equal(result.parse, "parsed");
  assert.equal(result.shape.scripts, 3);
  assert.equal(result.shape.dataScripts, 1);
  assert.equal(result.shape.srcScripts, 1);
  assert.equal(result.shape.unquotedSrcScripts, 1);
  assert.equal(result.candidate.href, "http://localhost:12345/scfs/a.js");
  assert.equal(globalThis.PWNED, undefined);
});
test("HTML entities, first effective base and deduplicated script candidates resolve structurally", () => {
  const result = parse(
    '<base href="/scfs/a/"><base href="https://outside.invalid/"><script src="b&#46;js"></script><script src=b.js></script>',
  );
  assert.equal(result.shape.bases, 2);
  assert.equal(result.candidate.href, "http://localhost:12345/scfs/a/b.js");
  assert.equal(
    parse('<base href="https://outside.invalid/"><script src=a.js></script>')
      .reason,
    "policyDenied",
  );
  assert.equal(
    parse('<script src="a.js"></script><script src="b.js"></script>').reason,
    "ambiguous",
  );
});
test("only direct literal navigation selects; nested, conditional, computed, frames and parse failures stop", () => {
  for (const code of [
    'location="/scfs/n.html"',
    'window.location.href="/scfs/n.html"',
    'document.location.assign("/scfs/n.html")',
  ]) {
    const result = parse("<script>" + code + "</script>");
    assert.equal(result.candidate?.kind, "literalNavigation");
    assert.equal(result.shape.navigationContext, "topLevelOnly");
  }
  for (const code of [
    'if(true)location="/scfs/n.html"',
    'function f(){location.replace("/scfs/n.html")}',
    '(()=>location.assign("/scfs/n.html"))()',
    'location="/scfs/"+x',
  ]) {
    const result = parse("<script>" + code + "</script>");
    assert.equal(result.candidate, null);
    assert.equal(result.reason, "ambiguous");
  }
  assert.equal(
    parse('<iframe src="/scfs/n.html"></iframe><script src=a.js></script>')
      .reason,
    "ambiguous",
  );
  const malformed = parse("<script>location.replace(</script>");
  assert.equal(malformed.parse, "partial");
  assert.equal(malformed.shape.navigation, "unknown");
  assert.equal(
    parse('<meta http-equiv=refresh content="0;URL=/scfs/n.html">').candidate
      .kind,
    "literalNavigation",
  );
  assert.equal(
    parse('<meta http-equiv=refresh content="bad">').reason,
    "ambiguous",
  );
});
test("external, rejected, self targets and resource limits never become a candidate", () => {
  assert.equal(
    parse('<script>location.replace("https://outside.invalid/n.html")</script>')
      .reason,
    "external",
  );
  assert.equal(
    parse('<script src="/scfs/account.js"></script>').reason,
    "policyDenied",
  );
  assert.equal(parse("<script src=home.html></script>").reason, "selfLoop");
  assert.equal(parse("<script src=a.js></script>".repeat(33)).parse, "limit");
  assert.equal(parse("<script>void 0</script>".repeat(9)).parse, "limit");
  assert.equal(parse("<div>".repeat(70)).parse, "limit");
  for (const href of [
    "http://localhost:12345/scfs/%252e%252e/private",
    "http://localhost:12345/scfs/%2fprivate",
    "http://localhost:12345/scfs/x?secret=x",
    "http://localhost:12345/scfs/%61ccount.js",
  ])
    assert.equal(permittedDocumentURL(href), null);
});
test("JavaScript is parsed as data and lexical methods expose only the fixed names", () => {
  const result = parseHomeDocument({
    source: 'globalThis.PWNED=true; VIZIO.getStoreProperty("PRIVATE_SENTINEL")',
    mime: "javascript",
    base,
  });
  assert.equal(result.parse, "parsed");
  assert.deepEqual(result.methods, [
    { scope: "VIZIO", name: "getStoreProperty", type: "function" },
  ]);
  assert.equal(globalThis.PWNED, undefined);
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
});
