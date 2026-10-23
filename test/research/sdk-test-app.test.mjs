import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  startSDKTestApp,
  SDK_BRIDGE_PAGE,
} from "../../src/research/sdk-test-app.mjs";
import { observeSDKCommand } from "../../src/research/sdk-command-outcome.mjs";

function run(method, observe = null) {
  let ready;
  const listeners = {};
  const output = { textContent: "" };
  const debug = {};
  if (method) debug.launchApiTestApp = method;
  const root = { VIZIO: { _debug: debug }, setTimeout() {} };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, callback) {
      listeners[name] = callback;
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
  startSDKTestApp(root, document, observe);
  return {
    output,
    ready: () => ready(),
    debug,
    policy: (event) => listeners.securitypolicyviolation(event),
  };
}

test("policy diagnostics show only loopback origins without paths or credentials", () => {
  const state = run();
  state.policy({
    effectiveDirective: "connect-src",
    blockedURI: "http://127.0.0.1:7346/private?token=PRIVATE_SENTINEL",
  });
  assert.match(
    state.output.textContent,
    /Policy blocked connect-src: http:\/\/127.0.0.1:7346/,
  );
  assert.doesNotMatch(state.output.textContent, /PRIVATE_SENTINEL|\/private/);
  state.policy({
    effectiveDirective: "connect-src",
    blockedURI: "https://private.invalid/path",
  });
  assert.doesNotMatch(state.output.textContent, /private.invalid/);
});

test("delivered command path invokes and subscribes only once across ready events", () => {
  let invokes = 0,
    subscriptions = 0;
  const state = run(() => {
    invokes++;
    return {
      subscribe(observer) {
        subscriptions++;
        observer.complete();
      },
    };
  }, observeSDKCommand);
  state.ready();
  state.ready();
  assert.equal(invokes, 1);
  assert.equal(subscriptions, 1);
  assert.match(state.output.textContent, /Observable completed/);
});

test("native test app waits for readiness and calls the fixed method once with zero arguments", () => {
  let calls = 0,
    receiver;
  const state = run(function () {
    calls++;
    receiver = this;
    assert.equal(arguments.length, 0);
    return { value: "PRIVATE_SENTINEL" };
  });
  assert.equal(calls, 0);
  state.ready();
  state.ready();
  assert.equal(calls, 1);
  assert.equal(receiver, state.debug);
  assert.match(state.output.textContent, /called once. Return type: object/);
  assert.doesNotMatch(state.output.textContent, /PRIVATE_SENTINEL/);
  new vm.Script(SDK_BRIDGE_PAGE.match(/<script>([\s\S]*?)<\/script>/)[1]);
});

test("failed or unavailable native test-app calls do not retry or disclose errors", () => {
  let calls = 0;
  const state = run(() => {
    calls++;
    throw new Error("PRIVATE_SENTINEL");
  });
  state.ready();
  state.ready();
  assert.equal(calls, 1);
  assert.match(state.output.textContent, /threw/);
  assert.doesNotMatch(state.output.textContent, /PRIVATE_SENTINEL/);
  const missing = run();
  missing.ready();
  assert.match(missing.output.textContent, /unavailable; no call made/);
});
