import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { Worker as NodeWorker } from "node:worker_threads";
import { readFileSync } from "node:fs";
import { parseHomeDocument } from "../../src/research/home-document-parser.mjs";
import {
  emptyDocumentReport,
  validateHomeDocument,
} from "../../src/research/home-document-contract.mjs";
import { permittedDocumentURL } from "../../src/research/home-document-policy.mjs";
import {
  inspectHomeDocument,
  makeDocumentParser,
  checkDocumentParser,
  startHomeDocument,
} from "../../src/research/home-document-browser.mjs";
import { readPreparedDocument } from "../../src/research/home-document-prepared.mjs";
const run = "a".repeat(32),
  base = "http://localhost:12345/scfs/home.html";
const parser = {
  parse: async (source, mime, base) =>
    parseHomeDocument({ source, mime, base }),
};
const rootFor = (fetch) => ({
  URL,
  AbortController,
  TextDecoder,
  Uint8Array,
  Date,
  setTimeout,
  clearTimeout,
  fetch,
});
async function inspect(html, child = "void 0", options = {}) {
  const calls = [];
  const root = rootFor(async (url, request) => {
    calls.push(url);
    assert.equal(request.credentials, "omit");
    assert.equal(request.redirect, "error");
    assert.equal(request.referrerPolicy, "no-referrer");
    if (options.fetch) return options.fetch(url, request, calls.length);
    return new Response(
      calls.length === 1 ? html : calls.length === 2 ? "absent" : child,
      {
        status: calls.length === 2 ? 404 : 200,
        headers: {
          "content-type":
            calls.length === 3
              ? options.childMime || "text/javascript"
              : "text/html",
        },
      },
    );
  });
  const result = await inspectHomeDocument(
    root,
    { MESSAGE: base },
    run,
    options.parser || parser,
    emptyDocumentReport,
    permittedDocumentURL,
  );
  assert.ok(validateHomeDocument(result), JSON.stringify(result));
  return { result, calls };
}
test("one literal navigation or unquoted script gets exactly one continuation, no recursive execution/export", async () => {
  for (const html of [
    "<script src=/scfs/main.js></script>",
    '<script>location.replace("/scfs/main.js")</script>',
  ]) {
    const { result, calls } = await inspect(
      html,
      'globalThis.PWNED=true; VIZIO.getStoreProperty("PRIVATE_SENTINEL"); import("/scfs/deeper.js")',
    );
    assert.equal(calls.length, 3);
    assert.equal(result.stopReason, "continuationInspected");
    assert.equal(result.negative.comparison, "different");
    assert.equal(result.methods.length, 1);
    assert.equal(globalThis.PWNED, undefined);
    assert.doesNotMatch(
      JSON.stringify(result),
      /PRIVATE_SENTINEL|main\.js|deeper|localhost|scfs/,
    );
  }
});
test("same bytes, even an HTTP error comparison, stop before continuation; equal lengths alone do not", async () => {
  const html = "<script src=a.js></script>";
  const { result, calls } = await inspect(html, "", {
    fetch: async (_, __, n) =>
      new Response(html, {
        status: n === 2 ? 404 : 200,
        headers: { "content-type": "text/html" },
      }),
  });
  assert.equal(result.stopReason, "sameResponse");
  assert.equal(calls.length, 2);
  const different = await inspect("<b>one</b>", "", {
    fetch: async (_, __, n) =>
      new Response(n === 1 ? "<b>one</b>" : "<b>two</b>", {
        headers: { "content-type": "text/html" },
      }),
  });
  assert.equal(different.result.negative.comparison, "different");
});
test("all non-follow reasons leave the continuation unattempted", async () => {
  for (const [html, reason] of [
    ["<p>plain</p>", "noCandidate"],
    ["<script src=a.js></script><script src=b.js></script>", "ambiguous"],
    ["<script src=https://outside.invalid/a.js></script>", "external"],
    ["<script src=/scfs/config.js></script>", "policyDenied"],
    ["<script src=home.html></script>", "selfLoop"],
    ['<script>if(true)location="/scfs/a.html"</script>', "ambiguous"],
    ["<script>location=</script>", "parseIncomplete"],
  ]) {
    const { result, calls } = await inspect(html);
    assert.equal(result.stopReason, reason);
    assert.ok(calls.length <= 2);
    assert.equal(result.continuationReason, "none");
  }
});
test("bounded failure classes, caps and parser termination produce valid metadata", async () => {
  for (const [fetch, reason] of [
    [async () => new Response("denied", { status: 403 }), "rootUnavailable"],
    [
      async () => {
        throw Error("PRIVATE");
      },
      "rootUnavailable",
    ],
    [
      async () =>
        new Response("x".repeat(16385), {
          headers: { "content-type": "text/html" },
        }),
      "budget",
    ],
    [
      async (_, __, n) => {
        if (n === 2) throw Error();
        return new Response("<p>x</p>", {
          headers: { "content-type": "text/html" },
        });
      },
      "comparisonUnavailable",
    ],
    [
      async (_, __, n) =>
        new Response(
          n === 1
            ? "<script src=a.js></script>"
            : n === 2
              ? "absent"
              : "denied",
          {
            status: n === 3 ? 403 : 200,
            headers: { "content-type": "text/html" },
          },
        ),
      "continuationUnavailable",
    ],
  ])
    assert.equal((await inspect("", "", { fetch })).result.stopReason, reason);
  const limited = await inspect("<p>x</p>", "", {
    parser: {
      parse: async () => {
        throw Error();
      },
    },
  });
  assert.equal(limited.result.stopReason, "budget");
  assert.equal(limited.result.budgetExceeded, true);
  const timeoutRoot = rootFor(
    async (_, { signal }) =>
      new Promise((_, reject) =>
        signal.addEventListener("abort", () => reject(Error())),
      ),
  );
  timeoutRoot.setTimeout = (fn) => {
    queueMicrotask(fn);
    return 1;
  };
  timeoutRoot.clearTimeout = () => {};
  const result = await inspectHomeDocument(
    timeoutRoot,
    { MESSAGE: base },
    run,
    parser,
    emptyDocumentReport,
    permittedDocumentURL,
  );
  assert.equal(result.stopReason, "budget");
  assert.ok(validateHomeDocument(result));
});
test("accessors and denied root paths cause no request", async () => {
  let requests = 0;
  const root = rootFor(async () => {
    requests++;
    throw Error();
  });
  const route = {};
  Object.defineProperty(route, "MESSAGE", {
    get() {
      throw Error("invoked");
    },
  });
  for (const value of [
    route,
    { MESSAGE: base + "?private=1" },
    { MESSAGE: "http://outside.invalid/x" },
  ]) {
    const result = await inspectHomeDocument(
      root,
      value,
      run,
      parser,
      emptyDocumentReport,
      permittedDocumentURL,
    );
    assert.ok(validateHomeDocument(result));
  }
  assert.equal(requests, 0);
});
test("all three body caps compose into the exact total and an oversized child is stopped", async () => {
  const header = "<script src=a.js></script>";
  const html = header + " ".repeat(16384 - header.length);
  const response = (oversize) => async (_, __, n) =>
    new Response(
      n === 1
        ? html
        : n === 2
          ? "n".repeat(16384)
          : "/*" + "x".repeat(524284 + (oversize ? 1 : 0)) + "*/",
      {
        status: n === 2 ? 404 : 200,
        headers: { "content-type": n === 3 ? "text/javascript" : "text/html" },
      },
    );
  const complete = await inspect(html, "", { fetch: response(false) });
  assert.equal(complete.result.bytesRead, 557056);
  assert.equal(complete.result.stopReason, "continuationInspected");
  const large = await inspect(html, "", { fetch: response(true) });
  assert.equal(large.result.bytesRead, 557056);
  assert.equal(large.result.continuation.outcome, "tooLarge");
  assert.equal(large.result.stopReason, "budget");
});
test("parser wrapper terminates an unresponsive worker within its separate hard deadline", async () => {
  let terminated = 0;
  const fake = {
    Worker: class {
      postMessage() {}
      terminate() {
        terminated++;
      }
    },
    setTimeout,
    clearTimeout,
  };
  const wrapped = makeDocumentParser(fake, "/fixed");
  await assert.rejects(wrapped.parse("x", "html", base, 10));
  assert.equal(terminated, 1);
  await assert.rejects(wrapped.parse("x", "html", base));
});
test("failed embedded controls make no getter or source request; late getter settlement starts no read", async () => {
  for (const failControls of [true, false]) {
    let ready,
      script,
      settle,
      gets = 0;
    const posts = [];
    const root = {
      ...rootFor(async (url, options) => {
        assert.equal(url, "/research/document-report");
        const value = JSON.parse(options.body);
        assert.ok(validateHomeDocument(value));
        posts.push(value);
        return {};
      }),
      location: { pathname: "/research/home-document/" + run },
      VIZIO_MODULES: {
        App: {
          getVizioAppInfoByCname() {
            gets++;
            return new Promise((resolve) => {
              settle = resolve;
            });
          },
        },
      },
      setTimeout(fn, ms) {
        if (ms === 5000) return setTimeout(fn, 2);
        return setTimeout(fn, ms);
      },
      clearTimeout,
    };
    const document = {
      addEventListener(_, fn) {
        ready = fn;
      },
      createElement: () => ({}),
      getElementById: () => ({}),
      body: {
        appendChild(v) {
          script = v;
        },
      },
    };
    const fakeParser = { close() {} };
    startHomeDocument(
      root,
      document,
      () => fakeParser,
      async () => !failControls,
      inspectHomeDocument,
      emptyDocumentReport,
      permittedDocumentURL,
      validateHomeDocument,
    );
    script.onload();
    await ready();
    if (settle) settle({ MESSAGE: base });
    await new Promise((resolve) => setTimeout(resolve, 4));
    assert.equal(gets, failControls ? 0 : 1);
    assert.equal(posts.at(-1).control, failControls ? "failed" : "passed");
    assert.equal(posts.at(-1).filesAttempted, 0);
  }
});
test("expired startup discards a late SDK event before any getter", async () => {
  let ready,
    expire,
    gets = 0;
  const root = {
    ...rootFor(async () => ({})),
    location: { pathname: "/research/home-document/" + run },
    setTimeout(fn, ms) {
      if (ms === 12000) {
        expire = fn;
        return 1;
      }
      return setTimeout(fn, ms);
    },
    clearTimeout() {},
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname() {
          gets++;
        },
      },
    },
  };
  const document = {
    addEventListener(_, fn) {
      ready = fn;
    },
    createElement: () => ({}),
    body: { appendChild() {} },
  };
  startHomeDocument(
    root,
    document,
    () => ({ close() {} }),
    async () => true,
    inspectHomeDocument,
    emptyDocumentReport,
    permittedDocumentURL,
    validateHomeDocument,
  );
  await Promise.resolve();
  await Promise.resolve();
  expire();
  await ready();
  assert.equal(gets, 0);
});

