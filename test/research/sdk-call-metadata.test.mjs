import { test } from "node:test";
import assert from "node:assert/strict";
import {
  inspectSDKCalls,
  summarizeVersionArguments,
} from "../../src/research/sdk-call-metadata.mjs";

test("call inspection exposes lexical references without invoking functions or string values", () => {
  let calls = 0;
  function getter(callback) {
    calls++;
    const hidden = "PRIVATE_SENTINEL.secretCall()";
    // PRIVATE_COMMENT.fakeCall()
    return system.getScConfigVersion(callback, hidden);
  }
  const root = { VIZIO: { getConfigVersion: getter } };
  const report = inspectSDKCalls(root);
  assert.equal(calls, 0);
  assert.equal(report[0].type, "function; declared args 1");
  assert.ok(
    report[0].members.some((item) => item.name === "system.getScConfigVersion"),
  );
  assert.doesNotMatch(
    JSON.stringify(report),
    /PRIVATE_SENTINEL|PRIVATE_COMMENT|secretCall|fakeCall/,
  );
});

test("callback metadata handles additional arguments and withholds arbitrary payloads", () => {
  assert.equal(
    summarizeVersionArguments([undefined, "64.37"]),
    "Version callback args: 2 [undefined, string]; version-shaped value: 64.37",
  );
  let calls = 0;
  const object = {
    get version() {
      calls++;
      throw new Error();
    },
    value: "PRIVATE_SENTINEL",
  };
  const output = summarizeVersionArguments([
    undefined,
    object,
    "PRIVATE_SENTINEL",
  ]);
  assert.equal(calls, 0);
  assert.match(output, /3 \[undefined, object, string\]/);
  assert.doesNotMatch(output, /PRIVATE_SENTINEL/);
});
