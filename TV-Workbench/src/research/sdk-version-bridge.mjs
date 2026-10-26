import { SDK_BRIDGE_CSP as BASE_CSP } from "./sdk-test-app.mjs";
import { observeSDKCommand } from "./sdk-command-outcome.mjs";
import { safeSDKVersion } from "./restricted-diagnostics.mjs";
import {
  collectSDKMethodMetadata,
  createDiagnosticReporter,
} from "./diagnostic-browser-report.mjs";
export const SDK_BRIDGE_CSP = BASE_CSP.replace(
  "connect-src http://127.0.0.1:7346;",
  "connect-src 'self' http://127.0.0.1:7346;",
);

export function startSDKVersionCheck(
  root,
  document,
  observe,
  safeVersion = null,
  makeReporter = null,
) {
  const output = document.getElementById("result");
  let loaded = false,
    ready = false,
    attempted = false;
  const lines = ["Waiting for SDK readiness; no call yet."];
  const reporter = makeReporter ? makeReporter(root) : null;
  function emit(update) {
    if (reporter) reporter.send({ loaded, ready, ...update });
  }
  function display() {
    output.textContent =
      "SDK loaded: " + loaded + "; ready: " + ready + "\n" + lines.join("\n");
  }
  function data(object, name) {
    const d = object && Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  function report(text) {
    if (lines.length === 7) lines.shift();
    lines.push(text);
    display();
  }
  function findMethod(object, name) {
    for (let i = 0; i < 4 && object && object !== Object.prototype; i++) {
      const d = Object.getOwnPropertyDescriptor(object, name);
      if (d)
        return Object.prototype.hasOwnProperty.call(d, "value") &&
          typeof d.value === "function"
          ? d.value
          : null;
      object = Object.getPrototypeOf(object);
    }
    return null;
  }
  function version(value) {
    const accept =
      safeVersion ||
      ((item) =>
        (typeof item === "string" || typeof item === "number") &&
        /^v?\d+(?:[.-]\d+){1,5}$/.test(String(item))
          ? String(item)
          : null);
    let candidate = value;
    if (value && typeof value === "object") {
      for (const key of [
        "version",
        "configVersion",
        "scConfigVersion",
        "value",
      ]) {
        const item = data(value, key);
        if (accept(item) !== null) {
          candidate = item;
          break;
        }
      }
    }
    if (accept(candidate) !== null) {
      report("VERSION VALUE: " + accept(candidate));
      emit({
        state: "resolved",
        responseType: value === null ? "null" : typeof value,
        version: accept(candidate),
      });
    } else {
      report(
        "Version response type: " +
          (value === null ? "null" : typeof value) +
          "; value withheld.",
      );
      emit({
        state: "resolved",
        responseType: value === null ? "null" : typeof value,
      });
    }
  }
  function rejected(error) {
    observe(
      {
        then(resolve, reject) {
          reject(error);
        },
      },
      (message) => {
        report(message);
        const update = { state: "rejected" };
        if (message.indexOf("Operation rejected/errored:") === 0)
          update.errorCategory = /unsupported/.test(message)
            ? "unsupported"
            : /permission/.test(message)
              ? "permission"
              : /timeout/.test(message)
                ? "timeout"
                : /connection|mojo/.test(message)
                  ? "connection"
                  : /method\/argument/.test(message)
                    ? "method"
                    : "other";
        const code = message.match(/(?:code|status)=(-?\d+)/);
        if (code) update.errorCode = Number(code[1]);
        emit(update);
      },
    );
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    ready = true;
    if (attempted) {
      display();
      return;
    }
    attempted = true;
    lines.length = 0;
    try {
      const modules = data(root, "VIZIO_MODULES"),
        system = data(modules, "System");
      const method = data(system, "getScConfigVersion");
      if (typeof method !== "function") {
        report("System version method unavailable.");
        emit({ state: "unavailable" });
        return;
      }
      report("Calling System.getScConfigVersion once; no app launch.");
      emit({ state: "invoked" });
      const result = method.call(system);
      const then = findMethod(result, "then");
      if (typeof then === "function") {
        then.call(result, version, rejected);
      } else if (findMethod(result, "subscribe")) {
        findMethod(result, "subscribe").call(result, {
          next: version,
          error: rejected,
          complete() {
            report("Version operation completed.");
          },
        });
      } else if (result !== undefined) version(result);
      else report("Returned undefined; no native version verified.");
      const sdk = data(root, "VIZIO"),
        debug = data(sdk, "_debug"),
        launch = data(debug, "launchApiTestApp");
      if (typeof launch === "function") {
        const source = Function.prototype.toString
          .call(launch)
          .replace(
            /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g,
            "[literal]",
          )
          .replace(/\b\d+(?:\.\d+)?\b/g, "#");
        report(
          "Test-app wrapper shape (not invoked; literals removed):\n" +
            source.slice(0, 240),
        );
      }
    } catch {
      report("Version inspection threw; details withheld.");
      emit({ state: "threw", errorCategory: "other" });
    }
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    display();
    emit({});
  };
  script.onerror = () => report("SDK load failed.");
  display();
  emit({ state: "waiting" });
  document.body.appendChild(script);
}

export const SDK_BRIDGE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist native version check</title>
<style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap;line-height:1.3;overflow-wrap:anywhere}</style>
<h1>MIST SDK DIAGNOSTIC CHANNEL / 10</h1><p>Read-only version and method metadata returned to Ally.</p><pre id="result"></pre>
<script>${collectSDKMethodMetadata.toString()}
${createDiagnosticReporter.toString()}
(${startSDKVersionCheck.toString()})(window,document,${observeSDKCommand.toString()},${safeSDKVersion.toString()},function(root){return createDiagnosticReporter(root,collectSDKMethodMetadata);});</script>`;
