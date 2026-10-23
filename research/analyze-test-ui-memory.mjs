import { createRequire } from "node:module";
const require = createRequire("C:/Dev/!RobCo/!RobCo-UOS/package.json");
const parse5 = require("parse5"),
  acorn = require("acorn");
const r = await fetch("http://192.168.4.26:4176/research/sdk-source-once");
if (!r.ok) throw Error("Capture unavailable");
const bytes = Buffer.from(await r.arrayBuffer()),
  html = bytes.toString("utf8"),
  dom = parse5.parse(html);
const targets = new Set(process.argv.slice(2));
const matches = [],
  registry = [],
  propertyKeys = {};
function astWalk(n, parents = []) {
  if (!n || typeof n !== "object") return;
  if (n.type === "ObjectExpression") {
    const properties = Object.fromEntries(
      n.properties
        .filter((p) => p.type === "Property" && !p.computed)
        .map((p) => [p.key.name || p.key.value, p.value]),
    );
    const name = properties.name?.value;
    if (
      properties.deeplinkId &&
      properties.params &&
      typeof name === "string" &&
      /^[A-Za-z][A-Za-z0-9]{1,80}$/.test(name)
    ) {
      const text = (x) =>
        x?.type === "Literal" &&
        typeof x.value === "string" &&
        /^[A-Za-z][A-Za-z0-9_ .-]{0,70}$/.test(x.value)
          ? x.value
          : undefined;
      const namespace = parents
        .filter((p) => p.type === "ObjectExpression")
        .flatMap((p) => p.properties || [])
        .filter((p) => ["namespace", "apiType"].includes(p.key?.name))
        .map((p) => text(p.value))
        .filter(Boolean);
      const sampleReferences = [];
      const samples = [];
      for (const param of properties.params.elements || []) {
        if (param.type !== "ObjectExpression") continue;
        const fields = Object.fromEntries(
          param.properties
            .filter((p) => p.type === "Property")
            .map((p) => [p.key.name, p.value]),
        );
        const pname = text(fields.name);
        if (!["key", "keys", "APP_ID", "NAME_SPACE", "cname"].includes(pname))
          continue;
        const values = [];
        function collect(x) {
          if (!x || typeof x !== "object") return;
          if (
            x.type === "TemplateElement" &&
            /^[/.A-Za-z0-9][A-Za-z0-9_. :/-]{0,100}$/.test(x.value.cooked || "")
          )
            values.push(x.value.cooked);
          if (
            x.type === "Literal" &&
            (typeof x.value === "number" ||
              (typeof x.value === "string" &&
                /^[/.A-Za-z0-9][A-Za-z0-9_. :/-]{0,100}$/.test(x.value)))
          )
            values.push(x.value);
          for (const [k, v] of Object.entries(x)) {
            if (k === "start" || k === "end") continue;
            if (Array.isArray(v)) for (const c of v) collect(c);
            else if (v && typeof v === "object") collect(v);
          }
        }
        if (fields.sampleOptions)
          sampleReferences.push({
            parameter: pname,
            type: fields.sampleOptions.type,
            elements: fields.sampleOptions.elements?.map((e) => ({
              type: e.type,
              identifier: e.name,
              literalType: typeof e.value,
              literalLength:
                typeof e.value === "string" ? e.value.length : undefined,
              characters:
                typeof e.value === "string"
                  ? [...new Set(e.value)]
                      .filter((c) => !/[A-Za-z0-9]/.test(c))
                      .map((c) => c.charCodeAt(0))
                  : undefined,
              keys: e.properties?.map((p) => p.key.name || "[literal]"),
            })),
          });
        collect(fields.sampleOptions);
        if (values.length) samples.push({ parameter: pname, values });
      }
      registry.push({
        name,
        namespace,
        samples,
        sampleReferences,
        group: text(properties.group),
        type: text(properties.type),
        parameterDefinitions: properties.params.elements?.map((param) => ({
          type: param.type,
          fields: param.properties?.map((p) => ({
            key: p.key?.name || "[literal]",
            type: p.value?.type,
            ...(["name", "type"].includes(p.key?.name)
              ? { text: text(p.value) }
              : {}),
          })),
        })),
        validationFields: properties.validate?.properties?.map(
          (p) => p.key?.name || "[literal]",
        ),
      });
    }
  }
  if (n.type === "Property") {
    const key = n.key?.name || n.key?.value;
    if (typeof key === "string" && /^[A-Za-z][A-Za-z0-9]{0,60}$/.test(key))
      propertyKeys[key] = (propertyKeys[key] || 0) + 1;
  }
  if (
    (n.type === "Literal" &&
      typeof n.value === "string" &&
      targets.has(n.value)) ||
    (n.type === "TemplateElement" && targets.has(n.value.cooked))
  ) {
    const obj = [...parents]
      .reverse()
      .find((x) => x.type === "ObjectExpression");
    matches.push({
      name: n.type === "Literal" ? n.value : n.value.cooked,
      parentTypes: parents.slice(-5).map((x) => x.type),
      objectKeys: (obj?.properties || []).map(
        (x) => x.key?.name || "[literal]",
      ),
      properties: (obj?.properties || []).map((x) => ({
        key: x.key?.name || "[literal]",
        type: x.value?.type,
        identifier: x.value?.name,
      })),
    });
  }
  for (const [k, v] of Object.entries(n)) {
    if (k === "start" || k === "end") continue;
    if (Array.isArray(v)) for (const c of v) astWalk(c, [...parents, n]);
    else if (v && typeof v === "object") astWalk(v, [...parents, n]);
  }
}
const tags = {},
  classes = {},
  methods = new Set(),
  scripts = [],
  ids = [],
  references = [];
