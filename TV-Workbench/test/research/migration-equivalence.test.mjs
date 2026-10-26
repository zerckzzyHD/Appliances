import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parse } from "acorn";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
function semanticTree(source) {
  return JSON.parse(
    JSON.stringify(
      parse(source, { ecmaVersion: "latest", sourceType: "module" }),
      (key, value) =>
        ["start", "end", "raw"].includes(key) ? undefined : value,
    ),
  );
}
test("offline envelope analyzer preserves original program semantics after relocation", () => {
  const receipt = JSON.parse(
    readFileSync(
      new URL("../../evidence/provenance/import.json", import.meta.url),
    ),
  );
  const original = execFileSync(
    "git",
    ["show", receipt.byteSnapshotCommit + ":research/inspect-utv.mjs"],
    {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    },
  );
  const relocated = readFileSync(
    new URL("../../scripts/analysis/inspect-utv.mjs", import.meta.url),
    "utf8",
  );
  assert.deepEqual(semanticTree(relocated), semanticTree(original));
});
