import { test } from "node:test";
import assert from "node:assert/strict";
import {
  startSDKProbe,
  SDK_BRIDGE_PAGE,
} from "../research/sdk-bridge-probe.mjs";
import { describeNativeInterfaces } from "../src/capabilities.mjs";
import vm from "node:vm";
import { inspectSDKModules } from "../research/sdk-module-metadata.mjs";

test("targeted modules filter after enumeration and never read private accessors", () => {
  let calls = 0;
  const sdk = {};
  for (let i = 0; i < 100; i++) sdk["aa" + i] = "PRIVATE_SENTINEL";
  sdk.registerApp = function () {
    calls++;
  };
  Object.defineProperty(sdk, "activeAppObject", {
    get() {
      calls++;
      throw new Error();
    },
  });
  const report = inspectSDKModules({
    VIZIO: sdk,
    VIZIO_MODULES: { App: { launch() {} } },
  });
  assert.equal(report.find((item) => item.name === "VIZIO").total, 102);
  assert.ok(
    report
      .find((item) => item.name === "VIZIO")
      .members.some((item) => item.name === "registerApp"),
  );
  assert.ok(
    report
      .find((item) => item.name === "VIZIO_MODULES.App")
      .members.some((item) => item.name === "launch"),
  );
  assert.equal(calls, 0);
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE_SENTINEL/);
});

test("native version getter is called once and non-version values are withheld", () => {
  let calls = 0,
    onKey,
    onReady;
  const output = { textContent: "" };
  const root = {
    VIZIO: {
      getConfigVersion(callback) {
        calls++;
        callback("PRIVATE_SENTINEL");
      },
    },
    addEventListener(name, callback) {
      onKey = callback;
    },
    setTimeout() {},
  };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, callback) {
      onReady = callback;
    },
    createElement() {
      return {};
    },
    body: {
      appendChild(script) {
        script.onload();
        assert.equal(calls, 0);
        onReady();
        onReady();
        script.onload();
      },
    },
  };
  startSDKProbe(root, document, inspectSDKModules);
  onKey({ key: "Enter" });
  assert.equal(calls, 1);
  assert.match(
    output.textContent,
    /Version reply type: string; value withheld/,
  );
  assert.doesNotMatch(output.textContent, /PRIVATE_SENTINEL/);
});

test("SDK inspection registers readiness before load and displays metadata without values or method calls", () => {
  let ready,
    calls = 0,
    appended = 0;
  const output = { textContent: "" };
  const root = { addEventListener() {}, setTimeout() {} };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, callback) {
      assert.equal(name, "VIZIO_LIBRARY_DID_LOAD");
      ready = callback;
    },
    createElement(name) {
      assert.equal(name, "script");
      return {};
    },
    body: {
      appendChild(script) {
        appended++;
        assert.equal(typeof ready, "function");
        assert.equal(
          script.src,
          "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js",
        );
        root.VIZIO = {
          launchApp() {
            calls++;
          },
          value: "PRIVATE_SENTINEL",
        };
        ready();
        script.onload();
      },
    },
  };
  startSDKProbe(root, document, describeNativeInterfaces);
  assert.equal(appended, 1);
  assert.equal(calls, 0);
  assert.match(
    output.textContent,
    /SDK script loaded: true; ready event: true/,
  );
  assert.match(output.textContent, /launchApp\(\)/);
  assert.doesNotMatch(output.textContent, /PRIVATE_SENTINEL/);
  new vm.Script(SDK_BRIDGE_PAGE.match(/<script>([\s\S]*?)<\/script>/)[1]);
});
