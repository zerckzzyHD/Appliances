import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
export function startStoreCheck(root, document, makeReporter) {
  const reporter = makeReporter(root),
    output = document.getElementById("result");
  let loaded = false,
    ready = false,
    attempted = false,
    settled = false,
    lastState = "waiting";
  function emit(update) {
    lastState = update.state;
    output.textContent =
      "SDK loaded: " +
      loaded +
      "; ready: " +
      ready +
      "\n" +
      update.state +
      "; result values withheld. No store write.";
    reporter.send({ loaded, ready, ...update });
  }
  function data(object, name) {
    const d = object && Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function method(object, name) {
    for (let i = 0; i < 4 && object && object !== Object.prototype; i++) {
      const v = data(object, name);
      if (typeof v === "function") return v;
      object = Object.getPrototypeOf(object);
    }
    return null;
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    ready = true;
    if (attempted) return;
    attempted = true;
    try {
      const system = data(data(root, "VIZIO_MODULES"), "System"),
        get = data(system, "getTvStoreProperty");
      if (typeof get !== "function") {
        emit({ state: "unavailable" });
        return;
      }
      emit({ state: "invoked" });
      const finish = (value) => {
        if (settled) return;
        settled = true;
        emit({
          state: "resolved",
          responseType: value === null ? "null" : typeof value,
        });
      };
      const reject = () => {
        if (settled) return;
        settled = true;
        emit({ state: "rejected", errorCategory: "other" });
      };
      const result = get.call(system, "com.mist.console.tv.research.absent");
      const then = method(result, "then"),
        subscribe = method(result, "subscribe");
      if (then) then.call(result, finish, reject);
      else if (subscribe)
        subscribe.call(result, { next: finish, error: reject });
      else finish(result);
      root.setTimeout(() => {
        if (!settled) {
          settled = true;
          emit({ state: "rejected", errorCategory: "timeout" });
        }
      }, 10000);
    } catch {
      settled = true;
      emit({ state: "threw", errorCategory: "other" });
    }
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    emit({ state: lastState });
  };
  script.onerror = () => emit({ state: "unavailable" });
  emit({ state: "waiting" });
  document.body.appendChild(script);
}
export const SDK_STORE_CSP = SDK_BRIDGE_CSP;
export const SDK_STORE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist SDK store check</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST SDK STORE READ / 12</h1><p>One read of a fixed unused Mist research key. No store write, app launch or configuration read.</p><pre id="result"></pre><script>
${createDiagnosticReporter.toString()}
(${startStoreCheck.toString()})(window,document,function(root){return createDiagnosticReporter(root,function(){return [{scope:"System",name:"getTvStoreProperty",type:"function"}];},"sdk-store-12");});</script>`;
