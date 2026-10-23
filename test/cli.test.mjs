import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
test("historical standalone command cannot start a listener independently of Console", () => {
  const cli = fileURLToPath(new URL("../bin/serve.mjs", import.meta.url));
  const result = spawnSync(
    process.execPath,
    [cli, "--bind", "192.168.4.26", "--tv", "192.168.4.20"],
    { encoding: "utf8", timeout: 3000, windowsHide: true },
  );
  assert.equal(result.status, 2);
  assert.match(result.stderr, /retired/);
  assert.doesNotMatch(result.stdout, /listening/);
});
