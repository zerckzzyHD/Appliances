import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const windows = process.platform === "win32";
const shell = windows
  ? path.join(
      process.env.SystemRoot,
      "System32/WindowsPowerShell/v1.0/powershell.exe",
    )
  : "";
const installer = fileURLToPath(
  new URL("../bin/install-readiness.ps1", import.meta.url),
);
function run(args) {
  return spawnSync(
    shell,
    ["-NoProfile", "-NonInteractive", "-File", installer, ...args],
    { encoding: "utf8", timeout: 15000, windowsHide: true },
  );
}
test(
  "Windows installer defaults to a non-mutating plan, never auto-launching TV",
  { skip: !windows },
  () => {
    const result = run(["-AllyIP", "192.168.4.26", "-TVIP", "192.168.4.20"]);
    assert.equal(result.status, 0, result.stderr);
    const plan = JSON.parse(result.stdout);
    assert.equal(plan.Mode, "PLAN_ONLY");
    assert.equal(plan.TaskName, "MistConsoleTV-Summary");
    assert.equal(plan.ConfigurationChanged, false);
    assert.equal(plan.ExistingTasksChanged, false);
    assert.equal(plan.AutoLaunchTV, false);
    assert.equal(plan.Retired, true);
    assert.equal(plan.ActivationSupported, false);
  },
);
test(
  "Windows plan rejects public addresses and protected service ports",
  { skip: !windows },
  () => {
    for (const args of [
      ["-AllyIP", "8.8.8.8", "-TVIP", "192.168.4.20"],
      ["-AllyIP", "192.168.4.26", "-TVIP", "192.168.4.20", "-Port", "5173"],
      ["-AllyIP", "192.168.4.26", "-TVIP", "192.168.4.20", "-Port", "4174"],
    ]) {
      const result = run(args);
      assert.notEqual(result.status, 0);
      assert.doesNotMatch(result.stdout, /PLAN_ONLY/);
    }
  },
);
