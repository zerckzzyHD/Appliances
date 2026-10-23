import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  inspectHomeReferences,
  HOME_SOURCE_PAGE,
  HOME_SOURCE_CSP,
} from "../research/home-source-check.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
function fixture(fetch) {
  return { URL, AbortController, TextDecoder, setTimeout, clearTimeout, fetch };
}

test("Home reader recognizes documented legacy store references without exporting their arguments", async () => {
  const root = fixture(
    async () =>
      new Response(
        'VIZIO.getStoreProperty("PRIVATE_SENTINEL"); VIZIO.getStorePropertyAsync("PRIVATE_SENTINEL"); VIZIO.getStoreProperties([]); VIZIO.setStoreProperty("PRIVATE_SENTINEL", 1);',
      ),
  );
  const result = await inspectHomeReferences(root, {
    MESSAGE: "http://localhost:12345/scfs/home.html",
  });
  assert.equal(result.state, "resolved");
  assert.deepEqual(
    result.methods.map(({ scope, name }) => [scope, name]),
    [
      ["VIZIO", "getStoreProperty"],
      ["VIZIO", "getStorePropertyAsync"],
      ["VIZIO", "getStoreProperties"],
      ["VIZIO", "setStoreProperty"],
    ],
  );
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
});
test("Home reader refuses arbitrary, credentialed and configuration URLs without fetching or getters", async () => {
  let calls = 0;
  const root = fixture(() => {
    calls++;
    throw Error();
  });
  for (const MESSAGE of [
    "http://outside.invalid/scfs/home.html",
    "http://localhost:12345/private",
    "http://localhost:12345/scfs/config.json",
    "http://localhost:12345/scfs/home.html?token=PRIVATE",
    "http://user:PRIVATE@localhost:12345/scfs/home.html",
    null,
  ]) {
    assert.equal(
      (await inspectHomeReferences(root, { MESSAGE })).state,
      "unavailable",
    );
  }
  const object = {};
  Object.defineProperty(object, "MESSAGE", {
    get() {
      throw Error("Getter invoked");
    },
  });
  assert.equal(
    (await inspectHomeReferences(root, object)).state,
    "unavailable",
  );
  assert.equal(calls, 0);
});
test("Home reader bounds linked static requests and emits only fixed lexical method references", async () => {
  const requests = [];
  const root = fixture(async (url, options) => {
    requests.push(url);
    assert.equal(options.credentials, "omit");
    assert.equal(options.redirect, "error");
    return new Response(
      requests.length === 1
        ? '<script src="http://outside.invalid/bad.js"></script><script src="/scfs/token.js"></script>' +
            Array.from(
              { length: 9 },
              (_, i) => `<script src="/scfs/static-${i}.js"></script>`,
            ).join("")
        : "PRIVATE_SENTINEL System.setTvStoreProperty; App.launchApp; globalThis.PWNED=true;",
    );
  });
  const result = await inspectHomeReferences(root, {
    MESSAGE: "http://localhost:12345/scfs/home.html",
  });
  assert.equal(result.state, "resolved");
  assert.equal(requests.length, 5);
  assert.deepEqual(
    result.methods.map((x) => x.name),
    ["setTvStoreProperty", "launchApp"],
  );
  assert.doesNotMatch(
    JSON.stringify(result),
    /PRIVATE_SENTINEL|static-|localhost|PWNED/,
  );
  assert.equal(globalThis.PWNED, undefined);
  assert.match(HOME_SOURCE_CSP, /connect-src[^;]*http:\/\/localhost:12345/);
  assert.doesNotMatch(HOME_SOURCE_CSP, /https:|connect-src\s+\*/);
});
test("Home reader rejects oversized source and never evaluates fetched code", async () => {
  let calls = 0;
  const root = fixture(async () => {
    calls++;
    return new Response("x".repeat(524289));
  });
  const result = await inspectHomeReferences(root, {
    MESSAGE: "http://127.0.0.1:12345/scfs/home.html",
  });
  assert.equal(result.state, "rejected");
  assert.equal(calls, 1);
  assert.deepEqual(result.methods, []);
});
test("Delivered Home reference page reads sctv once and only posts validated reference metadata", async () => {
  let ready,
    script,
    reads = 0;
  const reports = [];
  const root = {
    ...fixture(async (url, options) => {
      if (url === "/research/report") {
        const report = JSON.parse(options.body);
        assert.ok(validateDiagnosticReport(report));
        reports.push(report);
        assert.doesNotMatch(options.body, /PRIVATE_SENTINEL|scfs\/home/);
        return { status: 204 };
      }
      return new Response("PRIVATE_SENTINEL getConfigProperty");
    }),
    location: { pathname: "/research/home-source-check/" + "a".repeat(32) },
    VIZIO_MODULES: {
      App: {
        getVizioAppInfoByCname(name) {
          reads++;
          assert.equal(name, "sctv");
          return Promise.resolve({
            MESSAGE: "http://localhost:12345/scfs/home.html",
          });
        },
      },
    },
  };
  const document = {
    getElementById: () => ({}),
    addEventListener: (name, fn) => {
      ready = fn;
    },
    createElement: () => ({}),
    body: {
      appendChild: (s) => {
        script = s;
      },
    },
  };
  vm.runInNewContext(HOME_SOURCE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: root,
    document,
  });
  script.onload();
  await ready();
  await ready();
  assert.equal(reads, 1);
  assert.equal(reports.at(-1).state, "resolved");
  assert.equal(reports.at(-1).methods[0].name, "getConfigProperty");
});
