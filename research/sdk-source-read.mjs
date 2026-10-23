// Temporary owner-approved text-only experiment. Never evaluate the response.
export async function readSDKText(root, show) {
  const url = "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js";
  if (
    !root.fetch ||
    !root.Request ||
    !root.AbortController ||
    !root.TextDecoder
  ) {
    show("NOT ATTEMPTED: required safe fetch features unavailable.");
    return;
  }
  let controller, timer;
  try {
    controller = new root.AbortController();
    const request = new root.Request(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
    if (request.redirect !== "error" || request.credentials !== "omit") {
      show("NOT ATTEMPTED: request restrictions unsupported.");
      return;
    }
    timer = root.setTimeout(() => controller.abort(), 10000);
    show("Reading one fixed local script as text; no execution.");
    const response = await root.fetch(request);
    if (!response.ok || response.type === "opaque" || response.redirected) {
      controller.abort();
      show("NO SOURCE READ: HTTP " + response.status + ".");
      return;
    }
    if (!response.body || !response.body.getReader) {
      controller.abort();
      show("NO SOURCE READ: bounded streaming unavailable.");
      return;
    }
    const reader = response.body.getReader();
    const decoder = new root.TextDecoder();
    let bytes = 0,
      source = "";
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1048576) {
        controller.abort();
        show("NO SOURCE READ: one-MiB ceiling exceeded.");
        return;
      }
      source += decoder.decode(chunk.value, { stream: true });
    }
    source += decoder.decode();
    // Lexical labels only. These can match comments/strings and are not an API inventory.
    const names = [];
    const pattern = /\bfunction\s+([A-Za-z_$][\w$]{0,63})\s*\(/g;
    let match;
    while ((match = pattern.exec(source)) && names.length < 12) {
      if (names.indexOf(match[1]) === -1) names.push(match[1]);
    }
    source = "";
    show(
      "TEXT READ: HTTP " +
        response.status +
        "; " +
        bytes +
        " bytes.\n" +
        "Named-function labels only (up to 12; not verified APIs):\n" +
        (names.join("\n") || "No matching named functions.") +
        "\nNo source executed, saved or sent back.",
    );
  } catch {
    show(
      "NO SOURCE READ: browser/network/timeout restriction.\n" +
        "This does not establish whether the local file exists.",
    );
  } finally {
    if (timer !== undefined) root.clearTimeout(timer);
  }
}

export const SDK_READ_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist SDK text read</title>
<style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap;line-height:1.25}</style>
<h1>MIST SDK TEXT READ</h1><p>One request. No SDK execution. No native methods called.</p><pre id="result">Checking safe fetch features.</pre>
<script>(${readSDKText.toString()})(window,function(value){document.getElementById('result').textContent=value;});</script>`;

export const SDK_READ_CSP =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src http://localhost:12345/scfs/cl/js/vizio-companion-lib.js; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
