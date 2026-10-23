import { createRequire } from "node:module";
import { test } from "node:test";
import assert from "node:assert/strict";
import * as marker from "../research/dashcast-marker.mjs";

const require = createRequire(import.meta.url);
const { parse } = require("parse5");
const visibleMarker = "MIST DASHCAST CONTROL";

function elements(node) {
  return [
    ...(node.tagName ? [node] : []),
    ...(node.childNodes ?? []).flatMap(elements),
  ];
}

function textContent(node) {
  if (node.nodeName === "#text") return node.value;
  return (node.childNodes ?? []).map(textContent).join("");
}

test("marker document is fixed, visible, and inert", () => {
  const html = marker.DASHCAST_MARKER_HTML;
  const document = parse(html);
  const nodes = elements(document);
  const headings = nodes.filter((node) => node.tagName === "h1");
  const styles = nodes
    .filter((node) => node.tagName === "style")
    .map(textContent)
    .join("\n");

  assert.equal(headings.length, 1);
  assert.equal(textContent(headings[0]).trim(), visibleMarker);
  assert.ok(html.length > visibleMarker.length);
  assert.match(styles, /background:\s*#000\b/i);
  assert.match(styles, /color:\s*#fff\b/i);
  assert.match(styles, /font-size:\s*clamp\(/i);

  const forbiddenElements = new Set([
    "script",
    "iframe",
    "frame",
    "object",
    "embed",
    "form",
    "img",
    "video",
    "audio",
    "source",
    "track",
    "link",
  ]);
  assert.deepEqual(
    nodes
      .filter((node) => forbiddenElements.has(node.tagName))
      .map((node) => node.tagName),
    [],
  );
  for (const node of nodes) {
    for (const attribute of node.attrs ?? []) {
      assert.doesNotMatch(attribute.name, /^on/i);
      assert.ok(
        ![
          "href",
          "src",
          "srcset",
          "action",
          "formaction",
          "poster",
          "data",
          "xlink:href",
        ].includes(attribute.name),
        `unexpected URL-bearing attribute: ${attribute.name}`,
      );
    }
  }
  assert.doesNotMatch(html, /(?:https?|ftp|file|data|javascript):/i);
  assert.doesNotMatch(styles, /url\s*\(|@import|expression\s*\(/i);
  assert.doesNotMatch(html, /\{\{|\}\}|<%|%>|\$\{/);
});

test("CSP blocks active and outbound behavior while leaving this fixture embeddable", () => {
  const directives = new Map(
    marker.DASHCAST_MARKER_CSP.split(";").map((item) => {
      const [name, ...values] = item.trim().split(/\s+/);
      return [name, values.join(" ")];
    }),
  );

  assert.deepEqual([...directives.keys()].sort(), [
    "base-uri",
    "connect-src",
    "default-src",
    "form-action",
    "script-src",
    "style-src",
  ]);
  assert.equal(directives.get("default-src"), "'none'");
  assert.equal(directives.get("style-src"), "'unsafe-inline'");
  assert.equal(directives.get("connect-src"), "'none'");
  assert.equal(directives.get("base-uri"), "'none'");
  assert.equal(directives.get("form-action"), "'none'");
  assert.equal(directives.get("script-src"), "'none'");
  assert.equal(directives.has("frame-ancestors"), false);
  assert.equal(
    marker.DASHCAST_MARKER_HEADERS["content-security-policy"],
    marker.DASHCAST_MARKER_CSP,
  );
  assert.equal(
    marker.DASHCAST_MARKER_HEADERS["content-type"],
    "text/html; charset=utf-8",
  );
  assert.equal(
    Object.keys(marker.DASHCAST_MARKER_HEADERS).some(
      (name) => name.toLowerCase() === "x-frame-options",
    ),
    false,
  );
  assert.equal(Object.isFrozen(marker.DASHCAST_MARKER_HEADERS), true);
});

test("module exposes constants only, with no input-based page builder", () => {
  assert.deepEqual(Object.keys(marker).sort(), [
    "DASHCAST_MARKER_CSP",
    "DASHCAST_MARKER_HEADERS",
    "DASHCAST_MARKER_HTML",
  ]);
  assert.equal(typeof marker.DASHCAST_MARKER_CSP, "string");
  assert.equal(typeof marker.DASHCAST_MARKER_HTML, "string");
});
