import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createTVServer, permitsPeer } from "../src/server.mjs";

const fixture = {
  meta: { generatedAt: "2026-10-17T17:00:00Z", stateDir: "PRIVATE_SENTINEL" },
  summary: {
    verdict: "ATTENTION",
    total: 2,
    counts: { PASS: 1, FAIL: 1, UNOBSERVABLE: 0 },
    reason: "PRIVATE_SENTINEL",
  },
  supervisor: { lastTickAge: { ms: 60000 }, stale: true },
  checks: ["PRIVATE_SENTINEL"],
  sources: ["PRIVATE_SENTINEL"],
};
const LAN_HOST = "192.168.4.26",
  TV_PEER = "192.168.4.20";
const authority = LAN_HOST + ":4176";
async function start(
  t,
  readProjection = async () => fixture,
  peers = new Set(["127.0.0.1"]),
  tvPeer = "127.0.0.1",
) {
  const server = createTVServer({
    readProjection,
    peers,
    authority,
    tvPeer,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return server.address().port;
}
function request(port, path = "/", options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path,
        method: options.method || "GET",
        headers: { Host: authority, ...options.headers },
        timeout: 3000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString(),
          }),
        );
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("request timeout")));
    req.end(options.body);
  });
}

test("temporary SDK interface route keeps normal policy and retires the text-read route", async (t) => {
  let calls = 0;
  const port = await start(t, async () => {
    calls++;
    return fixture;
  });
  const diagnostic = await request(port, "/research/sdk-interfaces");
  assert.equal(diagnostic.status, 200);
  assert.match(
    diagnostic.headers["content-security-policy"],
    /script-src 'unsafe-inline' http:\/\/localhost:12345\/scfs\/cl\/js\/vizio-companion-lib.js;/,
  );
  assert.match(diagnostic.body, /MIST SDK DIAGNOSTIC CHANNEL \/ 10/);
  const fresh = await request(
    port,
    "/research/sdk-interfaces/" + "a".repeat(32),
  );
  assert.equal(fresh.status, 200);
  assert.equal(fresh.body, diagnostic.body);
  assert.equal(
    (await request(port, "/research/sdk-interfaces/arbitrary")).status,
    404,
  );
  const normal = await request(port);
  assert.match(
    normal.headers["content-security-policy"],
    /connect-src 'self';/,
  );
  assert.doesNotMatch(
    normal.headers["content-security-policy"],
    /localhost:12345/,
  );
  assert.equal(
    (await request(port, "/research/sdk-interfaces?other=1")).status,
    404,
  );
  assert.equal(
    (await request(port, "/research/sdk-interfaces", { method: "POST" }))
      .status,
    405,
  );
  assert.equal(
    (
      await request(port, "/research/sdk-interfaces", {
        headers: { Host: "wrong" },
      })
    ).status,
    403,
  );
  assert.equal((await request(port, "/research/sdk-source-read")).status, 404);
  assert.match(
    diagnostic.headers["content-security-policy"],
    /connect-src 'self' http:\/\/127\.0\.0\.1:7346;/,
  );
  assert.doesNotMatch(
    normal.headers["content-security-policy"],
    /127\.0\.0\.1:7346/,
  );
  assert.equal(calls, 0);
});

test("approved diagnostic channel accepts only validated TV-origin reports and retains newest sequence", async (t) => {
  let reads = 0;
  const port = await start(t, async () => {
    reads++;
    return fixture;
  });
  assert.equal(
    JSON.parse((await request(port, "/research/report")).body).available,
    false,
  );
  const payload = {
    probe: "sdk-version-10",
    run: "a".repeat(32),
    sequence: 2,
    loaded: true,
    ready: true,
    state: "resolved",
    responseType: "string",
    version: "PROD v64.37",
    methods: [{ scope: "App", name: "launchApp", type: "function" }],
  };
  async function post(value, headers = {}) {
    const body = JSON.stringify(value);
    return request(port, "/research/report", {
      method: "POST",
      body,
      headers: {
        Origin: "http://" + authority,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
        ...headers,
      },
    });
  }
  assert.equal((await post(payload)).status, 204);
  assert.equal(
    (await post({ ...payload, sequence: 1, version: "TEST v1.0" })).status,
    204,
  );
  const result = JSON.parse((await request(port, "/research/report")).body);
  assert.equal(result.available, true);
  assert.equal(result.report.version, "PROD v64.37");
  assert.equal(result.report.sequence, 2);
  assert.equal(
    (await post({ ...payload, rawSDK: "PRIVATE_SENTINEL" })).status,
    400,
  );
  assert.equal(
    (await post({ ...payload, version: "PRIVATE_SENTINEL" })).status,
    400,
  );
  assert.equal(
    (await post(payload, { Origin: "http://wrong.invalid" })).status,
    403,
  );
  assert.equal(
    (await post(payload, { "Content-Type": "text/plain" })).status,
    415,
  );
  assert.equal(
    (await post({ ...payload, rawSDK: "x".repeat(32768) })).status,
    413,
  );
  assert.equal(reads, 0);
  assert.doesNotMatch(
    (await request(port, "/research/report")).body,
    /PRIVATE_SENTINEL/,
  );
});

