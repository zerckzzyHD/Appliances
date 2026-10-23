export const CATALOG_FIELDS = [
  "APP_ID",
  "NAME_SPACE",
  "MESSAGE",
  "AppID",
  "AppId",
  "NameSpace",
  "HtmlAppURI",
  "HtmlAppUri",
  "CNAME",
  "cname",
  "Apps",
  "apps",
  "Items",
  "items",
  "Properties",
  "properties",
  "URL",
  "url",
  "URI",
  "uri",
  "enabled",
  "order",
];
export const CATALOG_TARGETS = [
  "vizioapps-home-route",
  "vizioapps-conjure-route",
  "vizioapps-absent-route",
  "vizioapps",
  "virtualinputs",
  "appmigration",
  "sctv",
];
export function projectCatalogShape(value, allowedFields) {
  const kind = (v) =>
    v === null
      ? "null"
      : Array.isArray(v)
        ? "array"
        : ["object", "string", "number", "boolean", "undefined"].includes(
              typeof v,
            )
          ? typeof v
          : "unsupported";
  const shape = { kind: kind(value), visited: 0, truncated: false, levels: [] };
  if (!value || typeof value !== "object") return shape;
  const seen = new WeakSet(),
    queue = [{ value, depth: 0 }],
    allowed = new Set(allowedFields);
  let inspected = 0;
  while (queue.length) {
    if (shape.visited >= 128 || inspected >= 4096) {
      shape.truncated = true;
      break;
    }
    const item = queue.shift(),
      object = item.value;
    if (seen.has(object)) continue;
    seen.add(object);
    shape.visited++;
    let level = shape.levels[item.depth];
    if (!level)
      level = shape.levels[item.depth] = {
        depth: item.depth,
        nodes: 0,
        objects: 0,
        arrays: 0,
        children: 0,
        accessorsSkipped: 0,
        scalarTypes: {
          string: 0,
          number: 0,
          boolean: 0,
          null: 0,
          undefined: 0,
          unsupported: 0,
        },
        fields: [],
      };
    level.nodes++;
    level[Array.isArray(object) ? "arrays" : "objects"]++;
    const keys = Object.getOwnPropertyNames(object);
    for (const key of keys) {
      if (Array.isArray(object) && key === "length") continue;
      if (inspected >= 4096) {
        shape.truncated = true;
        break;
      }
      inspected++;
      level.children++;
      const d = Object.getOwnPropertyDescriptor(object, key);
      if (!d || !Object.prototype.hasOwnProperty.call(d, "value")) {
        level.accessorsSkipped++;
        continue;
      }
      const child = d.value,
        type = kind(child);
      if (allowed.has(key)) {
        let f = level.fields.find((f) => f.field === key);
        if (!f) {
          f = { field: key, types: [], occurrences: 0 };
          level.fields.push(f);
        }
        f.occurrences++;
        if (!f.types.includes(type)) f.types.push(type);
      }
      if (type !== "object" && type !== "array") level.scalarTypes[type]++;
      else if (item.depth >= 2) {
        shape.truncated = true;
      } else if (
        item.depth < 2 &&
        !/auth|token|secret|account|identity|password|credential|esn|serial|macaddress/i.test(
          key,
        )
      ) {
        if (queue.length + shape.visited < 128)
          queue.push({ value: child, depth: item.depth + 1 });
        else shape.truncated = true;
      }
    }
  }
  return shape;
}
export function validateCatalogShapeReport(report) {
  const exact = (o, keys) =>
    o &&
    typeof o === "object" &&
    !Array.isArray(o) &&
    Object.keys(o).length === keys.length &&
    Object.keys(o).every((k) => keys.includes(k));
  const integer = (n, max = 4096) => Number.isInteger(n) && n >= 0 && n <= max;
  const kinds = [
    "object",
    "array",
    "null",
    "undefined",
    "string",
    "number",
    "boolean",
    "unsupported",
  ];
  if (
    !exact(report, ["run", "target", "shape"]) ||
    typeof report.run !== "string" ||
    !/^[a-f0-9]{32}$/.test(report.run) ||
    !CATALOG_TARGETS.includes(report.target)
  )
    return null;
  const s = report.shape;
  if (
    !exact(s, ["kind", "visited", "truncated", "levels"]) ||
    !kinds.includes(s.kind) ||
    !integer(s.visited, 128) ||
    typeof s.truncated !== "boolean" ||
    !Array.isArray(s.levels) ||
    s.levels.length > 3
  )
    return null;
  let nodes = 0,
    children = 0;
  for (let index = 0; index < s.levels.length; index++) {
    const l = s.levels[index];
    if (
      !exact(l, [
        "depth",
        "nodes",
        "objects",
        "arrays",
        "children",
        "accessorsSkipped",
        "scalarTypes",
        "fields",
      ]) ||
      l.depth !== index ||
      ![l.nodes, l.objects, l.arrays].every((n) => integer(n, 128)) ||
      l.nodes !== l.objects + l.arrays ||
      !integer(l.children) ||
      !integer(l.accessorsSkipped) ||
      l.accessorsSkipped > l.children
    )
      return null;
    if (
      !exact(l.scalarTypes, [
        "string",
        "number",
        "boolean",
        "null",
        "undefined",
        "unsupported",
      ]) ||
      !Object.values(l.scalarTypes).every((n) => integer(n)) ||
      Object.values(l.scalarTypes).reduce((a, b) => a + b, 0) +
        l.accessorsSkipped >
        l.children
    )
      return null;
    if (
      !Array.isArray(l.fields) ||
      l.fields.length > CATALOG_FIELDS.length ||
      new Set(l.fields.map((f) => f?.field)).size !== l.fields.length
    )
      return null;
    for (const f of l.fields)
      if (
        !exact(f, ["field", "types", "occurrences"]) ||
        !CATALOG_FIELDS.includes(f.field) ||
        !integer(f.occurrences) ||
        f.occurrences < 1 ||
        f.occurrences > l.children ||
        !Array.isArray(f.types) ||
        !f.types.length ||
        f.types.length > kinds.length ||
        new Set(f.types).size !== f.types.length ||
        !f.types.every((t) => kinds.includes(t))
      )
        return null;
    if (
      l.fields.reduce((sum, f) => sum + f.occurrences, 0) >
      l.children - l.accessorsSkipped
    )
      return null;
    nodes += l.nodes;
    children += l.children;
  }
  if (nodes !== s.visited || children > 4096) return null;
  if (["object", "array"].includes(s.kind) !== s.visited > 0) return null;
  return JSON.parse(JSON.stringify(report));
}
