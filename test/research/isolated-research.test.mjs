import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createResearchServer } from "../../src/research/isolated-server.mjs";
import { researchProfile } from "../../src/research/target-profiles.mjs";
import consoleTVPlugin, {
  bindToConsole,
} from "../../src/hosting/vite-plugin.mjs";
import { once } from "node:events";
import { emptyDocumentReport } from "../../src/research/home-document-contract.mjs";
import { emptyDependenciesReport } from "../../src/research/home-dependencies-contract.mjs";

async function fixture(
  t,
  target = "bedroom",
  documentEnabled = false,
  dependenciesEnabled = false,
) {
  let clock = 1000;
  const profile = { target, tv: "127.0.0.2", port: 4177 };
  const server = createResearchServer({
    profile,
    ally: "127.0.0.1",
    now: () => clock,
    documentEnabled,
    dependenciesEnabled,
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const request = (
    method,
    path,
    value,
    { tv = false, headers = {}, source } = {},
  ) =>
    new Promise((resolve, reject) => {
      const body = value === undefined ? undefined : JSON.stringify(value);
      const req = http.request(
        {
          host: "127.0.0.1",
          port: server.address().port,
          localAddress: source || (tv ? "127.0.0.2" : "127.0.0.1"),
          method,
          path,
          headers: {
            Host: "127.0.0.1:4177",
            ...(body
              ? {
                  "Content-Type": "application/json",
                  "Content-Length": Buffer.byteLength(body),
                }
              : {}),
            ...(tv ? { Origin: "http://127.0.0.1:4177" } : {}),
            ...headers,
          },
        },
        (res) => {
          let raw = "";
          res.on("data", (c) => {
            raw += c;
          });
          res.on("end", () =>
            resolve({
              status: res.statusCode,
              raw,
              value:
                res.headers["content-type"].includes("application/json") && raw
                  ? JSON.parse(raw)
                  : null,
              headers: res.headers,
            }),
          );
        },
      );
      req.on("error", reject);
      req.end(body);
    });
  const start = async () =>
    (await request("POST", "/research/runs", { group: "version" })).value;
  return {
    request,
    start,
    server,
    advance: (ms) => {
      clock += ms;
    },
  };
}

test("document group is disabled by default and can only opt into main; fixed parser shares its lease", async (t) => {
  const disabled = await fixture(t, "main");
  assert.equal(
    (await disabled.request("GET", "/health")).value.document24,
    false,
  );
  assert.equal(
    (
      await disabled.request("POST", "/research/runs", {
        group: "homeDocument",
      })
    ).status,
    400,
  );
  assert.throws(() =>
    createResearchServer({
      profile: { target: "bedroom", tv: "127.0.0.2", port: 4177 },
      ally: "127.0.0.1",
      documentEnabled: true,
    }),
  );
  const f = await fixture(t, "main", true);
  const lease = (
    await f.request("POST", "/research/runs", { group: "homeDocument" })
  ).value;
  const path = "/research/document-parser/" + lease.run;
  assert.equal((await f.request("GET", "/health")).value.document24, true);
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal((await f.request("GET", lease.path)).status, 403);
  const page = await f.request("GET", lease.path, undefined, { tv: true });
  assert.equal(page.status, 200);
  assert.match(page.headers["content-security-policy"], /worker-src 'self'/);
  const report = emptyDocumentReport(lease.run);
  report.control = "passed";
  report.ready = true;
  report.stopReason = "rootUnavailable";
  report.loaded = true;
  assert.equal(
    (await f.request("POST", "/research/document-report", report, { tv: true }))
      .status,
    409,
  );
  assert.equal((await f.request("GET", path)).status, 403);
  assert.equal(
    (
      await f.request("GET", path, undefined, {
        tv: true,
        headers: { Origin: "http://wrong" },
      })
    ).status,
    403,
  );
  const worker = await f.request("GET", path, undefined, { tv: true });
  assert.equal(worker.status, 200);
  assert.match(worker.headers["content-security-policy"], /connect-src 'none'/);
  assert.match(worker.headers["content-type"], /javascript/);
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal(
    (await f.request("POST", "/research/coverage-report", report, { tv: true }))
      .status,
    400,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/document-report",
        { ...report, source: "PRIVATE_SENTINEL" },
        { tv: true },
      )
    ).status,
    400,
  );
  assert.equal(
    (await f.request("POST", "/research/document-report", report)).status,
    403,
  );
  assert.equal(
    (
      await f.request("POST", "/research/document-report", report, {
        tv: true,
        headers: { Origin: "http://wrong" },
      })
    ).status,
    403,
  );
  assert.equal(
    (await f.request("POST", "/research/document-report", report, { tv: true }))
      .status,
    204,
  );
  assert.equal(
    (await f.request("POST", "/research/document-report", report, { tv: true }))
      .status,
    409,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/document-report",
        { ...report, run: "b".repeat(32), sequence: 1 },
        { tv: true },
      )
    ).status,
    409,
  );
  f.advance(60000);
  assert.equal(
    (await f.request("GET", "/research/runs/" + lease.run)).status,
    404,
  );
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/document-report",
        { ...report, sequence: 1 },
        { tv: true },
      )
    ).status,
    409,
  );
});
function report(run, sequence = 0) {
  return {
    probe: "sdk-version-10",
    run,
    sequence,
    loaded: true,
    ready: true,
    state: "resolved",
    version: "prod 64.37",
    responseType: "string",
    methods: [],
  };
}

