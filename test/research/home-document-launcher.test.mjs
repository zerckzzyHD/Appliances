import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const launcher = fileURLToPath(
  new URL("../../scripts/launch/run-target-research.ps1", import.meta.url),
).replaceAll("'", "''");
test(
  "launcher refuses bedroom document work before any I/O; disabled main refuses before credentials/native access",
  { skip: process.platform !== "win32" },
  () => {
    for (const [target, message] of [
      [
        "bedroom",
        "Document research is main-only; no credential or device access.",
      ],
      ["main", "Document group is disabled; no credential or device access."],
    ]) {
      // Both functions are local stubs: no real listener/TV request or token read.
      const source = `
      function Invoke-RestMethod { if('${target}' -eq 'bedroom'){throw 'unexpected_io'}; [pscustomobject]@{edge='running';target='main';document24=$false} }
      function Get-Content { throw 'unexpected_credential_access' }
      try { & '${launcher}' -Target '${target}' -Group homeDocument; exit 2 }
      catch { if($_.Exception.Message -ceq '${message}'){exit 0}; Write-Output 'unexpected_local_guard_result'; exit 3 }
    `;
      const result = spawnSync(
        "pwsh",
        ["-NoProfile", "-NonInteractive", "-Command", source],
        { encoding: "utf8", timeout: 10000, windowsHide: true },
      );
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert.equal(result.stdout, "");
    }
  },
);
