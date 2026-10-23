export function selectKnownRoutes(value, wantedId) {
  if (!Array.isArray(value) || !["1", "17", "99999999"].includes(wantedId))
    return null;
  const matches = [];
  let visited = 0,
    truncated = false;
  function data(object, key) {
    const d = Object.getOwnPropertyDescriptor(object, key);
    return d && Object.prototype.hasOwnProperty.call(d, "value")
      ? d.value
      : undefined;
  }
  for (const key of Object.getOwnPropertyNames(value)) {
    if (key === "length") continue;
    const entry = data(value, key);
    if (!entry || typeof entry !== "object") continue;
    const queue = [{ value: entry, depth: 0 }],
      seen = new WeakSet();
    let match = false;
    while (queue.length) {
      if (visited >= 128) {
        truncated = true;
        break;
      }
      const item = queue.shift(),
        object = item.value;
      if (seen.has(object)) continue;
      seen.add(object);
      visited++;
      if (
        data(object, "APP_ID") === wantedId &&
        data(object, "NAME_SPACE") === 4
      ) {
        match = true;
        break;
      }
      if (item.depth < 2)
        for (const childKey of Object.getOwnPropertyNames(object)) {
          if (
            /auth|token|secret|account|identity|password|credential/i.test(
              childKey,
            )
          )
            continue;
          const child = data(object, childKey);
          if (child && typeof child === "object") {
            if (queue.length + visited < 128)
              queue.push({ value: child, depth: item.depth + 1 });
            else truncated = true;
          }
        }
    }
    if (match) matches.push(entry);
    if (truncated) break;
  }
  return { matches, truncated };
}
