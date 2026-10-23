import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectHomeDependencies,
  makeDependenciesParser,
  checkDependenciesParser,
  startHomeDependencies,
} from "../research/home-dependencies-browser.mjs";
import {
  emptyDependenciesReport,
  validateHomeDependencies,
} from "../research/home-dependencies-contract.mjs";
import { permittedDocumentURL } from "../research/home-document-policy.mjs";
import { parseHomeDependencies } from "../research/home-dependencies-parser.mjs";

const run = "0123456789abcdef0123456789abcdef";
const rootURL = "http://localhost:12345/scfs/root.html";
const negativeURL = "http://localhost:12345/scfs/mist-absent-" + run + ".html";
const childURLs = [
  "http://localhost:12345/scfs/one.js",
  "http://localhost:12345/scfs/two.js",
];

function response(source, mime, status = 200) {
  const bytes = new TextEncoder().encode(source);
  let offset = 0;
  const body = {
    getReader() {
      return {
        async read() {
          if (offset >= bytes.length) return { done: true };
          const value = bytes.subarray(offset);
          offset = bytes.length;
          return { done: false, value };
        },
        async cancel() {},
      };
    },
    async cancel() {},
  };
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => (name === "content-type" ? mime : null) },
    body,
  };
}

function makeRoot(fetchImpl) {
  return {
    URL,
    Date,
    AbortController,
    TextDecoder,
    Uint8Array,
    setTimeout,
    clearTimeout,
    addEventListener() {},
    removeEventListener() {},
    fetch: fetchImpl,
  };
}

function route() {
  return Object.defineProperty({}, "MESSAGE", {
    value: rootURL,
    enumerable: true,
  });
}

function shape(overrides = {}) {
  return {
    scripts: 0,
    inlineScripts: 0,
    dataScripts: 0,
    srcScripts: 0,
    uniqueDirectScripts: 0,
    frames: 0,
    navigation: 0,
    eventHandlers: 0,
    bases: 0,
    baseState: "none",
    navigationState: "none",
    jsParse: "notAttempted",
    ...overrides,
  };
}

function parserStub({
  candidates = childURLs,
  rootReason = "ready",
  graphFor,
} = {}) {
  return {
    async parse(source, mime, base, module) {
      if (mime === "html") {
        return {
          parse: "parsed",
          shape: shape({
            scripts: 2,
            srcScripts: 2,
            uniqueDirectScripts: candidates.length,
          }),
          scriptCandidates: candidates.map((href, index) => ({
            href,
            mode: index === 1 ? "module" : "classic",
          })),
          graph: graphFor?.("root") || { nodes: [], edges: [] },
          methods: [],
          unsupportedCount: 0,
          truncated: false,
          sourceTruncated: false,
          parseIncomplete: false,
          saturated: false,
          reason: rootReason,
        };
      }
      return {
        parse: "parsed",
        shape: shape({ jsParse: "parsed" }),
        scriptCandidates: [],
        graph: graphFor?.(base) || { nodes: [], edges: [] },
        methods: [],
        unsupportedCount: 0,
        truncated: false,
        sourceTruncated: false,
        parseIncomplete: false,
        saturated: false,
        reason: "noCandidate",
      };
    },
  };
}

function validate(report) {
  const checked = validateHomeDependencies(report);
  assert.ok(checked, JSON.stringify(report));
  return checked;
}

test("control fixtures run the real static parser and pass without source execution", async () => {
  const parser = {
    parse(source, mime, base, module = false) {
      return Promise.resolve(
        parseHomeDependencies({ source, mime, base, module }),
      );
    },
  };
  assert.equal(await checkDependenciesParser(parser), true);
  assert.equal(typeof makeDependenciesParser, "function");
});