test("Ally socket cannot impersonate TV when posting diagnostics", async (t) => {
  const port = await start(
    t,
    async () => fixture,
    new Set(["127.0.0.1"]),
    "127.0.0.2",
  );
  assert.equal(
    (
      await request(port, "/research/report", {
        method: "POST",
        headers: { Origin: "http://" + authority },
      })
    ).status,
    403,
  );
});

test("production peer allowlist excludes WAN, tailnet, router and loopback", () => {
  const peers = new Set([LAN_HOST, TV_PEER]);
  for (const peer of [LAN_HOST, TV_PEER, "::ffff:" + TV_PEER])
    assert.equal(permitsPeer(peer, peers), true);
  for (const peer of [
    "8.8.8.8",
    "100.64.0.1",
    "192.168.4.1",
    "127.0.0.1",
    "::1",
    undefined,
  ])
    assert.equal(permitsPeer(peer, peers), false);
});
test("disallowed socket cannot read content or invoke the upstream", async (t) => {
  let calls = 0;
  const port = await start(
    t,
    async () => {
      calls++;
      return fixture;
    },
    new Set(["192.0.2.1"]),
  );
  await assert.rejects(request(port, "/summary.json"));
  assert.equal(calls, 0);
});
test("HTML and health do not query live projection", async (t) => {
  let calls = 0;
  const port = await start(t, async () => {
    calls++;
    return fixture;
  });
  const page = await request(port);
  assert.equal(page.status, 200);
  assert.match(page.body, /MIST CONSOLE/);
  assert.doesNotMatch(page.body, /PRIVATE_SENTINEL/);
  assert.equal((await request(port, "/health")).status, 200);
  assert.equal(calls, 0);
});
test("summary returns only approved fields with no cache or CORS allowance", async (t) => {
  const port = await start(t);
  const response = await request(port, "/summary.json");
  assert.equal(response.status, 200);
  assert.doesNotMatch(response.body, /PRIVATE_SENTINEL/);
  assert.equal(JSON.parse(response.body).summary.total, 2);
  assert.equal(JSON.parse(response.body).freshness.sourceStale, true);
  assert.match(response.headers["cache-control"], /no-store/);
  assert.equal(response.headers["access-control-allow-origin"], undefined);
  assert.match(
    response.headers["content-security-policy"],
    /frame-ancestors 'none'/,
  );
});
test("private paths, absolute URLs, query injection and writes cannot reach upstream", async (t) => {
  let calls = 0;
  const port = await start(t, async () => {
    calls++;
    return fixture;
  });
  for (const path of [
    "/reports",
    "/queue",
    "/view.json",
    "/../",
    "/summary.json?url=http://example.invalid",
    "http://example.invalid/summary.json",
  ]) {
    assert.equal((await request(port, path)).status, 404);
  }
  assert.equal(
    (await request(port, "/summary.json", { method: "POST" })).status,
    405,
  );
  assert.equal(calls, 0);
});
test("wrong Host and forwarded identity cannot authorize a request", async (t) => {
  let calls = 0;
  const port = await start(t, async () => {
    calls++;
    return fixture;
  });
  for (const headers of [
    { Host: "outside.example" },
    { "X-Forwarded-For": TV_PEER },
    { Forwarded: "for=" + TV_PEER },
    { Via: "proxy" },
  ]) {
    assert.equal(
      (await request(port, "/summary.json", { headers })).status,
      403,
    );
  }
  assert.equal(calls, 0);
});
test("upstream failure and invalid schema return unavailable without error details", async (t) => {
  const failed = await start(t, async () => {
    throw new Error("PRIVATE_SENTINEL");
  });
  const invalid = await start(t, async () => ({
    summary: { verdict: "GREEN", total: 42 },
  }));
  for (const port of [failed, invalid]) {
    const response = await request(port, "/summary.json");
    assert.equal(response.status, 503);
    assert.deepEqual(JSON.parse(response.body), {
      availability: "UNAVAILABLE",
    });
  }
});
test("concurrent summary requests share one in-flight projection read", async (t) => {
  let calls = 0;
  let release;
  const ready = new Promise((resolve) => {
    release = resolve;
  });
  const port = await start(t, async () => {
    calls++;
    await ready;
    return fixture;
  });
  const requests = [
    request(port, "/summary.json"),
    request(port, "/summary.json"),
  ];
  await new Promise((resolve) => setTimeout(resolve, 30));
  release();
  for (const response of await Promise.all(requests))
    assert.equal(response.status, 200);
  assert.equal(calls, 1);
});

