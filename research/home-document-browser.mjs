import { HOME_COVERAGE_CSP } from "./home-coverage-browser.mjs";
import { permittedDocumentURL } from "./home-document-policy.mjs";
import {
  emptyDocumentReport,
  validateHomeDocument,
} from "./home-document-contract.mjs";

// The worker has no source-to-Ally route. Only validated metadata can be posted.
export function makeDocumentParser(root, workerPath) {
  let worker,
    pending = false;
  try {
    worker = new root.Worker(workerPath);
  } catch {}
  return {
    async parse(source, mime, base, timeout = 1000) {
      if (!worker || pending) throw Error("parser_unavailable");
      pending = true;
      return new Promise((resolve, reject) => {
        const fail = () => {
          root.clearTimeout(timer);
          worker?.terminate();
          worker = null;
          pending = false;
          reject(Error("parser_failed"));
        };
        const timer = root.setTimeout(
          fail,
          Math.max(1, Math.min(timeout, 1000)),
        );
        worker.onerror = fail;
        worker.onmessage = ({ data }) => {
          root.clearTimeout(timer);
          pending = false;
          if (!data) {
            fail();
            return;
          }
          resolve(data);
        };
        try {
          worker.postMessage({ source, mime, base });
        } catch {
          fail();
        }
      });
    },
    close() {
      worker?.terminate();
      worker = null;
    },
  };
}

export async function checkDocumentParser(parser) {
  const base = "http://localhost:12345/scfs/fixture.html";
  const positive = await parser.parse(
    "<script src=/scfs/positive.js></script>",
    "html",
    base,
  );
  const negative = await parser.parse(
    '<!-- <script src="/scfs/false.js"></script> --><template><script src=/scfs/inert.js></script></template>',
    "html",
    base,
  );
  const nav = await parser.parse(
    '<script>location.replace("/scfs/next.html")</script>',
    "html",
    base,
  );
  return (
    positive.parse === "parsed" &&
    positive.shape.scripts === 1 &&
    positive.shape.unquotedSrcScripts === 1 &&
    positive.candidate?.kind === "singleScript" &&
    positive.candidate.href === "http://localhost:12345/scfs/positive.js" &&
    negative.parse === "parsed" &&
    negative.shape.scripts === 0 &&
    !negative.candidate &&
    !negative.truncated &&
    nav.parse === "parsed" &&
    nav.candidate?.kind === "literalNavigation" &&
    nav.shape.navigationContext === "topLevelOnly" &&
    nav.candidate.href === "http://localhost:12345/scfs/next.html"
  );
}

export async function inspectHomeDocument(
  root,
  route,
  run,
  parser,
  empty,
  permitted,
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
  const timer = root.setTimeout(() => {
    report.truncated = report.budgetExceeded = true;
    controller.abort();
  }, 5000);
  function remaining() {
    return Math.max(0, deadline - root.Date.now());
  }
  async function read(u, node, cap, negative = false) {
    report.filesAttempted++;
    node.outcome = "blocked";
    let reader;
    try {
      if (controller.signal.aborted || !remaining()) throw { kind: "timeout" };
      const response = await root.fetch(u.href, {
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        mode: "cors",
        signal: controller.signal,
      });
      if (!negative) {
        const type = (response.headers.get("content-type") || "")
          .split(";")[0]
          .trim()
          .toLowerCase();
        node.mime = ["text/html", "application/xhtml+xml"].includes(type)
          ? "html"
          : [
                "application/javascript",
                "text/javascript",
                "application/x-javascript",
              ].includes(type)
            ? "javascript"
            : type
              ? "other"
              : "missing";
      }
      if (!response.ok && !negative) {
        await response.body?.cancel();
        throw { kind: "httpError" };
      }
      if (!response.body?.getReader) throw { kind: "unsupported" };
      reader = response.body.getReader();
      const parts = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const accepted = Math.min(value.byteLength, cap - node.bytes);
        node.bytes += accepted;
        report.bytesRead += accepted;
        if (accepted !== value.byteLength) throw { kind: "tooLarge" };
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
      report.truncated = true;
      if (["tooLarge", "timeout"].includes(node.outcome))
        report.budgetExceeded = true;
      return null;
    } finally {
      try {
        await reader?.cancel();
      } catch {}
    }
  }
  async function classify(bytes, node, base) {
    try {
      if (!remaining()) throw Error();
      const parsed = await parser.parse(
        new root.TextDecoder().decode(bytes),
        node.mime,
        base,
        remaining(),
      );
      node.parse = parsed.parse;
      node.shape = parsed.shape;
      report.truncated ||= parsed.truncated;
      for (const m of parsed.methods)
        if (
          !report.methods.some(
            (previous) =>
              previous.scope === m.scope && previous.name === m.name,
          )
        )
          report.methods.push(m);
      return parsed;
    } catch {
      node.parse = "limit";
      node.shape.navigation =
        node.shape.literalTargetClass =
        node.shape.navigationContext =
          "unknown";
      report.truncated = report.budgetExceeded = true;
      return null;
    }
  }
  try {
    const bytes = await read(url, report.root, 16384);
    if (!bytes) {
      report.stopReason = report.budgetExceeded ? "budget" : "rootUnavailable";
      return report;
    }
    report.state = "resolved";
    if (report.root.mime !== "html") return report;
    const parsed = await classify(bytes, report.root, url.href);
    if (!parsed || report.root.parse !== "parsed") {
      report.stopReason = report.budgetExceeded ? "budget" : "parseIncomplete";
      return report;
    }
    const absent = permitted("mist-absent-" + run + ".html", url.href);
    if (!absent || absent.origin !== url.origin) {
      report.stopReason = "policyDenied";
      return report;
    }
    const negative = await read(absent, report.negative, 16384, true);
    if (!negative) {
      report.stopReason = report.budgetExceeded
        ? "budget"
        : "comparisonUnavailable";
      return report;
    }
    report.negative.comparison =
      bytes.length === negative.length &&
      bytes.every((b, i) => b === negative[i])
        ? "equal"
        : "different";
    if (report.negative.comparison === "equal") {
      report.stopReason = "sameResponse";
      return report;
    }
    if (!parsed.candidate) {
      report.stopReason = parsed.reason;
      return report;
    }
    const next = permitted(parsed.candidate.href);
    if (!next || next.origin !== url.origin) {
      report.stopReason = "policyDenied";
      return report;
    }
    if ([url.href, absent.href].includes(next.href)) {
      report.stopReason = "selfLoop";
      return report;
    }
    if (!remaining() || report.truncated) {
      report.truncated = report.budgetExceeded = true;
      report.stopReason = "budget";
      return report;
    }
    report.continuationReason = parsed.candidate.kind;
    const child = await read(next, report.continuation, 524288);
    if (!child) {
      report.stopReason = report.budgetExceeded
        ? "budget"
        : "continuationUnavailable";
      return report;
    }
    if (["html", "javascript"].includes(report.continuation.mime))
      await classify(child, report.continuation, next.href);
    report.stopReason = report.budgetExceeded
      ? "budget"
      : report.continuation.parse !== "parsed" &&
          ["html", "javascript"].includes(report.continuation.mime)
        ? "parseIncomplete"
        : "continuationInspected";
    return report;
  } finally {
    root.clearTimeout(timer);
    controller.abort();
  }
}

