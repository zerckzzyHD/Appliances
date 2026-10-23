import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { createResearchServer } from "../research/isolated-server.mjs";
import consoleTVPlugin from "../vite-plugin.mjs";
async function fixture(t, enabled = true) {
  let clock = 1000;
  const server = createResearchServer({
    profile: { target: "main", tv: "127.0.0.2", port: 4178 },
    ally: "127.0.0.1",
    dashcastMarkerEnabled: enabled,
    now: () => clock,
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const request = (method, path, value, tv = false, extra = {}) =>
    new Promise((resolve, reject) => {
      const body = value === undefined ? undefined : JSON.stringify(value);
      const req = http.request(
        {
          host: "127.0.0.1",
          port: server.address().port,
          localAddress: tv ? "127.0.0.2" : "127.0.0.1",
          method,
          path,
          headers: {
            Host: "127.0.0.1:4178",
            ...(body
              ? {
                  "Content-Type": "application/json",
                  "Content-Length": Buffer.byteLength(body),
                }
              : {}),
            ...extra,
          },
        },
        (res) => {
          let raw = "";
          res.on("data", (c) => (raw += c));
          res.on("end", () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              raw,
              value:
                res.headers["content-type"]?.includes("application/json") && raw
                  ? JSON.parse(raw)
                  : null,
            }),
          );
        },
      );
      req.on("error", reject);
      req.end(body);
    });
  return {
    request,
    start: async (group) =>
      (await request("POST", "/research/runs", { group })).value,
    advance: () => (clock += 60001),
  };
}
function denied(r, status) {
  assert.equal(r.status, status);
  assert.equal(r.headers["x-frame-options"], "DENY");
  assert.match(r.headers["content-security-policy"], /frame-ancestors 'none'/);
}
test("marker is main-only, boolean and default-disabled", async (t) => {
  const f = await fixture(t, false);
  assert.equal((await f.request("GET", "/health")).value.dashcastMarker, false);
  denied(
    await f.request("POST", "/research/runs", { group: "dashcastMarker" }),
    400,
  );
  for (const flag of [true, "true", 1])
    assert.throws(() =>
      createResearchServer({
        profile: { target: "bedroom", tv: "127.0.0.2", port: 4177 },
        ally: "127.0.0.1",
        dashcastMarkerEnabled: flag,
      }),
    );
  for (const researchDashcastMarker of [true, "true", 1])
    assert.throws(() =>
      consoleTVPlugin({
        bind: "192.168.4.26",
        tv: "192.168.4.20",
        researchDashcastMarker,
      }),
    );
});
test("only exact admitted TV fixture is embeddable and owns the shared lock", async (t) => {
  const f = await fixture(t);
  const lease = await f.start("dashcastMarker");
  const url = lease.path;
  assert.match(url, /^\/research\/dashcast-marker\/[a-f0-9]{32}$/);
  denied(await f.request("GET", url), 403);
  denied(
    await f.request("GET", url, undefined, true, { Host: "localhost:4178" }),
    403,
  );
  denied(
    await f.request("GET", url, undefined, true, {
      "X-Forwarded-For": "127.0.0.2",
    }),
    403,
  );
  for (const path of [
    url + "?x=1",
    url + "/",
    url.replace("dashcast-marker", "sdk-interfaces"),
  ])
    denied(await f.request("GET", path, undefined, true), 404);
  const before = await f.request("GET", "/research/runs/" + lease.run);
  assert.deepEqual(before.value.marker, {
    responsesIssued: 0,
    lastRejection: "none",
  });
  assert.equal(before.headers["x-frame-options"], "DENY");
  const page = await f.request("GET", url, undefined, true);
  assert.equal(page.status, 200);
  assert.match(page.raw, /<h1>MIST DASHCAST CONTROL<\/h1>/);
  assert.equal(page.headers["x-frame-options"], undefined);
  assert.doesNotMatch(
    page.headers["content-security-policy"],
    /frame-ancestors/,
  );
  assert.match(page.headers["content-security-policy"], /script-src 'none'/);
  assert.equal(
    (await f.request("GET", "/research/runs/" + lease.run)).value.marker
      .responsesIssued,
    1,
  );
  denied(await f.request("POST", "/research/runs", { group: "version" }), 409);
  denied(
    await f.request(
      "GET",
      "/research/dependency-parser/" + lease.run,
      undefined,
      true,
    ),
    404,
  );
  await f.request("DELETE", "/research/runs/" + lease.run);
  denied(await f.request("GET", url, undefined, true), 404);
});
test("Origin and method refusals serve nothing; third valid GET is refused", async (t) => {
  const f = await fixture(t);
  const lease = await f.start("dashcastMarker");
  denied(
    await f.request("GET", lease.path, undefined, true, {
      Origin: "http://127.0.0.1:4178",
    }),
    403,
  );
  assert.deepEqual(
    (await f.request("GET", "/research/runs/" + lease.run)).value.marker,
    { responsesIssued: 0, lastRejection: "origin_present" },
  );
  denied(await f.request("HEAD", lease.path, undefined, true), 405);
  assert.equal(
    (await f.request("GET", lease.path, undefined, true)).status,
    200,
  );
  assert.equal(
    (await f.request("GET", lease.path, undefined, true)).status,
    200,
  );
  denied(await f.request("GET", lease.path, undefined, true), 409);
  assert.deepEqual(
    (await f.request("GET", "/research/runs/" + lease.run)).value.marker,
    { responsesIssued: 2, lastRejection: "request_limit" },
  );
});
test("wrong group, expiry and release cannot expose marker; GET does not extend lease", async (t) => {
  const f = await fixture(t);
  const wrong = await f.start("version");
  denied(
    await f.request(
      "GET",
      "/research/dashcast-marker/" + wrong.run,
      undefined,
      true,
    ),
    404,
  );
  await f.request("DELETE", "/research/runs/" + wrong.run);
  const lease = await f.start("dashcastMarker");
  assert.equal(
    (await f.request("GET", lease.path, undefined, true)).status,
    200,
  );
  f.advance();
  denied(await f.request("GET", lease.path, undefined, true), 404);
  denied(await f.request("GET", "/research/runs/" + lease.run), 404);
});
