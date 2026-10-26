import { readFileSync } from "node:fs";
import { dependenciesPagePrefix } from "./home-dependencies-browser.mjs";

// Called only by the opt-in research route; importing this module reads no generated files.
export function readPreparedDependencies() {
  const worker = readFileSync(
    new URL("./generated/home-dependencies-worker.js", import.meta.url),
    "utf8",
  );
  const page = readFileSync(
    new URL("./generated/home-dependencies-page.js", import.meta.url),
    "utf8",
  );
  if (
    !worker.length ||
    !page.length ||
    Buffer.byteLength(worker) > 524288 ||
    Buffer.byteLength(page) > 65536
  )
    throw Error("Prepared dependency parser unavailable.");
  return {
    worker,
    page: dependenciesPagePrefix + "<script>" + page + "</script>",
  };
}
