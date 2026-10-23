import { createRequire } from "node:module";
const require = createRequire("C:/Dev/!RobCo/!RobCo-UOS/package.json");
const acorn = require("acorn");
const response = await fetch(
  "http://192.168.4.26:4176/research/sdk-source-once",
);
if (!response.ok) throw new Error("Capture unavailable");
const bytes = Buffer.from(await response.arrayBuffer());
const source = bytes.toString("utf8");
const ast = acorn.parse(source, {
  ecmaVersion: "latest",
  sourceType: "script",
});
const targets = new Set(process.argv.slice(2));
const found = [];
function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node);
  for (const [k, v] of Object.entries(node)) {
    if (k === "start" || k === "end") continue;
    if (Array.isArray(v)) for (const c of v) walk(c, visit);
    else if (v && typeof v === "object") walk(v, visit);
  }
}
function label(n) {
  if (!n) return "?";
  if (n.type === "Identifier") return n.name;
  if (n.type === "MemberExpression")
    return (
      label(n.object) +
      "." +
      (n.computed
        ? n.property.type === "Literal"
          ? "[literal]"
          : "[computed]"
        : label(n.property))
    );
  return n.type;
}
function shape(n) {
  if (!n || typeof n !== "object") return n;
  if (Array.isArray(n)) return n.map(shape);
  const o = {};
  for (const [k, v] of Object.entries(n)) {
    if (["start", "end", "raw", "regex"].includes(k)) continue;
    if (
      k === "value" &&
      (n.type === "Literal" || n.type === "TemplateElement")
    ) {
      o.value = "<redacted>";
      continue;
    }
    o[k] = v && typeof v === "object" ? shape(v) : v;
  }
  return o;
}
function concise(n) {
  if (!n) return null;
  switch (n.type) {
    case "Identifier":
      return n.name;
    case "Literal":
      return typeof n.value === "number" ? n.value : "<literal>";
    case "TemplateLiteral":
      return {
        templateLengths: n.quasis.map((q) => q.value.cooked.length),
        expressions: n.expressions.map(concise),
      };
    case "MemberExpression":
      return label(n);
    case "CallExpression":
      return { call: label(n.callee), args: n.arguments.map(concise) };
    case "UnaryExpression":
      return { operator: n.operator, arg: concise(n.argument) };
    case "ConditionalExpression":
      return {
        condition: concise(n.test),
        yes: concise(n.consequent),
        no: concise(n.alternate),
      };
    case "LogicalExpression":
    case "BinaryExpression":
      return {
        operator: n.operator,
        left: concise(n.left),
        right: concise(n.right),
      };
    case "AssignmentExpression":
      return { assign: concise(n.left), value: concise(n.right) };
    default:
      return n.type;
  }
}
function summarize(node, name) {
  const control = [];
  walk(node, (n) => {
    if (["IfStatement", "VariableDeclarator"].includes(n.type))
      control.push(
        n.type === "IfStatement"
          ? {
              condition: concise(n.test),
              consequent: n.consequent.type,
              alternate: n.alternate?.type,
            }
          : { binding: label(n.id), value: concise(n.init) },
      );
  });
  const calls = new Set(),
    identifiers = new Set(),
    keys = new Set(),
    paths = new Set(),
    literals = [];
  walk(node, (n) => {
    if (n.type === "CallExpression" || n.type === "NewExpression")
      calls.add(
        label(n.callee) +
          "(" +
          n.arguments.map((a) => label(a)).join(",") +
          ")",
      );
    if (n.type === "Identifier") identifiers.add(n.name);
    if (n.type === "TemplateElement") {
      const value = n.value.cooked || "";
      if (name === "hw" && /^https?:\/\//.test(value)) {
        try {
          const u = new URL(value);
          if (
            !u.username &&
            !u.password &&
            !u.search &&
            !u.hash &&
            u.pathname.split("/").every((x) => x.length < 25)
          )
            paths.add(u.origin + u.pathname);
        } catch {}
      }
      if (
        value.length <= 120 &&
        /^(?:\/?(?:app|tv|debug|sc|system|store|api|companion|tmm|tlm|get|set|launch|conjure|register|install)[A-Za-z0-9_./:-]*|https?:\/\/(?:localhost|127\.0\.0\.1)(?::[0-9]+)?(?:\/[A-Za-z0-9_.-]{0,24})*)$/.test(
          value,
        )
      )
        paths.add(value);
      else if (
        /^[A-Za-z_][A-Za-z0-9_.-]{1,60}$/.test(value) &&
        value.includes(".")
      )
        paths.add(value);
      else literals.push({ type: "template", length: value.length });
    }
    if (n.type === "Property" && !n.computed)
      keys.add(n.key.name || "[literal]");
    if (n.type === "Literal" && typeof n.value === "string") {
      if (
        /^(?:\/?(?:app|tv_store|tvstore|state|config|store|debug|scpl|system|tmm|tlm|sc_config|sc-config)[a-zA-Z0-9_./-]{0,80}|GET|PUT|POST|SUCCESS)$/.test(
          n.value,
        )
      )
        paths.add(n.value);
      else literals.push({ type: "string", length: n.value.length });
    }
  });
  return {
    name,
    control,
    ...(process.env.SDK_AST_DETAIL === "1" ? { structure: shape(node) } : {}),
    type: node.type,
    characters: node.end - node.start,
    calls: [...calls],
    identifiers: [...identifiers],
    keys: [...keys],
    paths: [...paths],
    literals,
  };
}
walk(ast, (n) => {
  if (n.type === "VariableDeclarator" && targets.has(n.id?.name))
    found.push(summarize(n, n.id.name));
  if (n.type === "FunctionDeclaration" && targets.has(n.id?.name))
    found.push(summarize(n, n.id.name));
  if (n.type === "Property" && targets.has(n.key?.name || n.key?.value))
    found.push(summarize(n, n.key.name || n.key.value));
});
bytes.fill(0);
const keywordCounts = {};
for (const term of [
  "install",
  "register",
  "tile",
  "favorite",
  "VirtualInputs",
  "HtmlAppURI",
  "DashCast",
])
  keywordCounts[term] = (source.match(new RegExp(term, "gi")) || []).length;
const configKeys = new Set(),
  entryNames = new Set(),
  rpcPaths = new Set();
walk(ast, (n) => {
  if (
    n.type === "Identifier" &&
    /install|register|tile|favorite|apporder|virtualinput|htmlapp|conjure|dashcast/i.test(
      n.name,
    )
  )
    entryNames.add(n.name);
  if (n.type === "CallExpression" && label(n.callee) === "ba.getProperty") {
    const a = n.arguments[0];
    if (a?.type === "TemplateLiteral" && !a.expressions.length) {
      const key = a.quasis[0].value.cooked;
      if (/^[A-Za-z0-9_.-]{1,100}$/.test(key)) configKeys.add(key);
    }
  }
  if (n.type === "TemplateElement") {
    const v = n.value.cooked || "";
    if (
      /^(?:app|state|tv|sc|system|config|key_command|network|menu)\/[a-zA-Z0-9_/.-]{1,80}$/.test(
        v,
      )
    )
      rpcPaths.add(v);
  }
});
console.log(
  JSON.stringify(
    {
      keywordCounts,
      configKeys: [...configKeys],
      entryNames: [...entryNames],
      rpcPaths: [...rpcPaths],
      parser: "acorn",
      utf8Bytes: Buffer.byteLength(source),
      characters: source.length,
      findings: found,
    },
    null,
    2,
  ),
);
