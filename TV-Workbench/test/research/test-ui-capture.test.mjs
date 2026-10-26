import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { Readable } from "node:stream";
import {
  createTestUICapture,
  TEST_UI_CAPTURE_PAGE,
} from "../../src/research/test-ui-capture.mjs";
test("test UI capture bounds upload, enforces peers, retains once and releases", async () => {
  const capture = createTestUICapture({
    authority: "192.168.4.26:4176",
    tvPeer: "192.168.4.20",
    allyPeer: "192.168.4.26",
  });
  const body = Buffer.alloc(2048, 65);
  let result;
  async function call(method, peer, headers = {}, payload = null) {
    const req = Readable.from(payload ? [payload] : []);
    Object.assign(req, {
      method,
      url: "/research/sdk-source-once",
      socket: { remoteAddress: peer },
      headers,
    });
    await capture.handle(
      req,
      (status, type, data) => {
        result = { status, type, data };
      },
      {},
    );
    return result;
  }
  const headers = {
    origin: "http://192.168.4.26:4176",
    "content-type": "text/html",
    "content-length": 2048,
  };
  assert.equal(
    (await call("POST", "192.168.4.26", headers, Buffer.from(body))).status,
    403,
  );
  assert.equal(
    (
      await call(
        "POST",
        "192.168.4.20",
        { ...headers, origin: "wrong" },
        Buffer.from(body),
      )
    ).status,
    403,
  );
  assert.equal(
    (await call("POST", "192.168.4.20", headers, Buffer.from(body))).status,
    204,
  );
  assert.equal((await call("GET", "192.168.4.20")).status, 403);
  assert.equal((await call("GET", "192.168.4.26")).data.length, 2048);
  assert.equal(
    (await call("POST", "192.168.4.20", headers, Buffer.from(body))).status,
    409,
  );
  assert.equal((await call("DELETE", "192.168.4.26")).status, 204);
  assert.equal((await call("GET", "192.168.4.26")).status, 410);
  capture.dispose();
});
test("delivered capture fetches only fixed HTML and uploads bytes without rendering or linked fetches", async () => {
  const output = {},
    calls = [];
  let resolve;
  const done = new Promise((r) => (resolve = r));
  const root = {
    Request,
    AbortController,
    setTimeout,
    clearTimeout,
    async fetch(input, options) {
      calls.push([input, options]);
      if (calls.length === 1) {
        assert.equal(
          input.url,
          "http://127.0.0.1:12345/scfs/cl/js/apiTestApp.html",
        );
        assert.equal(input.credentials, "omit");
        assert.equal(input.redirect, "error");
        return new Response(
          "<script>throw new Error('must never execute')</script>".repeat(40),
        );
      }
      assert.equal(input, "/research/sdk-source-once");
      assert.equal(options.headers["Content-Type"], "text/html");
      resolve();
      return new Response(null, { status: 204 });
    },
  };
  vm.runInNewContext(
    TEST_UI_CAPTURE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    {
      window: root,
      document: {
        getElementById() {
          return output;
        },
      },
      Uint8Array,
    },
  );
  await done;
  await new Promise((r) => setImmediate(r));
  assert.equal(calls.length, 2);
  assert.match(output.textContent, /HTTP 204/);
});
