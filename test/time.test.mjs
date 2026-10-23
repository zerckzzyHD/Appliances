import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { formatProjectionTime } from "../src/time.mjs";
import { PAGE } from "../src/page.mjs";

test("19:00 UTC displays 15:00 EDT in the owner timezone", () => {
  assert.equal(
    formatProjectionTime("2026-10-17T19:00:00Z"),
    "2026-10-17 15:00:00 EDT",
  );
});
test("winter and date boundaries use timezone rules, not a fixed offset", () => {
  assert.equal(
    formatProjectionTime("2026-01-17T20:00:00Z"),
    "2026-01-17 15:00:00 EST",
  );
  assert.equal(
    formatProjectionTime("2026-10-17T02:00:00Z"),
    "2026-10-16 22:00:00 EDT",
  );
  assert.equal(
    formatProjectionTime("2026-11-01T19:00:00Z"),
    "2026-11-01 14:00:00 EST",
  );
});
test("missing and invalid timestamps stay unknown", () => {
  for (const value of [null, undefined, "", "not-a-date"])
    assert.equal(formatProjectionTime(value), "unknown");
});
test("actual delivered page script formats the timestamp and retains the summary", () => {
  const nodes = {};
  const value = {
    availability: "AVAILABLE",
    projectionGeneratedAt: "2026-10-17T19:00:00Z",
    summary: {
      verdict: "ATTENTION",
      total: 3,
      counts: { PASS: 1, FAIL: 1, UNOBSERVABLE: 1 },
    },
    freshness: { sourceAgeMs: 1000, sourceStale: true },
  };
  class Request {
    open() {}
    setRequestHeader(name, value) {
      assert.equal(name, "X-Mist-TV-UI");
      assert.equal(value, "local-time-1");
    }
    send() {
      this.status = 200;
      this.responseText = JSON.stringify(value);
      this.onload();
    }
  }
  const script = PAGE.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script, {
    Intl,
    Date,
    Number,
    JSON,
    XMLHttpRequest: Request,
    setInterval() {},
    document: {
      getElementById(id) {
        return (nodes[id] ||= {});
      },
    },
  });
  assert.match(nodes.update.textContent, /2026-10-17 15:00:00 EDT/);
  assert.equal(nodes.verdict.textContent, "ATTENTION");
  assert.match(nodes.age.textContent, /STALE/);
});
