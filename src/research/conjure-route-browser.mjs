import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
import { CATALOG_FIELDS, projectCatalogShape } from "./catalog-shape.mjs";
import { selectKnownRoutes } from "./conjure-route-filter.mjs";
export function startConjureRouteCheck(
  root,
  document,
  select,
  project,
  fields,
  makeReporter,
) {
  let attempted = false,
    ready = false,
    loaded = false;
  const output = document.getElementById("result"),
    reporter = makeReporter(root),
    lines = [];
  const run = root.location.pathname.match(/\/([a-f0-9]{32})$/)?.[1];
  if (!run) return;
  function data(o, key) {
    const d = o && Object.getOwnPropertyDescriptor(o, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function emit(update) {
    reporter.send({ loaded, ready, ...update });
  }
  function show(line) {
    lines.push(line);
    output.textContent =
      lines.join("\n") +
      "\nDerived counts/types only. No IDs/names/URLs exported or changed.";
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", async () => {
    ready = true;
    if (attempted) return;
    attempted = true;
    emit({ state: "invoked" });
    try {
      const module = data(data(root, "VIZIO_MODULES"), "System"),
        fn = data(module, "getConfigProperty");
      if (typeof fn !== "function") throw Error();
      const value = await fn.call(module, "VIZIOApps");
      for (const [target, id] of [
        ["vizioapps-home-route", "1"],
        ["vizioapps-conjure-route", "17"],
        ["vizioapps-absent-route", "99999999"],
      ]) {
        const selected = select(value, id);
        if (!selected) throw Error();
        const shape = project(selected.matches, fields);
        shape.truncated = shape.truncated || selected.truncated;
        const response = await root.fetch("/research/catalog-shape-report", {
          method: "POST",
          credentials: "omit",
          redirect: "error",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ run, target, shape }),
        });
        if (response.status !== 204) throw Error();
        show(
          target +
            ": entries " +
            shape.levels[0].children +
            ", truncated " +
            shape.truncated,
        );
      }
      emit({ state: "resolved", responseType: typeof value });
    } catch {
      show("Lookup/projection failed; details withheld.");
      emit({ state: "rejected", errorCategory: "other" });
    }
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    emit({});
  };
  script.onerror = () => emit({ state: "unavailable" });
  document.body.appendChild(script);
}
export const CONJURE_ROUTE_CSP = SDK_BRIDGE_CSP;
export const CONJURE_ROUTE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist Conjure route check</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST CONJURE ROUTE CONTROL / 19</h1><p>Read one existing catalog, derive three fixed route subsets. No writes.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startConjureRouteCheck.toString()})(window,document,${selectKnownRoutes.toString()},${projectCatalogShape.toString()},${JSON.stringify(CATALOG_FIELDS)},function(root){return createDiagnosticReporter(root,function(){return [{scope:"System",name:"getConfigProperty",type:"function"}];},"sdk-route-filter-19");});</script>`;
