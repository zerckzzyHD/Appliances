import { parseHomeDocument } from "./home-document-parser.mjs";
// Static parser only. HTTP CSP denies worker connections/imports/eval. No source execution.
self.onmessage = ({ data }) => {
  try {
    if (
      !data ||
      Object.keys(data).sort().join() !== "base,mime,source" ||
      typeof data.base !== "string" ||
      data.base.length > 2048 ||
      !["html", "javascript"].includes(data.mime) ||
      typeof data.source !== "string" ||
      data.source.length > 524288
    )
      throw Error();
    self.postMessage(parseHomeDocument(data));
  } catch {
    self.postMessage(null);
  }
};
