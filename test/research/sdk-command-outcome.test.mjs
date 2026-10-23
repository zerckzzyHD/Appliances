import { test } from "node:test";
import assert from "node:assert/strict";
import { observeSDKCommand } from "../../src/research/sdk-command-outcome.mjs";

test("returned cold operation subscribes once and omits emitted values", () => {
  let calls = 0;
  const messages = [];
  observeSDKCommand(
    {
      subscribe(observer) {
        calls++;
        observer.next({ secret: "PRIVATE_SENTINEL" });
        observer.complete();
      },
    },
    (message) => messages.push(message),
  );
  assert.equal(calls, 1);
  assert.match(messages.join("\n"), /subscribing once/);
  assert.match(messages.join("\n"), /Observable completed/);
  assert.doesNotMatch(messages.join("\n"), /PRIVATE_SENTINEL/);
});

test("promise rejection produces fixed category without exposing error contents", async () => {
  const messages = [];
  observeSDKCommand(
    Promise.reject(new Error("API unsupported PRIVATE_SENTINEL")),
    (message) => messages.push(message),
  );
  await Promise.resolve();
  assert.match(messages.join("\n"), /unsupported\/unavailable/);
  assert.doesNotMatch(messages.join("\n"), /PRIVATE_SENTINEL/);
});

test("return-interface detection does not invoke getters or retry", () => {
  let reads = 0;
  const messages = [];
  const value = {};
  Object.defineProperty(value, "subscribe", {
    get() {
      reads++;
      throw new Error();
    },
  });
  Object.defineProperty(value, "then", {
    get() {
      reads++;
      throw new Error();
    },
  });
  observeSDKCommand(value, (message) => messages.push(message));
  assert.equal(reads, 0);
  assert.match(messages.join("\n"), /no data-method/);
});

test("structured rejection reports bounded error code and field types without getters or text", () => {
  const messages = [];
  let reads = 0;
  const error = {
    code: -32601,
    error: { reason: "METHOD_NOT_FOUND PRIVATE_SENTINEL" },
  };
  Object.defineProperty(error, "message", {
    get() {
      reads++;
      throw new Error();
    },
  });
  observeSDKCommand(
    {
      then(resolve, reject) {
        reject(error);
      },
    },
    (message) => messages.push(message),
  );
  assert.equal(reads, 0);
  assert.match(messages.join("\n"), /code=-32601/);
  assert.match(messages.join("\n"), /method\/argument unavailable/);
  assert.doesNotMatch(messages.join("\n"), /PRIVATE_SENTINEL|METHOD_NOT_FOUND/);
});
