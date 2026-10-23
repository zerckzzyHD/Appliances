import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("disabled normal hosting loads without parser packages or generated parser assets", () => {
  // The local child never listens or contacts a device. Fail if the disabled
  // import graph attempts to load a dev-only parser/build dependency or bundle.
  const loader = `export async function resolve(specifier, context, nextResolve) {
    if (["parse5", "acorn", "esbuild"].some(name => specifier === name || specifier.startsWith(name + "/")) || specifier.includes("/generated/")) throw Error("unexpected_parser_dependency");
    return nextResolve(specifier, context);
  }`;
  const entry = new URL("../vite-plugin.mjs", import.meta.url).href;
  const server = new URL("../research/isolated-server.mjs", import.meta.url)
    .href;
  const source = `const {default: plugin} = await import(${JSON.stringify(entry)});
    const {createResearchServer} = await import(${JSON.stringify(server)});
    plugin({bind:"192.168.4.26",tv:"192.168.4.20",researchTargets:["main"]});
    const unused = createResearchServer({profile:{target:"main",tv:"127.0.0.2",port:4178},ally:"127.0.0.1"});
    unused.close();`;
  const result = spawnSync(
    process.execPath,
    [
      "--experimental-loader=data:text/javascript," +
        encodeURIComponent(loader),
      "--input-type=module",
      "-e",
      source,
    ],
    { encoding: "utf8", timeout: 10000, windowsHide: true },
  );
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
