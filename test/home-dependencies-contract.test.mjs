import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyDependenciesReport,
  emptyDependenciesShape,
  validateHomeDependencies,
} from "../research/home-dependencies-contract.mjs";

const run = "abcdef0123456789abcdef0123456789";

function resolvedRoot() {
  const report = emptyDependenciesReport(run);
  report.control = "passed";
  report.ready = true;
  report.state = "resolved";
  report.root = {
    outcome: "ok",
    mime: "html",
    bytes: 3,
    parse: "parsed",
    shape: {
      ...emptyDependenciesShape(),
      scripts: 2,
      srcScripts: 2,
      uniqueDirectScripts: 2,
    },
  };
  report.negative = {
    outcome: "ok",
    bytes: 2,
    comparison: "different",
  };
  report.stopReason = "ambiguous";
  report.filesAttempted = 2;
  report.filesRead = 2;
  report.bytesRead = 5;
  return report;
}

function dependency(mode, mime = "javascript", parse = "parsed", bytes = 1) {
  return {
    mode,
    outcome: "ok",
    mime,
    bytes,
    parse,
    shape: {
      ...emptyDependenciesShape(),
      jsParse: parse === "parsed" ? "parsed" : "notAttempted",
    },
  };
}

test("empty control-failed and ready root-unavailable reports validate", () => {
  assert.ok(validateHomeDependencies(emptyDependenciesReport(run)));
  const unavailable = emptyDependenciesReport(run);
  unavailable.control = "passed";
  unavailable.ready = true;
  unavailable.stopReason = "rootUnavailable";
  assert.ok(validateHomeDependencies(unavailable));
});

test("complete HTTP 200 and HTTP 404 negative bodies count exactly once", () => {
  for (const outcome of ["ok", "httpError"]) {
    const report = resolvedRoot();
    report.negative.outcome = outcome;
    assert.ok(validateHomeDependencies(report));
  }
});

test("each incomplete negative outcome has a valid stopped report", () => {
  const incompleteOutcomes = [
    ["blocked", "comparisonUnavailable", false],
    ["httpError", "comparisonUnavailable", false],
    ["unsupported", "comparisonUnavailable", false],
    ["tooLarge", "budget", true],
    ["timeout", "budget", true],
  ];
  for (const [outcome, stopReason, budget] of incompleteOutcomes) {
    const report = resolvedRoot();
    report.negative = {
      outcome,
      bytes: outcome === "tooLarge" || outcome === "timeout" ? 16384 : 0,
      comparison: "unavailable",
    };
    report.filesAttempted = 2;
    report.filesRead = 1;
    report.bytesRead = report.root.bytes + report.negative.bytes;
    report.truncated = true;
    report.stopReason = stopReason;
    if (budget) {
      report.budgetExceeded = true;
      report.sourceTruncated = true;
    }
    assert.ok(validateHomeDependencies(report), outcome);
  }
});

test("root failures prevent any negative comparison attempt", () => {
  const report = emptyDependenciesReport(run);
  report.control = "passed";
  report.ready = true;
  report.root.outcome = "httpError";
  report.filesAttempted = 1;
  report.truncated = true;
  report.stopReason = "rootUnavailable";
  assert.ok(validateHomeDependencies(report));

  report.negative.outcome = "blocked";
  report.filesAttempted = 2;
  assert.equal(validateHomeDependencies(report), null);
});

test("successful JavaScript root MIME can remain unparsed and unavailable", () => {
  const report = emptyDependenciesReport(run);
  report.control = "passed";
  report.ready = true;
  report.state = "resolved";
  report.root = {
    outcome: "ok",
    mime: "javascript",
    bytes: 4,
    parse: "notAttempted",
    shape: emptyDependenciesShape(),
  };
  report.filesAttempted = 1;
  report.filesRead = 1;
  report.bytesRead = 4;
  report.stopReason = "rootUnavailable";
  assert.ok(validateHomeDependencies(report));
});

test("HTML child fallback preserves MIME and is a valid nonrecursive stop", () => {
  const report = resolvedRoot();
  report.dependencies = [dependency("classic", "html", "notAttempted", 2)];
  report.dependencies[0].shape = emptyDependenciesShape();
  report.filesAttempted = 3;
  report.filesRead = 3;
  report.bytesRead = 7;
  report.partialCoverage = true;
  report.stopReason = "dependencyUnavailable";
  assert.ok(validateHomeDependencies(report));
});

test("a complete two-child result rejects every truncation or incompleteness flag", () => {
  const report = resolvedRoot();
  report.dependencies = [dependency("classic"), dependency("module")];
  report.filesAttempted = 4;
  report.filesRead = 4;
  report.bytesRead = 7;
  report.partialCoverage = false;
  report.stopReason = "dependenciesInspected";
  assert.ok(validateHomeDependencies(report));
  for (const flag of [
    "truncated",
    "budgetExceeded",
    "sourceTruncated",
    "parseIncomplete",
    "saturated",
    "partialCoverage",
  ]) {
    const partial = structuredClone(report);
    partial[flag] = true;
    assert.equal(validateHomeDependencies(partial), null, flag);
  }
});

test("closed report rejects private fields and graph claims without valid syntax endpoints", () => {
  const privateField = resolvedRoot();
  privateField.source = "private sentinel";
  assert.equal(validateHomeDependencies(privateField), null);

  const dependencyWithoutRead = emptyDependenciesReport(run);
  dependencyWithoutRead.graph.nodes = [
    { id: 0, resource: "dependency2", kind: "storageWrite" },
  ];
  assert.equal(validateHomeDependencies(dependencyWithoutRead), null);

  const forgedControlGraph = emptyDependenciesReport(run);
  forgedControlGraph.graph.nodes = [
    { id: 0, resource: "root", kind: "storageWrite" },
  ];
  assert.equal(validateHomeDependencies(forgedControlGraph), null);

  const falseRelationship = resolvedRoot();
  falseRelationship.graph.nodes = [
    { id: 0, resource: "root", kind: "storageWrite" },
    { id: 1, resource: "root", kind: "domCreate" },
  ];
  falseRelationship.graph.edges = [
    { from: 0, to: 1, relationship: "responseConsumer" },
  ];
  assert.equal(validateHomeDependencies(falseRelationship), null);

  const crossSourceEdge = resolvedRoot();
  crossSourceEdge.dependencies = [dependency("classic")];
  crossSourceEdge.filesAttempted = 3;
  crossSourceEdge.filesRead = 3;
  crossSourceEdge.bytesRead = 6;
  crossSourceEdge.partialCoverage = true;
  crossSourceEdge.stopReason = "dependencyUnavailable";
  crossSourceEdge.graph.nodes = [
    { id: 0, resource: "root", kind: "networkRead" },
    { id: 1, resource: "dependency1", kind: "responseConsume" },
  ];
  crossSourceEdge.graph.edges = [
    { from: 0, to: 1, relationship: "responseConsumer" },
  ];
  assert.equal(validateHomeDependencies(crossSourceEdge), null);
});

test("all four conclusions remain exactly unestablished", () => {
  const report = resolvedRoot();
  report.conclusions.catalogMembership = "established";
  assert.equal(validateHomeDependencies(report), null);
});
