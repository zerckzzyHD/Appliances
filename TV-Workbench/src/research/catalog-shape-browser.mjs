import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
import { CATALOG_FIELDS, projectCatalogShape } from "./catalog-shape.mjs";
export function startCatalogShape(
  root,
  document,
  project,
  fields,
  makeReporter,
) {
  let attempted = false;
  const output = document.getElementById("result"),
    lines = [];
  const run = root.location.pathname.match(/\/([a-f0-9]{32})$/)?.[1];
  if (!run) return;
  const queries = [
    {
      target: "vizioapps",
      scope: "System",
      method: "getConfigProperty",
      key: "VIZIOApps",
      probe: "sdk-config-vizioapps-14",
    },
    {
      target: "virtualinputs",
      scope: "System",
      method: "getConfigProperty",
      key: "VirtualInputs",
      probe: "sdk-config-virtualinputs-14",
    },
    {
      target: "appmigration",
      scope: "System",
      method: "getConfigProperty",
      key: "AppMigration",
      probe: "sdk-config-appmigration-14",
    },
    {
      target: "sctv",
      scope: "App",
      method: "getVizioAppInfoByCname",
      key: "sctv",
      probe: "sdk-app-sctv-14",
    },
  ];
  function data(object, key) {
    const d = object && Object.getOwnPropertyDescriptor(object, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function show(line) {
    lines.push(line);
    output.textContent =
      lines.join("\n") +
      "\nNo scalar values or unknown field names exported. No writes.";
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", async () => {
    if (attempted) return;
    attempted = true;
    for (const q of queries) {
      const reporter = makeReporter(root, q);
      reporter.send({ loaded: true, ready: true, state: "invoked" });
      let timer;
      try {
        const module = data(data(root, "VIZIO_MODULES"), q.scope),
          fn = data(module, q.method);
        if (typeof fn !== "function") throw new Error();
        const value = await Promise.race([
          Promise.resolve(fn.call(module, q.key)),
          new Promise((resolve, reject) => {
            timer = root.setTimeout(() => reject(new Error()), 8000);
          }),
        ]);
        root.clearTimeout(timer);
        const shape = project(value, fields);
        const response = await root.fetch("/research/catalog-shape-report", {
          method: "POST",
          credentials: "omit",
          redirect: "error",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ run, target: q.target, shape }),
        });
        show(
          q.target +
            ": " +
            shape.kind +
            ", visited " +
            shape.visited +
            ", upload HTTP " +
            response.status,
        );
        reporter.send({
          loaded: true,
          ready: true,
          state: "resolved",
          responseType: value === null ? "null" : typeof value,
        });
      } catch {
        show(q.target + ": failed; details withheld.");
        reporter.send({
          loaded: true,
          ready: true,
          state: "rejected",
          errorCategory: "other",
        });
      } finally {
        if (timer) root.clearTimeout(timer);
      }
    }
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onerror = () => show("SDK unavailable; no calls made.");
  document.body.appendChild(script);
}
export const CATALOG_SHAPE_CSP = SDK_BRIDGE_CSP;
export const CATALOG_SHAPE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist catalog structure</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST CATALOG STRUCTURE / 15</h1><p>Bounded, field-allowlisted metadata only. No values or writes.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startCatalogShape.toString()})(window,document,${projectCatalogShape.toString()},${JSON.stringify(CATALOG_FIELDS)},function(root,q){return createDiagnosticReporter(root,function(){return [{scope:q.scope,name:q.method,type:"function"}];},q.probe);});</script>`;
