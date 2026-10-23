import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import {
  CATALOG_FIELDS,
  projectCatalogShape,
  validateCatalogShapeReport,
} from "../research/catalog-shape.mjs";
import { CATALOG_SHAPE_PAGE } from "../research/catalog-shape-browser.mjs";
const wrap = (shape) => ({ run: "a".repeat(32), target: "vizioapps", shape });
test("catalog projection never emits values, unknown keys or accessor data", () => {
  const value = {
    PRIVATE_SENTINEL: {
      APP_ID: "PRIVATE_SENTINEL",
      HtmlAppURI: "https://PRIVATE_SENTINEL/",
      order: 11,
    },
    Account: { URL: "PRIVATE_SENTINEL" },
  };
  Object.defineProperty(value, "url", {
    get() {
      throw new Error("Must not read getter");
    },
  });
  const shape = projectCatalogShape(value, CATALOG_FIELDS);
  assert.ok(validateCatalogShapeReport(wrap(shape)));
  assert.doesNotMatch(
    JSON.stringify(shape),
    /PRIVATE_SENTINEL|https|Account|11/,
  );
  assert.equal(shape.levels[0].accessorsSkipped, 1);
  assert.equal(
    shape.levels[1].fields.find((f) => f.field === "APP_ID").types[0],
    "string",
  );
});
test("catalog projection handles cycles and caps depth, objects and properties", () => {
  const value = {
    items: Array.from({ length: 500 }, () => ({
      APP_ID: 17,
      properties: { properties: { APP_ID: 1 } },
    })),
  };
  value.self = value;
  const shape = projectCatalogShape(value, CATALOG_FIELDS);
  assert.equal(shape.truncated, true);
  assert.ok(shape.visited <= 128);
  assert.ok(shape.levels.length <= 3);
  assert.ok(validateCatalogShapeReport(wrap(shape)));
  const huge = Object.fromEntries(
    Array.from({ length: 5000 }, (_, i) => ["unknown" + i, "PRIVATE_SENTINEL"]),
  );
  const bounded = projectCatalogShape(huge, CATALOG_FIELDS);
  assert.equal(bounded.levels[0].children, 4096);
  assert.equal(bounded.truncated, true);
  assert.ok(validateCatalogShapeReport(wrap(bounded)));
  for (const value of [null, undefined, true, 0, "PRIVATE_SENTINEL", [], {}])
    assert.ok(
      validateCatalogShapeReport(
        wrap(projectCatalogShape(value, CATALOG_FIELDS)),
      ),
    );
});
test("catalog validator rejects unknown fields, values, labels and unbounded counts", () => {
  const good = wrap(
    projectCatalogShape({ APP_ID: "PRIVATE_SENTINEL" }, CATALOG_FIELDS),
  );
  assert.equal(
    validateCatalogShapeReport({ ...good, values: "PRIVATE_SENTINEL" }),
    null,
  );
  assert.equal(
    validateCatalogShapeReport({ ...good, target: "account" }),
    null,
  );
  const bad = structuredClone(good);
  bad.shape.levels[0].fields[0].value = "PRIVATE_SENTINEL";
  assert.equal(validateCatalogShapeReport(bad), null);
  const overflow = structuredClone(good);
  overflow.shape.visited = 129;
  assert.equal(validateCatalogShapeReport(overflow), null);
});
test("delivered catalog shape page performs four fixed reads and only uploads validated structures", async () => {
  let ready, script;
  const uploads = [],
    calls = [];
  const output = {};
  let resolve;
  const done = new Promise((r) => (resolve = r));
  const secret = {
    APP_ID: "PRIVATE_SENTINEL",
    HtmlAppURI: "https://PRIVATE_SENTINEL/",
    PRIVATE_SENTINEL: "PRIVATE_SENTINEL",
  };
  const root = {
    VIZIO_MODULES: {
      System: {
        getConfigProperty(key) {
          calls.push(key);
          return Promise.resolve(secret);
        },
      },
      App: {
        getVizioAppInfoByCname(key) {
          calls.push(key);
          return Promise.resolve(secret);
        },
      },
    },
    location: { pathname: "/research/catalog-shape/" + "a".repeat(32) },
    setTimeout,
    clearTimeout,
    fetch(path, options) {
      const report = JSON.parse(options.body);
      assert.doesNotMatch(options.body, /PRIVATE_SENTINEL/);
      if (path === "/research/catalog-shape-report") {
        assert.ok(validateCatalogShapeReport(report));
        uploads.push(report);
        if (uploads.length === 4) resolve();
      }
      return Promise.resolve({ status: 204 });
    },
  };
  const document = {
    getElementById() {
      return output;
    },
    addEventListener(name, fn) {
      ready = fn;
    },
    createElement() {
      return {};
    },
    body: {
      appendChild(s) {
        script = s;
      },
    },
  };
  vm.runInNewContext(
    CATALOG_SHAPE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    { window: root, document },
  );
  ready();
  ready();
  await done;
  assert.deepEqual(calls, [
    "VIZIOApps",
    "VirtualInputs",
    "AppMigration",
    "sctv",
  ]);
  assert.equal(uploads.length, 4);
});
