// Approved aggregate data allowlist. Pure function: no files, network, state access, or server.
export function toTVSummary(projection) {
  const summary = projection?.summary;
  const counts = summary?.counts;
  const outcomes = ["PASS", "FAIL", "UNOBSERVABLE"];
  const integer = (value) => Number.isSafeInteger(value) && value >= 0;
  if (
    !["GREEN", "ATTENTION", "BLIND"].includes(summary?.verdict) ||
    !integer(summary?.total) ||
    summary.total === 0 ||
    !outcomes.every((key) => integer(counts?.[key])) ||
    outcomes.reduce((sum, key) => sum + counts[key], 0) !== summary.total
  ) {
    return { availability: "UNAVAILABLE" };
  }
  const generatedAt = projection?.meta?.generatedAt;
  const validTime =
    typeof generatedAt === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      generatedAt,
    ) &&
    Number.isFinite(Date.parse(generatedAt));
  const sourceAge = projection?.supervisor?.lastTickAge?.ms;
  const stale = projection?.supervisor?.stale;
  return {
    availability: "AVAILABLE",
    projectionGeneratedAt: validTime ? generatedAt : null,
    summary: {
      verdict: summary.verdict,
      total: summary.total,
      counts: Object.fromEntries(outcomes.map((key) => [key, counts[key]])),
    },
    freshness: {
      sourceAgeMs:
        typeof sourceAge === "number" &&
        Number.isFinite(sourceAge) &&
        sourceAge >= 0
          ? sourceAge
          : null,
      sourceStale: typeof stale === "boolean" ? stale : null,
    },
  };
}