test("unique client documents serve only the fixed page and reject arbitrary routes", async (t) => {
  let calls = 0;
  const port = await start(t, async () => {
    calls++;
    return fixture;
  });
  assert.equal(
    (await request(port, "/client/0123456789abcdef0123456789abcdef")).status,
    200,
  );
  for (const route of [
    "/client/private",
    "/client/0123456789abcdef0123456789abcdef?url=anything",
    "/client/../../reports",
  ])
    assert.equal((await request(port, route)).status, 404);
  assert.equal(calls, 0);
});
test("health records the TV UI marker only after the expected script requests summary", async (t) => {
  const port = await start(t);
  assert.equal(
    JSON.parse((await request(port, "/health")).body).tvLocalTimeUISeen,
    false,
  );
  await request(port, "/summary.json");
  assert.equal(
    JSON.parse((await request(port, "/health")).body).tvLocalTimeUISeen,
    false,
  );
  await request(port, "/summary.json", {
    headers: { "X-Mist-TV-UI": "local-time-1" },
  });
  assert.equal(
    JSON.parse((await request(port, "/health")).body).tvLocalTimeUISeen,
    true,
  );
});

test("completed SDK capture routes are retired", async (t) => {
  const port = await start(t);
  for (const path of [
    "/research/sdk-source-once",
    "/research/sdk-source-status",
    "/research/sdk-source-capture/" + "a".repeat(32),
  ])
    assert.equal((await request(port, path)).status, 404);
  assert.equal(
    (await request(port, "/research/sdk-source-once", { method: "POST" }))
      .status,
    405,
  );
});

test("batch diagnostic readback retains each fixed probe without querying Console", async (t) => {
  const port = await start(t, async () => {
    throw new Error("Must not read projection");
  });
  for (const [i, probe] of [
    "sdk-config-vizioapps-14",
    "sdk-app-sctv-14",
  ].entries()) {
    const body = JSON.stringify({
      probe,
      run: "a".repeat(32),
      sequence: i,
      loaded: true,
      ready: true,
      state: "resolved",
      responseType: "object",
    });
    assert.equal(
      (
        await request(port, "/research/report", {
          method: "POST",
          headers: {
            Origin: "http://" + authority,
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
          },
          body,
        })
      ).status,
      204,
    );
  }
  const result = JSON.parse((await request(port, "/research/reports")).body);
  assert.equal(result.reports.length, 2);
  assert.deepEqual(
    result.reports.map((r) => r.report.probe),
    ["sdk-config-vizioapps-14", "sdk-app-sctv-14"],
  );
});

test("catalog structure POST validates privacy schema before retaining metadata", async (t) => {
  const { projectCatalogShape, CATALOG_FIELDS } =
    await import("../research/catalog-shape.mjs");
  const port = await start(t, async () => {
    throw new Error("No projection read");
  });
  const report = {
    run: "a".repeat(32),
    target: "vizioapps",
    shape: projectCatalogShape({ APP_ID: "PRIVATE_SENTINEL" }, CATALOG_FIELDS),
  };
  async function post(value) {
    const body = JSON.stringify(value);
    return request(port, "/research/catalog-shape-report", {
      method: "POST",
      headers: {
        Origin: "http://" + authority,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
      body,
    });
  }
  assert.equal(
    (await post({ ...report, raw: "PRIVATE_SENTINEL" })).status,
    400,
  );
  assert.equal((await post(report)).status, 204);
  const result = await request(port, "/research/catalog-shape-report");
  assert.equal(JSON.parse(result.body).reports.length, 1);
  assert.doesNotMatch(result.body, /PRIVATE_SENTINEL/);
});
