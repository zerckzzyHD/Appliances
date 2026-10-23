import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";

// Source remains in this TV renderer. No rendering/eval, storage reads or arbitrary URLs.
export async function inspectHomeCoverage(root, route, methodList) {
  const result = {
    routeRelation: "unavailable",
    routeClass: "unsupported",
    documentOutcome: "unsupported",
    mimeClass: "missing",
    filesAttempted: 0,
    filesRead: 0,
    bytesRead: 0,
    scriptsSeen: 0,
    scriptsEligible: 0,
    truncated: false,
    budgetExceeded: false,
    methods: [],
  };
  const own = (object, key) => {
    const d = object && Object.getOwnPropertyDescriptor(object, key);
    return d && Object.hasOwn(d, "value") ? d.value : undefined;
  };
  function permitted(value, base) {
    if (typeof value !== "string" || value.length > 2048) return null;
    try {
      const u = new root.URL(value, base);
      if (
        u.protocol !== "http:" ||
        !["localhost", "127.0.0.1"].includes(u.hostname) ||
        u.port !== "12345" ||
        !u.pathname.startsWith("/scfs/") ||
        u.username ||
        u.password ||
        u.search ||
        u.hash ||
        /(?:config|token|account|identity|credential)/i.test(u.pathname)
      )
        return null;
      return u;
    } catch {
      return null;
    }
  }
  const value = own(route, "MESSAGE");
  const url = permitted(value);
  if (!url) {
    try {
      const u = new root.URL(value);
      if (
        ["http:", "https:"].includes(u.protocol) &&
        !["localhost", "127.0.0.1"].includes(u.hostname)
      )
        result.routeClass = "external";
    } catch {}
    return result;
  }
  result.routeClass = "localStatic";
  const controller = new root.AbortController();
  const timer = root.setTimeout(() => {
    result.budgetExceeded = true;
    controller.abort();
  }, 5000);
  const found = new Set();
  async function read(u, document) {
    result.filesAttempted++;
    let reader;
    try {
      const response = await root.fetch(u.href, {
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        referrerPolicy: "no-referrer",
        mode: "cors",
        signal: controller.signal,
      });
      const mime = (response.headers.get("content-type") || "")
        .split(";")[0]
        .trim()
        .toLowerCase();
      const mimeClass = ["text/html", "application/xhtml+xml"].includes(mime)
        ? "html"
        : [
              "text/javascript",
              "application/javascript",
              "application/x-javascript",
            ].includes(mime)
          ? "javascript"
          : mime
            ? "other"
            : "missing";
      if (document) result.mimeClass = mimeClass;
      if (!response.ok) {
        await response.body?.cancel();
        throw { outcome: "httpError" };
      }
      if (!response.body?.getReader) throw { outcome: "unsupported" };
      reader = response.body.getReader();
      const decoder = new root.TextDecoder();
      let bytes = 0,
        text = "";
      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const accepted = Math.min(
          chunk.byteLength,
          524288 - bytes,
          2097152 - result.bytesRead,
        );
        bytes += accepted;
        result.bytesRead += accepted;
        if (accepted !== chunk.byteLength) {
          result.truncated = true;
          result.budgetExceeded = true;
          throw { outcome: "tooLarge" };
        }
        text += decoder.decode(chunk, { stream: true });
      }
      text += decoder.decode();
      result.filesRead++;
      for (const [, name] of methodList)
        if (new RegExp("\\b" + name + "\\b").test(text)) found.add(name);
      return text;
    } catch (error) {
      result.truncated = true;
      if (document)
        result.documentOutcome =
          result.budgetExceeded && controller.signal.aborted
            ? "timeout"
            : ["httpError", "unsupported", "tooLarge"].includes(error?.outcome)
              ? error.outcome
              : "blocked";
      return null;
    } finally {
      if (reader) {
        try {
          await reader.cancel();
        } catch {}
      }
    }
  }
  try {
    const html = await read(url, true);
    if (html === null) return result;
    result.documentOutcome = "ok";
    const scripts = new Set();
    for (const match of html.matchAll(
      /<script\b[^>]{0,4096}?\bsrc\s*=\s*(["'])([^"']{1,2048})\1[^>]*>/gi,
    )) {
      if (result.scriptsSeen === 128) {
        result.truncated = true;
        break;
      }
      result.scriptsSeen++;
      const next = permitted(match[2], url.href);
      if (next && next.origin === url.origin && next.href !== url.href)
        scripts.add(next.href);
    }
    result.scriptsEligible = scripts.size;
    if (scripts.size > 4) result.truncated = true;
    for (const href of [...scripts].slice(0, 4)) {
      if (controller.signal.aborted || result.bytesRead >= 2097152) {
        result.truncated = true;
        result.budgetExceeded = true;
        break;
      }
      await read(new root.URL(href), false);
    }
    return result;
  } finally {
    root.clearTimeout(timer);
    result.methods = methodList
      .filter(([, name]) => found.has(name))
      .map(([scope, name]) => ({ scope, name, type: "function" }));
  }
}

export function startHomeCoverage(root, document, inspect, methods) {
  const match = root.location.pathname.match(/\/([a-f0-9]{32})$/);
  if (!match) return;
  let attempted = false,
    loaded = false,
    sequence = 0,
    latest = null;
  async function send() {
    if (!latest) return;
    try {
      await root.fetch("/research/coverage-report", {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...latest, loaded, sequence: sequence++ }),
      });
    } catch {}
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", async () => {
    if (attempted) return;
    attempted = true;
    let route;
    try {
      route = await root.VIZIO_MODULES.App.getVizioAppInfoByCname("sctv");
    } catch {}
    const coverage = await inspect(root, route, methods);
    latest = {
      probe: "sdk-home-coverage-23",
      run: match[1],
      ready: true,
      state: coverage.documentOutcome === "ok" ? "resolved" : "unavailable",
      ...coverage,
    };
    document.getElementById("result").textContent =
      "Bounded coverage inspection finished. Source remains on TV.";
    await send();
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    if (latest) void send();
  };
  document.body.appendChild(script);
}
export const HOME_COVERAGE_CSP = SDK_BRIDGE_CSP.replace(
  "connect-src 'self' http://127.0.0.1:7346;",
  "connect-src 'self' http://127.0.0.1:7346 http://localhost:12345 http://127.0.0.1:12345;",
);
export const HOME_COVERAGE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist Home coverage</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}</style><h1>MIST HOME COVERAGE / 23</h1><pre id="result">Waiting for SDK readiness.</pre><script>(${startHomeCoverage.toString()})(window,document,${inspectHomeCoverage.toString()},${JSON.stringify(HOME_REFERENCE_METHODS)});</script>`;