// Browser-compatible adapter around a real worker thread executing the exact built IIFE.
class BrowserWorker {
  constructor() {
    const code = readPreparedDocument().worker;
    this.worker = new NodeWorker(
      `const {parentPort}=require('node:worker_threads');globalThis.self={postMessage:v=>parentPort.postMessage(v)};${code};parentPort.on('message',data=>self.onmessage({data}));`,
      { eval: true },
    );
    this.worker.on("message", (data) => this.onmessage?.({ data }));
    this.worker.on("error", () => this.onerror?.());
  }
  postMessage(value) {
    this.worker.postMessage(value);
  }
  terminate() {
    return this.worker.terminate();
  }
}
test("built worker passes embedded controls; HTML/JS source is never evaluated", async () => {
  const wrapped = makeDocumentParser(
    { Worker: BrowserWorker, setTimeout, clearTimeout },
    "/fixed",
  );
  try {
    assert.equal(await checkDocumentParser(wrapped), true);
    const result = await wrapped.parse(
      '<script>throw Error("PRIVATE")</script>',
      "html",
      base,
    );
    assert.equal(result.parse, "parsed");
  } finally {
    wrapped.close();
  }
});
test("delivered bundled page runs controls, one getter, validates post and resends loaded race", async () => {
  let ready,
    script,
    getters = 0;
  const posts = [];
  const root = {
    ...rootFor(async (url, options) => {
      if (url === "/research/document-report") {
        const value = JSON.parse(options.body);
        assert.ok(validateHomeDocument(value));
        posts.push(value);
        return {};
      }
      return new Response(url === base ? "<p>root</p>" : "absent", {
        headers: { "content-type": "text/html" },
      });
    }),
    Worker: BrowserWorker,
    location: { pathname: "/research/home-document/" + run },
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname(name) {
          getters++;
          assert.equal(name, "sctv");
          return Promise.resolve({ MESSAGE: base });
        },
      },
    },
  };
  const document = {
    addEventListener(_, fn) {
      ready = fn;
    },
    getElementById: () => ({}),
    createElement: () => ({}),
    body: {
      appendChild(value) {
        script = value;
      },
    },
  };
  vm.runInNewContext(
    readFileSync(
      new URL(
        "../../src/research/generated/home-document-page.js",
        import.meta.url,
      ),
      "utf8",
    ),
    {
      window: root,
      document,
      URL,
      Uint8Array,
      TextDecoder,
      TextEncoder,
      Date,
      setTimeout,
      clearTimeout,
    },
  );
  await ready();
  await ready();
  assert.equal(getters, 1);
  assert.equal(posts.at(-1).loaded, false);
  script.onload();
  assert.equal(posts.at(-1).loaded, true);
  assert.equal(posts.at(-1).sequence, 1);
});
