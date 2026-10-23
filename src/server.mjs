// Candidate LAN edge for an approved aggregate projection. No directory serving or proxy routes.
import http from "node:http";
import {
  SOURCE_MAP_PAGE,
  SOURCE_MAP_CSP,
} from "../research/sdk-source-map-check.mjs";
import {
  HOME_SOURCE_PAGE,
  HOME_SOURCE_CSP,
} from "../research/home-source-check.mjs";
import {
  CONJURE_ROUTE_PAGE,
  CONJURE_ROUTE_CSP,
} from "../research/conjure-route-browser.mjs";
import {
  SDK_APP_LOOKUP_PAGE,
  SDK_APP_LOOKUP_CSP,
} from "../research/sdk-app-lookup.mjs";
import {
  SDK_SPEECH_PAGE,
  SDK_SPEECH_CSP,
} from "../research/sdk-speech-check.mjs";
import {
  SDK_INTERNAL_PAGE,
  SDK_INTERNAL_CSP,
} from "../research/sdk-internal-check.mjs";
import { validateCatalogShapeReport } from "../research/catalog-shape.mjs";
import {
  CATALOG_SHAPE_PAGE,
  CATALOG_SHAPE_CSP,
} from "../research/catalog-shape-browser.mjs";
import {
  SDK_CATALOG_PAGE,
  SDK_CATALOG_CSP,
} from "../research/sdk-catalog-check.mjs";
import { SDK_STORE_PAGE, SDK_STORE_CSP } from "../research/sdk-store-check.mjs";
import { toTVSummary } from "./summary.mjs";
import { PAGE } from "./page.mjs";
import {
  SDK_BRIDGE_PAGE,
  SDK_BRIDGE_CSP,
} from "../research/sdk-version-bridge.mjs";
import {
  MAX_DIAGNOSTIC_BYTES,
  validateDiagnosticReport,
} from "../research/restricted-diagnostics.mjs";

export function permitsPeer(address, peers) {
  return (
    typeof address === "string" && peers.has(address.replace(/^::ffff:/, ""))
  );
}

