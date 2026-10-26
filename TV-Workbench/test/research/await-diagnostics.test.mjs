import { test } from "node:test";
import assert from "node:assert/strict";
import { awaitDiagnostics } from "../../src/research/await-diagnostics.mjs";
const run = "a".repeat(32),
  probe = "sdk-version-10";
const report = {
  probe,
  run,
  sequence: 2,
  loaded: true,
  ready: true,
  state: "resolved",
  responseType: "string",
  version: "prod 64.37",
};
function response(r) {
  return new Response(
    JSON.stringify({
      PRIVATE_SENTINEL: "PRIVATE_SENTINEL",
      reports: [
        {
          PRIVATE_SENTINEL: "PRIVATE_SENTINEL",
          receivedAt: "2026-10-18T03:00:00.000Z",
          report: r,
        },
      ],
    }),
  );
}
test("diagnostic reader retries transport only and strips unapproved wrapper data", async () => {
  let calls = 0,
    time = 0;
  const result = await awaitDiagnostics({
    run,
    probes: [probe],
    now: () => time,
    delay: async (ms) => {
      time += ms;
    },
    fetchImpl: async (url, options) => {
      calls++;
      assert.equal(options.credentials, "omit");
      assert.equal(options.redirect, "error");
      assert.equal(url, "http://192.168.4.26:4176/research/reports");
      if (calls === 1) throw Error("PRIVATE_SENTINEL");
      return response(report);
    },
  });
  assert.equal(result.complete, true);
  assert.equal(calls, 2);
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/);
});
test("reader rejects stale run and waits for terminal state", async () => {
  let calls = 0,
    time = 0;
  const result = await awaitDiagnostics({
    run,
    probes: [probe],
    now: () => time,
    delay: async (ms) => {
      time += ms;
    },
    fetchImpl: async () => {
      calls++;
      return response(
        calls === 1
          ? { ...report, run: "b".repeat(32) }
          : calls === 2
            ? { ...report, state: "invoked" }
            : report,
      );
    },
  });
  assert.equal(result.complete, true);
  assert.equal(calls, 3);
});
test("reader reports bounded incomplete diagnostics without inventing success", async () => {
  let time = 0;
  const result = await awaitDiagnostics({
    run,
    probes: [probe],
    budgetMs: 20,
    now: () => time,
    delay: async (ms) => {
      time += ms;
    },
    fetchImpl: async () => response({ ...report, raw: "PRIVATE_SENTINEL" }),
  });
  assert.equal(result.complete, false);
  assert.deepEqual(result.missing, [probe]);
  assert.equal(result.reports.length, 0);
});
