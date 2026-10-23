// Read fixed function metadata/source lexically; never execute the inspected bodies.
export function inspectSDKCalls(root) {
  function data(object, name) {
    const d = object && Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  const sdk = data(root, "VIZIO"),
    modules = data(root, "VIZIO_MODULES");
  const targets = [
    ["VIZIO.getConfigVersion", sdk, "getConfigVersion"],
    [
      "System.getScConfigVersion",
      data(modules, "System"),
      "getScConfigVersion",
    ],
    ["debug.launchApiTestApp", data(sdk, "_debug"), "launchApiTestApp"],
    ["Mojo.sendMojoCommand", data(sdk, "Mojo"), "sendMojoCommand"],
  ];
  return targets.map(([name, object, member]) => {
    try {
      const fn = data(object, member);
      if (typeof fn !== "function")
        return { name, type: "unavailable", members: [] };
      const source = Function.prototype.toString.call(fn);
      // Remove strings, templates and comments before extracting references.
      const code = source.replace(
        /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g,
        " ",
      );
      const calls =
        code.match(/\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+(?=\s*\()/g) || [];
      const length = Object.getOwnPropertyDescriptor(fn, "length");
      const arity =
        length && typeof length.value === "number" ? length.value : "unknown";
      return {
        name,
        type: "function; declared args " + arity,
        members: [...new Set(calls)]
          .slice(0, 8)
          .map((call) => ({ name: call, type: "reference only" })),
      };
    } catch {
      return { name, type: "inspection refused", members: [] };
    }
  });
}

export function summarizeVersionArguments(args) {
  const types = [];
  let version = null;
  for (let i = 0; i < Math.min(args.length, 3); i++) {
    const value = args[i];
    types.push(value === null ? "null" : typeof value);
    if (
      (typeof value === "string" || typeof value === "number") &&
      /^v?\d+(?:[.-]\d+){1,5}$/.test(String(value))
    )
      version = String(value);
  }
  return (
    "Version callback args: " +
    args.length +
    " [" +
    types.join(", ") +
    "]" +
    (version === null
      ? "; values withheld."
      : "; version-shaped value: " + version)
  );
}
