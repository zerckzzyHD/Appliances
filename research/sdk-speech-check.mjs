import { SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { createDiagnosticReporter } from "./diagnostic-browser-report.mjs";
export function startSpeechCheck(root, document, makeReporter) {
  let attempted = false,
    loaded = false,
    ready = false;
  const output = document.getElementById("result"),
    lines = [];
  const speakReport = makeReporter(root, "sdk-speech-start-17"),
    stopReport = makeReporter(root, "sdk-speech-stop-17");
  function data(o, key) {
    const d = o && Object.getOwnPropertyDescriptor(o, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function emit(reporter, label, update) {
    lines.push(label + ": " + update.state);
    output.textContent =
      lines.join("\n") +
      "\nNo volume, Voice Guide or persistent settings change. A returned operation is not proof of audible speech.";
    reporter.send({ loaded, ready, ...update });
  }
  function call(module, method, reporter, label, args) {
    const fn = data(module, method);
    if (typeof fn !== "function") {
      emit(reporter, label, { state: "unavailable" });
      return;
    }
    emit(reporter, label, { state: "invoked" });
    try {
      Promise.resolve(fn.apply(module, args)).then(
        (value) =>
          emit(reporter, label, {
            state: "resolved",
            responseType: value === null ? "null" : typeof value,
          }),
        () =>
          emit(reporter, label, { state: "rejected", errorCategory: "other" }),
      );
    } catch {
      emit(reporter, label, { state: "threw", errorCategory: "other" });
    }
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    ready = true;
    if (attempted) return;
    attempted = true;
    const module = data(data(root, "VIZIO_MODULES"), "TextToSpeech");
    call(module, "speak", speakReport, "Speak", [
      "Mist is connected to this TV.",
    ]);
    root.setTimeout(
      () => call(module, "stopSpeech", stopReport, "Stop", []),
      5000,
    );
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    speakReport.send({ loaded, ready });
    stopReport.send({ loaded, ready });
  };
  script.onerror = () => emit(speakReport, "SDK", { state: "unavailable" });
  document.body.appendChild(script);
}
export const SDK_SPEECH_CSP = SDK_BRIDGE_CSP;
export const SDK_SPEECH_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist native speech test</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST NATIVE SPEECH / 17</h1><p>One fixed phrase. Request stop after five seconds. No setting toggles.</p><pre id="result"></pre><script>${createDiagnosticReporter.toString()}
(${startSpeechCheck.toString()})(window,document,function(root,probe){return createDiagnosticReporter(root,function(){return [{scope:"TextToSpeech",name:"speak",type:"function"},{scope:"TextToSpeech",name:"stopSpeech",type:"function"}];},probe);});</script>`;
