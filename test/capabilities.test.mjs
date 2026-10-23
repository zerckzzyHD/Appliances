import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { describeNativeInterfaces } from "../src/capabilities.mjs";
import { PAGE } from "../src/page.mjs";

test("focused probe inspects constructor prototype descriptors without calls", () => {
  let calls = 0;
  function External() {
    calls++;
  }
  External.prototype.exampleMethod = function () {
    calls++;
  };
  Object.defineProperty(External.prototype, "sensitiveAccessor", {
    get() {
      calls++;
      throw new Error("must not read");
    },
  });
  const report = describeNativeInterfaces({
    External,
    webkitSpeechRecognition() {},
  });
  assert.equal(report.length, 1);
  assert.ok(
    report[0].members.some(
      (item) =>
        item.name === "prototype.exampleMethod" && item.type === "function",
    ),
  );
  assert.ok(
    report[0].members.some(
      (item) =>
        item.name === "prototype.sensitiveAccessor" &&
        item.type === "accessor (not read)",
    ),
  );
  assert.equal(calls, 0);
});

test("native metadata probe does not invoke methods/getters or serialize values", () => {
  let calls = 0;
  const native = {
    method() {
      calls++;
    },
    privateValue: "PRIVATE_SENTINEL",
  };
  Object.defineProperty(native, "getDeviceId", {
    get() {
      calls++;
      throw new Error();
    },
  });
  const root = { VIZIO: native };
  Object.defineProperty(root, "nativeBridge", {
    get() {
      calls++;
      throw new Error();
    },
  });
  const report = describeNativeInterfaces(root);
  assert.equal(calls, 0);
  assert.doesNotMatch(JSON.stringify(report), /PRIVATE_SENTINEL/);
  assert.equal(
    report.find((item) => item.name === "nativeBridge").type,
    "accessor (not read)",
  );
  assert.equal(
    report[0].members.find((item) => item.name === "getDeviceId").type,
    "accessor (not read)",
  );
});

test("delivered diagnostic fragment renders metadata without any summary request", () => {
  const nodes = [];
  const root = {
    location: { hash: "#mist-capabilities" },
    VIZIO: { knownMethod() {} },
    addEventListener() {},
  };
  const script = PAGE.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script, {
    window: root,
    document: {
      createElement() {
        return { style: {}, textContent: "" };
      },
      body: {
        replaceChildren(...children) {
          nodes.push(...children);
        },
      },
    },
    XMLHttpRequest() {
      throw new Error("Unexpected network request");
    },
    setInterval() {
      throw new Error("Unexpected polling");
    },
  });
  assert.equal(nodes[0].textContent, "MIST SOFTWARE PROBE");
  assert.match(nodes[2].textContent, /VIZIO/);
  assert.match(nodes[2].textContent, /knownMethod : function/);
});
