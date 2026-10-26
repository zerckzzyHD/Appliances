// Reflect interface metadata only: never invoke getters/methods or serialize
// native property contents. Results stay in the renderer, not the LAN API.
export function describeNativeInterfaces(root) {
  const names = Object.getOwnPropertyNames(root)
    .filter((name) =>
      /vizio|conjure|bridge|native|chromecast|^webkit$|^chrome$|^external$/i.test(
        name,
      ),
    )
    .sort()
    .slice(0, 24);
  return names.map((name) => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(root, name);
      if (
        !descriptor ||
        !Object.prototype.hasOwnProperty.call(descriptor, "value")
      )
        return { name, type: "accessor (not read)", members: [] };
      const value = descriptor.value;
      const type = value === null ? "null" : typeof value;
      const members = [];
      if (value && (type === "object" || type === "function")) {
        const seen = new Set();
        let object = value;
        for (let level = 0; level < 2 && object; level++) {
          if (object === Object.prototype || object === Function.prototype)
            break;
          for (const member of Object.getOwnPropertyNames(object).sort()) {
            if (
              seen.has(member) ||
              member === "constructor" ||
              members.length >= 80
            )
              continue;
            seen.add(member);
            const item = Object.getOwnPropertyDescriptor(object, member);
            members.push({
              name: member,
              type:
                item && Object.prototype.hasOwnProperty.call(item, "value")
                  ? typeof item.value
                  : "accessor (not read)",
            });
          }
          object = Object.getPrototypeOf(object);
        }
        // A constructor's own prototype is a data descriptor. Inspect its
        // metadata separately; never instantiate it or invoke an accessor.
        if (type === "function") {
          const prototype = Object.getOwnPropertyDescriptor(value, "prototype");
          if (
            prototype &&
            prototype.value &&
            typeof prototype.value === "object"
          ) {
            for (const member of Object.getOwnPropertyNames(
              prototype.value,
            ).sort()) {
              if (member === "constructor" || members.length >= 80) continue;
              const item = Object.getOwnPropertyDescriptor(
                prototype.value,
                member,
              );
              members.push({
                name: "prototype." + member,
                type:
                  item && Object.prototype.hasOwnProperty.call(item, "value")
                    ? typeof item.value
                    : "accessor (not read)",
              });
            }
          }
        }
      }
      return { name, type, members };
    } catch {
      return { name, type: "inspection refused", members: [] };
    }
  });
}

export function renderCapabilityProbe(root, document, describe) {
  let pages = [],
    index = 0;
  const heading = document.createElement("h1");
  heading.textContent = "MIST SOFTWARE PROBE";
  const notice = document.createElement("p");
  notice.textContent =
    "Names and types only. No native methods called. Left/right: pages. OK: rescan.";
  const output = document.createElement("pre");
  output.style.cssText = "font:22px Arial;line-height:1.4;white-space:pre-wrap";
  document.body.replaceChildren(heading, notice, output);
  function display() {
    output.textContent =
      "Page " + (index + 1) + " of " + pages.length + "\n\n" + pages[index];
  }
  function scan() {
    const report = describe(root);
    const lines = [
      "Focused interface metadata (standard WebKit APIs omitted).",
      "",
    ];
    if (!report.length) lines.push("No matching own global names.");
    for (const item of report) {
      lines.push(item.name + " : " + item.type);
      if (!item.members.length) lines.push("  No member metadata read.");
      for (const member of item.members)
        lines.push("  " + member.name + " : " + member.type);
      lines.push("");
    }
    const wrapped = [];
    for (const line of lines) {
      if (!line.length) wrapped.push("");
      for (let offset = 0; offset < line.length; offset += 72)
        wrapped.push(line.slice(offset, offset + 72));
    }
    pages = [];
    for (let start = 0; start < wrapped.length; start += 12)
      pages.push(wrapped.slice(start, start + 12).join("\n"));
    index = 0;
    display();
  }
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.keyCode === 39)
      index = (index + 1) % pages.length;
    else if (event.key === "ArrowLeft" || event.keyCode === 37)
      index = (index + pages.length - 1) % pages.length;
    else if (event.key === "Enter" || event.keyCode === 13) {
      scan();
      return;
    } else return;
    event.preventDefault();
    display();
  });
  scan();
}
