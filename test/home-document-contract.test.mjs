import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyDocumentReport,
  validateHomeDocument,
} from "../research/home-document-contract.mjs";
import { validateDiagnosticReport } from "../research/restricted-diagnostics.mjs";
import { validateHomeCoverage } from "../research/home-coverage-contract.mjs";
const run = "a".repeat(32);
const good = () => emptyDocumentReport(run);
test("document contract accepts only exact bounded data and stays outside legacy channels", () => {
  const value = good();
  assert.deepEqual(validateHomeDocument(value), value);
  assert.equal(validateDiagnosticReport(value), null);
  assert.equal(validateHomeCoverage(value), null);
  for (const mutate of [
    (v) => (v.source = "PRIVATE_SENTINEL"),
    (v) => (v.root.source = "PRIVATE_SENTINEL"),
    (v) => (v.root.shape.source = "PRIVATE_SENTINEL"),
    (v) => (v.negative.source = "PRIVATE_SENTINEL"),
    (v) => (v.continuation.source = "PRIVATE_SENTINEL"),
    (v) => (v.root.shape.navigation = "PRIVATE_SENTINEL"),
    (v) => (v.stopReason = "PRIVATE_SENTINEL"),
    (v) => (v.filesAttempted = 4),
    (v) => (v.bytesRead = 557057),
    (v) => (v.sequence = 1001),
    (v) => (v.root.bytes = 16385),
    (v) => (v.root.shape.scripts = 33),
    (v) =>
      (v.methods = [
        {
          scope: "VIZIO",
          name: "getStoreProperty",
          type: "function",
          value: "PRIVATE_SENTINEL",
        },
      ]),
  ]) {
    const bad = good();
    mutate(bad);
    assert.equal(validateHomeDocument(bad), null);
  }
});
test("document contract rejects impossible states, bounds and continuation/control relationships", () => {
  for (const mutate of [
    (v) => (v.state = "resolved"),
    (v) => (v.root.bytes = 1),
    (v) => (v.negative.comparison = "equal"),
    (v) => (v.stopReason = "sameResponse"),
    (v) => (v.budgetExceeded = true),
    (v) => (v.continuationReason = "singleScript"),
    (v) => (v.root.parse = "parsed"),
    (v) => (v.root.shape.srcScripts = 1),
    (v) => (v.root.shape.unquotedSrcScripts = 1),
    (v) => (v.control = "passed"),
    (v) => (v.ready = true),
  ]) {
    const bad = good();
    mutate(bad);
    assert.equal(validateHomeDocument(bad), null);
  }
  const value = good();
  value.control = "passed";
  value.ready = true;
  value.stopReason = "rootUnavailable";
  assert.ok(validateHomeDocument(value));
});
