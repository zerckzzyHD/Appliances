import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";
import { emptyDocumentShape } from "./home-document-policy.mjs";
export const HOME_DOCUMENT_PROBE = "sdk-home-document-24";
export const DOCUMENT_REPORT_BYTES = 8192;
export const DOCUMENT_STOPS = [
  "controlFailed",
  "rootUnavailable",
  "parseIncomplete",
  "sameResponse",
  "comparisonUnavailable",
  "noCandidate",
  "ambiguous",
  "external",
  "policyDenied",
  "selfLoop",
  "budget",
  "continuationInspected",
  "continuationUnavailable",
];
const outcomes = [
  "notAttempted",
  "ok",
  "blocked",
  "httpError",
  "tooLarge",
  "timeout",
  "unsupported",
];
const parses = ["notAttempted", "parsed", "partial", "failed", "limit"];
const countNames = [
  "scripts",
  "inlineScripts",
  "dataScripts",
  "srcScripts",
  "unquotedSrcScripts",
  "frames",
  "bases",
  "metaRefresh",
];
const shapeEnums = {
  jsParse: parses,
  navigation: ["none", "literalOnly", "computedOnly", "mixed", "unknown"],
  literalTargetClass: [
    "none",
    "sameOriginAllowed",
    "external",
    "denied",
    "multiple",
    "unknown",
  ],
  navigationContext: ["none", "topLevelOnly", "nestedOnly", "mixed", "unknown"],
};
const exact = (o, keys) =>
  o !== null &&
  typeof o === "object" &&
  !Array.isArray(o) &&
  Object.keys(o).length === keys.length &&
  keys.every((k) => Object.hasOwn(o, k));
