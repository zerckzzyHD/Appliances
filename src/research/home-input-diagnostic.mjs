import { createHash } from "node:crypto";

// Default-disabled research page: no native method is called.
export function mountHomeInputDiagnostic(root, document) {
  var buttons = ["tile-a", "tile-b", "tile-c"].map(function (id) {
    return document.getElementById(id);
  });
  var index = 0;
  var activations = 0;
  var counts = { left: 0, right: 0, up: 0, down: 0, ok: 0, back: 0, home: 0 };
  function record(category) {
    counts[category] = Math.min(99, counts[category] + 1);
    document.getElementById("last").textContent = category;
    document.getElementById("counts").textContent = Object.keys(counts)
      .map(function (key) {
        return key + ":" + counts[key];
      })
      .join(" | ");
  }
  function focus(next) {
    index = Math.max(0, Math.min(2, next));
    buttons.forEach(function (button, position) {
      button.tabIndex = position === index ? 0 : -1;
    });
    buttons[index].focus();
  }
  buttons.forEach(function (button, position) {
    button.addEventListener("focus", function () {
      index = position;
      document.getElementById("focused").textContent =
        "Control " + (position + 1);
    });
    button.addEventListener("click", function () {
      activations = Math.min(99, activations + 1);
      document.getElementById("activation").textContent =
        "Control " +
        (position + 1) +
        " selected. Activations:" +
        activations +
        ". No app action.";
    });
  });
  root.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    var named = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      Enter: "ok",
      Escape: "back",
      BrowserBack: "back",
      GoBack: "back",
      BrowserHome: "home",
    };
    var legacy = {
      37: "left",
      39: "right",
      38: "up",
      40: "down",
      13: "ok",
      27: "back",
    };
    var category = Object.prototype.hasOwnProperty.call(named, event.key)
      ? named[event.key]
      : undefined;
    // Never reinterpret a printable key based on a conflicting numeric code.
    if (
      !category &&
      (!event.key || event.key === "Unidentified") &&
      Object.prototype.hasOwnProperty.call(legacy, event.keyCode)
    )
      category = legacy[event.keyCode];
    if (!category) return;
    if (category === "back" || category === "home") {
      record(category);
      return; // Observe only if delivered; preserve platform/browser exit behavior.
    }
    event.preventDefault();
    if (category === "ok") {
      record(category);
      if (!event.repeat) buttons[index].click();
      return;
    }
    record(category);
    if (category === "left") focus(index - 1);
    if (category === "right") focus(index + 1);
    // One row: Up/Down are acknowledged without inventing another destination.
  });
  focus(0);
}

const script =
  "(" + mountHomeInputDiagnostic.toString() + ")(window,document);";
const digest = createHash("sha256").update(script).digest("base64");
export const HOME_INPUT_CSP =
  "default-src 'none'; script-src 'sha256-" +
  digest +
  "'; style-src 'unsafe-inline'; connect-src 'none'; img-src 'none'; " +
  "base-uri 'none'; form-action 'none'";
export const HOME_INPUT_PAGE = `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${HOME_INPUT_CSP}">
<title>Mist Home input diagnostic</title><style>
body{background:#081726;color:#edffff;font:30px Arial;margin:50px}
button{font:32px Arial;padding:30px;margin:16px;background:#153949;color:white;border:4px solid transparent}
button:focus{border-color:#ffd287;outline:4px solid white}
</style></head><body><h1>MIST HOME / INPUT ONLY</h1>
<p>Temporary diagnostic. No apps launch. No information leaves this page.</p>
<p>Left/right: focus. OK: select. Up/down: counted. Back/Home: never intercepted.</p>
<button id="tile-a">Control 1</button><button id="tile-b">Control 2</button><button id="tile-c">Control 3</button>
<p>Last delivered category: <span id="last">none</span></p><p id="counts">No input yet</p>
<p>Focused: <span id="focused">none</span></p>
<p id="activation">No selection yet</p><p>Home may leave without delivering any event. This page cannot establish where the TV went.</p>
<script>${script}</script></body></html>`;
