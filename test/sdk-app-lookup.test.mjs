import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_APP_LOOKUP_PAGE } from "../research/sdk-app-lookup.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
test("app lookup sends exact documented arguments, includes absent control, and omits data", async () => {
  let ready, script;
  const reports = [],
    calls = [],
    output = {};
  const secret = { MESSAGE: "PRIVATE_SENTINEL" };
  const root = {
    VIZIO_MODULES: {
      App: {
        getAppInfo(id, namespace) {
          calls.push([id, namespace]);
          return Promise.resolve(id === "99999999" ? null : secret);
        },
        getVizioAppInfoByCname(name) {
          calls.push([name]);
          return Promise.resolve(secret);
        },
        launchApp() {
          throw Error("Must not launch");
        },
      },
    },
    location: { pathname: "/research/sdk-app-lookup/" + "a".repeat(32) },
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
  vm.runInNewContext(
    SDK_APP_LOOKUP_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    { window: root, document },
  );
  ready();
  ready();
  await new Promise((r) => setImmediate(r));
  script.onload();
  assert.deepEqual(calls, [["1", 4], ["17", 4], ["99999999", 4], ["conjure"]]);
  for (const report of reports) assert.ok(validateDiagnosticReport(report));
  assert.equal(
    reports.filter((r) => r.probe === "sdk-app-absent-info-18").at(-1)
      .responseType,
    "null",
  );
  assert.doesNotMatch(
    JSON.stringify(reports) + output.textContent,
    /PRIVATE_SENTINEL/,
  );
});