const integer = (n, cap) => Number.isInteger(n) && n >= 0 && n <= cap;
export function emptyDocumentNode() {
  return {
    outcome: "notAttempted",
    mime: "missing",
    bytes: 0,
    parse: "notAttempted",
    shape: emptyDocumentShape(),
  };
}
export function emptyDocumentReport(run) {
  return {
    probe: HOME_DOCUMENT_PROBE,
    run,
    sequence: 0,
    loaded: false,
    ready: false,
    state: "unavailable",
    control: "failed",
    truncated: false,
    budgetExceeded: false,
    methods: [],
    root: emptyDocumentNode(),
    continuation: emptyDocumentNode(),
    negative: { outcome: "notAttempted", bytes: 0, comparison: "unavailable" },
    continuationReason: "none",
    stopReason: "controlFailed",
    filesAttempted: 0,
    bytesRead: 0,
  };
}
export function validateHomeDocument(value) {
  if (
    !exact(value, Object.keys(emptyDocumentReport(""))) ||
    value.probe !== HOME_DOCUMENT_PROBE ||
    typeof value.run !== "string" ||
    !/^[a-f0-9]{32}$/.test(value.run) ||
    !integer(value.sequence, 1000) ||
    !["loaded", "ready", "truncated", "budgetExceeded"].every(
      (k) => typeof value[k] === "boolean",
    ) ||
    !["resolved", "unavailable"].includes(value.state) ||
    !["passed", "failed"].includes(value.control) ||
    !DOCUMENT_STOPS.includes(value.stopReason) ||
    !["none", "literalNavigation", "singleScript"].includes(
      value.continuationReason,
    ) ||
    !integer(value.filesAttempted, 3) ||
    !integer(value.bytesRead, 557056)
  )
    return null;
  for (const [node, cap] of [
    [value.root, 16384],
    [value.continuation, 524288],
  ]) {
    if (
      !exact(node, ["outcome", "mime", "bytes", "parse", "shape"]) ||
      !outcomes.includes(node.outcome) ||
      !["html", "javascript", "other", "missing"].includes(node.mime) ||
      !integer(node.bytes, cap) ||
      !parses.includes(node.parse) ||
      !exact(node.shape, [...countNames, ...Object.keys(shapeEnums)]) ||
      countNames.some((k) => !integer(node.shape[k], 32)) ||
      Object.entries(shapeEnums).some(
        ([k, enums]) => !enums.includes(node.shape[k]),
      ) ||
      node.shape.unquotedSrcScripts > node.shape.srcScripts ||
      node.shape.inlineScripts +
        node.shape.srcScripts +
        node.shape.dataScripts !==
        node.shape.scripts ||
      (node.outcome === "notAttempted" &&
        (node.mime !== "missing" ||
          node.bytes !== 0 ||
          node.parse !== "notAttempted" ||
          Object.entries(emptyDocumentShape()).some(
            ([key, expected]) => node.shape[key] !== expected,
          ))) ||
      (node.parse !== "notAttempted" && node.outcome !== "ok") ||
      (["partial", "failed", "limit"].includes(node.parse) &&
        node.shape.navigation !== "unknown")
    )
      return null;
  }
  const n = value.negative;
  if (
    !exact(n, ["outcome", "bytes", "comparison"]) ||
    !outcomes.includes(n.outcome) ||
    !integer(n.bytes, 16384) ||
    !["equal", "different", "unavailable"].includes(n.comparison) ||
    (n.outcome === "notAttempted" &&
      (n.bytes !== 0 || n.comparison !== "unavailable")) ||
    (n.comparison !== "unavailable" &&
      (value.root.outcome !== "ok" || !["ok", "httpError"].includes(n.outcome)))
  )
    return null;
  const attempted = [value.root, n, value.continuation].filter(
    (node) => node.outcome !== "notAttempted",
  ).length;
  if (
    value.filesAttempted !== attempted ||
    value.bytesRead !== value.root.bytes + n.bytes + value.continuation.bytes ||
    (value.state === "resolved") !== (value.root.outcome === "ok") ||
    (value.budgetExceeded && !value.truncated)
  )
    return null;
  const rootParsed =
    value.root.outcome === "ok" &&
    value.root.mime === "html" &&
    value.root.parse === "parsed";
  if (
    (n.outcome !== "notAttempted" && !rootParsed) ||
    (attempted > 0 && (!value.ready || value.control !== "passed")) ||
    (value.stopReason === "rootUnavailable" && rootParsed) ||
    (value.stopReason === "parseIncomplete" &&
      ![value.root.parse, value.continuation.parse].some((p) =>
        ["partial", "failed", "limit"].includes(p),
      )) ||
    (["noCandidate", "ambiguous", "external", "selfLoop"].includes(
      value.stopReason,
    ) &&
      (!rootParsed ||
        n.comparison !== "different" ||
        value.continuation.outcome !== "notAttempted")) ||
    (value.stopReason === "policyDenied" && !rootParsed)
  )
    return null;
  const continued = value.continuation.outcome !== "notAttempted";
  if (
    continued !== (value.continuationReason !== "none") ||
    (continued &&
      (value.control !== "passed" ||
        value.root.parse !== "parsed" ||
        n.comparison !== "different")) ||
    (value.control === "failed" &&
      (value.stopReason !== "controlFailed" ||
        attempted !== 0 ||
        value.ready)) ||
    (value.stopReason === "sameResponse" &&
      (n.comparison !== "equal" || continued)) ||
    (value.stopReason === "comparisonUnavailable" &&
      (n.comparison !== "unavailable" || n.outcome === "notAttempted")) ||
    (value.stopReason === "continuationInspected" &&
      value.continuation.outcome !== "ok") ||
    (value.stopReason === "continuationUnavailable" &&
      (!continued || value.continuation.outcome === "ok")) ||
    (value.stopReason === "budget" && !value.budgetExceeded) ||
    (value.stopReason === "controlFailed" && value.control !== "failed")
  )
    return null;
  if (
    !Array.isArray(value.methods) ||
    value.methods.length > HOME_REFERENCE_METHODS.length ||
    (attempted === 0 && value.methods.length)
  )
    return null;
  const seen = new Set();
  for (const m of value.methods) {
    if (
      !exact(m, ["scope", "name", "type"]) ||
      m.type !== "function" ||
      !HOME_REFERENCE_METHODS.some(
        ([scope, name]) => m.scope === scope && m.name === name,
      ) ||
      seen.has(m.scope + ":" + m.name)
    )
      return null;
    seen.add(m.scope + ":" + m.name);
  }
  // Reconstructing exact fields above rejects source-bearing extensions before retention.
  return JSON.parse(JSON.stringify(value));
}
