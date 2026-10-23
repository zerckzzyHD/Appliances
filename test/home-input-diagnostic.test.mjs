import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { createHash } from "node:crypto";
import {
  HOME_INPUT_PAGE,
  HOME_INPUT_CSP,
} from "../research/home-input-diagnostic.mjs";

function setup() {
  const nodes = new Map();
  let active;
  for (const id of [
    "tile-a",
    "tile-b",
    "tile-c",
    "last",
    "counts",
    "activation",
    "focused",
  ]) {
    const listeners = {};
    const node = {
      textContent: "",
      tabIndex: 0,
      addEventListener(type, callback) {
        listeners[type] = callback;
      },
      focus() {
        active = id;
        listeners.focus?.();
      },
      click() {
        listeners.click?.();
      },
    };
    nodes.set(id, node);
  }
  let keydown;
  const window = {
    addEventListener(type, callback) {
      assert.equal(type, "keydown");
      keydown = callback;
    },
  };
  const script = HOME_INPUT_PAGE.match(/<script>([\s\S]*)<\/script>/)[1];
  vm.runInNewContext(script, {
    window,
    document: { getElementById: (id) => nodes.get(id) },
  });
  return {
    nodes,
    active: () => active,
    key(key, extras = {}) {
      let prevented = false;
      keydown({
        key,
        preventDefault() {
          prevented = true;
        },
        ...extras,
      });
      return prevented;
    },
  };
}

test("remote row clamps focus, acknowledges vertical input and activates only inert controls", () => {
  const ui = setup();
  assert.equal(ui.active(), "tile-a");
  assert.equal(ui.nodes.get("focused").textContent, "Control 1");
  ui.key("ArrowLeft");
  assert.equal(ui.active(), "tile-a");
  ui.key("ArrowRight");
  ui.key("ArrowRight");
  ui.key("ArrowRight");
  assert.equal(ui.active(), "tile-c");
  ui.key("ArrowDown");
  assert.equal(ui.active(), "tile-c");
  ui.key("Enter");
  assert.match(ui.nodes.get("activation").textContent, /Control 3 selected/);
  ui.key("Enter", { repeat: true });
  assert.match(ui.nodes.get("counts").textContent, /ok:2/);
  assert.match(ui.nodes.get("activation").textContent, /Activations:1/);
  ui.nodes.get("tile-b").click();
  assert.match(ui.nodes.get("activation").textContent, /Activations:2/);
  assert.match(ui.nodes.get("counts").textContent, /ok:2/);
});

test("Back and BrowserHome are observed without preventing default; plain Home is not claimed", () => {
  const ui = setup();
  assert.equal(ui.key("Escape"), false);
  assert.equal(ui.key("BrowserHome"), false);
  assert.match(ui.nodes.get("counts").textContent, /back:1 \| home:1/);
  assert.equal(ui.key("Home"), false);
  assert.equal(ui.nodes.get("last").textContent, "home");
});

test("unknown/printable and modified keys are ignored; legacy unidentified keys work", () => {
  const ui = setup();
  assert.equal(ui.key("private text", { keyCode: 39 }), false);
  assert.equal(ui.key("constructor"), false);
  assert.equal(ui.key("toString"), false);
  assert.equal(ui.key("ArrowRight", { ctrlKey: true }), false);
  assert.equal(ui.active(), "tile-a");
  assert.equal(ui.key("Unidentified", { keyCode: 39 }), true);
  assert.equal(ui.active(), "tile-b");
  for (let i = 0; i < 110; i++) ui.key("ArrowRight");
  assert.match(ui.nodes.get("counts").textContent, /right:99/);
});

test("inline page runs without native/network/storage globals and CSP matches exact script", () => {
  setup();
  const script = HOME_INPUT_PAGE.match(/<script>([\s\S]*)<\/script>/)[1];
  const hash = createHash("sha256").update(script).digest("base64");
  assert.ok(HOME_INPUT_CSP.includes("'sha256-" + hash + "'"));
  assert.match(HOME_INPUT_CSP, /connect-src 'none'/);
  assert.doesNotMatch(
    script,
    /VIZIO|fetch\(|XMLHttpRequest|localStorage|setInterval|location\s*=/,
  );
});
