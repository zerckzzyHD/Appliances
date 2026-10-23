import { validateDiagnosticReport } from "./restricted-diagnostics.mjs";
import { pathToFileURL } from "node:url";
export const DIAGNOSTIC_GROUPS = {
  sourceMapping: [
    "sdk-source-absent-21",
    "sdk-source-positive-21",
    "sdk-source-chromium-21",
    "sdk-source-home-21",
    "sdk-source-orchestrator-21",
  ],
  homeReferences: ["sdk-home-reference-22"],
  routeFilter: ["sdk-route-filter-19"],
  version: ["sdk-version-10"],
  store: ["sdk-store-12"],
  internal: ["sdk-internal-docker-16"],
  speech: ["sdk-speech-start-17", "sdk-speech-stop-17"],
  appLookup: [
    "sdk-app-home-info-18",
    "sdk-app-conjure-info-18",
    "sdk-app-absent-info-18",
    "sdk-app-conjure-cname-18",
  ],
  catalogTypes: [
    "sdk-config-absent-14",
    "sdk-config-vizioapps-14",
    "sdk-config-virtualinputs-14",
    "sdk-config-appmigration-14",
    "sdk-app-sctv-14",
  ],
};
export async function awaitDiagnostics({
  run,
  probes,
  fetchImpl = fetch,
  now = Date.now,
  delay = (ms) => new Promise((r) => setTimeout(r, ms)),
  budgetMs = 12000,
}) {
  if (
    !/^[a-f0-9]{32}$/.test(run) ||
    !Array.isArray(probes) ||
    !probes.length ||
    probes.length > 16 ||
    !probes.every((p) => Object.values(DIAGNOSTIC_GROUPS).flat().includes(p)) ||
    !Number.isInteger(budgetMs) ||
    budgetMs < 10 ||
    budgetMs > 15000
  )
    throw Error("Invalid diagnostic request");
  const found = new Map(),
    deadline = now() + budgetMs;
  let attempts = 0;
  while (now() < deadline) {
    attempts++;
    try {
      const response = await fetchImpl(
        "http://192.168.4.26:4176/research/reports",
        {
          credentials: "omit",
          redirect: "error",
          cache: "no-store",
          signal: AbortSignal.timeout(
            Math.max(1, Math.min(1000, deadline - now())),
          ),
        },
      );
      if (!response.ok) {
        await response.body?.cancel();
        throw Error();
      }
      let bytes = 0;
      const chunks = [];
      for await (const chunk of response.body) {
        bytes += chunk.length;
        if (bytes > 524288) throw Error();
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (Array.isArray(body.reports))
        for (const item of body.reports) {
          const report = validateDiagnosticReport(item?.report);
          if (!report || report.run !== run || !probes.includes(report.probe))
            continue;
          const previous = found.get(report.probe);
          if (!previous || report.sequence >= previous.report.sequence)
            found.set(report.probe, {
              receivedAt:
                typeof item.receivedAt === "string" &&
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(
                  item.receivedAt,
                )
                  ? item.receivedAt
                  : null,
              report,
            });
        }
    } catch {} // Retry GET metadata only, never a TV command or raw payload output.
    const missing = probes.filter(
      (p) =>
        !found.has(p) ||
        !["resolved", "rejected", "unavailable", "threw"].includes(
          found.get(p).report.state,
        ),
    );
    if (!missing.length)
      return {
        complete: true,
        run,
        attempts,
        reports: probes.map((p) => found.get(p)),
      };
    if (now() < deadline)
      await delay(Math.min(1000, 150 * attempts, deadline - now()));
  }
  return {
    complete: false,
    run,
    attempts,
    missing: probes.filter(
      (p) =>
        !found.has(p) ||
        !["resolved", "rejected", "unavailable", "threw"].includes(
          found.get(p).report.state,
        ),
    ),
    reports: probes.filter((p) => found.has(p)).map((p) => found.get(p)),
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [group, run] = process.argv.slice(2);
  if (!DIAGNOSTIC_GROUPS[group]) throw Error("Unknown diagnostic group");
  const result = await awaitDiagnostics({
    run,
    probes: DIAGNOSTIC_GROUPS[group],
  });
  console.log(JSON.stringify(result, null, 2));
  if (!result.complete) process.exitCode = 2;
}
