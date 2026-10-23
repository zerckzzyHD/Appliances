import test from "node:test";
import assert from "node:assert/strict";
import {
  inspectHomeDependencies,
  makeDependenciesParser,
} from "../research/home-dependencies-browser.mjs";
import {
  emptyDependenciesReport,
  emptyDependenciesShape,
  validateHomeDependencies,
} from "../research/home-dependencies-contract.mjs";
import { parseHomeDependencies } from "../research/home-dependencies-parser.mjs";

const run = "0123456789abcdef0123456789abcdef";
const rootURL = "http://localhost:12345/scfs/root.html";
const base = rootURL;

function response(source, mime = "text/html") {
  const bytes = new TextEncoder().encode(source);
  let offset = 0;
  return {
    ok: true,
    headers: { get: (name) => (name === "content-type" ? mime : null) },
    body: {
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
    },
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

async function inspectRoot(parser, html = "<html></html>", customRoot) {
  const root =
    customRoot ||
    makeRoot(async (url) =>
      url === rootURL ? response(html) : response("absent"),
    );
  return inspectHomeDependencies(root, route(), run, parser);
}

test("worker wrapper reports only fixed reasons for each bounded failure", async () => {
  async function rejection(mode) {
    let worker;
    const timers = [];
    class Worker {
      constructor() {
        if (mode === "unavailable") throw Error("PRIVATE_EXCEPTION_SENTINEL");
        worker = this;
      }
      postMessage() {
        if (mode === "post") throw Error("PRIVATE_EXCEPTION_SENTINEL");
      }
      terminate() {}
    }
    const parser = makeDependenciesParser(
      {
        Worker,
        setTimeout(callback) {
          timers.push(callback);
          return timers.length;
        },
        clearTimeout() {},
      },
      "/worker",
    );
    const pending = parser.parse("source", "javascript", base);
    if (mode === "error") worker.onerror();
    if (mode === "empty") worker.onmessage({ data: null });
    if (mode === "deadline") timers[0]();
    if (mode === "workerResult")
      worker.onmessage({ data: { failureReason: "workerError" } });
    await assert.rejects(pending, (error) => {
      assert.deepEqual(error, {
        failureReason:
          mode === "unavailable"
            ? "workerUnavailable"
            : mode === "error" || mode === "workerResult"
              ? "workerError"
              : mode === "empty"
                ? "workerEmptyResponse"
                : mode === "post"
                  ? "workerPostFailure"
                  : "workerDeadline",
      });
      assert.doesNotMatch(JSON.stringify(error), /PRIVATE_EXCEPTION_SENTINEL/);
      return true;
    });
  }

  for (const mode of [
    "unavailable",
    "error",
    "deadline",
    "empty",
    "post",
    "workerResult",
  ])
    await rejection(mode);
});

test("collector keeps worker and unknown internal failures separate and redacted", async () => {
  for (const [failure, expected] of [
    [{ failureReason: "workerUnavailable" }, "workerUnavailable"],
    [Error("PRIVATE_EXCEPTION_SENTINEL"), "unknownInternalFailure"],
  ]) {
    const report = await inspectRoot({
      async parse() {
        throw failure;
      },
    });
    assert.equal(report.root.failureReason, expected);
    assert.equal(report.root.parse, "limit");
    assert.ok(validateHomeDependencies(report));
    assert.doesNotMatch(JSON.stringify(report), /PRIVATE_EXCEPTION_SENTINEL/);
  }
});

test("dependency records carry the fixed parser failure reason", async () => {
  const missingURL = "http://localhost:12345/scfs/mist-absent-" + run + ".html";
  const childURL = "http://localhost:12345/scfs/one.js";
  const root = makeRoot(async (url) => {
    if (url === rootURL)
      return response(
        '<script src="/scfs/one.js"></script><script src="/scfs/two.js"></script>',
      );
    if (url === missingURL) return response("absent", "text/html");
    if (url === childURL) return response("source", "text/javascript");
    return null;
  });
  const report = await inspectHomeDependencies(root, route(), run, {
    async parse(source, mime, baseURL, module) {
      if (mime === "html")
        return parseHomeDependencies({ source, mime, base: baseURL, module });
      throw { failureReason: "workerError" };
    },
  });
  assert.equal(report.dependencies[0].failureReason, "workerError");
  assert.equal(report.dependencies[0].parse, "limit");
  assert.ok(validateHomeDependencies(report));
});

test("collector distinguishes invalid parser results from invalid graphs", async () => {
  const badResult = await inspectRoot({
    async parse() {
      return null;
    },
  });
  assert.equal(badResult.root.failureReason, "invalidParserResult");
  assert.ok(validateHomeDependencies(badResult));

  const badGraph = await inspectRoot({
    async parse() {
      return {
        parse: "parsed",
        shape: { ...emptyDependenciesShape() },
        methods: [],
        graph: { nodes: [{ id: 0, kind: "unrecognized" }], edges: [] },
        unsupportedCount: 0,
        truncated: false,
        sourceTruncated: false,
        parseIncomplete: false,
        saturated: false,
        scriptCandidates: [],
        reason: "noCandidate",
      };
    },
  });
  assert.equal(badGraph.root.failureReason, "invalidParserGraph");
  assert.ok(validateHomeDependencies(badGraph));
});

test("outer collection deadline is recorded on the active resource", async () => {
  let now = 10000;
  let nextTimer = 0;
  const timers = new Map();
  const root = makeRoot(async () => response("<html></html>"));
  root.Date = { now: () => now };
  root.setTimeout = (callback) => {
    const id = ++nextTimer;
    timers.set(id, callback);
    return id;
  };
  root.clearTimeout = (id) => timers.delete(id);
  const parser = {
    async parse() {
      now = 15000;
      timers.get(1)();
      return new Promise(() => {});
    },
  };

  const report = await inspectHomeDependencies(root, route(), run, parser);
  assert.equal(report.root.failureReason, "collectionDeadline");
  assert.equal(report.budgetExceeded, true);
  assert.equal(report.sourceTruncated, false);
  assert.equal(report.stopReason, "budget");
  assert.ok(validateHomeDependencies(report));
});

test("syntax diagnostics survive report validation while historical reports stay valid", async () => {
  const report = await inspectRoot(
    {
      async parse(source, mime, baseURL, module) {
        return parseHomeDependencies({ source, mime, base: baseURL, module });
      },
    },
    "<script>const PRIVATE_SOURCE_SENTINEL = ;</script>",
  );
  assert.equal(report.root.failureReason, "syntaxError");
  assert.ok(validateHomeDependencies(report));
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE_SOURCE_SENTINEL/);

  const historical = structuredClone(report);
  delete historical.root.failureReason;
  assert.ok(validateHomeDependencies(historical));

  const arbitraryKey = structuredClone(report);
  arbitraryKey.root.rawError = "private";
  assert.equal(validateHomeDependencies(arbitraryKey), null);

  const unknownReason = structuredClone(report);
  unknownReason.root.failureReason = "PRIVATE_EXCEPTION_SENTINEL";
  assert.equal(validateHomeDependencies(unknownReason), null);

  const incoherentReason = structuredClone(report);
  incoherentReason.root.failureReason = "workerDeadline";
  assert.equal(validateHomeDependencies(incoherentReason), null);

  const empty = emptyDependenciesReport(run);
  empty.root.failureReason = "workerError";
  assert.equal(validateHomeDependencies(empty), null);

  const negativeExtension = emptyDependenciesReport(run);
  negativeExtension.negative.failureReason = "collectionDeadline";
  assert.equal(validateHomeDependencies(negativeExtension), null);
});

test("HTML stops at first inline failure instead of misattributing a later limit", () => {
  const source =
    "<script>let = ;</script><script>" + "void 0;".repeat(4000) + "</script>";
  const parsed = parseHomeDependencies({ source, mime: "html", base });
  assert.equal(parsed.failureReason, "syntaxError");
  assert.equal(parsed.parse, "partial");
  assert.equal(parsed.shape.jsParse, "failed");
});

test("malformed graph outranks a claimed syntax reason and remains reportable", async () => {
  const report = await inspectRoot({
    async parse() {
      const parsed = parseHomeDependencies({
        source: "<script>let = ;</script>",
        mime: "html",
        base,
      });
      parsed.graph = { nodes: [{ id: 0, kind: "unrecognized" }], edges: [] };
      return parsed;
    },
  });
  assert.equal(report.root.failureReason, "invalidParserGraph");
  assert.ok(validateHomeDependencies(report));
});

test("a completely parsed node cannot claim an unknown failure", async () => {
  const report = await inspectRoot({
    async parse(source, mime, base) {
      return parseHomeDependencies({ source, mime, base });
    },
  });
  assert.ok(validateHomeDependencies(report));
  report.root.failureReason = "unknownInternalFailure";
  assert.equal(validateHomeDependencies(report), null);
});
