import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";

// No raw source, route values or arbitrary identifiers leave the TV.
export async function inspectHomeReferences(root, route) {
  function data(o, k) {
    const d = o && Object.getOwnPropertyDescriptor(o, k);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
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
  const url = permitted(data(route, "MESSAGE"));
  if (!url)
    return { state: "unavailable", errorCategory: "unsupported", methods: [] };
  const candidates = [
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
  ];
  const found = new Set();
  const controller = new root.AbortController();
  const timer = root.setTimeout(() => controller.abort(), 5000);
  let total = 0;
  async function read(u) {
    const response = await root.fetch(u.href, {
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      mode: "cors",
      signal: controller.signal,
    });
    if (!response.ok || !response.body?.getReader) throw Error();
    const reader = response.body.getReader();
    const decoder = new root.TextDecoder();
    let bytes = 0,
      text = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        total += value.byteLength;
        if (bytes > 524288 || total > 2097152) throw Error();
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      await reader.cancel();
    }
    for (const [, method] of candidates)
      if (new RegExp("\\b" + method + "\\b").test(text)) found.add(method);
    return text;
  }
  try {
    const html = await read(url);
    const scripts = new Set();
    for (const match of html.matchAll(
      /<script\b[^>]{0,4096}?\bsrc\s*=\s*(["'])([^"']{1,2048})\1[^>]*>/gi,
    )) {
      const next = permitted(match[2], url.href);
      if (next && next.origin === url.origin && next.href !== url.href)
        scripts.add(next.href);
      if (scripts.size >= 4) break;
    }
    for (const href of scripts) await read(new root.URL(href));
    return {
      state: "resolved",
      responseType: "string",
      methods: candidates
        .filter(([, name]) => found.has(name))
        .map(([scope, name]) => ({ scope, name, type: "function" })),
    };
  } catch {
    return { state: "rejected", errorCategory: "connection", methods: [] };
  } finally {
    root.clearTimeout(timer);
  }
}

export function startHomeReferences(root, document, inspect, reporterFactory) {
  let attempted = false,
    loaded = false,
    ready = false;
  const reporter = reporterFactory(root);
  function emit(update) {
    reporter.send({ loaded, ready, ...update });
    document.getElementById("result").textContent =
      update.state +
      "\nKnown SDK references only; no source or route values exported.\nNo storage writes or downloaded code execution.";
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", async () => {
    if (attempted) return;
    attempted = true;
    ready = true;
    emit({ state: "invoked" });
    try {
      const route = await root.VIZIO_MODULES.App.getVizioAppInfoByCname("sctv");
      emit(await inspect(root, route));
    } catch {
      emit({ state: "rejected", errorCategory: "other", methods: [] });
    }
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    reporter.send({ loaded, ready });
  };
  script.onerror = () => emit({ state: "unavailable" });
  document.body.appendChild(script);
}
export const HOME_SOURCE_CSP = SDK_BRIDGE_CSP.replace(
  "connect-src 'self' http://127.0.0.1:7346;",
  "connect-src 'self' http://127.0.0.1:7346 http://localhost:12345 http://127.0.0.1:12345;",
);
export const HOME_SOURCE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist Home reference check</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST HOME STATIC REFERENCES / 22</h1><p>Legacy and modular names. Bounded local static reads; no writes or code execution.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startHomeReferences.toString()})(window,document,${inspectHomeReferences.toString()},function(root){return createDiagnosticReporter(root,function(){return [];},'sdk-home-reference-22');});</script>`;
