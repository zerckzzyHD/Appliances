import { test } from "node:test";
import assert from "node:assert/strict";
import { toTVSummary } from "../src/summary.mjs";

const fixture = () => ({
  meta: { generatedAt: "2026-10-17T17:00:00Z", stateDir: "PRIVATE_SENTINEL" },
  summary: {
    verdict: "BLIND",
    reason: "PRIVATE_SENTINEL",
    total: 3,
    counts: { PASS: 1, FAIL: 0, UNOBSERVABLE: 2 },
  },
  supervisor: {
    lastTickAge: { ms: 90000, text: "PRIVATE_SENTINEL" },
    stale: true,
  },
  checks: [{ evidence: "PRIVATE_SENTINEL" }],
  criticalItems: ["PRIVATE_SENTINEL"],
  sources: ["PRIVATE_SENTINEL"],
  token: "PRIVATE_SENTINEL",
});

test("keeps source verdict, denominator, unknown count and source freshness", () => {
  const result = toTVSummary(fixture());
  assert.deepEqual(result, {
    availability: "AVAILABLE",
    projectionGeneratedAt: "2026-10-17T17:00:00Z",
    summary: {
      verdict: "BLIND",
      total: 3,
      counts: { PASS: 1, FAIL: 0, UNOBSERVABLE: 2 },
    },
    freshness: { sourceAgeMs: 90000, sourceStale: true },
  });
});
test("drops every non-allowlisted field and does not mutate input", () => {
  const input = fixture();
  const before = JSON.stringify(input);
  assert.equal(
    JSON.stringify(toTVSummary(input)).includes("PRIVATE_SENTINEL"),
    false,
  );
  assert.equal(JSON.stringify(input), before);
});
test("missing projection and inconsistent denominator fail closed", () => {
  assert.deepEqual(toTVSummary(null), { availability: "UNAVAILABLE" });
  const input = fixture();
  input.summary.total = 4;
  assert.deepEqual(toTVSummary(input), { availability: "UNAVAILABLE" });
});
test("negative, missing and non-integer counts fail closed", () => {
  for (const value of [-1, undefined, 0.5, "1"]) {
    const input = fixture();
    input.summary.counts.PASS = value;
    assert.deepEqual(toTVSummary(input), { availability: "UNAVAILABLE" });
  }
});
test("unknown freshness stays unknown and invalid timestamps are not copied", () => {
  const input = fixture();
  input.supervisor = {};
  input.meta.generatedAt = "PRIVATE_SENTINEL";
  assert.deepEqual(toTVSummary(input).freshness, {
    sourceAgeMs: null,
    sourceStale: null,
  });
  assert.equal(toTVSummary(input).projectionGeneratedAt, null);
});
test("arbitrary verdict text and empty check set are unavailable", () => {
  const input = fixture();
  input.summary.verdict = "PRIVATE_SENTINEL";
  assert.deepEqual(toTVSummary(input), { availability: "UNAVAILABLE" });
  input.summary = {
    verdict: "GREEN",
    total: 0,
    counts: { PASS: 0, FAIL: 0, UNOBSERVABLE: 0 },
  };
  assert.deepEqual(toTVSummary(input), { availability: "UNAVAILABLE" });
});
