import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_CATALOG_PAGE } from "../research/sdk-catalog-check.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
test("delivered catalog probe performs exactly five fixed reads and exports types only", async () => {
  let ready, script;
  const calls = [],
    reports = [],
    output = {};
  const secret = {
    get token() {
      throw new Error("Private getter read");
    },
    value: "PRIVATE_SENTINEL",
  };
  const root = {
    VIZIO_MODULES: {
      System: {
        getConfigProperty(key) {
          calls.push(key);
          return Promise.resolve(secret);
        },
      },
      App: {
        getVizioAppInfoByCname(key) {
          calls.push(key);
          return Promise.resolve(secret);
        },
      },
    },
    location: { pathname: "/research/sdk-catalog-check/" + "a".repeat(32) },
    setTimeout() {},
    fetch(path, options) {
      reports.push(JSON.parse(options.body));
      return Promise.resolve({ status: 204 });
    },
  };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, fn) {
      ready = fn;
    },
    createElement() {
      return {};
    },
    body: {
      appendChild(s) {
        script = s;
      },
    },
  };
  vm.runInNewContext(SDK_CATALOG_PAGE.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: root,
    document,
  });
  ready();
  ready();
  await new Promise((r) => setImmediate(r));
  script.onload();
  assert.deepEqual(calls, [
    "MistResearchAbsentControl20261017",
    "VIZIOApps",
    "VirtualInputs",
    "AppMigration",
    "sctv",
  ]);
  assert.equal(
    new Set(reports.filter((r) => r.state === "resolved").map((r) => r.probe))
      .size,
    5,
  );
  for (const report of reports) assert.ok(validateDiagnosticReport(report));
  assert.doesNotMatch(
    JSON.stringify(reports) + output.textContent,
    /PRIVATE_SENTINEL|token/,
  );
});
