# Operations and change gates

This document describes the existing host boundary and the approvals required
for later work. It does not authorize a TV action, runtime cutover or settings
change.

The 2026-10-26 Appliances path cutover now imports directly from the new
workbench location; the temporary old TV junction is gone. Vite and both
allowlisted LAN health endpoints passed after its removal. See the
[cutover record](migration.md#appliances-runtime-cutover-2026-10-26). This
supersedes the older host-path observations below, while retaining their dates.

The approved module-path cutover was executed and health-checked; its receipt
and cleanup limits are in [migration](migration.md). Owner presence is still
required for the subsequent physical-input experiment.

## Hosting lifecycle

The Console Vite process owns the existing TV listener and closes it with the
Console lifecycle. There is no separate TV service, scheduler, watchdog or
automatic TV launch. Preserve the existing restricted bind, peer/Host/origin
checks, lease ownership, CSP and framing protections. Do not add a proxy, broad
directory server, all-interface bind or fallback listener.

This repository has its own source, lockfile, local build scripts and tests.
That makes offline development self-contained; it does not move ownership of
the running listener or Console lifecycle. The machine-local Console extension
now points at src/hosting/vite-plugin.mjs here. The approved canonical restart
used --no-proxy; LAN health reported all research flags false. Further option
changes/restarts need their own exact scope. Prior source can be recovered from
Git history. The owner removed the old folder, and its absence was checked.
The migration health observations date to2026-10-23; refresh host/LAN/config
checks before a live experiment, especially after the reported dock/config issue.

## Research input page

`researchHomeInput` is a default-off, main-only option. When separately
activated through the existing Console lifecycle, its route uses a fixed
single-use lease and one fixed page fetch, with peer/Host/origin checks. The
page is input-only: it does not call a native SDK, launch apps, persist state,
poll, relaunch or stop the receiver. Lease expiry prevents a later fetch; it
does not navigate away from an already-loaded page. The owner chooses how and
when to exit.

The precise Phase A steps, outputs and stop conditions are in
[the input experiment](experiments/home-input.md). Before any live run, the
owner must be present and approve the exact target, action, output, time window
and exit behavior, including any replacement of a current receiver. The earlier
local-sender exit was already approved and performed without TV STOP; do not
request its release again or treat it as authority for a new TV launch. The prior batch25 approval
was consumed. No approval transfers to another phase or target.

## Current runtime hold and rollback boundary

The approved hosting-path cutover and canonical restart passed health checks;
`researchHomeInput` was false in the2026-10-25 config-file check; running state
was not refreshed. The old sender exited locally without TV STOP.
No live Phase A operation has run. Further credentials, option changes/restarts,
TV requests, launches and cleanup require their own exact authorization; owner
presence remains required for the physical-input test.

For a later approved run, record the private non-secret before-state, change only
the approved option and verify the flag/run state. After the owner ends the run,
restore the approved options and verify admission is disabled. Do not infer TV
restoration from a process exit, log event or source rollback. If reverting this
migration, recover the old source from its recorded Git history before restoring
the original module path and canonically restarting. Do not rewrite history.

LAN/Vite/Tailscale extraction, in-Mist Tailscale configuration, task/Startup
inventory and unrelated Console integration requests remain with their owning
Mist/RobCo work; none is an operation in this TV project.

## Analysis-tool boundary

[Tool selection](plan.md) and [the proposed evaluation](experiments/tool-evaluation.md)
are planning only. This checkpoint does not install LeanREA/REA, execute their
examples, build fixtures or change client configuration. Direct tools retain the
same artifact/privacy limits. A tool reporting read-only metadata is not an
enforced permission boundary. Any future acquisition, runtime processing and
MCP registration need the exact scope described by that protocol.

## Local development checks

From the `TV-Workbench` package directory inside Appliances, the available
package scripts are:

```powershell
npm run check
npm test
npm run test:python
npm run check:repo
npm run format:check
```

`npm test` runs the configured pretest builders before the Node test suite. These
commands are local code checks; they do not call a TV or validate a live Console
configuration. Do not describe inherited test totals as a post-migration run.

Mutable sender logs now belong in ignored `.local/runs/`; committed session-log
snapshots remain immutable evidence, not live append targets. The retired memory
capture analyzers are text under dated history and cannot be used to reactivate
expired source-capture permission. Dependencies build from this repo's lockfile;
there is no require fallback to RobCo's installed packages.
