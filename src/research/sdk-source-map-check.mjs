import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
import { startCatalogCheck } from "./sdk-catalog-check.mjs";
export const SOURCE_MAP_QUERIES = [
  ["sdk-source-absent-21", "MistResearchAbsentControl20261018"],
  ["sdk-source-positive-21", "VIZIOApps"],
  ["sdk-source-chromium-21", "ChromiumHtmlAppUris"],
  ["sdk-source-home-21", "SmartCastHome"],
  ["sdk-source-orchestrator-21", "Orchestrator"],
].map(([probe, key]) => ({
  probe,
  key,
  scope: "System",
  method: "getConfigProperty",
}));
export const SOURCE_MAP_CSP = SDK_BRIDGE_CSP;
export const SOURCE_MAP_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist source mapping types</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST SOURCE MAPPING TYPES / 21</h1><p>Five fixed reads from source-defined sections and controls. Types only; no configuration export or writes.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startCatalogCheck.toString()})(window,document,function(root,q){return createDiagnosticReporter(root,function(){return [{scope:q.scope,name:q.method,type:'function'}];},q.probe);},${JSON.stringify(SOURCE_MAP_QUERIES)});</script>`;
