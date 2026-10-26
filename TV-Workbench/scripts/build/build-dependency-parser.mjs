import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const home = new URL("../../", import.meta.url);
const output = new URL("../../src/research/generated/", import.meta.url);
await mkdir(output, { recursive: true });

async function bundle(entryPoint) {
  const result = await build({
    absWorkingDir: fileURLToPath(home),
    entryPoints: [entryPoint],
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
  return result.outputFiles[0].text;
}

const worker = await bundle("src/research/home-dependencies-worker.mjs");
const page = await bundle("src/research/home-dependencies-entry.mjs");
if (Buffer.byteLength(worker) > 524288)
  throw Error("Dependency parser bundle exceeds fixed delivery limit.");
await writeFile(new URL("home-dependencies-worker.js", output), worker);
await writeFile(
  new URL("home-dependencies-page.js", output),
  page.replaceAll("</script", "<\\/script"),
);
const licenses = await Promise.all(
  ["parse5/LICENSE", "acorn/LICENSE", "entities/LICENSE"].map((path) =>
    readFile(new URL("node_modules/" + path, home), "utf8"),
  ),
);
await writeFile(new URL("LICENSES.txt", output), licenses.join("\n\n"));
console.log(
  JSON.stringify({
    workerBytes: Buffer.byteLength(worker),
    pageBytes: Buffer.byteLength(page),
    licenses: licenses.length,
  }),
);