test("real parser graphs pass the closed report contract with only proved syntax edges", async () => {
  const sources = new Map([
    [
      rootURL,
      response(
        '<!doctype html><script src="/scfs/one.js"></script><script type="module" src="/scfs/two.js"></script>',
        "text/html",
      ),
    ],
    [negativeURL, response("different", "text/html", 404)],
    [
      childURLs[0],
      response(
        "function save(){localStorage.setItem('x','y')} document.addEventListener('click',save); async function render(){const response=await fetch('/api');response.json();document.body.appendChild(document.createElement('div'))}",
        "application/javascript",
      ),
    ],
    [
      childURLs[1],
      response(
        "fetch('/api').then((response)=>response.text())",
        "application/javascript",
      ),
    ],
  ]);
  const root = makeRoot(async (url) => sources.get(url));
  const parser = {
    async parse(source, mime, base, module) {
      return parseHomeDependencies({ source, mime, base, module });
    },
  };
  const report = await inspectHomeDependencies(root, route(), run, parser);
  validate(report);
  assert.equal(report.stopReason, "dependenciesInspected");
  assert.ok(
    report.graph.edges.some(
      (edge) => edge.relationship === "registersCallback",
    ),
  );
  assert.ok(
    report.graph.edges.some((edge) => edge.relationship === "responseConsumer"),
  );
  assert.ok(report.graph.edges.some((edge) => edge.relationship === "inserts"));
});

