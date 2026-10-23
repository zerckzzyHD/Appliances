import { SDK_BRIDGE_CSP as BASE_CSP } from "./sdk-bridge-probe.mjs";
import { observeSDKCommand } from "./sdk-command-outcome.mjs";
// Owner-authorized native testing; permit only the transport actually observed
// blocked on the TV. This origin is TV loopback, not an Ally/LAN listener.
export const SDK_BRIDGE_CSP = BASE_CSP.replace(
  "connect-src 'none';",
  "connect-src http://127.0.0.1:7346;",
);

// Owner repeatedly authorized native commands. Invoke only this identified,
// zero-argument SDK entry point, once per explicitly launched document.
export function startSDKTestApp(root, document, observe = null) {
  const output = document.getElementById("result");
  let loaded = false,
    ready = false,
    attempted = false;
  let status = "Waiting for SDK readiness; no command attempted.";
  const blocks = [];
  function display() {
    output.textContent =
      "SDK loaded: " +
      loaded +
      "; ready: " +
      ready +
      "\n" +
      status +
      "\n" +
      (blocks.length
        ? blocks.join("\n")
        : "No browser policy-block event observed.") +
      "\nNo firmware, reset, install or settings command requested.";
  }
  document.addEventListener("securitypolicyviolation", (event) => {
    const directive =
      /^(connect-src|script-src|script-src-elem|worker-src|default-src)$/.test(
        event.effectiveDirective,
      )
        ? event.effectiveDirective
        : "other";
    let destination = "destination withheld";
    try {
      const url = new URL(event.blockedURI);
      if (
        ["localhost", "127.0.0.1", "[::1]"].indexOf(url.hostname) !== -1 &&
        /^(http:|https:|ws:|wss:)$/.test(url.protocol)
      )
        destination = url.origin;
    } catch {
      if (event.blockedURI === "eval" || event.blockedURI === "inline")
        destination = event.blockedURI;
    }
    if (blocks.length === 3) blocks.shift();
    blocks.push("Policy blocked " + directive + ": " + destination);
    display();
  });
  function data(object, name) {
    const d = object && Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    ready = true;
    if (attempted) {
      display();
      return;
    }
    attempted = true;
    try {
      const sdk = data(root, "VIZIO"),
        debug = data(sdk, "_debug");
      const method = data(debug, "launchApiTestApp");
      if (typeof method !== "function")
        status = "launchApiTestApp unavailable; no call made.";
      else {
        status = "Calling launchApiTestApp once.";
        display();
        const value = method.call(debug);
        status =
          "launchApiTestApp called once. Return type: " +
          (value === null ? "null" : typeof value) +
          ".\nObserve whether the TV opens another interface.\nReturn value does not confirm a successful launch.";
        if (observe) {
          const outcomes = [];
          observe(value, (message) => {
            if (outcomes.length === 4) outcomes.shift();
            outcomes.push(message);
            status = "launchApiTestApp invoked once.\n" + outcomes.join("\n");
            display();
          });
        }
      }
    } catch {
      status = "Test-app call threw; details withheld. No retry.";
    }
    display();
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    display();
  };
  script.onerror = () => {
    status = "SDK script load failed; no command attempted.";
    display();
  };
  display();
  document.body.appendChild(script);
  root.setTimeout(display, 10000);
}

export const SDK_BRIDGE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist SDK test app</title>
<style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap;line-height:1.4}</style>
<h1>MIST SDK LOCAL BRIDGE / 8</h1><p>One test-app call; observed TV-loopback transport permitted.</p><pre id="result"></pre>
<script>(${startSDKTestApp.toString()})(window,document,${observeSDKCommand.toString()});</script>`;
