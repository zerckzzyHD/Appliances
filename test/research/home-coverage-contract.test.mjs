import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateHomeCoverage,
  HOME_COVERAGE_PROBE,
} from "../../src/research/home-coverage-contract.mjs";
import { validateDiagnosticReport } from "../../src/research/restricted-diagnostics.mjs";

function fixture() {
  return {
    probe: HOME_COVERAGE_PROBE,
    run: "a".repeat(32),
    sequence: 2,
    loaded: true,
    ready: true,
    state: "resolved",
    methods: [{ scope: "VIZIO", name: "getStoreProperty", type: "function" }],
    routeRelation: "unavailable",
    routeClass: "localStatic",
    documentOutcome: "ok",
    mimeClass: "html",
    filesAttempted: 2,
    filesRead: 2,
    bytesRead: 4096,
    scriptsSeen: 3,
    scriptsEligible: 1,
    truncated: false,
    budgetExceeded: false,
  };
}
test("coverage preserves bounded metadata and remains inadmissible to the legacy report validator", () => {
  const input = fixture(),
    output = validateHomeCoverage(input);
  assert.deepEqual(output, input);
  assert.notStrictEqual(output, input);
  assert.equal(validateDiagnosticReport(input), null);
  assert.doesNotMatch(
    JSON.stringify(output),
    /PRIVATE_SENTINEL|localhost|http:|cookie|token/i,
  );
});
test("coverage rejects private values, unknown enums, unbounded counts and impossible denominators", () => {
  for (const update of [
    { url: "PRIVATE_SENTINEL" },
    { rawSource: "PRIVATE_SENTINEL" },
    { routeClass: "PRIVATE_SENTINEL" },
    { mimeClass: "text/private" },
    { filesRead: 6 },
    { filesRead: 3 },
    { bytesRead: 2097153 },
    { scriptsSeen: 129 },
    { scriptsEligible: 4 },
    { filesAttempted: 0 },
    { truncated: "true" },
    { sequence: -1 },
    { target: "bedroom" },
  ])
    assert.equal(validateHomeCoverage({ ...fixture(), ...update }), null);
  const missing = fixture();
  delete missing.bytesRead;
  assert.equal(validateHomeCoverage(missing), null);
});
test("only eleven fixed method references are admitted, never property names or arguments", () => {
  for (const methods of [
    [{ scope: "VIZIO", name: "PRIVATE_SENTINEL", type: "function" }],
    [
      {
        scope: "VIZIO",
        name: "getStoreProperty",
        type: "function",
        argument: "PRIVATE_SENTINEL",
      },
    ],
    [{ scope: "System", name: "getStoreProperty", type: "function" }],
    [fixture().methods[0], fixture().methods[0]],
  ])
    assert.equal(validateHomeCoverage({ ...fixture(), methods }), null);
});
