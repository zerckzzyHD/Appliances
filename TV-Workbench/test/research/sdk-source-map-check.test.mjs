import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SOURCE_MAP_PAGE } from "../../src/research/sdk-source-map-check.mjs";
import { validateDiagnosticReport } from "../../src/research/restricted-diagnostics.mjs";
test("source mapping page reads five fixed sections once, retains controls, and exports no contents", async () => {
  let ready, script;
  const calls = [],
    reports = [],
    output = {};
  const root = {
    location: { pathname: "/research/source-mapping-check/" + "a".repeat(32) },
    VIZIO_MODULES: {
      System: {
        getConfigProperty(key) {
          calls.push(key);
          return Promise.resolve(
            key.startsWith("MistResearchAbsent")
              ? null
              : {
                  get token() {
                    throw Error("Getter read");
                  },
                  value: "PRIVATE_SENTINEL",
                },
          );
        },
      },
    },
    setTimeout() {},
    fetch(path, options) {
      assert.equal(path, "/research/report");
      const report = JSON.parse(options.body);
      assert.ok(validateDiagnosticReport(report));
      reports.push(report);
      return Promise.resolve({ status: 204 });
    },
  };
  const document = {
    getElementById: () => output,
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
  vm.runInNewContext(SOURCE_MAP_PAGE.match(/<script>([\s\S]*)<\/script>/)[1], {
    window: root,
    document,
  });
  ready();
  ready();
  script.onload();
  await new Promise((r) => setImmediate(r));
  assert.deepEqual(calls, [
    "MistResearchAbsentControl20261018",
    "VIZIOApps",
    "ChromiumHtmlAppUris",
    "SmartCastHome",
    "Orchestrator",
  ]);
  const settled = reports.filter((r) => r.state === "resolved");
  assert.equal(settled.length, 5);
  assert.equal(settled[0].responseType, "null");
  assert.equal(settled[1].responseType, "object");
  assert.doesNotMatch(
    JSON.stringify(reports) + output.textContent,
    /PRIVATE_SENTINEL|token|https?:\/\//,
  );
});
