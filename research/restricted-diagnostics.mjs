export const MAX_DIAGNOSTIC_BYTES = 32768;

export function safeSDKVersion(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value);
  return text.length <= 80 &&
    /^(?:(?:PROD|DEV|TEST|PRODUCTION)\s+)?v?\d{1,8}(?:[.-]\d{1,8}){1,5}$/i.test(
      text,
    )
    ? text
    : null;
}

// Fail closed: no free-form messages, SDK source, arbitrary values or identifiers.
export function validateDiagnosticReport(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const allowed = new Set([
    "probe",
    "run",
    "sequence",
    "loaded",
    "ready",
    "state",
    "responseType",
    "version",
    "methods",
    "errorCategory",
    "errorCode",
  ]);
  if (Object.keys(value).some((key) => !allowed.has(key))) return null;
  if (
    ![
      "sdk-source-absent-21",
      "sdk-source-positive-21",
      "sdk-source-chromium-21",
      "sdk-source-home-21",
      "sdk-source-orchestrator-21",
      "sdk-home-reference-20",
      "sdk-home-reference-22",
      "sdk-route-filter-19",
      "sdk-app-home-info-18",
      "sdk-app-conjure-info-18",
      "sdk-app-absent-info-18",
      "sdk-app-conjure-cname-18",
      "sdk-speech-start-17",
      "sdk-speech-stop-17",
      "sdk-internal-docker-16",
      "sdk-version-10",
      "sdk-store-12",
      "sdk-config-absent-14",
      "sdk-config-vizioapps-14",
      "sdk-config-virtualinputs-14",
      "sdk-config-appmigration-14",
      "sdk-app-sctv-14",
    ].includes(value.probe) ||
    typeof value.run !== "string" ||
    !/^[a-f0-9]{32}$/.test(value.run)
  )
    return null;
  if (
    !Number.isInteger(value.sequence) ||
    value.sequence < 0 ||
    value.sequence > 1000
  )
    return null;
  if (
    ![
      "waiting",
      "loaded",
      "ready",
      "invoked",
      "resolved",
      "rejected",
      "unavailable",
      "threw",
    ].includes(value.state)
  )
    return null;
  for (const key of ["loaded", "ready"])
    if (typeof value[key] !== "boolean") return null;
  if (
    value.responseType !== undefined &&
    ![
      "undefined",
      "null",
      "string",
      "number",
      "boolean",
      "object",
      "function",
    ].includes(value.responseType)
  )
    return null;
  if (value.version !== undefined && safeSDKVersion(value.version) === null)
    return null;
  if (
    value.errorCategory !== undefined &&
    ![
      "unsupported",
      "permission",
      "timeout",
      "connection",
      "method",
      "other",
    ].includes(value.errorCategory)
  )
    return null;
  if (
    value.errorCode !== undefined &&
    (!Number.isInteger(value.errorCode) ||
      value.errorCode < -32768 ||
      value.errorCode > 65535)
  )
    return null;
  if (value.methods !== undefined) {
    if (!Array.isArray(value.methods) || value.methods.length > 256)
      return null;
    for (const method of value.methods) {
      if (
        !method ||
        typeof method !== "object" ||
        Array.isArray(method) ||
        Object.keys(method).some(
          (key) => !["scope", "name", "type"].includes(key),
        )
      )
        return null;
      if (
        ![
          "VIZIO",
          "App",
          "System",
          "Mojo",
          "debug",
          "InternalDocker",
          "TextToSpeech",
        ].includes(method.scope) ||
        typeof method.name !== "string" ||
        !/^[A-Za-z_$][\w$]{0,63}$/.test(method.name) ||
        !["function", "accessor", "object"].includes(method.type)
      )
        return null;
    }
  }
  return JSON.parse(JSON.stringify(value));
}
