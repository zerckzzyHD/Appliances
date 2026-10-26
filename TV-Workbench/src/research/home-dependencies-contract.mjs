import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";

export const HOME_DEPENDENCIES_PROBE = "sdk-home-dependencies-25";
export const DEPENDENCIES_REPORT_BYTES = 8192;
export const HOME_DEPENDENCIES_FAILURE_REASONS = Object.freeze([
  "astNodeLimit",
  "astDepthLimit",
  "syntaxError",
  "workerUnavailable",
  "workerError",
  "workerDeadline",
  "workerEmptyResponse",
  "workerPostFailure",
  "collectionDeadline",
  "invalidParserResult",
  "invalidParserGraph",
  "unknownInternalFailure",
]);
export const DEPENDENCIES_STOPS = Object.freeze([
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
  "dependenciesInspected",
  "dependencyUnavailable",
  "graphSaturated",
]);

const outcomes = [
  "notAttempted",
  "ok",
  "blocked",
  "httpError",
  "tooLarge",
  "timeout",
  "unsupported",
];
const failureReasons = new Set(HOME_DEPENDENCIES_FAILURE_REASONS);
const workerFailureReasons = new Set([
  "workerUnavailable",
  "workerError",
  "workerDeadline",
  "workerEmptyResponse",
  "workerPostFailure",
]);
const parses = ["notAttempted", "parsed", "partial", "failed", "limit"];
const shapeCounts = [
  "scripts",
  "inlineScripts",
  "dataScripts",
  "srcScripts",
  "uniqueDirectScripts",
  "frames",
  "navigation",
  "eventHandlers",
  "bases",
];
const shapeEnums = {
  baseState: ["none", "valid", "invalid", "multiple"],
  navigationState: ["none", "present", "unknown"],
  jsParse: parses,
};
const nodeKinds = [
  "function",
  "call",
  "networkRead",
  "responseConsume",
  "storageRead",
  "storageWrite",
  "launchCall",
  "eventRegistration",
  "domCreate",
  "domInsert",
];
const relationships = [
  "contains",
  "directCall",
  "registersCallback",
  "responseConsumer",
  "inserts",
];
const exact = (value, keys) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));
const exactWithOptional = (value, keys, optionalKey) =>
  exact(value, keys) ||
  (value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.hasOwn(value, optionalKey) &&
    exact(value, [...keys, optionalKey]));
const integer = (value, cap) =>
  Number.isInteger(value) && value >= 0 && value <= cap;

export function emptyDependenciesShape() {
  return {
    scripts: 0,
    inlineScripts: 0,
    dataScripts: 0,
    srcScripts: 0,
    uniqueDirectScripts: 0,
    frames: 0,
    navigation: 0,
    eventHandlers: 0,
    bases: 0,
    baseState: "none",
    navigationState: "none",
    jsParse: "notAttempted",
  };
}

export function emptyDependenciesNode() {
  return {
    outcome: "notAttempted",
    mime: "missing",
    bytes: 0,
    parse: "notAttempted",
    shape: emptyDependenciesShape(),
  };
}

export function emptyDependenciesReport(run) {
  return {
    probe: HOME_DEPENDENCIES_PROBE,
    run,
    sequence: 0,
    loaded: false,
    ready: false,
    state: "unavailable",
    control: "failed",
    truncated: false,
    budgetExceeded: false,
    sourceTruncated: false,
    parseIncomplete: false,
    saturated: false,
    methods: [],
    root: emptyDependenciesNode(),
    negative: { outcome: "notAttempted", bytes: 0, comparison: "unavailable" },
    dependencies: [],
    graph: { nodes: [], edges: [] },
    unsupportedCount: 0,
    partialCoverage: false,
    conclusions: {
      catalogMembership: "unestablished",
      favoritesOrder: "unestablished",
      launchRouting: "unestablished",
      signedDelivery: "unestablished",
    },
    stopReason: "controlFailed",
    filesAttempted: 0,
    filesRead: 0,
    bytesRead: 0,
  };
}

function validShape(value) {
  return (
    exact(value, [...shapeCounts, ...Object.keys(shapeEnums)]) &&
    shapeCounts.every((key) => integer(value[key], 32)) &&
    Object.entries(shapeEnums).every(([key, choices]) =>
      choices.includes(value[key]),
    ) &&
    value.inlineScripts + value.dataScripts + value.srcScripts ===
      value.scripts &&
    value.uniqueDirectScripts <= value.srcScripts &&
    (value.navigationState !== "none" || value.navigation === 0)
  );
}

function validNode(
  value,
  cap,
  {
    root = false,
    attempted = true,
    allowHTMLFallback = false,
    allowUnparsedRootMime = false,
  } = {},
) {
  const baseKeys = ["outcome", "mime", "bytes", "parse", "shape"];
  const hasFailureReason =
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.hasOwn(value, "failureReason");
  if (
    !exactWithOptional(value, baseKeys, "failureReason") ||
    !outcomes.includes(value.outcome) ||
    !["html", "javascript", "other", "missing"].includes(value.mime) ||
    !integer(value.bytes, cap) ||
    !parses.includes(value.parse) ||
    !validShape(value.shape)
  )
    return false;
  if (
    value.outcome === "notAttempted" &&
    (value.mime !== "missing" ||
      value.bytes !== 0 ||
      value.parse !== "notAttempted" ||
      hasFailureReason ||
      !exact(value.shape, Object.keys(emptyDependenciesShape())) ||
      Object.entries(emptyDependenciesShape()).some(
        ([key, expected]) => value.shape[key] !== expected,
      ))
  )
    return false;
  if (value.parse !== "notAttempted" && value.outcome !== "ok") return false;
  if (
    value.parse !== "notAttempted" &&
    !["html", "javascript"].includes(value.mime)
  )
    return false;
  if (root && value.parse !== "notAttempted" && value.mime !== "html")
    return false;
  if (attempted && value.outcome === "ok" && value.parse === "notAttempted") {
    // Successful HTTP reads may stop before parsing when content type is unsupported.
    if (value.mime === "javascript" && !(root && allowUnparsedRootMime))
      return false;
    if (value.mime === "html" && (root || !allowHTMLFallback)) return false;
  }
  if (
    value.parse === "parsed" &&
    ["failed", "partial", "limit"].includes(value.shape.jsParse)
  )
    return false;
  if (
    ["partial", "failed", "limit"].includes(value.parse) &&
    value.shape.jsParse === "notAttempted"
  ) {
    // HTML parser failure can happen before any JavaScript is reached.
    if (value.mime !== "html") return false;
  }
  if (hasFailureReason) {
    const reason = value.failureReason;
    if (!failureReasons.has(reason) || value.outcome === "notAttempted")
      return false;
    if (reason === "syntaxError") {
      if (
        value.outcome !== "ok" ||
        !["partial", "failed"].includes(value.parse) ||
        !["partial", "failed"].includes(value.shape.jsParse)
      )
        return false;
    } else if (reason === "astNodeLimit" || reason === "astDepthLimit") {
      if (
        value.outcome !== "ok" ||
        value.parse !== "limit" ||
        !(
          value.shape.jsParse === "limit" ||
          (value.mime === "html" && value.shape.jsParse === "notAttempted")
        )
      )
        return false;
    } else if (workerFailureReasons.has(reason)) {
      if (
        value.outcome !== "ok" ||
        value.parse !== "limit" ||
        value.shape.jsParse !== "limit"
      )
        return false;
    } else if (
      reason === "invalidParserResult" ||
      reason === "invalidParserGraph"
    ) {
      if (
        value.outcome !== "ok" ||
        value.parse !== "limit" ||
        value.shape.jsParse !== "limit"
      )
        return false;
    } else if (reason === "collectionDeadline") {
      if (!(
        (value.outcome === "ok" && value.parse === "limit") ||
        (["blocked", "timeout"].includes(value.outcome) &&
          value.parse === "notAttempted")
      ))
        return false;
    } else if (reason === "unknownInternalFailure") {
      if (!(
        (value.outcome === "ok" &&
          ["partial", "failed", "limit"].includes(value.parse)) ||
        (["blocked", "timeout"].includes(value.outcome) &&
          value.parse === "notAttempted")
      ))
        return false;
    }
  }
  return true;
}

function validGraph(graph) {
  if (
    !exact(graph, ["nodes", "edges"]) ||
    !Array.isArray(graph.nodes) ||
    graph.nodes.length > 32 ||
    !Array.isArray(graph.edges) ||
    graph.edges.length > 32
  )
    return false;
  const ids = new Set();
  const byId = new Map();
  for (const node of graph.nodes) {
    if (
      !exact(node, ["id", "resource", "kind"]) ||
      !integer(node.id, 31) ||
      !["root", "dependency1", "dependency2"].includes(node.resource) ||
      !nodeKinds.includes(node.kind) ||
      ids.has(node.id)
    )
      return false;
    ids.add(node.id);
    byId.set(node.id, node);
  }
  if (ids.size !== graph.nodes.length) return false;
  const edges = new Set();
  for (const edge of graph.edges) {
    if (
      !exact(edge, ["from", "to", "relationship"]) ||
      !integer(edge.from, 31) ||
      !integer(edge.to, 31) ||
      edge.from === edge.to ||
      !ids.has(edge.from) ||
      !ids.has(edge.to) ||
      !relationships.includes(edge.relationship)
    )
      return false;
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (from.resource !== to.resource) return false;
    const endpoints = {
      contains: from.kind === "function",
      directCall: from.kind === "call" && to.kind === "function",
      registersCallback:
        from.kind === "eventRegistration" && to.kind === "function",
      responseConsumer:
        from.kind === "networkRead" && to.kind === "responseConsume",
      inserts: from.kind === "domCreate" && to.kind === "domInsert",
    };
    if (!endpoints[edge.relationship]) return false;
    const key = `${edge.from}:${edge.to}:${edge.relationship}`;
    if (edges.has(key)) return false;
    edges.add(key);
  }
  return true;
}

function validMethods(methods, attempted) {
  if (!Array.isArray(methods) || methods.length > HOME_REFERENCE_METHODS.length)
    return false;
  if (!attempted && methods.length) return false;
  const seen = new Set();
  for (const method of methods) {
    if (
      !exact(method, ["scope", "name", "type"]) ||
      method.type !== "function" ||
      !HOME_REFERENCE_METHODS.some(
        ([scope, name]) => method.scope === scope && method.name === name,
      ) ||
      seen.has(method.scope + ":" + method.name)
    )
      return false;
    seen.add(method.scope + ":" + method.name);
  }
  return true;
}