test("fixed profiles reject arbitrary target/credential selection and unsafe integration", () => {
  assert.equal(researchProfile("bedroom").credential, "d32f-g4.token.dpapi");
  assert.equal(researchProfile("main").tv, "192.168.4.20");
  for (const name of ["__proto__", "other", "192.168.4.20"])
    assert.throws(() => researchProfile(name));
  for (const researchTargets of [["other"], ["main", "main"], "main"])
    assert.throws(() =>
      consoleTVPlugin({
        bind: "192.168.4.26",
        tv: "192.168.4.20",
        researchTargets,
      }),
    );
  assert.throws(() =>
    consoleTVPlugin({
      bind: "192.168.4.25",
      tv: "192.168.4.20",
      researchTargets: ["bedroom"],
    }),
  );
});
test("server issues a bounded lease, rejects forged/pre-page runs, locks operations and releases", async (t) => {
  const f = await fixture(t);
  const run = await f.start();
  assert.equal(run.target, "bedroom");
  assert.match(run.run, /^[a-f0-9]{32}$/);
  assert.equal(
    (await f.request("POST", "/research/runs", { group: "version" })).status,
    409,
  );
  assert.equal(
    (await f.request("POST", "/research/report", report(run.run), { tv: true }))
      .status,
    409,
  );
  assert.equal((await f.request("GET", run.path)).status, 403);
  assert.equal(
    (await f.request("GET", run.path, undefined, { tv: true })).status,
    200,
  );
  assert.equal(
    (await f.request("GET", run.path, undefined, { tv: true })).status,
    404,
  );
  assert.equal(
    (
      await f.request("POST", "/research/report", report("f".repeat(32)), {
        tv: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (await f.request("POST", "/research/report", report(run.run), { tv: true }))
      .status,
    204,
  );
  const read = await f.request("GET", "/research/runs/" + run.run);
  assert.equal(read.value.target, "bedroom");
  assert.equal(read.value.reports.length, 1);
  assert.equal(
    (await f.request("DELETE", "/research/runs/" + run.run)).status,
    200,
  );
  assert.equal(
    (
      await f.request("POST", "/research/report", report(run.run, 1), {
        tv: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (await f.request("GET", "/research/runs/" + run.run)).status,
    404,
  );
  assert.notEqual((await f.start()).run, run.run);
});
test("peer, Host, Origin, field, group, content and sequence checks fail closed", async (t) => {
  const f = await fixture(t);
  const lease = await f.start();
  await f.request("GET", lease.path, undefined, { tv: true });
  for (const headers of [
    { Host: "wrong" },
    { Via: "proxy" },
    { "X-Forwarded-For": "127.0.0.2" },
    { Origin: "http://wrong" },
  ])
    assert.equal(
      (
        await f.request("POST", "/research/report", report(lease.run), {
          tv: true,
          headers,
        })
      ).status,
      403,
    );
  assert.equal(
    (await f.request("POST", "/research/report", report(lease.run))).status,
    403,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/runs",
        { group: "version" },
        { tv: true },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await f.request("GET", "/research/runs/" + lease.run, undefined, {
        tv: true,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/report",
        { ...report(lease.run), privateData: "SENTINEL" },
        { tv: true },
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/report",
        { ...report(lease.run), probe: "sdk-store-12" },
        { tv: true },
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await f.request("POST", "/research/report", report(lease.run), {
        tv: true,
        headers: { "Content-Type": "text/plain" },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await f.request("POST", "/research/report", report(lease.run, 2), {
        tv: true,
      })
    ).status,
    204,
  );
  for (const sequence of [2, 1])
    assert.equal(
      (
        await f.request(
          "POST",
          "/research/report",
          report(lease.run, sequence),
          { tv: true },
        )
      ).status,
      409,
    );
  assert.equal(
    (
      await f.request("POST", "/research/report", report(lease.run, 3), {
        tv: true,
      })
    ).status,
    204,
  );
  await assert.rejects(
    f.request("GET", "/health", undefined, { source: "127.0.0.3" }),
  );
});
test("expiry clears reports and wrong-device run cannot cross isolated listeners", async (t) => {
  const a = await fixture(t, "main"),
    b = await fixture(t, "bedroom");
  const lease = await a.start(),
    other = await b.start();
  await a.request("GET", lease.path, undefined, { tv: true });
  await b.request("GET", other.path, undefined, { tv: true });
  assert.equal(
    (
      await b.request("POST", "/research/report", report(lease.run), {
        tv: true,
      })
    ).status,
    409,
  );
  a.advance(60000);
  assert.equal(
    (
      await a.request("POST", "/research/report", report(lease.run), {
        tv: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (await a.request("GET", "/research/runs/" + lease.run)).status,
    404,
  );
  assert.notEqual((await a.start()).run, lease.run);
});
test("unsupported requests and browser control requests are rejected", async (t) => {
  const f = await fixture(t);
  for (const input of [{ group: "store" }, { group: "version", tv: "other" }])
    assert.equal(
      (await f.request("POST", "/research/runs", input)).status,
      400,
    );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/runs",
        { group: "version" },
        { headers: { Origin: "http://127.0.0.1:4177" } },
      )
    ).status,
    403,
  );
  for (const path of [
    "/",
    "/summary.json",
    "/research/catalog-shape-report",
    "/research/sdk-source-once",
  ])
    assert.equal((await f.request("GET", path)).status, 404);
});

test("coverage group admits only its own page and bounded coverage report", async (t) => {
  const f = await fixture(t);
  const lease = (
    await f.request("POST", "/research/runs", { group: "homeCoverage" })
  ).value;
  assert.equal(
    (
      await f.request(
        "GET",
        "/research/sdk-interfaces/" + lease.run,
        undefined,
        { tv: true },
      )
    ).status,
    404,
  );
  assert.equal(
    (await f.request("GET", lease.path, undefined, { tv: true })).status,
    200,
  );
  assert.equal(
    (
      await f.request("POST", "/research/report", report(lease.run), {
        tv: true,
      })
    ).status,
    409,
  );
  const coverage = {
    probe: "sdk-home-coverage-23",
    run: lease.run,
    sequence: 0,
    loaded: true,
    ready: true,
    state: "resolved",
    methods: [],
    routeRelation: "unavailable",
    routeClass: "localStatic",
    documentOutcome: "ok",
    mimeClass: "html",
    filesAttempted: 1,
    filesRead: 1,
    bytesRead: 128,
    scriptsSeen: 0,
    scriptsEligible: 0,
    truncated: false,
    budgetExceeded: false,
  };
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/coverage-report",
        { ...coverage, source: "PRIVATE_SENTINEL" },
        { tv: true },
      )
    ).status,
    400,
  );
  assert.equal(
    (await f.request("POST", "/research/coverage-report", coverage)).status,
    403,
  );
  assert.equal(
    (
      await f.request("POST", "/research/coverage-report", coverage, {
        tv: true,
      })
    ).status,
    204,
  );
  const value = (await f.request("GET", "/research/runs/" + lease.run)).value;
  assert.deepEqual(value.reports[0].report, coverage);
  assert.doesNotMatch(JSON.stringify(value), /PRIVATE_SENTINEL/);
});
test("research lifecycle closes the socket and discards active run on Console close", async (t) => {
  const f = await fixture(t);
  const lease = await f.start();
  const owner = http.createServer();
  owner.listen(0, "127.0.0.1");
  await once(owner, "listening");
  bindToConsole(
    owner,
    f.server,
    { host: "127.0.0.1", port: f.server.address().port },
    { ready: () => false },
  );
  const closed = once(f.server, "close");
  owner.close();
  await closed;
  assert.equal(f.server.listening, false);
  const fresh = await fixture(t);
  assert.equal(
    (await fresh.request("GET", "/research/runs/" + lease.run)).status,
    404,
  );
});

test("occupied research port fails closed without fallback or stopping its owner", async (t) => {
  const occupied = http.createServer(),
    owner = http.createServer();
  occupied.listen(0, "127.0.0.1");
  await once(occupied, "listening");
  const port = occupied.address().port;
  const client = createResearchServer({
    profile: { target: "main", tv: "127.0.0.2", port },
    ally: "127.0.0.1",
  });
  t.after(() => {
    occupied.close();
    owner.close();
    client.close();
  });
  let failures = 0;
  bindToConsole(
    owner,
    client,
    { host: "127.0.0.1", port },
    {
      error: () => {
        failures++;
      },
    },
  );
  const failed = once(client, "error");
  owner.listen(0, "127.0.0.1");
  const [error] = await failed;
  assert.equal(error.code, "EADDRINUSE");
  assert.equal(failures, 1);
  assert.equal(client.listening, false);
  assert.equal(occupied.listening, true);
  assert.equal(owner.listening, true);
});

test("dependency group defaults off, remains main-only and keeps page/worker/report lease binding", async (t) => {
  const disabled = await fixture(t, "main");
  assert.equal(
    (await disabled.request("GET", "/health")).value.dependencies25,
    false,
  );
  assert.equal(
    (
      await disabled.request("POST", "/research/runs", {
        group: "homeDependencies",
      })
    ).status,
    400,
  );
  for (const dependenciesEnabled of [true, "true"])
    assert.throws(() =>
      createResearchServer({
        profile: { target: "bedroom", tv: "127.0.0.2", port: 4177 },
        ally: "127.0.0.1",
        dependenciesEnabled,
      }),
    );
  for (const researchDependencies25 of [true, "true"])
    assert.throws(() =>
      consoleTVPlugin({
        bind: "192.168.4.26",
        tv: "192.168.4.20",
        researchTargets: ["bedroom"],
        researchDependencies25,
      }),
    );
  const f = await fixture(t, "main", false, true);
  assert.equal((await f.request("GET", "/health")).value.dependencies25, true);
  assert.equal((await f.request("GET", "/health")).value.document24, false);
  const lease = (
    await f.request("POST", "/research/runs", { group: "homeDependencies" })
  ).value;
  const path = "/research/dependency-parser/" + lease.run;
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal((await f.request("GET", lease.path)).status, 403);
  const page = await f.request("GET", lease.path, undefined, { tv: true });
  assert.equal(page.status, 200);
  assert.match(page.headers["content-security-policy"], /worker-src 'self'/);
  assert.equal(
    (
      await f.request(
        "GET",
        "/research/document-parser/" + lease.run,
        undefined,
        { tv: true },
      )
    ).status,
    404,
  );
  assert.equal((await f.request("GET", path)).status, 403);
  for (const headers of [
    { Origin: "http://wrong" },
    { Host: "wrong" },
    { Via: "proxy" },
  ])
    assert.equal(
      (await f.request("GET", path, undefined, { tv: true, headers })).status,
      403,
    );
  const report = emptyDependenciesReport(lease.run);
  report.loaded = report.ready = true;
  report.control = "passed";
  report.stopReason = "rootUnavailable";
  assert.equal(
    (
      await f.request("POST", "/research/dependency-report", report, {
        tv: true,
      })
    ).status,
    409,
  );
  const worker = await f.request("GET", path, undefined, { tv: true });
  assert.equal(worker.status, 200);
  assert.match(worker.headers["content-security-policy"], /connect-src 'none'/);
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal(
    (await f.request("POST", "/research/dependency-report", report)).status,
    403,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/dependency-report",
        { ...report, raw: "PRIVATE_SENTINEL" },
        { tv: true },
      )
    ).status,
    400,
  );
  assert.equal(
    (await f.request("POST", "/research/coverage-report", report, { tv: true }))
      .status,
    400,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/dependency-report",
        { ...report, run: "f".repeat(32) },
        { tv: true },
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await f.request("POST", "/research/dependency-report", report, {
        tv: true,
      })
    ).status,
    204,
  );
  assert.equal(
    (
      await f.request("POST", "/research/dependency-report", report, {
        tv: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (await f.request("DELETE", "/research/runs/" + lease.run)).status,
    200,
  );
  assert.equal(
    (await f.request("GET", path, undefined, { tv: true })).status,
    404,
  );
  assert.equal(
    (
      await f.request(
        "POST",
        "/research/dependency-report",
        { ...report, sequence: 1 },
        { tv: true },
      )
    ).status,
    409,
  );
  const next = (
    await f.request("POST", "/research/runs", { group: "homeDependencies" })
  ).value;
  await f.request("GET", next.path, undefined, { tv: true });
  f.advance(60000);
  assert.equal(
    (
      await f.request(
        "GET",
        "/research/dependency-parser/" + next.run,
        undefined,
        { tv: true },
      )
    ).status,
    404,
  );
});
