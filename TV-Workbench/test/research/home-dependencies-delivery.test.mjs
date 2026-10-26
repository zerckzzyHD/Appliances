import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { Worker as NodeWorker } from "node:worker_threads";
import { readPreparedDependencies } from "../../src/research/home-dependencies-prepared.mjs";
import { makeDependenciesParser } from "../../src/research/home-dependencies-browser.mjs";
import { validateHomeDependencies } from "../../src/research/home-dependencies-contract.mjs";

const run = "f".repeat(32);
class BrowserWorker {
  constructor(path) {
    assert.equal(path, "/research/dependency-parser/" + run);
    const code = readPreparedDependencies().worker;
    this.worker = new NodeWorker(
      `import {parentPort} from "node:worker_threads";globalThis.self={postMessage:v=>parentPort.postMessage(v)};${code};parentPort.on('message',data=>self.onmessage({data}));`,
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

test("the built worker returns fixed parser diagnostics and no source or exception text", async () => {
  const base = "http://localhost:12345/scfs/fixture.html";
  const syntaxParser = makeDependenciesParser(
    { Worker: BrowserWorker, setTimeout, clearTimeout },
    "/research/dependency-parser/" + run,
  );
  try {
    const syntax = await syntaxParser.parse(
      "const PRIVATE_SOURCE_SENTINEL = ;",
      "javascript",
      base,
    );
    assert.equal(syntax.failureReason, "syntaxError");
    assert.doesNotMatch(JSON.stringify(syntax), /PRIVATE_SOURCE_SENTINEL/);
  } finally {
    syntaxParser.close();
  }

  const invalidParser = makeDependenciesParser(
    { Worker: BrowserWorker, setTimeout, clearTimeout },
    "/research/dependency-parser/" + run,
  );
  try {
    await assert.rejects(
      invalidParser.parse("x".repeat(524290), "javascript", base),
      (error) => {
        assert.deepEqual(error, { failureReason: "workerError" });
        assert.doesNotMatch(String(error), /x{64}/);
        return true;
      },
    );
  } finally {
    invalidParser.close();
  }
});

test("the exact built page and worker produce only a validated report from synthetic source", async () => {
  let ready, script, pagehide;
  let getters = 0;
  const reports = [],
    reads = [];
  const root = {
    URL,
    Date,
    AbortController,
    TextDecoder,
    Uint8Array,
    setTimeout,
    clearTimeout,
    Worker: BrowserWorker,
    location: { pathname: "/research/home-dependencies/" + run },
    addEventListener(name, callback) {
      if (name === "pagehide") pagehide = callback;
    },
    removeEventListener() {},
    VIZIO_MODULES: {
      App: {
        async getVizioAppInfoByCname(name) {
          assert.equal(name, "sctv");
          getters++;
          return { MESSAGE: "http://localhost:12345/scfs/root.html" };
        },
      },
    },
    async fetch(url, options) {
      if (url === "/research/dependency-report") {
        assert.equal(options.method, "POST");
        reports.push(JSON.parse(options.body));
        return new Response(null, { status: 204 });
      }
      reads.push(url);
      assert.match(url, /^http:\/\/localhost:12345\/scfs\//);
      const body =
        reads.length === 1
          ? '<script src="a.js"></script><script src="b.js"></script>'
          : reads.length === 2
            ? "absent"
            : 'throw Error("PRIVATE_SOURCE_MUST_NOT_EXECUTE")';
      return new Response(body, {
        status: reads.length === 2 ? 404 : 200,
        headers: {
          "content-type": reads.length <= 2 ? "text/html" : "text/javascript",
        },
      });
    },
  };
  const document = {
    addEventListener(name, callback) {
      assert.equal(name, "VIZIO_LIBRARY_DID_LOAD");
      ready = callback;
    },
    createElement() {
      return {};
    },
    getElementById() {
      return {};
    },
    body: {
      appendChild(value) {
        script = value;
      },
    },
  };
  const page = readPreparedDependencies().page;
  const code = page.slice(
    page.indexOf("<script>") + 8,
    page.lastIndexOf("</script>"),
  );
  vm.runInNewContext(
    code,
    { window: root, document, URL, TextEncoder },
    { timeout: 1000 },
  );
  try {
    const deadline = Date.now() + 2000;
    while (!script && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 5));
    assert.ok(
      script,
      "built worker controls must finish before SDK script insertion",
    );
    script.onload();
    await ready();
    assert.equal(getters, 1);
    assert.equal(reads.length, 4);
    assert.equal(reports.length, 1);
    assert.ok(validateHomeDependencies(reports[0]));
    assert.equal(reports[0].control, "passed");
    assert.equal(reports[0].stopReason, "dependenciesInspected");
    assert.doesNotMatch(
      JSON.stringify(reports),
      /PRIVATE_SOURCE|localhost|a\.js|b\.js/,
    );
    await ready();
    assert.equal(getters, 1);
  } finally {
    pagehide?.();
  }
});
