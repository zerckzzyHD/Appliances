// Fixed SDK objects only. No getters, property values, or function bodies emitted.
export function inspectSDKModules(root) {
  function data(object, name) {
    if (!object || (typeof object !== "object" && typeof object !== "function"))
      return undefined;
    const d = Object.getOwnPropertyDescriptor(object, name);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  const vizio = data(root, "VIZIO"),
    modules = data(root, "VIZIO_MODULES");
  const targets = [
    ["VIZIO_MODULES.App", data(modules, "App")],
    ["VIZIO.Mojo", data(vizio, "Mojo")],
    ["VIZIO._debug", data(vizio, "_debug")],
    ["VIZIO_MODULES._debug", data(modules, "_debug")],
    [
      "VIZIO_MODULES.System",
      data(modules, "System"),
      /app|home|input|config|debug|developer|install|launch|register|bookmark|tile|version|ready|connect/i,
    ],
    [
      "VIZIO",
      vizio,
      /app|home|input|config|debug|developer|install|launch|register|bookmark|tile/i,
    ],
  ];
  return targets.map(([name, value, filter]) => {
    try {
      if (!value || (typeof value !== "object" && typeof value !== "function"))
        return { name, type: "unavailable as data property", members: [] };
      const names = Object.getOwnPropertyNames(value).sort();
      const selected = names.filter(
        (member) =>
          member !== "constructor" &&
          !/auth|token|homekit/i.test(member) &&
          (!filter || filter.test(member)),
      );
      return {
        name,
        type: typeof value,
        total: names.length,
        selected: selected.length,
        members: selected.slice(0, 120).map((member) => {
          const d = Object.getOwnPropertyDescriptor(value, member);
          return {
            name: member,
            type:
              d && Object.prototype.hasOwnProperty.call(d, "value")
                ? typeof d.value
                : "accessor (not read)",
          };
        }),
      };
    } catch {
      return { name, type: "inspection refused", members: [] };
    }
  });
}
