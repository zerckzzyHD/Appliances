import http from "node:http";
import { HOME_INPUT_PAGE, HOME_INPUT_CSP } from "./home-input-diagnostic.mjs";
import {
  DASHCAST_MARKER_HTML,
  DASHCAST_MARKER_CSP,
} from "./dashcast-marker.mjs";
import { randomBytes } from "node:crypto";
import {
  HOME_COVERAGE_PAGE,
  HOME_COVERAGE_CSP,
} from "./home-coverage-browser.mjs";
import { validateHomeCoverage } from "./home-coverage-contract.mjs";
import { SDK_BRIDGE_PAGE, SDK_BRIDGE_CSP } from "./sdk-version-bridge.mjs";
import { HOME_DOCUMENT_CSP } from "./home-document-browser.mjs";
import {
  validateHomeDocument,
  DOCUMENT_REPORT_BYTES,
} from "./home-document-contract.mjs";
import { readPreparedDocument } from "./home-document-prepared.mjs";
import { HOME_DEPENDENCIES_CSP } from "./home-dependencies-browser.mjs";
import {
  validateHomeDependencies,
  DEPENDENCIES_REPORT_BYTES,
} from "./home-dependencies-contract.mjs";
import { readPreparedDependencies } from "./home-dependencies-prepared.mjs";
import {
  validateDiagnosticReport,
  MAX_DIAGNOSTIC_BYTES,
} from "./restricted-diagnostics.mjs";