export function startHomeDocument(
  root,
  document,
  makeParser,
  controls,
  inspect,
  empty,
  permitted,
  validate,
) {
  const run = root.location.pathname.match(
    /^\/research\/home-document\/([a-f0-9]{32})$/,
  )?.[1];
  if (!run) return;
  let attempted = false,
    loaded = false,
    sequence = 0,
    latest = null;
  const parser = makeParser(root, "/research/document-parser/" + run);
  let controlPassed = false;
  const control = Promise.resolve()
    .then(() => controls(parser))
    .catch(() => false)
    .then((value) => {
      controlPassed = value;
      return value;
    });
  function publish() {
    if (!latest) return;
    const value = validate({ ...latest, loaded, sequence: sequence++ });
    if (!value) return;
    void root
      .fetch("/research/document-report", {
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
    if (attempted) return;
    attempted = true;
    root.clearTimeout(startupTimer);
    if (!(await control)) {
      latest = empty(run);
      parser.close();
      publish();
      return;
    }
    let timer, route;
    try {
      route = await Promise.race([
        Promise.resolve().then(() =>
          root.VIZIO_MODULES.App.getVizioAppInfoByCname("sctv"),
        ),
        new Promise((_, reject) => {
          timer = root.setTimeout(() => reject(Error()), 5000);
        }),
      ]);
      latest = await inspect(root, route, run, parser, empty, permitted);
    } catch {
      latest = empty(run);
      latest.control = "passed";
      latest.ready = true;
      latest.stopReason = "rootUnavailable";
    } finally {
      root.clearTimeout(timer);
      parser.close();
    }
    document.getElementById("result").textContent =
      "Document inspection finished; source remains on TV.";
    publish();
  });
  // A late SDK event must not start a native call after this finite page has timed out.
  const startupTimer = root.setTimeout(() => {
    if (attempted) return;
    attempted = true;
    parser.close();
    latest = empty(run);
    if (controlPassed) {
      latest.control = "passed";
      latest.stopReason = "rootUnavailable";
    }
    publish();
  }, 12000);
  root.addEventListener?.(
    "pagehide",
    () => {
      attempted = true;
      root.clearTimeout(startupTimer);
      parser.close();
    },
    { once: true },
  );
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    publish();
  };
  script.onerror = async () => {
    attempted = true;
    root.clearTimeout(startupTimer);
    await control;
    parser.close();
    latest = empty(run);
    publish();
  };
  document.body.appendChild(script);
}

export const HOME_DOCUMENT_CSP = HOME_COVERAGE_CSP + "; worker-src 'self';";
// Entry bundle includes validators and their dependencies; inspected source never enters this build.
export const documentPagePrefix =
  '<!doctype html><meta charset="utf-8"><title>Mist document identity</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}</style><h1>MIST DOCUMENT IDENTITY / 24</h1><pre id="result">Waiting for SDK readiness and parser controls.</pre>';
export function runDocumentPage() {
  startHomeDocument(
    window,
    document,
    makeDocumentParser,
    checkDocumentParser,
    inspectHomeDocument,
    emptyDocumentReport,
    permittedDocumentURL,
    validateHomeDocument,
  );
}
