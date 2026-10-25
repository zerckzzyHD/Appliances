# Current status

Planning checkpoint: 2026-10-25. Device and migration observations below retain
their original dates; no fresh device or running-host health claim is implied. This page owns the concise current state; see
[the plan](plan.md) for priorities and [routes](routes.md) for evidence claims.

## Private repository publication: 2026-10-25

The owner explicitly authorized creating and uploading this repository. GitHub
reported [zerckzzyHD/tv-workbench](https://github.com/zerckzzyHD/tv-workbench) as
private; origin now points there. Initial main upload included03afda3 and its
preserved history. Local checks before upload passed:190 Node tests,18 Python
tests, syntax, formatting, provenance/links, whitespace and29 PowerShell parses.
No TV/runtime operations occurred. The final documentation commit is verified
against the remote after upload; these earlier checkpoint paragraphs remain
dated observations, not assertions that no remote exists today.

## Synthesis and restore preflight: 2026-10-25

- [Plan](plan.md) now connects both architecture candidates, gates G0–G5,
  requirement coverage, outcome branches and a finite future lifecycle matrix.
  Astra returned read-only planning advice; this is a strategy proposal recorded
  locally, not TV acceptance or an architecture selection.
- Local Git before-state was clean at9b583ed with no configured remote. The old
  Forge TV folder was absent. Ignored Console config still references this repo
  and none of its four research options was enabled. These are file checks; no
  listener health, dock, LAN reachability or TV state was tested today.
- Global Codex TOML parsed. Advisor/worker definition files still name Astra
  medium and Luna max, but explicit agents.astra_advisor / agents.luna_worker
  registrations and features.multi_agent were absent from the global config.
  Session role dispatch did return Astra advice. That mismatch does not establish
  a broken setup or the cause of corruption; no backup comparison or config
  repair was performed. Future sessions need their available roles checked.
- No TV test, runtime change or build occurred in this synthesis. The next live
  experiment remains G1 after fresh preflight and owner go-ahead. Static G2/G3
  evidence organization need not wait for physical remote testing.
- [Synthesis receipt](../evidence/provenance/plan-synthesis-2026-10-25.json)
  preserves pre-edit source hashes, review scope and the bounded restore check.

## Static contract review: 2026-10-25

- [G2/G3 preparation](experiments/home-actions.md) now links the retained SDK,
  catalog, store, host-launch and Home-routing evidence to exact missing proof.
  Modular App.launchApp takes an object; legacy VIZIO.launchApp is a distinct
  callback interface. No new app destination or object normalization was inferred.
- Generic app/store/set is not an established Home writer. The bounded Home read
  stopped on incomplete first-script analysis; the second script remained unread.
  New reason reporting cannot diagnose the old result retroactively.
- Ran nine targeted synthetic dependency-failure-reason tests: nine passed, zero
  failed/skipped. No SDK, archive code, launch helper or new source capture ran.
  TVs, credentials, host configuration and runtime remained untouched.
- [Review receipt](../evidence/provenance/home-contract-review-2026-10-25.json)
  identifies inputs/hashes and test scope. Next live action remains G1, held for
  owner presence and exact approval. G2/G3 proposals are not live authorizations.

## Earlier verified project state: migration checkpoint2026-10-23

- This local repository was created from the TV snapshot identified in
  [`evidence/provenance/import.json`](../evidence/provenance/import.json); its
  initial import commit is `534557e`, with exact source bytes preserved in the
  forward snapshot commit `2f6ca02`. The initial import inherited Git line-ending
  normalization; no commit was rewritten to conceal that. The receipt and path
  map account for193 inputs (186 Forge files,4 handoff records,1 tracker,2 log
  snapshots). Original archived documents and evidence are hash-checked.
- The code is organized under `src/console/`, `src/hosting/` and
  `src/research/`, with scripts and tests grouped by purpose. This repository
  had no configured remote at that migration checkpoint; publication is recorded
  above.
- An input-only Conjure page is prepared in
  [`src/research/home-input-diagnostic.mjs`](../src/research/home-input-diagnostic.mjs).
  Existing hosting integration in
  [`src/hosting/vite-plugin.mjs`](../src/hosting/vite-plugin.mjs) and
  [`src/research/isolated-server.mjs`](../src/research/isolated-server.mjs)
  exposes it only behind `researchHomeInput: false` by default. It has no app
  action, persistence, polling, relaunch or automatic stop behavior.
- The approved machine-local module-only change points Console at this repository.
  Canonical stop/start with --no-proxy succeeded. Vite returned HTTP 200; LAN
  summary and main research health returned HTTP 200. All four research flags
  were false at that migration checkpoint; running health was not refreshed
  for the2026-10-25 synthesis. Loopback research refused connection, consistent with its LAN bind.
- Old sender session73923 exited with KeyboardInterrupt (exit1). No TV STOP was
  sent. Its final log snapshot records earlier session loss; TV screen state
  and restoration were not checked.
- No live Phase A input diagnostic has run. No TV query, launch, pairing,
  credential read or TV setting change occurred during cutover. Further TV
  operations remain held pending owner presence and exact live authorization.
- Earlier owner observations establish a full-screen Conjure Console page and
  directional/OK navigation in an earlier four-tile menu. They do not establish
  current-page input reception, an app-launch contract, default-Home ownership
  or persistence; see [routes](routes.md).

## Validation boundary

The four owned Codex TV handoff originals were removed after hash verification
(handoff local commitdaee234). The external tracker is now location-only after
its original bytes matched the imported history. All186 tracked Forge TV files were removed in local commitd3d649d after
cutover and hash checks. The owner deleted the remaining old folder, and a
subsequent local filesystem check independently confirmed its absence. Untracked
Claude TV files were left untouched. [Migration record](migration.md) records the
cleanup evidence and remaining ownership limit.

Final post-reorganization validation ran `npm run check`,
190 Node tests through `npm test`, and 18 Python tests through
`npm run test:python`. These are local source/fixture checks, not TV evidence.
Those source checks did not operate a TV. The later approved runtime cutover
is separately recorded above and in the migration receipt.
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
