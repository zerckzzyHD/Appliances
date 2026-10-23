import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parse } from "acorn";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(root, path));
const hash = (data) => createHash("sha256").update(data).digest("hex");
const receipt = JSON.parse(read("evidence/provenance/import.json"));
const paths = JSON.parse(read("evidence/provenance/path-map.json")).forgePaths;
const problems = [];
const baseline = receipt.byteSnapshotCommit;
if (!/^[a-f0-9]{40}$/.test(baseline ?? ""))
  throw Error("Missing byte snapshot commit");
for (const item of receipt.records) {
  const original = spawnSync(
    "git",
    ["show", baseline + ":" + item.importPath],
    {
      cwd: root,
      maxBuffer: 4 * 1024 * 1024,
      windowsHide: true,
    },
  );
  if (original.status !== 0 || hash(original.stdout) !== item.sha256)
    problems.push("import baseline mismatch: " + item.importPath);
  const target =
    item.sourcePath.startsWith("console-tv/") && item.class === "tracked"
      ? paths[item.sourcePath.slice(11)]
      : item.importPath;
  if (!target || !existsSync(resolve(root, target)))
    problems.push("missing migrated member: " + target);
  else if (
    (target.startsWith("docs/history/") || target.startsWith("evidence/")) &&
    hash(read(target)) !== item.sha256
  )
    problems.push("immutable content changed: " + target);
}
if (Object.keys(paths).length !== 186 || receipt.records.length !== 193)
  problems.push("unexpected import accounting");
function files(folder) {
  if (!existsSync(resolve(root, folder))) return [];
  return readdirSync(resolve(root, folder)).flatMap((name) => {
    const path = folder + "/" + name;
    if (name === "generated") return [];
    return statSync(resolve(root, path)).isDirectory() ? files(path) : [path];
  });
}
const maintained = [...files("src"), ...files("scripts"), ...files("test")];
for (const path of maintained) {
  const text = read(path).toString("utf8");
  if (
    /C:[/\\]Dev[/\\].*(?:_Mist-Forge|RobCo-UOS[/\\]package\.json)/i.test(text)
  )
    problems.push("old source dependency: " + path);
  if (extname(path) !== ".mjs") continue;
  const ast = parse(text, { ecmaVersion: "latest", sourceType: "module" });
  for (const node of ast.body) {
    const value = node.source?.value;
    if (
      typeof value === "string" &&
      value.startsWith(".") &&
      !existsSync(resolve(root, dirname(path), value))
    )
      problems.push("missing import: " + path + " -> " + value);
  }
}
for (const path of [
  "README.md",
  "AGENTS.md",
  ...files("docs").filter(
    (p) => !p.startsWith("docs/history/") && p.endsWith(".md"),
  ),
]) {
  if (!existsSync(resolve(root, path))) {
    problems.push("missing current document: " + path);
    continue;
  }
  const text = read(path).toString("utf8");
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split("#")[0];
    if (!target || /^https?:\/\//.test(target)) continue;
    if (
      /^[A-Za-z]:|^\//.test(target) ||
      !existsSync(resolve(root, dirname(path), target))
    )
      problems.push("nonportable/missing link: " + path + " -> " + target);
  }
}
const listed = spawnSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  { cwd: root, encoding: "utf8", windowsHide: true },
);
const candidates = [...new Set(listed.stdout.trim().split(/\r?\n/))].filter(
  (p) => p && existsSync(resolve(root, p)),
);
for (const path of candidates) {
  if (
    /(?:^|\/)(?:node_modules|__pycache__|\.local|generated)(?:\/|$)|\.token\.dpapi$|\.(?:pem|key|zip|tar|gz|jpg|png)$/i.test(
      path,
    )
  )
    problems.push("excluded member: " + path);
  if (
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
      read(path).toString("utf8"),
    )
  )
    problems.push("private key marker: " + path);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    JSON.stringify({
      importRecords: 193,
      forgeMembers: 186,
      baselineVerified: true,
      immutableMembersVerified: true,
      relativeImportsVerified: true,
      currentLinksVerified: true,
      excludedFileCheck: true,
      privateKeyMarkerCheck: true,
      scope: "bounded checks; not a comprehensive secret audit",
    }),
  );
