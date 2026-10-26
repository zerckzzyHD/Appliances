export function collectSDKMethodMetadata(root) {
  function data(object, name) {
    const d = object && Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  const sdk = data(root, "VIZIO"),
    modules = data(root, "VIZIO_MODULES"),
    result = [];
  for (const [scope, object] of [
    ["App", data(modules, "App")],
    ["System", data(modules, "System")],
    ["Mojo", data(sdk, "Mojo")],
    ["debug", data(sdk, "_debug")],
    ["VIZIO", sdk],
  ]) {
    if (!object || (typeof object !== "object" && typeof object !== "function"))
      continue;
    for (const name of Object.getOwnPropertyNames(object).sort()) {
      if (result.length >= 256) return result;
      if (!/^[A-Za-z_$][\w$]{0,63}$/.test(name)) continue;
      const d = Object.getOwnPropertyDescriptor(object, name);
      const type =
        d && Object.prototype.hasOwnProperty.call(d, "value")
          ? typeof d.value
          : "accessor";
      if (["function", "object", "accessor"].indexOf(type) !== -1)
        result.push({ scope, name, type });
    }
  }
  return result;
}

export function createDiagnosticReporter(
  root,
  collect,
  probe = "sdk-version-10",
) {
  const match =
    root.location && root.location.pathname.match(/\/([a-f0-9]{32})$/);
  if (!root.fetch || !match) return { send() {} };
  let sequence = 0;
  const state = {
    probe,
    run: match[1],
    loaded: false,
    ready: false,
    state: "waiting",
  };
  return {
    send(update) {
      Object.assign(state, update);
      if (state.ready && !state.methods) {
        try {
          state.methods = collect(root);
        } catch {
          state.methods = [];
        }
      }
      const body = JSON.stringify({ ...state, sequence: sequence++ });
      // No retries or raw console/error/source text; backend independently validates.
      root
        .fetch("/research/report", {
          method: "POST",
          credentials: "omit",
          redirect: "error",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body,
        })
        .then(
          () => {},
          () => {},
        );
    },
  };
}
