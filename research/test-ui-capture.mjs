import {
  captureFixedSDKSource,
  createSDKSourceVault,
  MAX_SDK_SOURCE_BYTES,
} from "./sdk-source-vault.mjs";
const target = "http://127.0.0.1:12345/scfs/cl/js/apiTestApp.html";
const browser = captureFixedSDKSource
  .toString()
  .replaceAll(
    "http://localhost:12345/scfs/cl/js/vizio-companion-lib.js",
    target,
  )
  .replaceAll("application/javascript", "text/html");
export const TEST_UI_CAPTURE_PAGE = `<!doctype html><meta charset="utf-8"><title>Mist test UI capture</title><style>body{background:#081726;color:#edffff;font:24px Arial;margin:45px}h1{color:#76f0e1}pre{white-space:pre-wrap}</style><h1>MIST TEST UI MEMORY CAPTURE / 13</h1><p>One fixed HTML resource, parsed as data. No linked files or live configuration.</p><pre id="result"></pre><script>(${browser})(window,document);</script>`;
export const TEST_UI_CAPTURE_CSP =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self' " +
  target +
  "; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
export function createTestUICapture({ authority, tvPeer, allyPeer }) {
  const vault = createSDKSourceVault();
  return {
    dispose: () => vault.dispose(),
    async handle(req, send, headers) {
      if (req.url === "/research/sdk-source-once") {
        const peer = req.socket.remoteAddress.replace(/^::ffff:/, "");
        if (req.method === "GET" || req.method === "DELETE") {
          if (peer !== allyPeer)
            return (send(403, "text/plain", "Forbidden"), true);
          if (req.method === "DELETE") {
            vault.dispose();
            send(204, "text/plain", "");
            return true;
          }
          const bytes = vault.read();
          send(
            bytes ? 200 : 410,
            "text/plain; charset=utf-8",
            bytes || "Source not retained",
          );
          return true;
        }
        if (req.method !== "POST") {
          send(405, "text/plain", "Method not allowed");
          return true;
        }
        if (peer !== tvPeer || req.headers.origin !== "http://" + authority) {
          send(403, "text/plain", "Forbidden");
          return true;
        }
        if (req.headers["content-type"] !== "text/html") {
          send(415, "text/plain", "Unsupported content type");
          return true;
        }
        const length = Number(req.headers["content-length"]);
        if (
          !Number.isInteger(length) ||
          length < 1024 ||
          length > MAX_SDK_SOURCE_BYTES ||
          req.headers["transfer-encoding"]
        ) {
          send(413, "text/plain", "Invalid source size");
          return true;
        }
        if (vault.status().captured) {
          send(409, "text/plain", "Capture already used");
          return true;
        }
        const chunks = [];
        let size = 0;
        try {
          for await (const chunk of req) {
            size += chunk.length;
            if (size > MAX_SDK_SOURCE_BYTES) throw new Error();
            chunks.push(chunk);
          }
          if (size !== length) throw new Error();
          const body = Buffer.concat(chunks);
          const accepted = vault.accept(body);
          body.fill(0);
          send(accepted ? 204 : 409, "text/plain", "");
        } catch {
          send(400, "text/plain", "Capture failed");
        } finally {
          for (const chunk of chunks) chunk.fill(0);
        }
        return true;
      }
      if (req.method !== "GET" && req.method !== "HEAD") return false;
      if (req.url === "/research/sdk-source-status") {
        send(200, "application/json", JSON.stringify(vault.status()));
        return true;
      }
      if (/^\/research\/sdk-test-ui-capture\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = TEST_UI_CAPTURE_CSP;
        send(200, "text/html; charset=utf-8", TEST_UI_CAPTURE_PAGE);
        return true;
      }
      return false;
    },
  };
}
