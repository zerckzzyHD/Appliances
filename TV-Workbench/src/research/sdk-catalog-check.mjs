import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
export function startCatalogCheck(
  root,
  document,
  makeReporter,
  selectedQueries = null,
) {
  let loaded = false,
    ready = false,
    attempted = false;
  const lines = [];
  const output = document.getElementById("result");
  const queries = selectedQueries ?? [
    {
      probe: "sdk-config-absent-14",
      scope: "System",
      method: "getConfigProperty",
      key: "MistResearchAbsentControl20261017",
    },
    {
      probe: "sdk-config-vizioapps-14",
      scope: "System",
      method: "getConfigProperty",
      key: "VIZIOApps",
    },
    {
      probe: "sdk-config-virtualinputs-14",
      scope: "System",
      method: "getConfigProperty",
      key: "VirtualInputs",
    },
    {
      probe: "sdk-config-appmigration-14",
      scope: "System",
      method: "getConfigProperty",
      key: "AppMigration",
    },
    {
      probe: "sdk-app-sctv-14",
      scope: "App",
      method: "getVizioAppInfoByCname",
      key: "sctv",
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
        Promise.resolve(fn.call(module, q.key)).then(
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
export const SDK_CATALOG_CSP = SDK_BRIDGE_CSP;
export const SDK_CATALOG_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist catalog type check</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST CATALOG TYPES / 14</h1><p>Five fixed read-only lookups, including an absent-key control. Types only; no data export or writes.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startCatalogCheck.toString()})(window,document,function(root,q){return createDiagnosticReporter(root,function(){return [{scope:q.scope,name:q.method,type:"function"}];},q.probe);});</script>`;
