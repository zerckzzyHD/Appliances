# Operations and change gates

This document describes the existing host boundary and the approvals required
for later work. It does not authorize a TV action, runtime cutover or settings
change.

The exact proposed module-path cutover and rollback are in [migration](migration.md).
It remains unexecuted. No device presence is needed merely to review that delta;
owner presence is required for the subsequent physical-input experiment.

## Hosting lifecycle

The Console Vite process owns the existing TV listener and closes it with the
Console lifecycle. There is no separate TV service, scheduler, watchdog or
automatic TV launch. Preserve the existing restricted bind, peer/Host/origin
checks, lease ownership, CSP and framing protections. Do not add a proxy, broad
directory server, all-interface bind or fallback listener.

This repository has its own source, lockfile, local build scripts and tests.
That makes offline development self-contained; it does not move ownership of
the running listener or Console lifecycle. The machine-local Console extension
has not been pointed at this repository; it still references the previous Forge
checkout. A path cutover and Console restart require a separate, reviewed
approval. Keep the previous source tree until the new path is explicitly enabled
and verified. Local tests cannot prove which source a live Console process has
loaded.

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
owner must be present, release the earlier no-stop hold and approve the exact
target, action, output, time window and exit behavior. The prior batch25 approval
was consumed. No approval transfers to another phase or target.

## Current runtime hold and rollback boundary

At the current checkpoint, `researchHomeInput` has not been enabled, no Console
restart or live health check has been performed for this repository, and no TV
operation has run for Phase A. The owner-presence and prior no-stop constraints
remain unresolved. Do not read credentials, change the ignored local options,
restart Console, send a TV request, launch a receiver or issue cleanup while that
hold remains.

If a later exact approval is given, document the private before-state, change
only the approved local option, use the canonical Console lifecycle, and verify
the flag/run state before the owner-controlled action. After the owner ends the
run, restore the approved option state and verify that research admission is
disabled. Keep secrets out of backups and reports. Do not remove the old source
until the path cutover is reviewed and verified; do not infer receiver cleanup
from a log or a local source rollback.

LAN/Vite/Tailscale extraction, in-Mist Tailscale configuration, task/Startup
inventory and unrelated Console integration requests remain with their owning
Mist/RobCo work; none is an operation in this TV project.

## Local development checks

From the repository root, the available package scripts are:

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
