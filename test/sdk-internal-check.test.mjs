import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_INTERNAL_PAGE } from "../research/sdk-internal-check.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
function run(factory) {
  let ready, script;
  const reports = [],
    output = {};
  const root = {
    VIZIO_MODULES: { _docker: factory },
    location: { pathname: "/research/sdk-internal-check/" + "a".repeat(32) },
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
    SDK_INTERNAL_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    { window: root, document },
  );
  ready();
  ready();
  script.onload();
  for (const report of reports) assert.ok(validateDiagnosticReport(report));
  return { reports, output };
}
test("internal check refuses to invoke a factory containing any call", () => {
  let calls = 0;
  const result = run(() => {
    calls++;
    throw new Error("PRIVATE_SENTINEL");
  });
  assert.equal(calls, 0);
  assert.equal(result.reports.at(-1).state, "unavailable");
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
});
test("pure getter exposes methods only, never getters or returned data values", () => {
  const container = {
    method() {
      throw new Error("Do not call");
    },
    secret: "PRIVATE_SENTINEL",
  };
  Object.defineProperty(container, "token", {
    get() {
      throw new Error("Do not read");
    },
  });
  const result = run(() => container);
  const last = result.reports.at(-1);
  assert.equal(last.state, "resolved");
  assert.equal(last.responseType, "object");
  assert.ok(last.methods.some((m) => m.name === "method"));
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL|token|secret/);
});
