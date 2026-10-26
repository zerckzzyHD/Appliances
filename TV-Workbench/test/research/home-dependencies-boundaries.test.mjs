import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHomeDependencies } from "../../src/research/home-dependencies-parser.mjs";
import {
  inspectHomeDependencies,
  makeDependenciesParser,
  startHomeDependencies,
} from "../../src/research/home-dependencies-browser.mjs";
import { validateHomeDependencies } from "../../src/research/home-dependencies-contract.mjs";

const base = "http://localhost:12345/scfs/home.html";
const run = "e".repeat(32);
const pair = "<script src=a.js></script><script src=b.js></script>";
const parser = {
  async parse(source, mime, base, module = false) {
    return parseHomeDependencies({ source, mime, base, module });
  },
};

async function inspect(
  html,
  {
    status = 404,
    childType = "text/javascript",
    route = { MESSAGE: base },
  } = {},
) {
  const calls = [];
  const root = {
    URL,
    Date,
    AbortController,
    TextDecoder,
    Uint8Array,
    setTimeout,
    clearTimeout,
    async fetch(url, options) {
      calls.push(url);
      assert.equal(options.credentials, "omit");
      assert.equal(options.redirect, "error");
      assert.equal(options.referrerPolicy, "no-referrer");
      return calls.length === 1
        ? new Response(html, { headers: { "content-type": "text/html" } })
        : calls.length === 2
          ? new Response("different negative body", {
              status,
              headers: { "content-type": "text/html" },
            })
          : new Response("void 0", { headers: { "content-type": childType } });
    },
  };
  const report = await inspectHomeDependencies(root, route, run, parser);
  assert.ok(
    validateHomeDependencies(report),
    "collector outcome must satisfy its report contract: " +
      JSON.stringify(report),
  );
  return { calls, report };
}

test("two direct scripts never override a frame, navigation or denied base veto", async () => {
  for (const suffix of [
    "<iframe src=/scfs/frame.html></iframe>",
    '<script>location.replace("/scfs/other.html")</script>',
    '<base href="https://example.invalid/">',
    "<body onload=go()>",
  ]) {
    const { calls, report } = await inspect(pair + suffix);
    assert.equal(calls.length, 2);
    assert.equal(report.dependencies.length, 0);
    assert.ok(
      ["ambiguous", "policyDenied", "external"].includes(report.stopReason),
    );
  }
});

test("complete HTTP-success and HTTP-error negative bodies each count once", async () => {
  for (const status of [200, 404]) {
    const { calls, report } = await inspect(pair, { status });
    assert.equal(calls.length, 4);
    assert.equal(report.filesRead, 4);
    assert.equal(report.negative.outcome, status === 200 ? "ok" : "httpError");
    assert.equal(report.negative.comparison, "different");
    assert.equal(report.stopReason, "dependenciesInspected");
  }
});

test("an HTML script response is preserved as partial coverage without a recursive read", async () => {
  const { calls, report } = await inspect(pair, { childType: "text/html" });
  assert.equal(calls.length, 3);
  assert.equal(report.dependencies[0].mime, "html");
  assert.equal(report.dependencies[0].parse, "notAttempted");
  assert.equal(report.partialCoverage, true);
  assert.equal(report.stopReason, "dependencyUnavailable");
});

test("a native route accessor is not invoked to obtain a source URL", async () => {
  const route = Object.defineProperty({}, "MESSAGE", {
    get() {
      throw Error("unexpected accessor");
    },
  });
  const { calls, report } = await inspect(pair, { route });
  assert.equal(calls.length, 0);
  assert.equal(report.stopReason, "rootUnavailable");
});

test("the collection deadline also bounds an unresponsive stream and cancellation", async () => {
  let clock = 0,
    attempts = 0;
  const root = {
    URL,
    AbortController,
    TextDecoder,
    Uint8Array,
    Date: { now: () => clock },
    setTimeout(callback, milliseconds) {
      return setTimeout(() => {
        clock += milliseconds;
        callback();
      }, 2);
    },
    clearTimeout,
    async fetch() {
      attempts++;
      return {
        ok: true,
        headers: new Headers({ "content-type": "text/html" }),
        body: {
          getReader: () => ({
            read: () => new Promise(() => {}),
            cancel: () => new Promise(() => {}),
          }),
        },
      };
    },
  };
  const report = await inspectHomeDependencies(
    root,
    { MESSAGE: base },
    run,
    parser,
  );
  assert.ok(validateHomeDependencies(report));
  assert.equal(attempts, 1);
  assert.equal(report.stopReason, "budget");
  assert.equal(report.sourceTruncated, true);
  assert.equal(report.saturated, false);
});

test("a parser that never replies is terminated rather than extending the parse deadline", async () => {
  let terminated = 0;
  class Worker {
    postMessage() {}
    terminate() {
      terminated++;
    }
  }
  const wrapped = makeDependenciesParser(
    { Worker, setTimeout, clearTimeout },
    "/fixture",
  );
  await assert.rejects(wrapped.parse("void 0", "javascript", base, false, 5), {
    failureReason: "workerDeadline",
  });
  assert.equal(terminated, 1);
  await assert.rejects(wrapped.parse("void 0", "javascript", base), {
    failureReason: "workerUnavailable",
  });
});

test("a native lookup settling after pagehide cannot start source collection", async () => {
  let ready,
    pagehide,
    settle,
    calls = 0,
    inspected = 0;
  const root = {
    location: { pathname: "/research/home-dependencies/" + run },
    setTimeout,
    clearTimeout,
    addEventListener(name, callback) {
      if (name === "pagehide") pagehide = callback;
    },
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname() {
          calls++;
          return new Promise((resolve) => {
            settle = resolve;
          });
        },
      },
    },
    fetch() {
      throw Error("unexpected report");
    },
  };
  const document = {
    addEventListener(_, callback) {
      ready = callback;
    },
    createElement: () => ({}),
    body: { appendChild() {} },
  };
  startHomeDependencies(
    root,
    document,
    () => ({ close() {} }),
    async () => true,
    async () => {
      inspected++;
      throw Error("unexpected collection");
    },
  );
  await new Promise((resolve) => setImmediate(resolve));
  const pending = ready();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(calls, 1);
  pagehide();
  settle({ MESSAGE: base });
  await pending;
  assert.equal(inspected, 0);
});