export function createTVServer({
  readProjection,
  peers,
  authority,
  tvPeer = null,
}) {
  if (
    !(peers instanceof Set) ||
    !peers.size ||
    typeof authority !== "string" ||
    !authority
  ) {
    throw new Error("Explicit peer and Host restrictions are required");
  }
  let tvLocalTimeUISeen = false;
  let lastDiagnostic = null;
  const diagnostics = new Map();
  const catalogShapes = new Map();
  let pending = null;
  async function summary() {
    if (!pending) {
      pending = Promise.resolve().then(readProjection).then(toTVSummary);
    }
    try {
      return await pending;
    } finally {
      pending = null;
    }
  }
  const server = http.createServer(
    { maxHeaderSize: 4096 },
    async (req, res) => {
      const headers = {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
        "Content-Security-Policy":
          "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
        "X-Robots-Tag": "noindex, nofollow",
        "Cross-Origin-Resource-Policy": "same-origin",
      };
      const send = (status, type, body) => {
        res.writeHead(status, { ...headers, "Content-Type": type });
        res.end(req.method === "HEAD" ? undefined : body);
      };
      if (
        req.headers.host !== authority ||
        [
          "forwarded",
          "x-forwarded-for",
          "x-forwarded-host",
          "x-forwarded-proto",
          "via",
        ].some((key) => key in req.headers)
      ) {
        return send(403, "text/plain", "Forbidden");
      }
      if (
        req.url === "/research/catalog-shape-report" &&
        req.method === "POST"
      ) {
        if (
          !tvPeer ||
          req.socket.remoteAddress.replace(/^::ffff:/, "") !==
            tvPeer.replace(/^::ffff:/, "") ||
          req.headers.origin !== "http://" + authority
        )
          return send(403, "text/plain", "Forbidden");
        if (req.headers["content-type"] !== "application/json")
          return send(415, "text/plain", "Unsupported content type");
        const length = Number(req.headers["content-length"]);
        if (
          !Number.isInteger(length) ||
          length < 2 ||
          length > 16384 ||
          req.headers["transfer-encoding"]
        )
          return send(413, "text/plain", "Invalid shape size");
        const chunks = [];
        let bytes = 0;
        try {
          for await (const chunk of req) {
            bytes += chunk.length;
            if (bytes > 16384) throw new Error();
            chunks.push(chunk);
          }
          const report = validateCatalogShapeReport(
            JSON.parse(Buffer.concat(chunks).toString("utf8")),
          );
          if (!report) return send(400, "text/plain", "Invalid shape report");
          catalogShapes.set(report.target, {
            receivedAt: new Date().toISOString(),
            report,
          });
          return send(204, "text/plain", "");
        } catch {
          return send(400, "text/plain", "Invalid shape report");
        }
      }
      if (req.url === "/research/report" && req.method === "POST") {
        if (
          !tvPeer ||
          req.socket.remoteAddress.replace(/^::ffff:/, "") !==
            tvPeer.replace(/^::ffff:/, "") ||
          req.headers.origin !== "http://" + authority
        )
          return send(403, "text/plain", "Forbidden");
        if (req.headers["content-type"] !== "application/json")
          return send(415, "text/plain", "Unsupported content type");
        const length = Number(req.headers["content-length"]);
        if (
          !Number.isInteger(length) ||
          length < 2 ||
          length > MAX_DIAGNOSTIC_BYTES ||
          req.headers["transfer-encoding"]
        )
          return send(413, "text/plain", "Invalid report size");
        const chunks = [];
        let bytes = 0;
        try {
          for await (const chunk of req) {
            bytes += chunk.length;
            if (bytes > MAX_DIAGNOSTIC_BYTES) throw new Error("Report size");
            chunks.push(chunk);
          }
          const report = validateDiagnosticReport(
            JSON.parse(Buffer.concat(chunks).toString("utf8")),
          );
          if (!report)
            return send(400, "text/plain", "Invalid diagnostic report");
          if (
            !lastDiagnostic ||
            lastDiagnostic.report.run !== report.run ||
            report.sequence >= lastDiagnostic.report.sequence
          )
            lastDiagnostic = { receivedAt: new Date().toISOString(), report };
          const previous = diagnostics.get(report.probe);
          if (
            !previous ||
            previous.report.run !== report.run ||
            report.sequence >= previous.report.sequence
          )
            diagnostics.set(report.probe, {
              receivedAt: new Date().toISOString(),
              report,
            });
          return send(204, "text/plain", "");
        } catch {
          return send(400, "text/plain", "Invalid diagnostic report");
        }
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        return send(405, "text/plain", "Method not allowed");
      }
      if (/^\/research\/sdk-store-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_STORE_CSP;
        return send(200, "text/html; charset=utf-8", SDK_STORE_PAGE);
      }
      if (req.url === "/research/catalog-shape-report")
        return send(
          200,
          "application/json",
          JSON.stringify({ reports: [...catalogShapes.values()] }),
        );
      if (/^\/research\/catalog-shape\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = CATALOG_SHAPE_CSP;
        return send(200, "text/html; charset=utf-8", CATALOG_SHAPE_PAGE);
      }
      if (/^\/research\/sdk-internal-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_INTERNAL_CSP;
        return send(200, "text/html; charset=utf-8", SDK_INTERNAL_PAGE);
      }
      if (/^\/research\/sdk-speech-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_SPEECH_CSP;
        return send(200, "text/html; charset=utf-8", SDK_SPEECH_PAGE);
      }
      if (/^\/research\/sdk-app-lookup\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_APP_LOOKUP_CSP;
        return send(200, "text/html; charset=utf-8", SDK_APP_LOOKUP_PAGE);
      }
      if (/^\/research\/home-source-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = HOME_SOURCE_CSP;
        return send(200, "text/html; charset=utf-8", HOME_SOURCE_PAGE);
      }
      if (/^\/research\/source-mapping-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SOURCE_MAP_CSP;
        return send(200, "text/html; charset=utf-8", SOURCE_MAP_PAGE);
      }
      if (/^\/research\/conjure-route-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = CONJURE_ROUTE_CSP;
        return send(200, "text/html; charset=utf-8", CONJURE_ROUTE_PAGE);
      }
      if (req.url === "/research/reports")
        return send(
          200,
          "application/json",
          JSON.stringify({ reports: [...diagnostics.values()] }),
        );
      if (/^\/research\/sdk-catalog-check\/[a-f0-9]{32}$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_CATALOG_CSP;
        return send(200, "text/html; charset=utf-8", SDK_CATALOG_PAGE);
      }
      if (req.url === "/research/report")
        return send(
          200,
          "application/json",
          JSON.stringify({
            available: lastDiagnostic !== null,
            ...(lastDiagnostic || {}),
          }),
        );
      if (/^\/research\/sdk-interfaces(?:\/[a-f0-9]{32})?$/.test(req.url)) {
        headers["Content-Security-Policy"] = SDK_BRIDGE_CSP;
        return send(200, "text/html; charset=utf-8", SDK_BRIDGE_PAGE);
      }
      if (req.url === "/" || /^\/client\/[a-f0-9]{32}$/.test(req.url))
        return send(200, "text/html; charset=utf-8", PAGE);
      if (req.url === "/health")
        return send(
          200,
          "application/json",
          JSON.stringify({ edge: "running", tvLocalTimeUISeen }),
        );
      if (req.url !== "/summary.json")
        return send(404, "text/plain", "Not found");
      if (
        tvPeer &&
        req.socket.remoteAddress === tvPeer &&
        req.headers["x-mist-tv-ui"] === "local-time-1"
      )
        tvLocalTimeUISeen = true;
      try {
        const value = await summary();
        send(
          value.availability === "AVAILABLE" ? 200 : 503,
          "application/json",
          JSON.stringify(value),
        );
      } catch {
        send(503, "application/json", '{"availability":"UNAVAILABLE"}');
      }
    },
  );
  server.on("connection", (socket) => {
    if (!permitsPeer(socket.remoteAddress, peers)) socket.destroy();
  });
  server.maxConnections = 4;
  server.requestTimeout = 8000;
  server.headersTimeout = 5000;
  server.keepAliveTimeout = 1000;
  return server;
}

export async function readExistingConsole() {
  // Fixed loopback destination; no caller-supplied URL, redirects, files, or credentials.
  const response = await fetch("http://127.0.0.1:5173/view.json", {
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    headers: { Accept: "application/json" },
  });
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    await response.body?.cancel();
    throw new Error("Console unavailable");
  }
  let bytes = 0;
  const chunks = [];
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > 1024 * 1024) throw new Error("Console response exceeds bound");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
