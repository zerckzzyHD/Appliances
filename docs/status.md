# Current status

Checkpoint: 2026-10-23. This page owns the concise current state; see
[the plan](plan.md) for priorities and [routes](routes.md) for evidence claims.

## Verified project state

- This local repository was created from the TV snapshot identified in
  [`evidence/provenance/import.json`](../evidence/provenance/import.json); its
  initial import commit is `534557e`, with exact source bytes preserved in the
  forward snapshot commit `2f6ca02`. The initial import inherited Git line-ending
  normalization; no commit was rewritten to conceal that. The receipt and path
  map account for193 inputs (186 Forge files,4 handoff records,1 tracker,2 log
  snapshots). Original archived documents and evidence are hash-checked.
- The code is organized under `src/console/`, `src/hosting/` and
  `src/research/`, with scripts and tests grouped by purpose. This repository
  has no configured remote in the current migration scope.
- An input-only Conjure page is prepared in
  [`src/research/home-input-diagnostic.mjs`](../src/research/home-input-diagnostic.mjs).
  Existing hosting integration in
  [`src/hosting/vite-plugin.mjs`](../src/hosting/vite-plugin.mjs) and
  [`src/research/isolated-server.mjs`](../src/research/isolated-server.mjs)
  exposes it only behind `researchHomeInput: false` by default. It has no app
  action, persistence, polling, relaunch or automatic stop behavior.
- The machine-local Console module reference still points to the previous Forge
  checkout. This repository has not been cut over; no local runtime settings
  were changed and no Console restart or live health check was performed as
  part of this migration checkpoint. The previous tree is retained until a
  separate approved cutover.
- No live Phase A input diagnostic has run. No TV query, launch, pairing,
  credential read, setting change, server restart or cleanup was performed for
  this phase. All TV operations remain held pending owner presence and explicit
  release of the earlier no-stop constraint.
- Earlier owner observations establish a full-screen Conjure Console page and
  directional/OK navigation in an earlier four-tile menu. They do not establish
  current-page input reception, an app-launch contract, default-Home ownership
  or persistence; see [routes](routes.md).

## Validation boundary

The four owned Codex TV handoff originals were removed after hash verification
(handoff local commitdaee234). The external tracker is now location-only after
its original bytes matched the imported history. Forge source still awaits
approved runtime-path cutover/sender closure; untracked Claude TV files were left
untouched. [Migration record](migration.md) specifies the exact remaining delta.

Final post-reorganization validation ran `npm run check`,
190 Node tests through `npm test`, and 18 Python tests through
`npm run test:python`. These are local source/fixture checks, not TV evidence.
No TV or runtime operation was part of those checks or this documentation pass.
All passed without failures/skips. Prettier and29 PowerShell file parses passed.
The193-record provenance/import/link check passed. Node190 retains the original
189 tests and adds one semantic-equivalence regression; no original tests removed.

Astra caught an overbroad path rewrite changing an offline analyzer's JWT
delimiter. It was restored; the new test compares the parsed program against the
exact-byte snapshot. Other relocated JavaScript string literals were reviewed
for similar non-path changes. No firmware analysis was executed for that test.

## Still unestablished

Default Home ownership, a persistent tile or replacement launcher, prototype
page-to-app/input launching, durable favorites/order storage, no-promotional-content behavior on
a running customized Home, native arbitrary-text notices, playback detection,
root/privileged access, signed delivery acceptance and a verified firmware
recovery path remain unestablished. The earlier bounded Home read did not
identify these contracts; its coverage limit is recorded in
[routes](routes.md) and the linked result.
