// Approved bounded phase2 contract; used only by isolated research admission.
import { validateDiagnosticReport } from "./restricted-diagnostics.mjs";
export const HOME_COVERAGE_PROBE = "sdk-home-coverage-23";
export const HOME_REFERENCE_METHODS = Object.freeze(
  [
    ["System", "getTvStoreProperty"],
    ["System", "getTvStoreProperties"],
    ["System", "setTvStoreProperty"],
    ["System", "getConfigProperty"],
    ["App", "getAppInfo"],
    ["App", "getCurrentAppInfo"],
    ["App", "launchApp"],
    ["VIZIO", "getStoreProperty"],
    ["VIZIO", "getStorePropertyAsync"],
    ["VIZIO", "getStoreProperties"],
    ["VIZIO", "setStoreProperty"],
  ].map(Object.freeze),
);
const enumFields = {
  routeRelation: ["same", "different", "unavailable"],
  routeClass: ["localStatic", "external", "unsupported"],
  documentOutcome: [
    "ok",
    "blocked",
    "httpError",
    "tooLarge",
    "timeout",
    "unsupported",
  ],
  mimeClass: ["html", "javascript", "other", "missing"],
};
const countFields = {
  filesAttempted: 5,
  filesRead: 5,
  bytesRead: 2097152,
  scriptsSeen: 128,
  scriptsEligible: 128,
};
const baseFields = [
  "probe",
  "run",
  "sequence",
  "loaded",
  "ready",
  "state",
  "methods",
];
const fields = [
  ...baseFields,
  ...Object.keys(enumFields),
  ...Object.keys(countFields),
  "truncated",
  "budgetExceeded",
];
export function validateHomeCoverage(value) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).length !== fields.length ||
    fields.some((key) => !Object.hasOwn(value, key)) ||
    Object.keys(value).some((key) => !fields.includes(key)) ||
    value.probe !== HOME_COVERAGE_PROBE
  )
    return null;
  const core = Object.fromEntries(baseFields.map((key) => [key, value[key]]));
  // Validate the core without adding this probe to the legacy report channel.
  core.probe = "sdk-home-reference-22";
  if (!validateDiagnosticReport(core)) return null;
  for (const [key, choices] of Object.entries(enumFields))
    if (!choices.includes(value[key])) return null;
  for (const [key, limit] of Object.entries(countFields))
    if (!Number.isInteger(value[key]) || value[key] < 0 || value[key] > limit)
      return null;
  if (
    typeof value.truncated !== "boolean" ||
    typeof value.budgetExceeded !== "boolean" ||
    value.filesRead > value.filesAttempted ||
    value.scriptsEligible > value.scriptsSeen ||
    (value.documentOutcome === "ok" && value.filesRead === 0) ||
    value.bytesRead > value.filesAttempted * 524288
  )
    return null;
  const seen = new Set();
  for (const method of value.methods) {
    const id = method.scope + ":" + method.name;
    if (
      method.type !== "function" ||
      !HOME_REFERENCE_METHODS.some(
        ([scope, name]) => scope === method.scope && name === method.name,
      ) ||
      seen.has(id)
    )
      return null;
    seen.add(id);
  }
  return JSON.parse(JSON.stringify(value));
}
