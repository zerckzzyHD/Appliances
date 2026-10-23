import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";
import { createResearchServer } from "../research/isolated-server.mjs";
import {
  HOME_INPUT_PAGE,
  HOME_INPUT_CSP,
} from "../research/home-input-diagnostic.mjs";
import consoleTVPlugin from "../vite-plugin.mjs";

async function fixture(t, enabled = false) {
  let clock = 1000;
  const server = createResearchServer({
    profile: { target: "main", tv: "127.0.0.2", port: 4178 },
    ally: "127.0.0.1",
    homeInputEnabled: enabled,
    now: () => clock,
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  function request(method, path, value, peer = "127.0.0.1", headers = {}) {
    return new Promise((resolve, reject) => {
      const body = value === undefined ? undefined : JSON.stringify(value);
      const req = http.request(
        {
          host: "127.0.0.1",
          port: server.address().port,
          localAddress: peer,
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
            ...headers,
          },
        },
        (res) => {
          let raw = "";
          res.on("data", (chunk) => (raw += chunk));
          res.on("end", () =>
            resolve({ status: res.statusCode, headers: res.headers, raw }),
          );
        },
      );
      req.on("error", reject);
      req.end(body);
    });
  }
  return { request, expire: () => (clock += 60001) };
}
const tv = "127.0.0.2";
async function reserve(f, group = "homeInput") {
  const result = await f.request("POST", "/research/runs", { group });
  assert.equal(result.status, 201);
  return JSON.parse(result.raw);
}
function denied(result, status) {
  assert.equal(result.status, status);
  assert.equal(result.headers["x-frame-options"], "DENY");
  assert.match(
    result.headers["content-security-policy"],
    /frame-ancestors 'none'/,
  );
  assert.doesNotMatch(result.raw, /MIST HOME \/ INPUT ONLY/);
}

test("input group defaults off and rejects nonboolean/bedroom opt-in", async (t) => {
  const f = await fixture(t);
  assert.equal(
    JSON.parse((await f.request("GET", "/health")).raw).homeInput,
    false,
  );
  denied(
    await f.request("POST", "/research/runs", { group: "homeInput" }),
    400,
  );
  for (const homeInputEnabled of [true, "true", 1])
    assert.throws(() =>
      createResearchServer({
        profile: { target: "bedroom", tv, port: 4177 },
        ally: "127.0.0.1",
        homeInputEnabled,
      }),
    );
  const base = { bind: "192.168.4.26", tv: "192.168.4.20" };
  for (const options of [
    { researchHomeInput: true },
    { researchHomeInput: true, researchTargets: ["bedroom"] },
    { researchHomeInput: "true", researchTargets: ["main"] },
    { researchHomeInput: true, researchTargets: "main" },
  ])
    assert.throws(() => consoleTVPlugin({ ...base, ...options }));
  assert.doesNotThrow(() =>
    consoleTVPlugin({
      ...base,
      researchTargets: ["main"],
      researchHomeInput: true,
    }),
  );
});

test("one exact TV-only page shares existing lease lock and keeps strict headers", async (t) => {
  const f = await fixture(t, true);
  assert.equal(
    JSON.parse((await f.request("GET", "/health")).raw).homeInput,
    true,
  );
  denied(
    await f.request("POST", "/research/runs", { group: "homeInput" }, tv),
    403,
  );
  const lease = await reserve(f);
  assert.match(lease.path, /^\/research\/home-input\/[a-f0-9]{32}$/);
  denied(await f.request("GET", lease.path), 403);
  for (const headers of [
    { Host: "localhost:4178" },
    { "X-Forwarded-For": tv },
    { Origin: "null" },
    { Origin: "http://127.0.0.1:4178" },
  ])
    denied(await f.request("GET", lease.path, undefined, tv, headers), 403);
  for (const path of [
    lease.path + "?q=1",
    lease.path + "/",
    lease.path.replace("home-input", "home-coverage"),
  ])
    denied(await f.request("GET", path, undefined, tv), 404);
  denied(await f.request("POST", "/research/runs", { group: "version" }), 409);
  denied(await f.request("POST", lease.path, {}, tv), 404);
  const page = await f.request("GET", lease.path, undefined, tv);
  assert.equal(page.status, 200);
  assert.equal(page.raw, HOME_INPUT_PAGE);
  assert.equal(
    page.headers["content-security-policy"],
    HOME_INPUT_CSP + "; frame-ancestors 'none'",
  );
  assert.equal(page.headers["x-frame-options"], "DENY");
  assert.equal(page.headers["cache-control"], "no-store");
  assert.equal(page.headers["referrer-policy"], "no-referrer");
  denied(await f.request("GET", lease.path, undefined, tv), 404);
  assert.deepEqual(
    JSON.parse((await f.request("GET", "/research/runs/" + lease.run)).raw)
      .reports,
    [],
  );
  denied(
    await f.request(
      "POST",
      "/research/report",
      {
        probe: "sdk-version-10",
        run: lease.run,
        sequence: 0,
        loaded: true,
        ready: true,
        state: "resolved",
        responseType: "string",
        version: "prod 64.37",
      },
      tv,
      { Origin: "http://127.0.0.1:4178" },
    ),
    409,
  );
  assert.equal(
    (await f.request("DELETE", "/research/runs/" + lease.run)).status,
    200,
  );
  denied(await f.request("GET", lease.path, undefined, tv), 404);
  await reserve(f, "version");
});

test("expiry/wrong group cannot deliver input page or allow report upload", async (t) => {
  const f = await fixture(t, true);
  const lease = await reserve(f);
  denied(
    await f.request("POST", "/research/report", {}, tv, {
      Origin: "http://127.0.0.1:4178",
    }),
    400,
  );
  f.expire();
  denied(await f.request("GET", lease.path, undefined, tv), 404);
  const other = await reserve(f, "version");
  denied(
    await f.request(
      "GET",
      other.path.replace("sdk-interfaces", "home-input"),
      undefined,
      tv,
    ),
    404,
  );
  assert.equal((await f.request("GET", other.path, undefined, tv)).status, 200);
});

test("unapproved socket cannot fetch diagnostic", async (t) => {
  const f = await fixture(t, true);
  const lease = await reserve(f);
  await assert.rejects(f.request("GET", lease.path, undefined, "127.0.0.3"));
});
