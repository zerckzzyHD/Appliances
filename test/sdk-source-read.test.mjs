import { test } from "node:test";
import assert from "node:assert/strict";
import { readSDKText } from "../research/sdk-source-read.mjs";

function runtime(fetch) {
  return {
    Request,
    AbortController,
    TextDecoder,
    fetch,
    setTimeout,
    clearTimeout,
  };
}

test("SDK text read uses one credential-free CORS request without evaluating source", async () => {
  let calls = 0,
    output;
  await readSDKText(
    runtime(async (request) => {
      calls++;
      assert.equal(
        request.url,
        "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js",
      );
      assert.equal(request.method, "GET");
      assert.equal(request.mode, "cors");
      assert.equal(request.credentials, "omit");
      assert.equal(request.redirect, "error");
      assert.equal(request.referrerPolicy, "no-referrer");
      assert.equal(request.headers.has("authorization"), false);
      return new Response(
        'throw new Error("MUST_NOT_EXECUTE"); function MetadataOnly(){}; const secret="PRIVATE_SENTINEL";',
      );
    }),
    (value) => {
      output = value;
    },
  );
  assert.equal(calls, 1);
  assert.match(output, /TEXT READ: HTTP 200/);
  assert.match(output, /MetadataOnly/);
  assert.doesNotMatch(output, /PRIVATE_SENTINEL|MUST_NOT_EXECUTE/);
});

test("SDK text read stops before fetch when redirect safety is unavailable", async () => {
  let calls = 0,
    output;
  const root = runtime(() => {
    calls++;
  });
  root.Request = class {
    constructor() {
      this.redirect = "follow";
    }
  };
  await readSDKText(root, (value) => {
    output = value;
  });
  assert.equal(calls, 0);
  assert.match(output, /NOT ATTEMPTED/);
});

test("SDK text read aborts when response exceeds its byte ceiling", async () => {
  let signal, output;
  await readSDKText(
    runtime(async (request) => {
      signal = request.signal;
      return new Response(new Uint8Array(1048577));
    }),
    (value) => {
      output = value;
    },
  );
  assert.equal(signal.aborted, true);
  assert.match(output, /ceiling exceeded/);
});

test("SDK text read does not retry a blocked request or disclose exception text", async () => {
  let calls = 0,
    output;
  await readSDKText(
    runtime(async () => {
      calls++;
      throw new Error("PRIVATE_SENTINEL");
    }),
    (value) => {
      output = value;
    },
  );
  assert.equal(calls, 1);
  assert.match(output, /does not establish whether the local file exists/);
  assert.doesNotMatch(output, /PRIVATE_SENTINEL/);
});
