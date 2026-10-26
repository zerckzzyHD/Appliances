import { readFileSync } from "node:fs";
import { documentPagePrefix } from "./home-document-browser.mjs";
export function readPreparedDocument() {
  const worker = readFileSync(
    new URL("./generated/home-document-worker.js", import.meta.url),
    "utf8",
  );
  const page = readFileSync(
    new URL("./generated/home-document-page.js", import.meta.url),
    "utf8",
  );
  if (
    !worker.length ||
    !page.length ||
    Buffer.byteLength(worker) > 524288 ||
    Buffer.byteLength(page) > 65536
  )
    throw Error("Prepared parser unavailable.");
  return { worker, page: documentPagePrefix + "<script>" + page + "</script>" };
}
