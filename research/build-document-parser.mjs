import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const home = new URL("../", import.meta.url);
const output = new URL("generated/", import.meta.url);
await mkdir(output, { recursive: true });
const result = await build({
  absWorkingDir: fileURLToPath(home),
  entryPoints: ["research/home-document-worker.mjs"],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "none",
  charset: "ascii",
  logLevel: "silent",
});
const code = result.outputFiles[0].text;
if (Buffer.byteLength(code) > 524288)
  throw Error("Parser bundle exceeds fixed delivery limit.");
// Generated output is ignored. Rebuilt privately with locked dependencies, never source capture.
await writeFile(new URL("home-document-worker.js", output), code);
const page = await build({
  absWorkingDir: fileURLToPath(home),
  entryPoints: ["research/home-document-entry.mjs"],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "none",
  charset: "ascii",
  logLevel: "silent",
});
await writeFile(
  new URL("home-document-page.js", output),
  page.outputFiles[0].text.replaceAll("</script", "<\\/script"),
);
const licenses = await Promise.all(
  ["parse5/LICENSE", "acorn/LICENSE", "entities/LICENSE"].map((p) =>
    readFile(new URL("node_modules/" + p, home), "utf8"),
  ),
);
await writeFile(new URL("LICENSES.txt", output), licenses.join("\n\n"));
console.log(
  JSON.stringify({
    parserBundleBytes: Buffer.byteLength(code),
    licenses: licenses.length,
  }),
);
