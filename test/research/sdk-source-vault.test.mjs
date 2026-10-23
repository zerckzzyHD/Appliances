import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createSDKSourceVault,
  SDK_SOURCE_PAGE,
  SDK_SOURCE_CSP,
} from "../../src/research/sdk-source-vault.mjs";
test("source vault enforces bounds, one capture, independent buffer, and expiry", async () => {
  const vault = createSDKSourceVault(20);
  assert.equal(vault.accept(Buffer.alloc(10)), false);
  const bytes = Buffer.alloc(2048, 65);
  assert.equal(vault.accept(bytes), true);
  bytes.fill(0);
  assert.equal(vault.read()[0], 65);
  assert.equal(vault.accept(Buffer.alloc(2048)), false);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(vault.read(), null);
  assert.equal(vault.status().available, false);
});
test("capture document has only fixed fetch and bounded upload, no SDK execution", () => {
  assert.match(SDK_SOURCE_PAGE, /credentials: "omit"/);
  assert.match(SDK_SOURCE_PAGE, /redirect: "error"/);
  assert.match(SDK_SOURCE_PAGE, /1048576/);
  assert.doesNotMatch(SDK_SOURCE_PAGE, /<script src|eval\(|new Function/);
  assert.match(SDK_SOURCE_CSP, /connect-src 'self' http:\/\/localhost:12345/);
});
