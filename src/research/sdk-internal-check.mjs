import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
export function startInternalCheck(root, document, makeReporter) {
  let attempted = false,
    loaded = false,
    ready = false;
  const output = document.getElementById("result"),
    methods = [];
  const reporter = makeReporter(root, () => methods);
  function data(o, key) {
    const d = o && Object.getOwnPropertyDescriptor(o, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function collect(object, maxDepth = 2) {
    for (
      let depth = 0;
      depth < maxDepth && object && object !== Object.prototype;
      depth++, object = Object.getPrototypeOf(object)
    ) {
      for (const name of Object.getOwnPropertyNames(object)) {
        if (methods.length >= 128) return;
        if (
          !/^[A-Za-z_$][\w$]{0,63}$/.test(name) ||
          ["constructor", "prototype", "caller", "arguments"].includes(name)
        )
          continue;
        const value = data(object, name);
        if (
          typeof value === "function" &&
          !methods.some((m) => m.name === name)
        )
          methods.push({ scope: "InternalDocker", name, type: "function" });
      }
    }
  }
  function emit(update) {
    output.textContent =
      "Hidden SDK factory: " +
      update.state +
      "\nMethod metadata only. No raw source or values returned.";
    reporter.send({ loaded, ready, ...update });
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    if (attempted) return;
    attempted = true;
    ready = true;
    try {
      const modules = data(root, "VIZIO_MODULES"),
        factory = data(modules, "_docker");
      if (typeof factory !== "function") {
        emit({ state: "unavailable" });
        return;
      }
      methods.push({
        scope: "InternalDocker",
        name: "_docker",
        type: "function",
      });
      collect(factory, 1);
      collect(data(factory, "prototype"), 1);
      const source = Function.prototype.toString.call(factory).trim();
      const pure =
        /^\(\s*\)\s*=>\s*[A-Za-z_$][\w$]*\s*;?$/.test(source) ||
        /^function\s*(?:[A-Za-z_$][\w$]*)?\s*\(\s*\)\s*\{\s*return\s+[A-Za-z_$][\w$]*\s*;?\s*\}$/.test(
          source,
        );
      if (!pure) {
        emit({ state: "unavailable", responseType: "function" });
        return;
      }
      const result = factory.call(modules);
      if (
        result &&
        (typeof result === "object" || typeof result === "function")
      )
        collect(result, typeof result === "function" ? 1 : 2);
      emit({
        state: "resolved",
        responseType: result === null ? "null" : typeof result,
      });
    } catch {
      emit({ state: "threw", errorCategory: "other" });
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
export const SDK_INTERNAL_CSP = SDK_BRIDGE_CSP;
export const SDK_INTERNAL_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist hidden SDK metadata</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST INTERNAL SDK METADATA / 16</h1><p>Inspect factory. Invoke only if it is a pure identifier getter.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startInternalCheck.toString()})(window,document,function(root,collect){return createDiagnosticReporter(root,collect,"sdk-internal-docker-16");});</script>`;
