import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  inspectHomeCoverage,
  HOME_COVERAGE_PAGE,
} from "../../src/research/home-coverage-browser.mjs";
import {
  HOME_REFERENCE_METHODS,
  validateHomeCoverage,
} from "../../src/research/home-coverage-contract.mjs";
const route = { MESSAGE: "http://localhost:12345/scfs/home.html" };
const fixture = (fetch) => ({
  URL,
  AbortController,
  TextDecoder,
  setTimeout,
  clearTimeout,
  fetch,
});
const report = (value) => ({
  probe: "sdk-home-coverage-23",
  run: "a".repeat(32),
  sequence: 0,
  loaded: true,
  ready: true,
  state: value.documentOutcome === "ok" ? "resolved" : "unavailable",
  ...value,
});
test("coverage distinguishes actual bounded reads from matched method names without source execution or export", async () => {
  const requests = [];
  const root = fixture(async (url, options) => {
    requests.push(url);
    assert.equal(options.credentials, "omit");
    assert.equal(options.redirect, "error");
    return new Response(
      requests.length === 1
        ? '<script src="http://outside.invalid/scfs/private.js"></script><script src="/scfs/config.js"></script>' +
            Array.from(
              { length: 9 },
              (_, n) => `<script src="/scfs/s${n}.js"></script>`,
            ).join("")
        : 'globalThis.PWNED=true; VIZIO.getStoreProperty("PRIVATE_SENTINEL")',
      {
        headers: {
          "Content-Type":
            requests.length === 1 ? "text/html" : "application/javascript",
        },
      },
    );
  });
  const result = await inspectHomeCoverage(root, route, HOME_REFERENCE_METHODS);
  assert.equal(requests.length, 5);
  assert.equal(result.filesAttempted, 5);
  assert.equal(result.filesRead, 5);
  assert.equal(result.scriptsSeen, 11);
  assert.equal(result.scriptsEligible, 9);
  assert.equal(result.truncated, true);
  assert.equal(result.documentOutcome, "ok");
  assert.equal(result.mimeClass, "html");
  assert.equal(result.routeRelation, "unavailable");
  assert.deepEqual(result.methods, [
    { scope: "VIZIO", name: "getStoreProperty", type: "function" },
  ]);
  assert.ok(validateHomeCoverage(report(result)));
  assert.equal(globalThis.PWNED, undefined);
  assert.doesNotMatch(
    JSON.stringify(result),
    /PRIVATE_SENTINEL|outside|scfs|PWNED|http:/,
  );
});
test("zero script document is reported as one read, not complete Home implementation coverage", async () => {
  const result = await inspectHomeCoverage(
    fixture(
      async () =>
        new Response("<html>bootstrap only</html>", {
          headers: { "Content-Type": "text/html" },
        }),
    ),
    route,
    HOME_REFERENCE_METHODS,
  );
  assert.equal(result.filesRead, 1);
  assert.equal(result.scriptsSeen, 0);
  assert.equal(result.truncated, false);
  assert.deepEqual(result.methods, []);
  assert.ok(validateHomeCoverage(report(result)));
});
test("coverage blocks arbitrary URLs and accessors, caps bytes, and labels failed reads", async () => {
  let calls = 0;
  const root = fixture(async () => {
    calls++;
    return new Response("x".repeat(524289));
  });
  for (const MESSAGE of [
    "https://outside.invalid/scfs/home.html",
    "http://localhost:12345/scfs/home.html?secret=PRIVATE",
    "http://localhost:12345/scfs/account.html",
  ]) {
    const result = await inspectHomeCoverage(
      root,
      { MESSAGE },
      HOME_REFERENCE_METHODS,
    );
    assert.equal(result.filesAttempted, 0);
    assert.ok(validateHomeCoverage(report(result)));
  }
  const accessor = {};
  Object.defineProperty(accessor, "MESSAGE", {
    get() {
      throw Error("getter invoked");
    },
  });
  assert.equal(
    (await inspectHomeCoverage(root, accessor, HOME_REFERENCE_METHODS))
      .filesAttempted,
    0,
  );
  assert.equal(calls, 0);
  const large = await inspectHomeCoverage(root, route, HOME_REFERENCE_METHODS);
  assert.equal(large.bytesRead, 524288);
  assert.equal(large.filesRead, 0);
  assert.equal(large.documentOutcome, "tooLarge");
  assert.equal(large.budgetExceeded, true);
  assert.ok(validateHomeCoverage(report(large)));
  for (const [fetch, outcome] of [
    [async () => new Response("private error", { status: 403 }), "httpError"],
    [
      async () => {
        throw Error("private error");
      },
      "blocked",
    ],
  ]) {
    const result = await inspectHomeCoverage(
      fixture(fetch),
      route,
      HOME_REFERENCE_METHODS,
    );
    assert.equal(result.documentOutcome, outcome);
    assert.equal(result.filesRead, 0);
    assert.ok(validateHomeCoverage(report(result)));
    assert.doesNotMatch(JSON.stringify(result), /private error/);
  }
});
test("total budget and time budget stop further reads with valid bounded counts", async () => {
  let count = 0;
  const root = fixture(
    async () =>
      new Response(
        ++count === 1
          ? Array.from(
              { length: 4 },
              (_, n) => `<script src="/scfs/s${n}.js"></script>`,
            ).join("")
          : "x".repeat(524288),
      ),
  );
  const total = await inspectHomeCoverage(root, route, HOME_REFERENCE_METHODS);
  assert.equal(total.bytesRead, 2097152);
  assert.equal(total.filesAttempted, 5);
  assert.equal(total.filesRead, 4);
  assert.equal(total.budgetExceeded, true);
  assert.ok(validateHomeCoverage(report(total)));
  const timed = fixture(async (_, { signal }) => {
    if (signal.aborted) throw Error();
    return new Promise((resolve, reject) =>
      signal.addEventListener("abort", () => reject(Error())),
    );
  });
  timed.setTimeout = (fn) => {
    queueMicrotask(fn);
    return 1;
  };
  timed.clearTimeout = () => {};
  const expired = await inspectHomeCoverage(
    timed,
    route,
    HOME_REFERENCE_METHODS,
  );
  assert.equal(expired.documentOutcome, "timeout");
  assert.equal(expired.budgetExceeded, true);
  assert.ok(validateHomeCoverage(report(expired)));
});
test("delivered page reads only sctv once, validates reports, and handles SDK ready before script onload", async () => {
  let ready,
    script,
    reads = 0;
  const reports = [];
  const root = {
    ...fixture(async (url, options) => {
      if (url === "/research/coverage-report") {
        const value = JSON.parse(options.body);
        assert.ok(validateHomeCoverage(value));
        reports.push(value);
        return {};
      }
      return new Response("VIZIO.getStoreProperty", {
        headers: { "Content-Type": "text/html" },
      });
    }),
    location: { pathname: "/research/home-coverage/" + "a".repeat(32) },
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname(name) {
          assert.equal(name, "sctv");
          reads++;
          return Promise.resolve(route);
        },
      },
    },
  };
  const document = {
    getElementById: () => ({}),
    addEventListener: (_, fn) => {
      ready = fn;
    },
    createElement: () => ({}),
    body: {
      appendChild: (value) => {
        script = value;
      },
    },
  };
  vm.runInNewContext(
    HOME_COVERAGE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    { window: root, document },
  );
  await ready();
  await ready();
  assert.equal(reads, 1);
  assert.equal(reports.at(-1).loaded, false);
  script.onload();
  assert.equal(reports.at(-1).loaded, true);
  assert.equal(reports.at(-1).sequence, 1);
});