// One listener and one active lease per fixed target. No summary, proxy or filesystem routes.
export function createResearchServer({
  profile,
  ally,
  now = Date.now,
  makeId = () => randomBytes(16).toString("hex"),
  documentEnabled = false,
  dependenciesEnabled = false,
  dashcastMarkerEnabled = false,
  homeInputEnabled = false,
}) {
  if (
    typeof homeInputEnabled !== "boolean" ||
    (homeInputEnabled && profile.target !== "main")
  )
    throw Error("Home input diagnostic requires main profile.");
  if (
    typeof documentEnabled !== "boolean" ||
    (documentEnabled && profile.target !== "main")
  )
    throw Error("Document group requires main profile.");
  if (
    typeof dependenciesEnabled !== "boolean" ||
    (dependenciesEnabled && profile.target !== "main")
  )
    throw Error("Dependency group requires main profile.");
  if (
    typeof dashcastMarkerEnabled !== "boolean" ||
    (dashcastMarkerEnabled && profile.target !== "main")
  )
    throw Error("DashCast marker requires main profile.");
  const prepared = documentEnabled ? readPreparedDocument() : null;
  const preparedDependencies = dependenciesEnabled
    ? readPreparedDependencies()
    : null;
  const groups = {
    version: {
      page: "sdk-interfaces",
      probe: "sdk-version-10",
      report: "/research/report",
    },
    homeCoverage: {
      page: "home-coverage",
      probe: "sdk-home-coverage-23",
      report: "/research/coverage-report",
    },
    ...(prepared
      ? {
          homeDocument: {
            page: "home-document",
            probe: "sdk-home-document-24",
            report: "/research/document-report",
          },
        }
      : {}),
  };
  if (preparedDependencies)
    groups.homeDependencies = {
      page: "home-dependencies",
      probe: "sdk-home-dependencies-25",
      report: "/research/dependency-report",
    };
  if (dashcastMarkerEnabled)
    groups.dashcastMarker = { page: "dashcast-marker" };
  if (homeInputEnabled) groups.homeInput = { page: "home-input" };
  const authority = ally + ":" + profile.port;
  const normalize = (address) => address?.replace(/^::ffff:/, "");
  const peers = new Set([ally, profile.tv]);
  let lease = null;
  function active() {
    if (lease && now() >= lease.expiresAt) lease = null;
    return lease;
  }
  async function body(req, limit) {
    const length = Number(req.headers["content-length"]);
    if (
      req.headers["content-type"] !== "application/json" ||
      req.headers["transfer-encoding"] ||
      !Number.isInteger(length) ||
      length < 2 ||
      length > limit
    )
      throw Error();
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > limit) throw Error();
      chunks.push(chunk);
    }
    if (size !== length) throw Error();
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  }
  const server = http.createServer(
    { maxHeaderSize: 4096 },
    async (req, res) => {
      const send = (status, value, html = false, policy = SDK_BRIDGE_CSP) => {
        res.writeHead(status, {
          "Content-Type": html
            ? "text/html; charset=utf-8"
            : "application/json",
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Content-Security-Policy": html
            ? policy
            : "default-src 'none'; frame-ancestors 'none'",
        });
        res.end(html ? value : JSON.stringify(value));
      };
      const peer = normalize(req.socket.remoteAddress);
      if (
        !peers.has(peer) ||
        req.headers.host !== authority ||
        [
          "forwarded",
          "x-forwarded-for",
          "x-forwarded-host",
          "x-forwarded-proto",
          "via",
        ].some((key) => key in req.headers)
      )
        return send(403, { error: "forbidden" });
      const control = peer === ally && req.headers.origin === undefined;
      if (req.url === "/health" && req.method === "GET" && control)
        return send(200, {
          edge: "running",
          target: profile.target,
          document24: !!prepared,
          dependencies25: !!preparedDependencies,
          dashcastMarker: dashcastMarkerEnabled,
          homeInput: homeInputEnabled,
        });
      if (req.url === "/research/runs" && req.method === "POST") {
        if (!control) return send(403, { error: "forbidden" });
        try {
          const input = await body(req, 256);
          if (
            !input ||
            Array.isArray(input) ||
            Object.keys(input).length !== 1 ||
            !Object.hasOwn(groups, input.group)
          )
            return send(400, { error: "invalid_request" });
          if (active()) return send(409, { error: "busy" });
          const run = makeId();
          if (!/^[a-f0-9]{32}$/.test(run)) throw Error();
          lease = {
            run,
            group: input.group,
            expiresAt: now() + 60000,
            served: false,
            parserServed: false,
            latest: null,
            ...(input.group === "dashcastMarker"
              ? {
                  marker: { responsesIssued: 0, lastRejection: "none" },
                }
              : {}),
          };
          return send(201, {
            target: profile.target,
            run,
            expiresInSeconds: 60,
            path: "/research/" + groups[input.group].page + "/" + run,
          });
        } catch {
          return send(400, { error: "invalid_request" });
        }
      }
      const parser = req.url?.match(
        /^\/research\/(document-parser|dependency-parser)\/([a-f0-9]{32})$/,
      );
      if (parser && req.method === "GET") {
        const current = active();
        const dependencyParser = parser[1] === "dependency-parser";
        const parserPrepared = dependencyParser
          ? preparedDependencies
          : prepared;
        const parserGroup = dependencyParser
          ? "homeDependencies"
          : "homeDocument";
        if (
          peer !== profile.tv ||
          (req.headers.origin !== undefined &&
            req.headers.origin !== "http://" + authority)
        )
          return send(403, { error: "forbidden" });
        if (
          !parserPrepared ||
          !current ||
          current.group !== parserGroup ||
          current.run !== parser[2] ||
          !current.served ||
          current.parserServed
        )
          return send(404, { error: "unknown_run" });
        current.parserServed = true;
        res.writeHead(200, {
          "Content-Type": "text/javascript; charset=utf-8",
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy":
            "default-src 'none'; connect-src 'none'; script-src 'none'; worker-src 'none'",
        });
        res.end(parserPrepared.worker);
        return;
      }
      const runPath = req.url?.match(/^\/research\/runs\/([a-f0-9]{32})$/);
      if (runPath) {
        if (!control) return send(403, { error: "forbidden" });
        const current = active();
        if (!current || current.run !== runPath[1])
          return send(404, { error: "unknown_run" });
        if (req.method === "DELETE") {
          lease = null;
          return send(200, { released: true });
        }
        if (req.method === "GET")
          return send(200, {
            target: profile.target,
            run: current.run,
            reports: current.latest ? [current.latest] : [],
            ...(current.marker ? { marker: { ...current.marker } } : {}),
          });
        return send(405, { error: "method" });
      }
      // Only this inert no-data fixture is embeddable; shared denial headers stay intact.
      const marker = req.url?.match(
        /^\/research\/dashcast-marker\/([a-f0-9]{32})$/,
      );
      if (marker) {
        const current = active();
        if (peer !== profile.tv) return send(403, { error: "forbidden" });
        if (
          !dashcastMarkerEnabled ||
          !current ||
          current.group !== "dashcastMarker" ||
          current.run !== marker[1]
        )
          return send(404, { error: "unknown_run" });
        if (req.method !== "GET") {
          current.marker.lastRejection = "method";
          return send(405, { error: "method" });
        }
        if (req.headers.origin !== undefined) {
          current.marker.lastRejection = "origin_present";
          return send(403, { error: "origin_present" });
        }
        if (current.marker.responsesIssued >= 2) {
          current.marker.lastRejection = "request_limit";
          return send(409, { error: "request_limit" });
        }
        current.served = true;
        current.marker.responsesIssued++;
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": Buffer.byteLength(DASHCAST_MARKER_HTML),
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": DASHCAST_MARKER_CSP,
        });
        res.end(DASHCAST_MARKER_HTML);
        return;
      }
      const page = req.url?.match(
        /^\/research\/(sdk-interfaces|home-coverage|home-document|home-dependencies|home-input)\/([a-f0-9]{32})$/,
      );
      if (page && req.method === "GET") {
        const current = active();
        if (peer !== profile.tv) return send(403, { error: "forbidden" });
        if (page[1] === "home-input" && req.headers.origin !== undefined)
          return send(403, { error: "forbidden" });
        if (
          !current ||
          current.run !== page[2] ||
          current.served ||
          page[1] !== groups[current.group].page
        )
          return send(404, { error: "unknown_run" });
        current.served = true;
        if (current.group === "homeInput")
          return send(
            200,
            HOME_INPUT_PAGE,
            true,
            HOME_INPUT_CSP + "; frame-ancestors 'none'",
          );
        if (current.group === "homeDependencies")
          return send(
            200,
            preparedDependencies.page,
            true,
            HOME_DEPENDENCIES_CSP,
          );
        if (current.group === "homeDocument")
          return send(200, prepared.page, true, HOME_DOCUMENT_CSP);
        return current.group === "version"
          ? send(200, SDK_BRIDGE_PAGE, true)
          : send(200, HOME_COVERAGE_PAGE, true, HOME_COVERAGE_CSP);
      }
      if (
        [
          "/research/report",
          "/research/coverage-report",
          "/research/document-report",
          "/research/dependency-report",
        ].includes(req.url) &&
        req.method === "POST"
      ) {
        if (peer !== profile.tv || req.headers.origin !== "http://" + authority)
          return send(403, { error: "forbidden" });
        try {
          const coverage = req.url === "/research/coverage-report";
          const document = req.url === "/research/document-report";
          const dependencies = req.url === "/research/dependency-report";
          if (dependencies && !preparedDependencies)
            return send(404, { error: "not_found" });
          if (document && !prepared) return send(404, { error: "not_found" });
          const report = dependencies
            ? validateHomeDependencies(
                await body(req, DEPENDENCIES_REPORT_BYTES),
              )
            : document
              ? validateHomeDocument(await body(req, DOCUMENT_REPORT_BYTES))
              : coverage
                ? validateHomeCoverage(await body(req, 4096))
                : validateDiagnosticReport(
                    await body(req, MAX_DIAGNOSTIC_BYTES),
                  );
          const current = active();
          if (!report) return send(400, { error: "invalid_report" });
          if (
            !current ||
            !current.served ||
            current.run !== report.run ||
            req.url !== groups[current.group].report ||
            report.probe !== groups[current.group].probe ||
            ((document || dependencies) &&
              report.control === "passed" &&
              !current.parserServed)
          )
            return send(409, { error: "unexpected_report" });
          if (
            current.latest &&
            report.sequence <= current.latest.report.sequence
          )
            return send(409, { error: "stale_report" });
          current.latest = {
            receivedAt: new Date(now()).toISOString(),
            report,
          };
          return send(204, null);
        } catch {
          return send(400, { error: "invalid_report" });
        }
      }
      return send(404, { error: "not_found" });
    },
  );
  server.on("connection", (socket) => {
    if (!peers.has(normalize(socket.remoteAddress))) socket.destroy();
  });
  server.on("close", () => {
    lease = null;
  });
  server.maxConnections = 4;
  server.requestTimeout = 8000;
  server.headersTimeout = 5000;
  server.keepAliveTimeout = 1000;
  return server;
}
