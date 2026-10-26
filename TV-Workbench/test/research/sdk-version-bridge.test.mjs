import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  startSDKVersionCheck,
  SDK_BRIDGE_PAGE,
} from "../../src/research/sdk-version-bridge.mjs";
import { observeSDKCommand } from "../../src/research/sdk-command-outcome.mjs";

function run(method) {
  let ready;
  const output = { textContent: "" };
  const root = {
    VIZIO_MODULES: { System: { getScConfigVersion: method } },
    VIZIO: {
      _debug: {
        launchApiTestApp() {
          throw new Error("must not launch");
        },
      },
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
      },
    },
  };
  startSDKVersionCheck(root, document, observeSDKCommand);
  return { output, ready: () => ready() };
}

test("native version probe reads once after readiness and does not launch debug app", async () => {
  let calls = 0;
  const state = run(() => {
    calls++;
    return Promise.resolve("v64.37");
  });
  assert.equal(calls, 0);
  state.ready();
  state.ready();
  await Promise.resolve();
  assert.equal(calls, 1);
  assert.match(state.output.textContent, /VERSION VALUE: v64.37/);
  assert.doesNotMatch(state.output.textContent, /must not launch/);
  new vm.Script(SDK_BRIDGE_PAGE.match(/<script>([\s\S]*?)<\/script>/)[1]);
});

test("native version result never reads accessors or emits arbitrary payloads", async () => {
  let reads = 0;
  const value = { privateData: "PRIVATE_SENTINEL" };
  Object.defineProperty(value, "version", {
    get() {
      reads++;
      throw new Error();
    },
  });
  const state = run(() => Promise.resolve(value));
  state.ready();
  await Promise.resolve();
  assert.equal(reads, 0);
  assert.doesNotMatch(state.output.textContent, /PRIVATE_SENTINEL/);
  assert.match(
    state.output.textContent,
    /response type: object; value withheld/,
  );
});