test("fetch order is root, negative comparison, then two distinct children; reports retain no URLs or source", async () => {
  const order = [];
  const bodies = new Map([
    [rootURL, response("PRIVATE_SOURCE_SENTINEL", "text/html")],
    [negativeURL, response("different missing response", "text/html", 404)],
    [childURLs[0], response("one()", "application/javascript")],
    [childURLs[1], response("two()", "application/javascript")],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub({
      candidates: [
        "http://localhost:12345/scfs/one.js",
        "http://localhost:12345/scfs/two.js",
      ],
    }),
  );
  validate(report);
  assert.deepEqual(order, [rootURL, negativeURL, ...childURLs]);
  assert.equal(report.filesAttempted, 4);
  assert.equal(report.filesRead, 4);
  assert.equal(report.stopReason, "dependenciesInspected");
  const serialized = JSON.stringify(report);
  assert.equal(serialized.includes("PRIVATE_SOURCE_SENTINEL"), false);
  assert.equal(serialized.includes("/scfs/one.js"), false);
});

test("both candidates are rechecked before fetching either; denied second candidate stops the batch", async () => {
  const order = [];
  const checked = [];
  const bodies = new Map([
    [rootURL, response("root", "text/html")],
    [negativeURL, response("different", "text/html")],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const permitted = (value, base) => {
    if (value.endsWith("/one.js") || value.endsWith("/two.js"))
      checked.push(value);
    if (value.endsWith("/two.js")) return null;
    return permittedDocumentURL(value, base);
  };
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub({
      candidates: [
        "http://localhost:12345/scfs/one.js",
        "http://localhost:12345/scfs/two.js",
      ],
    }),
    emptyDependenciesReport,
    permitted,
  );
  validate(report);
  assert.deepEqual(checked, [
    "http://localhost:12345/scfs/one.js",
    "http://localhost:12345/scfs/two.js",
  ]);
  assert.deepEqual(order, [rootURL, negativeURL]);
  assert.equal(report.stopReason, "policyDenied");
});

test("parser ambiguity with two direct scripts prevents every child read", async () => {
  const order = [];
  const bodies = new Map([
    [rootURL, response("root", "text/html")],
    [negativeURL, response("different", "text/html")],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub({ rootReason: "ambiguous" }),
  );
  validate(report);
  assert.deepEqual(order, [rootURL, negativeURL]);
  assert.equal(report.stopReason, "ambiguous");
  assert.equal(report.dependencies.length, 0);
});

test("a failed first child stops before the second child and keeps its HTTP outcome", async () => {
  const order = [];
  const bodies = new Map([
    [rootURL, response("root", "text/html")],
    [negativeURL, response("different", "text/html")],
    [childURLs[0], response("missing child", "application/javascript", 404)],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub(),
  );
  validate(report);
  assert.deepEqual(order, [rootURL, negativeURL, childURLs[0]]);
  assert.equal(report.dependencies.length, 1);
  assert.equal(report.dependencies[0].outcome, "httpError");
  assert.equal(report.stopReason, "dependencyUnavailable");
  assert.equal(report.partialCoverage, true);
});

test("an HTML child fallback is preserved and never parsed or followed", async () => {
  const order = [];
  const bodies = new Map([
    [rootURL, response("root", "text/html")],
    [negativeURL, response("different", "text/html")],
    [childURLs[0], response("<html>fallback</html>", "text/html")],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub(),
  );
  validate(report);
  assert.deepEqual(order, [rootURL, negativeURL, childURLs[0]]);
  assert.equal(report.dependencies[0].mime, "html");
  assert.equal(report.dependencies[0].parse, "notAttempted");
  assert.equal(report.stopReason, "dependencyUnavailable");
});

test("four complete reads obey the exact 1,056 KiB aggregate byte ceiling", async () => {
  const bodies = new Map([
    [rootURL, response("r".repeat(16384), "text/html")],
    [negativeURL, response("n".repeat(16384), "text/html")],
    [childURLs[0], response("a".repeat(524288), "application/javascript")],
    [childURLs[1], response("b".repeat(524288), "application/javascript")],
  ]);
  const root = makeRoot(async (url) => bodies.get(url));
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub(),
  );
  validate(report);
  assert.equal(report.bytesRead, 1081344);
  assert.equal(report.filesAttempted, 4);
  assert.equal(report.filesRead, 4);
});

test("global graph cap remaps nodes across files and stops after saturation", async () => {
  const order = [];
  const bodies = new Map([
    [rootURL, response("root", "text/html")],
    [negativeURL, response("different", "text/html")],
    [childURLs[0], response("one()", "application/javascript")],
  ]);
  const root = makeRoot(async (url) => {
    order.push(url);
    return bodies.get(url);
  });
  const report = await inspectHomeDependencies(
    root,
    route(),
    run,
    parserStub({
      graphFor: (resource) => {
        if (resource === "root")
          return {
            nodes: Array.from({ length: 32 }, (_, id) => ({
              id,
              kind: "call",
            })),
            edges: [],
          };
        return { nodes: [{ id: 0, kind: "storageWrite" }], edges: [] };
      },
    }),
  );
  validate(report);
  assert.deepEqual(order, [rootURL, negativeURL, childURLs[0]]);
  assert.equal(report.graph.nodes.length, 32);
  assert.equal(report.saturated, true);
  assert.equal(report.stopReason, "graphSaturated");
});

test("a pagehide during pending parser controls prevents the later SDK getter", async () => {
  let finishControls;
  let pagehide;
  let sdkCalls = 0;
  let appended = 0;
  const documentListeners = new Map();
  const document = {
    addEventListener(name, callback) {
      documentListeners.set(name, callback);
    },
    getElementById() {
      return { set textContent(value) {} };
    },
    createElement() {
      return { set src(value) {}, set referrerPolicy(value) {} };
    },
    body: {
      appendChild() {
        appended++;
      },
    },
  };
  const root = {
    ...makeRoot(async () => {
      throw Error("unexpected fetch");
    }),
    location: { pathname: "/research/home-dependencies/" + run },
    addEventListener(name, callback) {
      if (name === "pagehide") pagehide = callback;
    },
    removeEventListener() {},
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname() {
          sdkCalls++;
          return {};
        },
      },
    },
  };
  const parser = { close() {} };
  startHomeDependencies(
    root,
    document,
    () => parser,
    () =>
      new Promise((resolve) => {
        finishControls = resolve;
      }),
    async () => {
      throw Error("inspection must not start");
    },
    emptyDependenciesReport,
    permittedDocumentURL,
    validateHomeDependencies,
  );
  await Promise.resolve();
  pagehide();
  finishControls(true);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(sdkCalls, 0);
  assert.equal(appended, 0);
  assert.equal(documentListeners.has("VIZIO_LIBRARY_DID_LOAD"), true);
});
