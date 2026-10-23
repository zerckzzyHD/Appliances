import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
export function startAppLookup(root, document, makeReporter) {
  let loaded = false,
    ready = false,
    attempted = false;
  const lines = [];
  const output = document.getElementById("result");
  const queries = [
    {
      probe: "sdk-app-home-info-18",
      scope: "App",
      method: "getAppInfo",
      args: ["1", 4],
    },
    {
      probe: "sdk-app-conjure-info-18",
      scope: "App",
      method: "getAppInfo",
      args: ["17", 4],
    },
    {
      probe: "sdk-app-absent-info-18",
      scope: "App",
      method: "getAppInfo",
      args: ["99999999", 4],
    },
    {
      probe: "sdk-app-conjure-cname-18",
      scope: "App",
      method: "getVizioAppInfoByCname",
      args: ["conjure"],
    },
  ];
  function data(object, key) {
    const d = object && Object.getOwnPropertyDescriptor(object, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  const reporters = queries.map((q) => makeReporter(root, q));
  function emit(index, update) {
    reporters[index].send({ loaded, ready, ...update });
    lines[index] =
      queries[index].probe +
      ": " +
      update.state +
      (update.responseType ? " / " + update.responseType : "");
    output.textContent =
      lines.join("\n") + "\nAll values withheld. No write/launch command.";
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    ready = true;
    if (attempted) return;
    attempted = true;
    queries.forEach((q, index) => {
      const module = data(data(root, "VIZIO_MODULES"), q.scope),
        fn = data(module, q.method);
      if (typeof fn !== "function") {
        emit(index, { state: "unavailable" });
        return;
      }
      let settled = false;
      emit(index, { state: "invoked" });
      const finish = (state, value) => {
        if (settled) return;
        settled = true;
        if (state === "resolved")
          emit(index, {
            state,
            responseType: value === null ? "null" : typeof value,
          });
        else emit(index, { state, errorCategory: "other" });
      };
      try {
        Promise.resolve(fn.apply(module, q.args)).then(
          (value) => finish("resolved", value),
          () => finish("rejected"),
        );
      } catch {
        finish("threw");
      }
      root.setTimeout(() => {
        if (!settled) {
          settled = true;
          emit(index, { state: "rejected", errorCategory: "timeout" });
        }
      }, 8000);
    });
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    reporters.forEach((r) => r.send({ loaded, ready }));
  };
  script.onerror = () =>
    queries.forEach((q, i) => emit(i, { state: "unavailable" }));
  document.body.appendChild(script);
}
export const SDK_APP_LOOKUP_CSP = SDK_BRIDGE_CSP;
export const SDK_APP_LOOKUP_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist catalog type check</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST APP LOOKUP CONTROL / 18</h1><p>Four fixed app lookups, including an absent-ID control. Types only; no data export or writes.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startAppLookup.toString()})(window,document,function(root,q){return createDiagnosticReporter(root,function(){return [{scope:q.scope,name:q.method,type:"function"}];},q.probe);});</script>`;
