import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

test(
  "terminating the Windows host also terminates its sleeping child",
  { skip: process.platform !== "win32", timeout: 15000 },
  async (t) => {
    const shell = path.join(
      process.env.SystemRoot,
      "System32/WindowsPowerShell/v1.0/powershell.exe",
    );
    const helper = fileURLToPath(
      new URL("../bin/process-job.ps1", import.meta.url),
    ).replaceAll("'", "''");
    const command =
      ". '" +
      helper +
      "'; Enable-TVProcessJob; $child=Start-Process -FilePath (Join-Path $env:ProgramFiles 'nodejs\\node.exe') -ArgumentList '-e','setTimeout(function(){},60000)' -WindowStyle Hidden -PassThru; Write-Output $child.Id; Start-Sleep -Seconds 60";
    const host = spawn(
      shell,
      ["-NoProfile", "-NonInteractive", "-Command", command],
      { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    let childPid,
      output = "",
      errors = "";
    host.stderr.on("data", (chunk) => {
      errors += chunk;
    });
    t.after(() => {
      for (const pid of [host.pid, childPid])
        if (pid) {
          try {
            process.kill(pid);
          } catch {}
        }
    });
    childPid = await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error("No test child reported: " + errors)),
        10000,
      );
      host.stdout.on("data", (chunk) => {
        output += chunk;
        const match = output.match(/^\s*(\d+)\s*$/m);
        if (match) {
          clearTimeout(timer);
          resolve(Number(match[1]));
        }
      });
      host.once("exit", () => {
        if (!childPid) {
          clearTimeout(timer);
          reject(new Error("Host exited before child: " + errors));
        }
      });
    });
    process.kill(childPid, 0);
    const exit = once(host, "exit");
    host.kill();
    await exit;
    for (let i = 0; i < 50; i++) {
      try {
        process.kill(childPid, 0);
      } catch (error) {
        assert.equal(error.code, "ESRCH");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    assert.fail("Test child survived its host");
  },
);
