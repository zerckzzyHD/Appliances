// Presentation only: projection timestamps remain UTC in the data contract.
export function formatProjectionTime(iso) {
  if (typeof iso !== "string" || !iso) return "unknown";
  var date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return "unknown";
  try {
    var formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    });
    var values = {};
    formatter.formatToParts(date).forEach(function (part) {
      values[part.type] = part.value;
    });
    return (
      values.year +
      "-" +
      values.month +
      "-" +
      values.day +
      " " +
      values.hour +
      ":" +
      values.minute +
      ":" +
      values.second +
      " " +
      values.timeZoneName
    );
  } catch (error) {
    return "local time unavailable";
  }
}
