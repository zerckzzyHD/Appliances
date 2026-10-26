import { createHash } from "node:crypto";
export const MAX_SDK_SOURCE_BYTES = 1048576;

export function createSDKSourceVault(ttlMs = 600000) {
  let source = null,
    captured = false,
    timer = null,
    metadata = null;
  function dispose() {
    if (timer) clearTimeout(timer);
    if (source) source.fill(0);
    source = null;
    timer = null;
  }
  return {
    accept(bytes) {
      if (
        captured ||
        !Buffer.isBuffer(bytes) ||
        bytes.length < 1024 ||
        bytes.length > MAX_SDK_SOURCE_BYTES
      )
        return false;
      source = Buffer.from(bytes);
      captured = true;
      metadata = {
        bytes: source.length,
        sha256: createHash("sha256").update(source).digest("hex"),
        expiresAt: new Date(Date.now() + ttlMs).toISOString(),
      };
      timer = setTimeout(dispose, ttlMs);
      timer.unref();
      return true;
    },
    status() {
      return { captured, available: source !== null, ...(metadata || {}) };
    },
    read() {
      return source;
    },
    dispose,
  };
}

export function captureFixedSDKSource(root, document) {
  const output = document.getElementById("result");
  const show = (text) => {
    output.textContent = text;
  };
  if (!root.fetch || !root.Request || !root.AbortController) {
    show("Safe fetch features unavailable; no request made.");
    return;
  }
  const controller = new root.AbortController();
  const timer = root.setTimeout(() => controller.abort(), 10000);
  (async () => {
    try {
      const request = new root.Request(
        "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js",
        {
          credentials: "omit",
          redirect: "error",
          mode: "cors",
          cache: "no-store",
          referrerPolicy: "no-referrer",
          signal: controller.signal,
        },
      );
      if (request.credentials !== "omit" || request.redirect !== "error")
        throw new Error();
      show("Reading the one fixed SDK resource as text/bytes; no execution.");
      const response = await root.fetch(request);
      if (
        !response.ok ||
        response.redirected ||
        !response.body ||
        !response.body.getReader
      )
        throw new Error();
      const reader = response.body.getReader(),
        chunks = [];
      let size = 0;
      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) break;
        size += chunk.value.byteLength;
        if (size > 1048576) {
          controller.abort();
          throw new Error();
        }
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      const uploaded = await root.fetch("/research/sdk-source-once", {
        method: "POST",
        credentials: "omit",
        redirect: "error",
        cache: "no-store",
        headers: { "Content-Type": "application/javascript" },
        body: bytes,
        signal: controller.signal,
      });
      bytes.fill(0);
      show(
        "SDK memory capture HTTP " +
          uploaded.status +
          "; bytes: " +
          size +
          ".\nNo SDK execution or raw source file was requested.",
      );
    } catch {
      show("Capture failed or blocked; details withheld. No automatic retry.");
    } finally {
      root.clearTimeout(timer);
    }
  })();
}

export const SDK_SOURCE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist SDK memory capture</title>
<style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style>
<h1>MIST SDK MEMORY CAPTURE / 11</h1><p>One fixed software resource. No native commands. Memory only.</p><pre id="result"></pre>
<script>(${captureFixedSDKSource.toString()})(window,document);</script>`;
export const SDK_SOURCE_CSP =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self' http://localhost:12345/scfs/cl/js/vizio-companion-lib.js; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