function walk(n) {
  if (n.tagName) {
    tags[n.tagName] = (tags[n.tagName] || 0) + 1;
    const attrs = Object.fromEntries(
      (n.attrs || []).map((a) => [a.name, a.value]),
    );
    for (const cl of (attrs.class || "").split(/\s+/))
      if (/^[a-zA-Z][\w-]{0,40}$/.test(cl))
        classes[cl] = (classes[cl] || 0) + 1;
    if (attrs.id && /^[A-Za-z][\w.-]{0,60}$/.test(attrs.id)) ids.push(attrs.id);
    if (n.tagName === "script") {
      const source = (n.childNodes || [])
        .filter((c) => c.nodeName === "#text")
        .map((c) => c.value)
        .join("");
      const info = { inlineCharacters: source.length };
      if (attrs.src && /^(?:\.\.?\/)?[A-Za-z0-9_./-]{1,120}$/.test(attrs.src))
        info.relativeSource = attrs.src;
      if (source) {
        try {
          const ast = acorn.parse(source, {
            ecmaVersion: "latest",
            sourceType: "script",
          });
          astWalk(ast);
          info.statements = ast.body.length;
          info.topLevelBindingCount = ast.body.flatMap((a) =>
            a.type === "VariableDeclaration"
              ? a.declarations.map((d) => d.id?.name).filter(Boolean)
              : a.id?.name
                ? [a.id.name]
                : [],
          ).length;
        } catch {
          info.parse = "unsupported";
        }
      }
      scripts.push(info);
    }
  }
  if (n.nodeName === "#text") {
    for (const value of (n.value || "").matchAll(
      /\b(?:get|set|subscribeTo|launch|register|exit)[A-Z][A-Za-z0-9]{1,80}\b/g,
    ))
      methods.add(value[0]);
  }
  for (const c of n.childNodes || []) walk(c);
}
walk(dom);
bytes.fill(0);
console.log(
  JSON.stringify(
    {
      registry,
      matches,
      propertyKeys: Object.fromEntries(
        Object.entries(propertyKeys)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 50),
      ),
      utf8Bytes: Buffer.byteLength(html),
      tags,
      classes,
      ids: [...new Set(ids)].slice(0, 80),
      methods: [...methods].sort(),
      scripts,
    },
    null,
    2,
  ),
);
