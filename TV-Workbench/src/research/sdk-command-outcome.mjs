// Observe one returned operation. No argument/payload values leave this function.
export function observeSDKCommand(value, report) {
  function method(object, name) {
    for (let i = 0; i < 4 && object && object !== Object.prototype; i++) {
      const descriptor = Object.getOwnPropertyDescriptor(object, name);
      if (descriptor)
        return Object.prototype.hasOwnProperty.call(descriptor, "value") &&
          typeof descriptor.value === "function"
          ? descriptor.value
          : null;
      object = Object.getPrototypeOf(object);
    }
    return null;
  }
  function failure(error) {
    const texts = [],
      fields = [],
      codes = [];
    function inspect(item, depth) {
      if (typeof item === "string") {
        texts.push(item.slice(0, 4096));
        return;
      }
      if (!item || typeof item !== "object") return;
      for (const key of [
        "message",
        "code",
        "status",
        "error",
        "reason",
        "name",
      ]) {
        const d = Object.getOwnPropertyDescriptor(item, key);
        if (!d) continue;
        if (!Object.prototype.hasOwnProperty.call(d, "value")) {
          fields.push(key + "[accessor not read]");
          continue;
        }
        fields.push(key + "[" + typeof d.value + "]");
        if (typeof d.value === "string") texts.push(d.value.slice(0, 4096));
        if (
          (key === "code" || key === "status") &&
          Number.isInteger(d.value) &&
          d.value >= -32768 &&
          d.value <= 65535
        )
          codes.push(key + "=" + d.value);
        if (key === "error" && depth === 0) inspect(d.value, 1);
      }
    }
    inspect(error, 0);
    const message = texts
      .join(" ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]/g, " ");
    const category =
      /not supported|unsupported|not implemented|unavailable|not available/i.test(
        message,
      )
        ? "unsupported/unavailable"
        : /not authorized|unauthorized|permission|denied/i.test(message)
          ? "authorization/permission"
          : /timeout|timed out/i.test(message)
            ? "timeout"
            : /not initialized|not ready|not connected|disconnected|mojo/i.test(
                  message,
                )
              ? "initialization/connection/mojo"
              : /not found|unknown method|invalid method|invalid param|invalid argument/i.test(
                    message,
                  )
                ? "method/argument unavailable"
                : "other (details withheld)";
    report(
      "Error type: " +
        (error === null ? "null" : typeof error) +
        "; fields: " +
        (fields.join(", ") || "none of the inspected fields") +
        (codes.length ? "; " + codes.join(", ") : ""),
    );
    report("Operation rejected/errored: " + category + ". Raw text withheld.");
  }
  if (!value || (typeof value !== "object" && typeof value !== "function")) {
    report("No asynchronous operation returned; value withheld.");
    return;
  }
  try {
    // Subscribe only when a data-method descriptor actually exists. This can
    // start a cold SDK Observable; it is part of the authorized command test.
    const subscribe = method(value, "subscribe");
    if (subscribe) {
      report("Observable-like result: subscribing once; awaiting outcome.");
      subscribe.call(value, {
        next(item) {
          report(
            "Observable emitted type: " +
              (item === null ? "null" : typeof item) +
              "; value withheld.",
          );
        },
        error: failure,
        complete() {
          report("Observable completed; check actual TV interface.");
        },
      });
      return;
    }
    const then = method(value, "then");
    if (then) {
      report("Promise-like result: awaiting settlement.");
      then.call(
        value,
        (item) =>
          report(
            "Operation resolved type: " +
              (item === null ? "null" : typeof item) +
              "; value withheld.",
          ),
        failure,
      );
      return;
    }
    report(
      "Returned object has no data-method subscribe/then; values withheld.",
    );
  } catch (error) {
    failure(error);
  }
}
