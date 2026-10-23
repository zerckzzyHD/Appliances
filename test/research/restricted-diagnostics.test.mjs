import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { SDK_BRIDGE_PAGE } from "../../src/research/sdk-version-bridge.mjs";
import {
  safeSDKVersion,
  validateDiagnosticReport,
} from "../../src/research/restricted-diagnostics.mjs";
import {
  collectSDKMethodMetadata,
  createDiagnosticReporter,
} from "../../src/research/diagnostic-browser-report.mjs";

const sample = {
  probe: "sdk-version-10",
  run: "a".repeat(32),
  sequence: 0,
  loaded: true,
  ready: true,
  state: "resolved",
};

test("actual delivered diagnostic script reports only approved resolved metadata", async () => {
  let ready;
  const output = { textContent: "" },
    reports = [];
  const root = {
    location: { pathname: "/research/sdk-interfaces/" + sample.run },
    VIZIO_MODULES: {
      System: {
        getScConfigVersion() {
          return Promise.resolve("PROD v64.37");
        },
      },
    },
    VIZIO: { privateString: "PRIVATE_SENTINEL", launchApp() {} },
    fetch: async (url, options) => {
      reports.push(JSON.parse(options.body));
      return { status: 204 };
    },
  };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, callback) {
      ready = callback;
    },
    createElement() {
      return {};
    },
    body: {
      appendChild(script) {
        script.onload();
        ready();
      },
    },
  };
  vm.runInNewContext(SDK_BRIDGE_PAGE.match(/<script>([\s\S]*?)<\/script>/)[1], {
    window: root,
    document,
  });
  await Promise.resolve();
  await Promise.resolve();
  assert.ok(reports.length >= 3);
  for (const report of reports) assert.ok(validateDiagnosticReport(report));
  const latest = reports.at(-1);
  assert.equal(latest.state, "resolved");
  assert.equal(latest.version, "PROD v64.37");
  assert.doesNotMatch(
    JSON.stringify(reports),
    /PRIVATE_SENTINEL|privateString/,
  );
});

test("diagnostic schema rejects unknown fields, coercions and arbitrary strings", () => {
  assert.equal(safeSDKVersion("PROD v64.37"), "PROD v64.37");
  assert.equal(safeSDKVersion("PRIVATE_SENTINEL"), null);
  assert.equal(
    validateDiagnosticReport({ ...sample, token: "PRIVATE_SENTINEL" }),
    null,
  );
  assert.equal(
    validateDiagnosticReport({ ...sample, run: [sample.run] }),
    null,
  );
  assert.equal(
    validateDiagnosticReport({ ...sample, version: "PRIVATE_SENTINEL" }),
    null,
  );
  assert.equal(
    validateDiagnosticReport({ ...sample, errorCategory: "PRIVATE_SENTINEL" }),
    null,
  );
  assert.equal(
    validateDiagnosticReport({
      ...sample,
      methods: [{ scope: "Account", name: "getUser", type: "function" }],
    }),
    null,
  );
});

test("SDK method collection never reads accessors or includes data values", () => {
  let reads = 0;
  const sdk = { launchApp() {}, arbitraryString: "PRIVATE_SENTINEL" };
  Object.defineProperty(sdk, "getDeviceId", {
    get() {
      reads++;
      throw new Error();
    },
  });
  const methods = collectSDKMethodMetadata({ VIZIO: sdk });
  assert.equal(reads, 0);
  assert.ok(
    methods.some(
      (item) => item.name === "getDeviceId" && item.type === "accessor",
    ),
  );
  assert.doesNotMatch(
    JSON.stringify(methods),
    /PRIVATE_SENTINEL|arbitraryString/,
  );
});

test("browser diagnostic reporter posts credential-free typed snapshots with fresh run and sequence", async () => {
  const calls = [];
  const root = {
    location: { pathname: "/research/sdk-interfaces/" + sample.run },
    fetch: async (url, options) => {
      calls.push({ url, options });
      return { status: 204 };
    },
  };
  const reporter = createDiagnosticReporter(root, () => [
    { scope: "App", name: "launchApp", type: "function" },
  ]);
  reporter.send({
    loaded: true,
    ready: true,
    state: "resolved",
    version: "PROD v64.37",
  });
  reporter.send({ state: "resolved" });
  await Promise.resolve();
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "/research/report");
  assert.equal(calls[0].options.credentials, "omit");
  assert.equal(calls[0].options.redirect, "error");
  for (const call of calls)
    assert.ok(validateDiagnosticReport(JSON.parse(call.options.body)));
  assert.equal(JSON.parse(calls[1].options.body).sequence, 1);
});
