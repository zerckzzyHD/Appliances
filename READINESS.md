# Historical independent readiness task - superseded

Owner decision 2026-10-17: the TV listener must run only with Mist Console.
CONSOLE-LIFECYCLE.md is the current contract. The record below describes the
earlier separately installed task and its tests; it is retained as history,
not an instruction to activate that task again. The old entry points now refuse
independent startup. Task configuration is retained disabled after transition.

# Quiet readiness after Windows login

The live TV display has been confirmed. On 2026-10-17 the owner explicitly
approved installing this dedicated task and transitioning the known foreground
listener. The task was registered and started; its listener/summary passed the
read-only health check. A coordinated sign-out/sign-in on 2026-10-17 then
produced a newer task run, new task-owned listener and available approved
summary without a manual start. Automatic failure recovery remains untested.
The earlier foreground listener was stopped during the original transition.

## Dedicated task

`MistConsoleTV-Summary` runs `bin/start-ready.ps1` at current-user login using
built-in Windows PowerShell and installed Node. It runs as the interactive user
with limited privileges, no saved password, and a hidden console. Source stays
in this repository; there is no second runtime copy to drift.

It waits up to 120 seconds for the configured LAN address, starts only the TV
summary listener, and has three restart attempts one minute apart on failure.
It can run on battery, has no time limit, and ignores duplicate task starts.
It never launches Conjure, reads a pairing token, restarts Vite, changes
Tailscale/firewall settings, or modifies the existing probe/supervisor tasks.
Unavailable Console data stays UNAVAILABLE; paused/stale sources stay stale.
Changed DHCP addresses fail closed rather than binding all interfaces.

This requires an explicit exception to the owner's standing rule against
scheduled-task changes. Preparation and plan output do not grant that exception.

## Review without changing configuration

From this directory, in Windows PowerShell or PowerShell 7:

```powershell
.\bin\install-readiness.ps1 -AllyIP 192.168.4.26 -TVIP 192.168.4.20
.\bin\check-ready.ps1 -AllyIP 192.168.4.26
```

The installer defaults to PLAN_ONLY. It refuses public addresses, reserved
ports and missing runtimes. Applying refuses any pre-existing task of that name
or occupied port; it never overwrites, stops, or adopts somebody else's work.

## Activation, only after owner approval

Coordinate stopping only the already-identified foreground listener. Confirm
the port is free, then run the same installer with `-Apply`. It registers only
the dedicated task and requests its start. Run the readiness check and inspect
task state/last result. API registration alone does not establish availability.
If activation fails, keep the error visible and explicitly restart the known
foreground listener if needed; do not change other tasks to work around it.

An actual Windows relogon test requires coordination. Do not log off or reboot
the owner automatically. A new task start proves task-hosted operation, not
survival across a later logon, DHCP change, or Windows update.

## Rollback, only with owner approval

Stop and unregister only `MistConsoleTV-Summary`, then use the documented manual
foreground command if desired. Never remove the original probe task, token or
site, and never touch the paused supervisor. No rollback command is run merely
because this document exists.

## Child-process lifetime

A controlled stop initially showed that terminating the PowerShell task host
could leave Node alive. start-ready.ps1 now loads process-job.ps1 before starting
Node. A non-inheritable Windows job handle places the host and future children
under kill-on-close lifetime management. Host termination closes that handle,
so Node cannot remain as an orphan that occupies the port on the next start.
Initialization failure stops before the listener is launched.

A synthetic Windows process test killed a test host and observed its sleeping
child exit. An actual dedicated-task stop then closed its Node child and freed
4176; starting the task restored health and the summary. Automatic retry after
an unexpected crash remains separate from this controlled stop/start result.
Reference: https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects
