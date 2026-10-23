import { HOME_COVERAGE_CSP } from "./home-coverage-browser.mjs";
import { permittedDocumentURL } from "./home-document-policy.mjs";
import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";
import {
  emptyDependenciesReport,
  HOME_DEPENDENCIES_FAILURE_REASONS,
  validateHomeDependencies,
} from "./home-dependencies-contract.mjs";

const SOURCE_LIMIT = 524288;
const ROOT_LIMIT = 16384;
const TOTAL_LIMIT = 1081344;
const GRAPH_LIMIT = 32;
const GRAPH_KINDS = new Set([
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
]);
const GRAPH_RELATIONSHIPS = new Set([
  "contains",
  "directCall",
  "registersCallback",
  "responseConsumer",
  "inserts",
]);
const MIME_TYPES = {
  html: ["text/html", "application/xhtml+xml"],
  javascript: [
    "application/javascript",
    "text/javascript",
    "application/x-javascript",
    "text/ecmascript",
    "application/ecmascript",
  ],
};
const failureReasons = new Set(HOME_DEPENDENCIES_FAILURE_REASONS);
const parserFailureReasons = new Set([
  "astNodeLimit",
  "astDepthLimit",
  "syntaxError",
  "unknownInternalFailure",
]);

function noteFailure(node, reason) {
  if (node && !node.failureReason && failureReasons.has(reason))
    node.failureReason = reason;
}

function validParserFailure(parsed) {
  if (!Object.hasOwn(parsed, "failureReason")) return true;
  const reason = parsed.failureReason;
  if (!parserFailureReasons.has(reason)) return false;
  if (reason === "syntaxError")
    return (
      ["partial", "failed"].includes(parsed.parse) &&
      ["partial", "failed"].includes(parsed.shape?.jsParse)
    );
  if (reason === "astNodeLimit" || reason === "astDepthLimit")
    return (
      parsed.parse === "limit" &&
      (parsed.shape?.jsParse === "limit" ||
        (parsed.shape?.jsParse === "notAttempted" &&
          parsed.sourceTruncated === false))
    );
  return ["partial", "failed", "limit"].includes(parsed.parse);
}

function mimeClass(headers) {
  let value = "";
  try {
    value = (headers?.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
  } catch {}
  if (MIME_TYPES.html.includes(value)) return "html";
  if (MIME_TYPES.javascript.includes(value)) return "javascript";
  return value ? "other" : "missing";
}

function cancelQuietly(value) {
  try {
    const result = value?.cancel?.();
    if (result && typeof result.catch === "function")
      void result.catch(() => {});
  } catch {}
}

function addMethods(report, methods) {
  if (!Array.isArray(methods)) return;
  for (const entry of methods) {
    if (
      !entry ||
      entry.type !== "function" ||
      !HOME_REFERENCE_METHODS.some(
        ([scope, name]) => entry.scope === scope && entry.name === name,
      ) ||
      report.methods.some(
        (previous) =>
          previous.scope === entry.scope && previous.name === entry.name,
      )
    )
      continue;
    if (report.methods.length < HOME_REFERENCE_METHODS.length) {
      report.methods.push({
        scope: entry.scope,
        name: entry.name,
        type: "function",
      });
    }
  }
}

// Only fixed syntax labels and integer edges cross from the private worker result.
function mergeGraph(report, sourceGraph, resource) {
  if (
    !sourceGraph ||
    !Array.isArray(sourceGraph.nodes) ||
    !Array.isArray(sourceGraph.edges)
  )
    return false;
  const ids = new Map();
  for (const node of sourceGraph.nodes) {
    if (
      !node ||
      !Number.isInteger(node.id) ||
      node.id < 0 ||
      node.id > 31 ||
      ids.has(node.id) ||
      !GRAPH_KINDS.has(node.kind)
    )
      return false;
    if (report.graph.nodes.length >= GRAPH_LIMIT) {
      report.saturated = true;
      report.truncated = true;
      ids.set(node.id, null);
      continue;
    }
    const id = report.graph.nodes.length;
    ids.set(node.id, id);
    report.graph.nodes.push({ id, resource, kind: node.kind });
  }
  const edgesSeen = new Set(
    report.graph.edges.map(
      (edge) => edge.from + ":" + edge.to + ":" + edge.relationship,
    ),
  );
  for (const edge of sourceGraph.edges) {
    if (
      !edge ||
      !Number.isInteger(edge.from) ||
      !Number.isInteger(edge.to) ||
      !GRAPH_RELATIONSHIPS.has(edge.relationship) ||
      !ids.has(edge.from) ||
      !ids.has(edge.to) ||
      edge.from === edge.to
    )
      return false;
    const from = ids.get(edge.from);
    const to = ids.get(edge.to);
    if (from === null || to === null) {
      report.saturated = true;
      report.truncated = true;
      continue;
    }
    const key = from + ":" + to + ":" + edge.relationship;
    if (edgesSeen.has(key)) continue;
    if (report.graph.edges.length >= GRAPH_LIMIT) {
      report.saturated = true;
      report.truncated = true;
      continue;
    }
    edgesSeen.add(key);
    report.graph.edges.push({ from, to, relationship: edge.relationship });
  }
  return true;
}

function incomplete(
  report,
  node,
  { source = false, budget = false, failureReason } = {},
) {
  node.parse = "limit";
  node.shape.jsParse = "limit";
  noteFailure(node, failureReason);
  report.parseIncomplete = true;
  report.truncated = true;
  if (source) report.sourceTruncated = true;
  if (budget) report.budgetExceeded = true;
}

export function makeDependenciesParser(root, workerPath) {
  let worker = null;
  let pending = false;
  try {
    worker = new root.Worker(workerPath);
  } catch {}
  return {
    async parse(source, mime, base, module = false, timeout = 1000) {
      if (!worker || pending) throw { failureReason: "workerUnavailable" };
      pending = true;
      return new Promise((resolve, reject) => {
        let timer;
        let settled = false;
        const clearHandlers = () => {
          if (!worker) return;
          worker.onmessage = null;
          worker.onerror = null;
          worker.onmessageerror = null;
        };
        const fail = (failureReason) => {
          if (settled) return;
          settled = true;
          root.clearTimeout(timer);
          clearHandlers();
          try {
            worker?.terminate();
          } catch {}
          worker = null;
          pending = false;
          reject({ failureReason });
        };
        try {
          timer = root.setTimeout(
            () => fail("workerDeadline"),
            Math.max(1, Math.min(timeout, 1000)),
          );
        } catch {
          fail("unknownInternalFailure");
          return;
        }
        worker.onerror = () => fail("workerError");
        worker.onmessageerror = () => fail("workerError");
        worker.onmessage = (event) => {
          if (settled) return;
          const data = event?.data;
          root.clearTimeout(timer);
          if (data === null || data === undefined) {
            fail("workerEmptyResponse");
            return;
          }
          if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data) &&
            Object.keys(data).length === 1 &&
            Object.hasOwn(data, "failureReason") &&
            data.failureReason === "workerError"
          ) {
            fail("workerError");
            return;
          }
          settled = true;
          clearHandlers();
          pending = false;
          resolve(data);
        };
        try {
          worker.postMessage({ source, mime, base, module });
        } catch {
          fail("workerPostFailure");
        }
      });
    },
    close() {
      try {
        worker?.terminate();
      } catch {}
      worker = null;
    },
  };
}

export async function checkDependenciesParser(parser) {
  const base = "http://localhost:12345/scfs/fixture.html";
  const html = await parser.parse(
    '<!doctype html><!-- <script src="/scfs/decoy.js"></script> --><template><script src="/scfs/template.js"></script></template><script type="module" src="/scfs/b&#46;js"></script><script src="/scfs/a.js"></script><script src="/scfs/a.js"></script>',
    "html",
    base,
  );
  const mixed = await parser.parse(
    '<!doctype html><script src="/scfs/a.js"></script><script type="module" src="/scfs/a.js"></script><script src="/scfs/b.js"></script>',
    "html",
    base,
  );
  const flow = await parser.parse(
    "async function consume(){const r=await fetch('/real');r.json()} function hidden(fetch,localStorage){fetch('/fake');localStorage.setItem('x','y')} fetch('/post',{method:'POST'});",
    "javascript",
    base,
    false,
  );
  const htmlCandidates = html?.scriptCandidates;
  const kinds = new Set(flow?.graph?.nodes?.map((node) => node.kind));
  return (
    html?.parse === "parsed" &&
    html?.reason === "ready" &&
    html?.shape?.scripts === 3 &&
    html?.shape?.uniqueDirectScripts === 2 &&
    htmlCandidates?.length === 2 &&
    htmlCandidates[0]?.href === "http://localhost:12345/scfs/b.js" &&
    htmlCandidates[0]?.mode === "module" &&
    htmlCandidates[1]?.href === "http://localhost:12345/scfs/a.js" &&
    mixed?.scriptCandidates?.some((candidate) => candidate.mode === "mixed") &&
    mixed?.reason === "ambiguous" &&
    flow?.parse === "parsed" &&
    kinds.has("networkRead") &&
    kinds.has("responseConsume") &&
    flow.graph.edges.some((edge) => edge.relationship === "responseConsumer") &&
    flow.graph.nodes.filter((node) => node.kind === "networkRead").length ===
      1 &&
    flow.unsupportedCount > 0 &&
    !flow.graph.nodes.some((node) => node.kind === "storageWrite")
  );
}

export async function inspectHomeDependencies(
  root,
  route,
  run,
  parser,
  empty = emptyDependenciesReport,
  permitted = permittedDocumentURL,
) {
  const report = empty(run);
  report.control = "passed";
  report.ready = true;
  report.stopReason = "rootUnavailable";
  const own = route && Object.getOwnPropertyDescriptor(route, "MESSAGE");
  const url = permitted(
    own && Object.hasOwn(own, "value") ? own.value : undefined,
  );
  if (!url) return report;

  const controller = new root.AbortController();
  const deadline = root.Date.now() + 5000;
  let reading = false;
  let collectionDeadlineExpired = false;
  let activeNode = null;
  function noteActiveFailure(reason) {
    if (activeNode !== report.negative) noteFailure(activeNode, reason);
  }
  const deadlineTimer = root.setTimeout(() => {
    collectionDeadlineExpired = true;
    report.truncated = true;
    report.budgetExceeded = true;
    if (reading) report.sourceTruncated = true;
    noteActiveFailure("collectionDeadline");
    controller.abort();
  }, 5000);
  const onPageHide = () => controller.abort();
  root.addEventListener?.("pagehide", onPageHide, { once: true });
  function remaining() {
    return Math.max(0, deadline - root.Date.now());
  }
  async function bounded(promise, cap = remaining()) {
    const milliseconds = Math.min(remaining(), cap);
    if (milliseconds <= 0) throw { kind: "timeout" };
    let timer;
    try {
      return await Promise.race([
        promise,
        new Promise((_, reject) => {
          timer = root.setTimeout(
            () => reject({ kind: "timeout" }),
            milliseconds,
          );
        }),
      ]);
    } finally {
      root.clearTimeout(timer);
    }
  }
  async function read(fileURL, node, cap, negative = false) {
    const previousNode = activeNode;
    activeNode = node;
    report.filesAttempted++;
    node.outcome = "blocked";
    let reader = null;
    let complete = false;
    try {
      if (!remaining() || controller.signal.aborted) throw { kind: "timeout" };
      reading = true;
      const response = await bounded(
        root.fetch(fileURL.href, {
          credentials: "omit",
          redirect: "error",
          cache: "no-store",
          referrerPolicy: "no-referrer",
          mode: "cors",
          signal: controller.signal,
        }),
      );
      if (!negative) node.mime = mimeClass(response.headers);
      if (!response.ok && !negative) {
        cancelQuietly(response.body);
        throw { kind: "httpError" };
      }
      if (!response.body?.getReader) throw { kind: "unsupported" };
      reader = response.body.getReader();
      const parts = [];
      while (true) {
        const { done, value } = await bounded(reader.read());
        if (done) {
          complete = true;
          break;
        }
        const length = value?.byteLength || 0;
        const remainingFile = cap - node.bytes;
        const remainingTotal = TOTAL_LIMIT - report.bytesRead;
        const accepted = Math.min(length, remainingFile, remainingTotal);
        node.bytes += accepted;
        report.bytesRead += accepted;
        if (accepted !== length) throw { kind: "tooLarge" };
        parts.push(value);
      }
      const bytes = new root.Uint8Array(node.bytes);
      let offset = 0;
      for (const part of parts) {
        bytes.set(part, offset);
        offset += part.byteLength;
      }
      node.outcome = response.ok ? "ok" : "httpError";
      return bytes;
    } catch (error) {
      node.outcome = controller.signal.aborted
        ? "timeout"
        : ["httpError", "unsupported", "tooLarge", "timeout"].includes(
              error?.kind,
            )
          ? error.kind
          : "blocked";
      if (node !== report.negative) {
        if (collectionDeadlineExpired || remaining() === 0)
          noteFailure(node, "collectionDeadline");
        else if (["blocked", "timeout"].includes(node.outcome))
          noteFailure(node, "unknownInternalFailure");
      }
      report.truncated = true;
      if (["tooLarge", "timeout"].includes(node.outcome)) {
        report.sourceTruncated = true;
        report.budgetExceeded = true;
      }
      return null;
    } finally {
      activeNode = previousNode;
      reading = false;
      cancelQuietly(reader);
      // Only a complete negative body permits an equality comparison, including HTTP errors.
      if (negative && complete) report.filesRead++;
    }
  }
  function mergeParsed(parsed, resource) {
    if (!parsed || typeof parsed !== "object") return false;
    addMethods(report, parsed.methods);
    const merged = mergeGraph(report, parsed.graph, resource);
    if (parsed.saturated === true) {
      report.saturated = true;
      report.truncated = true;
    }
    if (parsed.truncated === true) report.truncated = true;
    if (parsed.sourceTruncated === true) {
      report.sourceTruncated = true;
      report.truncated = true;
    }
    if (parsed.parseIncomplete === true) {
      report.parseIncomplete = true;
      report.truncated = true;
    }
    if (
      Number.isInteger(parsed.unsupportedCount) &&
      parsed.unsupportedCount > 0
    ) {
      const available = 64 - report.unsupportedCount;
      const accepted = Math.min(available, parsed.unsupportedCount);
      report.unsupportedCount += accepted;
      if (accepted !== parsed.unsupportedCount) {
        report.saturated = true;
        report.truncated = true;
      }
    }
    return merged;
  }
  async function classify(bytes, node, base, module, resource) {
    const previousNode = activeNode;
    activeNode = node;
    if (!remaining()) {
      incomplete(report, node, {
        budget: true,
        failureReason: "collectionDeadline",
      });
      activeNode = previousNode;
      return null;
    }
    try {
      const source = new root.TextDecoder().decode(bytes);
      const parsed = await bounded(
        parser.parse(
          source,
          node.mime,
          base,
          module,
          Math.min(remaining(), 1000),
        ),
        1000,
      );
      if (
        !parsed ||
        !["parsed", "partial", "failed", "limit"].includes(parsed.parse) ||
        !parsed.shape ||
        !Array.isArray(parsed.methods) ||
        !parsed.graph
      ) {
        incomplete(report, node, { failureReason: "invalidParserResult" });
        return null;
      }
      if (!validParserFailure(parsed)) {
        incomplete(report, node, { failureReason: "invalidParserResult" });
        return null;
      }
      node.parse = parsed.parse;
      node.shape = parsed.shape;
      if (!mergeParsed(parsed, resource)) {
        incomplete(report, node, { failureReason: "invalidParserGraph" });
        return null;
      }
      noteFailure(node, parsed.failureReason);
      return parsed;
    } catch (error) {
      const reason = failureReasons.has(error?.failureReason)
        ? error.failureReason
        : error?.kind === "timeout"
          ? collectionDeadlineExpired || remaining() === 0
            ? "collectionDeadline"
            : "workerDeadline"
          : collectionDeadlineExpired || remaining() === 0
            ? "collectionDeadline"
            : "unknownInternalFailure";
      incomplete(report, node, {
        budget: collectionDeadlineExpired || remaining() === 0,
        failureReason: reason,
      });
      return null;
    } finally {
      activeNode = previousNode;
    }
  }
  function finishCounts() {
    report.filesRead =
      Number(report.root.outcome === "ok") +
      Number(
        ["ok", "httpError"].includes(report.negative.outcome) &&
          ["equal", "different"].includes(report.negative.comparison),
      ) +
      report.dependencies.filter((item) => item.outcome === "ok").length;
    report.partialCoverage =
      report.dependencies.length > 0 &&
      (report.dependencies.length < 2 ||
        report.dependencies.some(
          (item) => item.outcome !== "ok" || item.parse !== "parsed",
        ));
  }
  function final(reason) {
    report.stopReason = reason;
    finishCounts();
    return report;
  }

  try {
    const rootBytes = await read(url, report.root, ROOT_LIMIT);
    if (!rootBytes)
      return final(report.budgetExceeded ? "budget" : "rootUnavailable");
    report.state = "resolved";
    if (report.root.mime !== "html") return final("rootUnavailable");
    const rootParsed = await classify(
      rootBytes,
      report.root,
      url.href,
      false,
      "root",
    );
    if (!rootParsed || report.root.parse !== "parsed")
      return final(report.budgetExceeded ? "budget" : "parseIncomplete");

    const absentURL = permitted("mist-absent-" + run + ".html", url.href);
    if (!absentURL || absentURL.origin !== url.origin)
      return final("policyDenied");
    const absentBytes = await read(
      absentURL,
      report.negative,
      ROOT_LIMIT,
      true,
    );
    if (!absentBytes)
      return final(report.budgetExceeded ? "budget" : "comparisonUnavailable");
    report.negative.comparison =
      rootBytes.length === absentBytes.length &&
      rootBytes.every((byte, index) => byte === absentBytes[index])
        ? "equal"
        : "different";
    if (report.negative.comparison === "equal") return final("sameResponse");

    if (report.saturated) return final("graphSaturated");
    const candidates = rootParsed.scriptCandidates;
    if (!Array.isArray(candidates) || candidates.length !== 2)
      return final(
        ["noCandidate", "ambiguous", "external", "policyDenied"].includes(
          rootParsed.reason,
        )
          ? rootParsed.reason
          : candidates?.length > 2
            ? "ambiguous"
            : "noCandidate",
      );
    const normalized = [];
    let invalidReason = null;
    for (const candidate of candidates) {
      if (
        !candidate ||
        typeof candidate.href !== "string" ||
        !["classic", "module", "mixed"].includes(candidate.mode)
      ) {
        invalidReason = "ambiguous";
        normalized.push(null);
        continue;
      }
      const checked = permitted(candidate.href, url.href);
      if (!checked || checked.origin !== url.origin) {
        let external = false;
        try {
          external =
            new root.URL(candidate.href, url.href).origin !== url.origin;
        } catch {}
        invalidReason = external ? "external" : "policyDenied";
        normalized.push(null);
      } else {
        normalized.push(checked);
      }
    }
    if (normalized.some((item) => item === null))
      return final(invalidReason || "policyDenied");
    if (
      normalized[0].href === normalized[1].href ||
      candidates.some((candidate) => candidate.mode === "mixed")
    )
      return final("ambiguous");
    if (rootParsed.reason === "ambiguous") return final("ambiguous");
    if (rootParsed.reason === "policyDenied") return final("policyDenied");
    if (rootParsed.reason !== "ready")
      return final(
        ["noCandidate", "ambiguous", "external", "policyDenied"].includes(
          rootParsed.reason,
        )
          ? rootParsed.reason
          : "ambiguous",
      );
    if (
      normalized.some(
        (candidate) =>
          candidate.href === url.href || candidate.href === absentURL.href,
      )
    )
      return final("selfLoop");

    for (let index = 0; index < 2; index++) {
      if (report.saturated) return final("graphSaturated");
      if (!remaining() || report.truncated)
        return final(report.budgetExceeded ? "budget" : "parseIncomplete");
      const dependency = {
        mode: candidates[index].mode,
        outcome: "notAttempted",
        mime: "missing",
        bytes: 0,
        parse: "notAttempted",
        shape: {
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
        },
      };
      report.dependencies.push(dependency);
      const bytes = await read(normalized[index], dependency, SOURCE_LIMIT);
      if (!bytes)
        return final(
          report.budgetExceeded ? "budget" : "dependencyUnavailable",
        );
      if (dependency.mime !== "javascript")
        return final("dependencyUnavailable");
      const parsed = await classify(
        bytes,
        dependency,
        normalized[index].href,
        dependency.mode === "module",
        "dependency" + (index + 1),
      );
      if (!parsed || dependency.parse !== "parsed")
        return final(report.budgetExceeded ? "budget" : "parseIncomplete");
      if (report.saturated) return final("graphSaturated");
    }
    return final("dependenciesInspected");
  } catch {
    report.truncated = true;
    const deadlineReached = collectionDeadlineExpired || remaining() === 0;
    if (deadlineReached) report.budgetExceeded = true;
    const failureTarget =
      activeNode === report.negative
        ? null
        : activeNode ||
          (report.root.outcome === "ok" && report.root.parse !== "notAttempted"
            ? report.root
            : null);
    if (failureTarget?.outcome === "ok") {
      incomplete(report, failureTarget, {
        budget: deadlineReached,
        failureReason: deadlineReached
          ? "collectionDeadline"
          : "unknownInternalFailure",
      });
    } else if (failureTarget) {
      noteFailure(
        failureTarget,
        deadlineReached ? "collectionDeadline" : "unknownInternalFailure",
      );
    }
    finishCounts();
    report.stopReason = report.budgetExceeded
      ? "budget"
      : report.root.outcome === "notAttempted"
        ? "rootUnavailable"
        : "parseIncomplete";
    return report;
  } finally {
    root.clearTimeout(deadlineTimer);
    root.removeEventListener?.("pagehide", onPageHide);
    controller.abort();
  }
}

export function startHomeDependencies(
  root,
  document,
  makeParser = makeDependenciesParser,
  controls = checkDependenciesParser,
  inspect = inspectHomeDependencies,
  empty = emptyDependenciesReport,
  permitted = permittedDocumentURL,
  validate = validateHomeDependencies,
) {
  const run = root.location.pathname.match(
    /^\/research\/home-dependencies\/([a-f0-9]{32})$/,
  )?.[1];
  if (!run) return;
  let attempted = false;
  let pageClosed = false;
  let loaded = false;
  let sequence = 0;
  let latest = null;
  const parser = makeParser(root, "/research/dependency-parser/" + run);
  let controlPassed = false;
  const control = Promise.resolve()
    .then(() => controls(parser))
    .catch(() => false)
    .then((value) => {
      controlPassed = value === true;
      return controlPassed;
    });
  function publish() {
    if (!latest || pageClosed) return;
    const value = validate({ ...latest, loaded, sequence: sequence++ });
    if (!value) return;
    void root
      .fetch("/research/dependency-report", {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      })
      .catch(() => {});
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", async () => {
    if (attempted || pageClosed) return;
    attempted = true;
    root.clearTimeout(startupTimer);
    if (!(await control)) {
      if (pageClosed) return;
      latest = empty(run);
      parser.close?.();
      publish();
      return;
    }
    if (pageClosed) return;
    let timer;
    let route;
    try {
      route = await Promise.race([
        Promise.resolve().then(() =>
          root.VIZIO_MODULES.App.getVizioAppInfoByCname("sctv"),
        ),
        new Promise((_, reject) => {
          timer = root.setTimeout(() => reject(Error("sdk_timeout")), 5000);
        }),
      ]);
      if (pageClosed) return;
      latest = await inspect(root, route, run, parser, empty, permitted);
      if (pageClosed) return;
    } catch {
      if (pageClosed) return;
      latest = empty(run);
      latest.control = "passed";
      latest.ready = true;
      latest.stopReason = "rootUnavailable";
    } finally {
      root.clearTimeout(timer);
      parser.close?.();
    }
    document.getElementById("result").textContent =
      "Dependency inspection finished; source remains on TV.";
    publish();
  });
  // The companion SDK setup is bounded and initiated only after parser controls pass.
  const startupTimer = root.setTimeout(() => {
    if (attempted || pageClosed) return;
    attempted = true;
    parser.close?.();
    latest = empty(run);
    if (controlPassed) {
      latest.control = "passed";
      latest.ready = true;
      latest.stopReason = "rootUnavailable";
    }
    publish();
  }, 12000);
  root.addEventListener?.(
    "pagehide",
    () => {
      pageClosed = true;
      attempted = true;
      root.clearTimeout(startupTimer);
      parser.close?.();
    },
    { once: true },
  );
  // Load the existing SDK only after controls pass; the SDK getter remains one-shot.
  void control.then((passed) => {
    if (attempted || pageClosed || !passed) return;
    const script = document.createElement("script");
    script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
    script.referrerPolicy = "no-referrer";
    script.onload = () => {
      if (pageClosed) return;
      loaded = true;
      publish();
    };
    script.onerror = () => {
      if (attempted || pageClosed) return;
      attempted = true;
      root.clearTimeout(startupTimer);
      parser.close?.();
      latest = empty(run);
      latest.control = "passed";
      latest.ready = true;
      latest.stopReason = "rootUnavailable";
      publish();
    };
    document.body.appendChild(script);
  });
}

export const HOME_DEPENDENCIES_CSP = HOME_COVERAGE_CSP + "; worker-src 'self';";
export const dependenciesPagePrefix =
  '<!doctype html><meta charset="utf-8"><title>Mist Home dependencies</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}</style><h1>MIST HOME DEPENDENCIES / 25</h1><pre id="result">Waiting for parser controls and SDK readiness.</pre>';
