import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_STORE_PAGE } from "../research/sdk-store-check.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
async function run(t, reject = false) {
  let ready,
    script,
    calls = 0,
    writes = 0;
  const reports = [];
  const output = {};
  const system = {
    getTvStoreProperty(key) {
      calls++;
      assert.equal(key, "com.mist.console.tv.research.absent");
      return reject
        ? Promise.reject(new Error("PRIVATE_SENTINEL"))
        : Promise.resolve({ secret: "PRIVATE_SENTINEL" });
    },
    setTvStoreProperty() {
      writes++;
      throw new Error();
    },
  };
  const root = {
    VIZIO_MODULES: { System: system },
    location: { pathname: "/research/sdk-store-check/" + "a".repeat(32) },
    fetch(path, options) {
      reports.push(JSON.parse(options.body));
      return Promise.resolve({ status: 204 });
    },
    setTimeout() {},
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
  vm.runInNewContext(SDK_STORE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: root,
    document,
  });
  ready();
  ready();
  await new Promise((r) => setImmediate(r));
  script.onload();
  assert.equal(calls, 1);
  assert.equal(writes, 0);
  assert.equal(reports.at(-1).state, reject ? "rejected" : "resolved");
  for (const report of reports) assert.ok(validateDiagnosticReport(report));
  assert.doesNotMatch(
    JSON.stringify(reports) + output.textContent,
    /PRIVATE_SENTINEL/,
  );
}
test("delivered store probe calls one fixed getter, never setter, and omits data", (t) =>
  run(t));
test("delivered store probe withholds rejection text and preserves rejected state after load", (t) =>
  run(t, true));
