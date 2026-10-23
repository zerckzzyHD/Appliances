// Shared with the TV parser bundle; never accepts query-bearing/private resources.
export function permittedDocumentURL(value, base) {
  if (typeof value !== "string" || !value.trim() || value.length > 2048)
    return null;
  try {
    const u = new URL(value, base);
    if (
      u.protocol !== "http:" ||
      !["localhost", "127.0.0.1"].includes(u.hostname) ||
      u.port !== "12345" ||
      !u.pathname.startsWith("/scfs/") ||
      u.username ||
      u.password ||
      u.search ||
      u.hash ||
      /%(?:2f|5c|25|00)/i.test(u.pathname) ||
      /(?:config|token|account|identity|credential)/i.test(
        decodeURIComponent(u.pathname),
      )
    )
      return null;
    return u;
  } catch {
    return null;
  }
}
export function classifyDocumentURL(value, base) {
  const permitted = permittedDocumentURL(value, base);
  if (permitted && permitted.origin === new URL(base).origin)
    return "sameOriginAllowed";
  try {
    const u = new URL(value, base);
    return u.origin !== new URL(base).origin ? "external" : "denied";
  } catch {
    return "denied";
  }
}
export function emptyDocumentShape() {
  return {
    scripts: 0,
    inlineScripts: 0,
    dataScripts: 0,
    srcScripts: 0,
    unquotedSrcScripts: 0,
    frames: 0,
    bases: 0,
    metaRefresh: 0,
    jsParse: "notAttempted",
    navigation: "none",
    literalTargetClass: "none",
    navigationContext: "none",
  };
}
