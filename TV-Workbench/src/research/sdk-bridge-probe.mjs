import {
  inspectSDKCalls,
  summarizeVersionArguments,
} from "./sdk-call-metadata.mjs";

// Owner authorized SDK/native investigation. Do not invoke an unknown method
// merely because its name matches a filter. SDK initialization itself executes.
export function startSDKProbe(root, document, describe, summarize = null) {
  const output = document.getElementById("result");
  let loaded = false,
    eventSeen = false,
    failed = false,
    versionAttempted = false,
    versionStatus = "Version getter waits for SDK ready event.",
    index = 0,
    pages = [];
  function scan() {
    const report = describe(root);
    const lines = [
      "SDK script loaded: " + loaded + "; ready event: " + eventSeen,
      "Load error: " + failed + ". Names/types only; values omitted.",
      versionStatus,
    ];
    for (const item of report) {
      lines.push(item.name + " : " + item.type);
      if (typeof item.total === "number")
        lines.push(
          "  Own names: " +
            item.total +
            "; selected: " +
            item.selected +
            "; shown: " +
            item.members.length,
        );
      const members = item.members.filter(
        (member) =>
          !/^(arguments|caller|length|name|prototype)$/.test(member.name),
      );
      members.sort(
        (a, b) =>
          Number(
            /app|home|launch|install|input|config|debug|developer/i.test(
              b.name,
            ),
          ) -
          Number(
            /app|home|launch|install|input|config|debug|developer/i.test(
              a.name,
            ),
          ),
      );
      if (members.length)
        lines.push(
          members
            .map(
              (member) =>
                member.name +
                (member.type === "function" ? "()" : "[" + member.type + "]"),
            )
            .join(", "),
        );
      if (!members.length) lines.push("  No additional member metadata.");
    }
    if (!report.length) lines.push("No matching own global names.");
    const wrapped = [];
    for (const line of lines) {
      for (let i = 0; i < line.length; i += 72)
        wrapped.push(line.slice(i, i + 72));
    }
    pages = [];
    for (let i = 0; i < wrapped.length; i += 12)
      pages.push(wrapped.slice(i, i + 12).join("\n"));
    index = Math.min(index, pages.length - 1);
    display();
  }
  function display() {
    output.textContent =
      "Page " + (index + 1) + " of " + pages.length + "\n\n" + pages[index];
  }
  function readVersion() {
    if (versionAttempted) return;
    versionAttempted = true;
    try {
      const sdk = Object.getOwnPropertyDescriptor(root, "VIZIO");
      const object = sdk && sdk.value;
      const method =
        object && Object.getOwnPropertyDescriptor(object, "getConfigVersion");
      if (!method || typeof method.value !== "function") {
        versionStatus = "Version getter unavailable.";
        return;
      }
      let callbackSeen = false;
      function result(value) {
        callbackSeen = true;
        if (summarize) {
          versionStatus = summarize(arguments);
          scan();
          return;
        }
        if (
          (typeof value === "string" || typeof value === "number") &&
          /^v?\d+(?:[.-]\d+){1,5}$/.test(String(value))
        )
          versionStatus = "Config version reply: " + String(value);
        else
          versionStatus =
            "Version reply type: " + typeof value + "; value withheld.";
        scan();
      }
      versionStatus = "getConfigVersion called once; awaiting callback.";
      const value = method.value.call(object, result);
      if (value !== undefined && !callbackSeen) {
        if (summarize)
          versionStatus = summarize([value]).replace(
            "callback args",
            "return values",
          );
        else result(value);
      }
    } catch {
      versionStatus = "Version getter threw; details withheld.";
    }
  }
  document.addEventListener("VIZIO_LIBRARY_DID_LOAD", () => {
    eventSeen = true;
    readVersion();
    scan();
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.keyCode === 39)
      index = (index + 1) % pages.length;
    else if (event.key === "ArrowLeft" || event.keyCode === 37)
      index = (index + pages.length - 1) % pages.length;
    else if (event.key === "Enter" || event.keyCode === 13) {
      scan();
      return;
    } else return;
    event.preventDefault();
    display();
  });
  const script = document.createElement("script");
  script.src = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  script.referrerPolicy = "no-referrer";
  script.onload = () => {
    loaded = true;
    scan();
  };
  script.onerror = () => {
    failed = true;
    scan();
  };
  scan();
  document.body.appendChild(script);
  root.setTimeout(scan, 10000);
}

export const SDK_BRIDGE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist SDK interfaces</title>
<style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap;line-height:1.25}</style>
<h1>MIST SDK CALL SHAPES / 4</h1><p>One version read. Other functions inspected, not invoked. Left/right: pages.</p><pre id="result"></pre>
<script>(${startSDKProbe.toString()})(window,document,${inspectSDKCalls.toString()},${summarizeVersionArguments.toString()});</script>`;

export const SDK_BRIDGE_CSP =
  "default-src 'none'; script-src 'unsafe-inline' http://localhost:12345/scfs/cl/js/vizio-companion-lib.js; style-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
