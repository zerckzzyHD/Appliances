import { parse as parseHTML } from "parse5";
import { parse as parseJS } from "acorn";
import {
  classifyDocumentURL,
  emptyDocumentShape,
  permittedDocumentURL,
} from "./home-document-policy.mjs";
import { HOME_REFERENCE_METHODS } from "./home-coverage-contract.mjs";

// Pure syntax inspection. Candidate values are private worker-to-renderer data on TV.
export function parseHomeDocument({ source, mime, base }) {
  const shape = emptyDocumentShape();
  const result = {
    parse: "parsed",
    shape,
    truncated: false,
    candidate: null,
    reason: "noCandidate",
    methods: [],
  };
  if (typeof source === "string")
    result.methods = HOME_REFERENCE_METHODS.filter(([, name]) =>
      new RegExp("\\b" + name + "\\b").test(source),
    ).map(([scope, name]) => ({ scope, name, type: "function" }));
  let nodes = 0,
    inlineBytes = 0,
    baseURL = base,
    baseDenied = false;
  const scripts = new Set(),
    navigation = [],
    jsStates = [];
  const limit = () => {
    throw { limit: true };
  };
  const count = (key) => {
    if (shape[key] === 32) limit();
    shape[key]++;
  };
  const candidates = [];
  function nav(value, top) {
    if (navigation.length === 32 || candidates.length === 32) limit();
    const item = { value, top };
    navigation.push(item);
    candidates.push(item);
  }
  function member(node) {
    if (node?.type === "Identifier") return node.name;
    if (node?.type === "MemberExpression" && !node.computed) {
      const object = member(node.object);
      return object && node.property.type === "Identifier"
        ? object + "." + node.property.name
        : null;
    }
    return null;
  }
  const location = (name) =>
    ["location", "window.location", "document.location"].includes(name);
  function inspectJS(text, module, standalone = false) {
    if (!standalone) {
      inlineBytes += new TextEncoder().encode(text).length;
      if (shape.inlineScripts > 8 || inlineBytes > 65536) limit();
    }
    let ast;
    try {
      ast = parseJS(text, {
        ecmaVersion: 2022,
        sourceType: module ? "module" : "script",
      });
    } catch {
      jsStates.push("failed");
      return;
    }
    jsStates.push("parsed");
    function walk(node, depth, top = false) {
      if (!node || typeof node !== "object") return;
      if (++nodes > 8192 || depth > 64) limit();
      if (node.type === "AssignmentExpression") {
        const name = member(node.left);
        if (
          location(name) ||
          (name?.endsWith(".href") && location(name.slice(0, -5)))
        )
          nav(
            node.operator === "=" &&
              node.right.type === "Literal" &&
              typeof node.right.value === "string"
              ? node.right.value
              : null,
            top,
          );
      }
      if (node.type === "CallExpression") {
        const name = member(node.callee);
        if (
          name &&
          [".assign", ".replace"].some(
            (suffix) =>
              name.endsWith(suffix) && location(name.slice(0, -suffix.length)),
          )
        )
          nav(
            node.arguments.length === 1 &&
              node.arguments[0].type === "Literal" &&
              typeof node.arguments[0].value === "string"
              ? node.arguments[0].value
              : null,
            top,
          );
      }
      for (const [key, child] of Object.entries(node)) {
        if (["start", "end", "type"].includes(key)) continue;
        if (Array.isArray(child))
          for (const item of child) walk(item, depth + 1, false);
        else if (child && typeof child === "object")
          walk(child, depth + 1, node.type === "ExpressionStatement" && top);
      }
    }
    // Only a direct ExpressionStatement at Program level can select navigation.
    for (const statement of ast.body)
      walk(statement, 0, statement.type === "ExpressionStatement");
  }
  try {
    if (
      typeof source !== "string" ||
      source.length > 524288 ||
      !permittedDocumentURL(base)
    )
      throw {};
    if (mime === "javascript") inspectJS(source, false, true);
    else if (mime === "html") {
      const tree = parseHTML(source, {
        sourceCodeLocationInfo: true,
        scriptingEnabled: true,
      });
      const active = [];
      function walkHTML(node, depth) {
        if (++nodes > 8192 || depth > 64) limit();
        if (node.tagName === "template") return;
        if (node.tagName) active.push(node);
        for (const child of node.childNodes || []) walkHTML(child, depth + 1);
      }
      walkHTML(tree, 0);
      const attr = (node, name) =>
        node.attrs?.find((a) => a.name === name)?.value;
      let firstBase = true;
      for (const node of active)
        if (node.tagName === "base") {
          count("bases");
          const href = attr(node, "href");
          if (firstBase && href !== undefined) {
            firstBase = false;
            const u = permittedDocumentURL(href, base);
            if (!u || u.origin !== new URL(base).origin) baseDenied = true;
            else baseURL = u.href;
          }
        }
      for (const node of active) {
        // Unmodelled event-handler navigation prevents choosing a dependency by exclusion.
        if (node.attrs?.some((a) => a.name.startsWith("on"))) nav(null, false);
        if (["frame", "iframe"].includes(node.tagName)) count("frames");
        if (
          node.tagName === "meta" &&
          attr(node, "http-equiv")?.toLowerCase() === "refresh"
        ) {
          count("metaRefresh");
          // Grammar only: a numeric delay then a URL attribute. Never follows here.
          const match = attr(node, "content")?.match(
            /^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(.*?)\s*$/i,
          );
          let value = match?.[1] ?? null;
          if (
            value &&
            ((value[0] === '"' && value[value.length - 1] === '"') ||
              (value[0] === "'" && value[value.length - 1] === "'"))
          )
            value = value.slice(1, -1);
          nav(value, true);
        }
        if (node.tagName !== "script") continue;
        count("scripts");
        const type = (attr(node, "type") || "").trim().toLowerCase();
        const executable = [
          "",
          "module",
          "text/javascript",
          "application/javascript",
          "text/ecmascript",
          "application/ecmascript",
        ].includes(type);
        if (!executable) {
          count("dataScripts");
          continue;
        }
        const src = attr(node, "src");
        if (src !== undefined) {
          count("srcScripts");
          const loc = node.sourceCodeLocation?.attrs?.src;
          const raw = loc ? source.slice(loc.startOffset, loc.endOffset) : "";
          if (!/^[^=]*=\s*["']/.test(raw)) count("unquotedSrcScripts");
          if (candidates.length === 32) limit();
          candidates.push(src);
          scripts.add(src);
        } else {
          count("inlineScripts");
          inspectJS(
            (node.childNodes || [])
              .map((c) => (c.nodeName === "#text" ? c.value : ""))
              .join(""),
            type === "module",
          );
        }
      }
    } else throw {};
  } catch (error) {
    result.parse = error?.limit ? "limit" : "failed";
    result.truncated = true;
  }
  shape.jsParse = jsStates.includes("failed")
    ? jsStates.includes("parsed")
      ? "partial"
      : "failed"
    : jsStates.length
      ? "parsed"
      : "notAttempted";
  if (
    result.parse !== "parsed" ||
    ["failed", "partial"].includes(shape.jsParse)
  ) {
    if (result.parse === "parsed") result.parse = "partial";
    result.truncated = true;
    shape.navigation =
      shape.literalTargetClass =
      shape.navigationContext =
        "unknown";
    result.reason = "parseIncomplete";
    return result;
  }
  const literal = navigation.filter((n) => n.value !== null),
    computed = navigation.length - literal.length;
  shape.navigation = literal.length
    ? computed
      ? "mixed"
      : "literalOnly"
    : computed
      ? "computedOnly"
      : "none";
  const top = navigation.filter((n) => n.top).length;
  shape.navigationContext = !navigation.length
    ? "none"
    : top === navigation.length
      ? "topLevelOnly"
      : top
        ? "mixed"
        : "nestedOnly";
  const targets = new Set(
    literal.map((n) => {
      try {
        return new URL(n.value, baseURL).href;
      } catch {
        return n.value;
      }
    }),
  );
  shape.literalTargetClass =
    targets.size > 1
      ? "multiple"
      : targets.size
        ? classifyDocumentURL([...targets][0], base)
        : "none";
  // Priority: incomplete > rejected base > frames/computed/nested/multiple > destination policy.
  if (baseDenied) {
    result.reason = "policyDenied";
    return result;
  }
  if (
    shape.frames ||
    computed ||
    top !== navigation.length ||
    targets.size > 1
  ) {
    result.reason = "ambiguous";
    return result;
  }
  let chosen, kind;
  if (targets.size === 1) {
    chosen = [...targets][0];
    kind = "literalNavigation";
  } else {
    const resolved = new Set(
      [...scripts].map((s) => {
        try {
          return new URL(s, baseURL).href;
        } catch {
          return s;
        }
      }),
    );
    if (resolved.size > 1) {
      result.reason = "ambiguous";
      return result;
    }
    if (!resolved.size) return result;
    chosen = [...resolved][0];
    kind = "singleScript";
  }
  const category = classifyDocumentURL(chosen, base);
  if (category !== "sameOriginAllowed") {
    result.reason = category === "external" ? "external" : "policyDenied";
    return result;
  }
  if (chosen === new URL(base).href) {
    result.reason = "selfLoop";
    return result;
  }
  result.candidate = { href: chosen, kind };
  return result;
}
