import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { selectKnownRoutes } from "../../src/research/conjure-route-filter.mjs";
import {
  CATALOG_FIELDS,
  projectCatalogShape,
  validateCatalogShapeReport,
} from "../../src/research/catalog-shape.mjs";
import { CONJURE_ROUTE_PAGE } from "../../src/research/conjure-route-browser.mjs";
import { validateDiagnosticReport } from "../../src/research/restricted-diagnostics.mjs";
const fixtures = [
  {
    CNAME: "PRIVATE_SENTINEL",
    VALUE: { APP_ID: "1", NAME_SPACE: 4, MESSAGE: "PRIVATE_SENTINEL" },
  },
  {
    CNAME: "PRIVATE_SENTINEL",
    VALUE: { APP_ID: "17", NAME_SPACE: 4, MESSAGE: "PRIVATE_SENTINEL" },
  },
  { VALUE: { APP_ID: "17", NAME_SPACE: 3 } },
];
test("route selector separates known namespace controls without exporting native route values", () => {
  assert.equal(selectKnownRoutes(fixtures, "1").matches.length, 1);
  assert.equal(selectKnownRoutes(fixtures, "17").matches.length, 1);
  assert.equal(selectKnownRoutes(fixtures, "99999999").matches.length, 0);
  assert.equal(selectKnownRoutes(fixtures, "other"), null);
  const shape = projectCatalogShape(
    selectKnownRoutes(fixtures, "17").matches,
    CATALOG_FIELDS,
  );
  assert.doesNotMatch(JSON.stringify(shape), /PRIVATE_SENTINEL/);
  assert.ok(
    validateCatalogShapeReport({
      run: "a".repeat(32),
      target: "vizioapps-conjure-route",
      shape,
    }),
  );
  let got = false;
  const object = {};
  Object.defineProperty(object, "APP_ID", {
    get() {
      got = true;
      throw Error();
    },
  });
  selectKnownRoutes([object], "17");
  assert.equal(got, false);
  const many = Array.from({ length: 200 }, () => ({
    value: { nested: { id: "other" } },
  }));
  assert.equal(selectKnownRoutes(many, "17").truncated, true);
});
test("delivered route experiment reads once, uploads three validated projections, never raw values", async () => {
  let ready,
    script,
    reads = 0,
    resolve;
  const done = new Promise((r) => (resolve = r)),
    shapes = [],
    metadata = [],
    output = {};
  const root = {
    VIZIO_MODULES: {
      System: {
        getConfigProperty(key) {
          reads++;
          assert.equal(key, "VIZIOApps");
          return Promise.resolve(fixtures);
        },
      },
    },
    location: { pathname: "/research/conjure-route-check/" + "a".repeat(32) },
    fetch(path, options) {
      assert.doesNotMatch(options.body, /PRIVATE_SENTINEL/);
      const body = JSON.parse(options.body);
      if (path === "/research/catalog-shape-report") {
        assert.ok(validateCatalogShapeReport(body));
        shapes.push(body);
        if (shapes.length === 3) resolve();
      } else {
        assert.ok(validateDiagnosticReport(body));
        metadata.push(body);
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
    CONJURE_ROUTE_PAGE.match(/<script>([\s\S]*)<\/script>/)[1],
    { window: root, document },
  );
  ready();
  ready();
  script.onload();
  await done;
  await new Promise((r) => setImmediate(r));
  assert.equal(reads, 1);
  assert.deepEqual(
    shapes.map((r) => r.shape.levels[0].children),
    [1, 1, 0],
  );
  assert.equal(metadata.at(-1).state, "resolved");
});