export function validateHomeDependencies(value) {
  const keys = Object.keys(emptyDependenciesReport(""));
  if (
    !exact(value, keys) ||
    value.probe !== HOME_DEPENDENCIES_PROBE ||
    typeof value.run !== "string" ||
    !/^[a-f0-9]{32}$/.test(value.run) ||
    !integer(value.sequence, 1000) ||
    ![
      "loaded",
      "ready",
      "truncated",
      "budgetExceeded",
      "sourceTruncated",
      "parseIncomplete",
      "saturated",
      "partialCoverage",
    ].every((key) => typeof value[key] === "boolean") ||
    !["resolved", "unavailable"].includes(value.state) ||
    !["passed", "failed"].includes(value.control) ||
    !DEPENDENCIES_STOPS.includes(value.stopReason) ||
    !integer(value.filesAttempted, 4) ||
    !integer(value.filesRead, 4) ||
    !integer(value.bytesRead, 1081344) ||
    !integer(value.unsupportedCount, 64) ||
    !exact(value.conclusions, [
      "catalogMembership",
      "favoritesOrder",
      "launchRouting",
      "signedDelivery",
    ]) ||
    Object.values(value.conclusions).some((item) => item !== "unestablished") ||
    !validNode(value.root, 16384, {
      root: true,
      allowUnparsedRootMime: true,
    }) ||
    !exact(value.negative, ["outcome", "bytes", "comparison"]) ||
    !outcomes.includes(value.negative.outcome) ||
    !integer(value.negative.bytes, 16384) ||
    !["unavailable", "equal", "different"].includes(
      value.negative.comparison,
    ) ||
    !Array.isArray(value.dependencies) ||
    value.dependencies.length > 2 ||
    !validGraph(value.graph)
  )
    return null;

  const attemptedNodes = [
    value.root,
    value.negative,
    ...value.dependencies,
  ].filter((node) => node.outcome !== "notAttempted");
  const filesRead =
    Number(value.root.outcome === "ok") +
    value.dependencies.filter((node) => node.outcome === "ok").length;
  const negativeBodyRead =
    ["ok", "httpError"].includes(value.negative.outcome) &&
    ["equal", "different"].includes(value.negative.comparison);
  const bytesRead =
    value.root.bytes +
    value.negative.bytes +
    value.dependencies.reduce((sum, node) => sum + node.bytes, 0);
  if (
    value.filesAttempted !== attemptedNodes.length ||
    value.filesRead !== filesRead + Number(negativeBodyRead) ||
    value.bytesRead !== bytesRead ||
    value.filesRead > value.filesAttempted ||
    (value.state === "resolved") !== (value.root.outcome === "ok") ||
    (value.budgetExceeded && !value.truncated) ||
    (value.sourceTruncated && !value.truncated) ||
    (value.parseIncomplete && !value.truncated) ||
    (value.saturated && !value.truncated) ||
    (value.budgetExceeded && !(value.sourceTruncated || value.truncated))
  )
    return null;

  const rootParsed =
    value.root.outcome === "ok" &&
    value.root.mime === "html" &&
    value.root.parse === "parsed";
  const negativeNotAttempted = value.negative.outcome === "notAttempted";
  const negativeValid =
    ["ok", "httpError"].includes(value.negative.outcome) &&
    ["equal", "different"].includes(value.negative.comparison);
  if (
    (negativeNotAttempted &&
      (value.negative.bytes !== 0 ||
        value.negative.comparison !== "unavailable")) ||
    (!negativeNotAttempted && !rootParsed) ||
    (value.negative.comparison !== "unavailable" && !negativeValid) ||
    (value.dependencies.length &&
      (!rootParsed ||
        value.negative.comparison !== "different" ||
        value.root.shape.uniqueDirectScripts !== 2))
  )
    return null;

  const resourceWasParsed = (resource) => {
    if (resource === "root")
      return value.root.outcome === "ok" && value.root.parse !== "notAttempted";
    if (resource === "dependency1" || resource === "dependency2") {
      const dependency = value.dependencies[Number(resource.at(-1)) - 1];
      return Boolean(
        dependency &&
        dependency.outcome === "ok" &&
        dependency.mime === "javascript" &&
        dependency.parse !== "notAttempted",
      );
    }
    return false;
  };
  if (
    value.graph.nodes.some((node) => !resourceWasParsed(node.resource)) ||
    (value.methods.length > 0 &&
      !(
        resourceWasParsed("root") ||
        resourceWasParsed("dependency1") ||
        resourceWasParsed("dependency2")
      )) ||
    (value.unsupportedCount > 0 &&
      !(
        resourceWasParsed("root") ||
        resourceWasParsed("dependency1") ||
        resourceWasParsed("dependency2")
      )) ||
    (value.control === "failed" &&
      (value.graph.nodes.length > 0 ||
        value.graph.edges.length > 0 ||
        value.methods.length > 0 ||
        value.unsupportedCount > 0 ||
        value.dependencies.length > 0 ||
        value.negative.outcome !== "notAttempted"))
  )
    return null;

  for (const dependency of value.dependencies) {
    if (
      !exactWithOptional(
        dependency,
        ["mode", "outcome", "mime", "bytes", "parse", "shape"],
        "failureReason",
      ) ||
      !["classic", "module"].includes(dependency.mode) ||
      !validNode(
        {
          outcome: dependency.outcome,
          mime: dependency.mime,
          bytes: dependency.bytes,
          parse: dependency.parse,
          shape: dependency.shape,
          ...(Object.hasOwn(dependency, "failureReason")
            ? { failureReason: dependency.failureReason }
            : {}),
        },
        524288,
        { allowHTMLFallback: true },
      ) ||
      !["javascript", "html", "other", "missing"].includes(dependency.mime) ||
      (dependency.mime === "html" && dependency.parse !== "notAttempted")
    )
      return null;
  }

  const parseIncomplete = [value.root, ...value.dependencies].some((node) =>
    ["partial", "failed", "limit"].includes(node.parse),
  );
  if (value.parseIncomplete !== parseIncomplete) return null;
  const partialCoverage =
    value.dependencies.length > 0 &&
    (value.dependencies.length < 2 ||
      value.dependencies.some(
        (node) => node.outcome !== "ok" || node.parse !== "parsed",
      ));
  if (value.partialCoverage !== partialCoverage) return null;

  if (
    !validMethods(value.methods, value.filesAttempted > 0) ||
    (value.control === "failed" &&
      (value.stopReason !== "controlFailed" ||
        value.filesAttempted !== 0 ||
        value.ready)) ||
    (value.control === "passed" && !value.ready) ||
    (value.filesAttempted > 0 &&
      (value.control !== "passed" || !value.ready)) ||
    (value.stopReason === "controlFailed" && value.control !== "failed") ||
    (value.stopReason === "rootUnavailable" && rootParsed) ||
    (value.stopReason === "sameResponse" &&
      (value.negative.comparison !== "equal" || value.dependencies.length)) ||
    (value.stopReason === "comparisonUnavailable" &&
      (negativeNotAttempted || value.negative.comparison !== "unavailable")) ||
    (value.stopReason === "parseIncomplete" && !value.parseIncomplete) ||
    (value.stopReason === "budget" && !value.budgetExceeded) ||
    ([
      "noCandidate",
      "ambiguous",
      "external",
      "policyDenied",
      "selfLoop",
    ].includes(value.stopReason) &&
      (!rootParsed ||
        value.negative.comparison !== "different" ||
        value.dependencies.length)) ||
    (value.stopReason === "dependenciesInspected" &&
      (value.dependencies.length !== 2 ||
        value.dependencies.some(
          (node) => node.outcome !== "ok" || node.parse !== "parsed",
        ) ||
        value.partialCoverage ||
        value.parseIncomplete ||
        value.saturated ||
        value.truncated ||
        value.sourceTruncated ||
        value.budgetExceeded)) ||
    (value.stopReason === "dependencyUnavailable" &&
      (!value.dependencies.length ||
        !value.partialCoverage ||
        (value.dependencies.length === 2 &&
          value.dependencies.every(
            (node) => node.outcome === "ok" && node.parse === "parsed",
          )))) ||
    (value.stopReason === "graphSaturated" && !value.saturated)
  )
    return null;

  try {
    const encoded = new TextEncoder().encode(JSON.stringify(value)).byteLength;
    if (encoded > DEPENDENCIES_REPORT_BYTES) return null;
    return JSON.parse(JSON.stringify(value));
  } catch {
    return null;
  }
}
