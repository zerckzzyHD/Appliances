import { parseHomeDependencies } from "./home-dependencies-parser.mjs";

// The parser sees source only inside this worker. It never evaluates or imports it.
self.onmessage = ({ data }) => {
  try {
    if (
      !data ||
      Object.keys(data).sort().join() !== "base,mime,module,source" ||
      typeof data.base !== "string" ||
      data.base.length > 2048 ||
      !["html", "javascript"].includes(data.mime) ||
      typeof data.module !== "boolean" ||
      typeof data.source !== "string" ||
      new TextEncoder().encode(data.source).byteLength > 524289
    )
      throw Error();
    self.postMessage(parseHomeDependencies(data));
  } catch {
    self.postMessage({ failureReason: "workerError" });
  }
};
