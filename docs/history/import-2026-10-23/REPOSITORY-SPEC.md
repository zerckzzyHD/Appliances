# Standalone TV repository specification

Proposed 2026-10-23. Awaiting owner greenlight. This file is a migration proposal,
not a new repository, executed transfer or authorization to operate a TV. No new
repo, remote, branch, config, hosting change or deletion was made for this spec.

## Purpose and identity

Working name: **TV Workbench**. Proposed local home:
`C:/Dev/!TV/TV-Workbench`. Proposed remote repository name: `tv-workbench`.
Names are provisional until owner approval; remote visibility must be explicitly
set PRIVATE and read back when a remote is eventually created. No remote exists
as part of this proposal. Dispatch/owner owns all remote writes and pushes.

The project investigates owner-controlled, customized, ad-free Home on the
owner's Vizio TVs. Modifying stock Home or replacing it are both candidates.
The Mist tile is proof of concept; Mist Console is an optional existing client
integration, not the project's identity or a duplicate backend to build.
Other TV platforms are reference material until specifically selected.

Initial advertising scope is the controlled Home surface, not promised removal
of streaming/live-TV/HDMI ads or all telemetry. Native notifications and playback
measurement are secondary research lanes. Root/default-Home/persistent install
remain unestablished. A working HTML launch is not those capabilities.

## Measured migration inputs

Read-only inventory at Forge HEAD `cfb4e30e8741c1eaaae43f3746410eeccdcd12dc`:

| Input | Observed contents | Disposition after approved verification |
| --- | --- | --- |
| `_Mist-Forge/console-tv` | 186 tracked files:18 root,6 bin,5 src,109 research,48 test; two additional untracked DashCast JSONL logs | Import scoped content, organize, test and then remove entire old component from Forge working tree in a local commit |
| Handoff `codex/mist-console-tv-2026-10-17` | Four tracked files: PROGRESS, route audit, evidence manifest and Codex model-routing intake | Transfer audit/history evidence, reconcile current facts, then remove this TV directory in a local commit |
| Handoff Claude TV material | Untracked BRIEF-TV-PEER-REVIEW.md and TV-PEER-REVIEW-2026-10-21.md observed among unrelated dirty files | Review exact ownership/content and approved inclusion before any transfer/removal; do not sweep unrelated files or assume these are committed |
| `C:/Dev/!Mist/TV-RESEARCH-TRACKER.md` | Stale owner progress pointer, still describes old tile goal/early active probe | Preserve historical bytes; replace with location-only migration pointer or remove under the approved manifest; no parallel progress log |
| RobCo ignored `.dev-companion.local.json` | module points to `C:/Dev/!Mist/_Mist-Forge/console-tv/vite-plugin.mjs` | Coordinate exact module-path change only at runtime cutover, preserving other options; do not copy this local config into new Git |

Forge remote verified `https://github.com/zerckzzyHD/_Mist-Forge.git`;
handoff remote verified `https://github.com/zerckzzyHD/_RobCo-Agent-Handoff.git`.
Their names alone do not establish visibility. No remote visibility query was
performed in this inventory. The public host tracked tree was clean at inspection;
handoff has unrelated dirty Claude/Codex work that must remain untouched.

These counts are an observed source snapshot, not a frozen import manifest.
Recheck HEAD, working trees, hashes and run-log activity immediately before
transfer. Session loss was logged without STOP; no current TV/process state was
queried. Do not stop the old sender merely to make migration easier.

## Repository layout and document authority

Root stays small. Current documents are rewritten for readability and neutral TV
identity. Historical originals remain byte-exact and explicitly non-authoritative.

```text
TV-Workbench/
  README.md                   start here: purpose, measured status, next action
  AGENTS.md                   rules, gates, privacy, advisor workflow, TV hold
  package.json
  package-lock.json
  .gitignore
  src/
    console/                  existing read-only Console client and projection
    hosting/                  Console lifecycle adapter and restricted listeners
    research/                 current browser probes, contracts and parsers
  scripts/
    build/                    reproducible parser/page builders
    launch/                   explicit, fixed-target launch/control tools
    analysis/                 offline analysis; explicit dependencies
  test/                       tests organized to mirror maintained components
  docs/
    spec.md                   product scope, behavior, acceptance ladder
    plan.md                   sole backlog, dependencies, approvals, next batch
    status.md                 current verified facts, ceilings, local validation
    routes.md                 capabilities and evidence links, not a second plan
    operations.md             hosting lifecycle, profiles, cleanup and rollback
    models.md                 Sol executor / Luna worker / Astra advisor workflow
    experiments/              one protocol per current experiment family
    research/                 synthesized firmware/API/reference findings
    history/                  dated original records, superseded/read-only
  evidence/
    results/                  immutable sanitized run reports and observations
    analysis/                 sanitized source-analysis/registry findings
    provenance/               import receipt, hashes, path map and source refs
```

Avoid a pile of root status/handoff/update documents. No new general queue.
`docs/plan.md` owns the TV-only backlog and approval states. `docs/status.md`
summarizes evidence but never becomes another roadmap. `docs/experiments/`
contains exact execution protocols and result links; do not paste result history
into every file. Current docs link relatively and must be portable after clone.

The layout is a target, not permission to rename files blindly. Build an explicit
old-path/new-path/import-consumer map before relocation. Preserve tests and behavior
while updating imports, worker builders, Python sibling paths, PowerShell entry
paths, fixture/report references and hosting adapter exports. Retired standalone
task/capture entry points must stay refused; archive their context and retain any
required refusal shim/tests. Do not resurrect expired one-shot captures.

## Content reconciliation

| Existing material | New authority |
| --- | --- |
| HOME-SPEC | docs/spec.md, clean current wording |
| EXECUTION-PLAN and project-only backlog | docs/plan.md, retain TV-P identifiers and exact holds; old dated narrative archived |
| STATUS, HANDOFF-NOTES, CONTEXT, old PROGRESS and tracker | Reconciled docs/status.md + operations; dated originals under docs/history |
| ROUTES | docs/routes.md, observed versus untested clearly separated |
| Home input plan | docs/experiments/home-input.md, Phase A/B and hosting rollback |
| TV attention design | docs/experiments/attention.md, secondary and unbuilt |
| Firmware/software/entry/reference reports | docs/research grouped by topic; each claim linked to evidence/provenance |
| Home-order persistence notes | Separate research issue, not presumed solved by a replacement Home |
| Route audit, peer review, manifests and sanitized results | evidence plus dated history, cross-linked from current findings |
| Model routing intake | docs/models.md after checking actual configured capabilities; no Codex/Claude config mutation |

Preserve existing evidence labels, run IDs, denominators, owner observations,
limits and consumed approvals. No bulk relabeling tests as device verification.
Do not edit original evidence manifests to make their old hashes appear current;
add a migration path/hash receipt that explains original paths and their new home.

The two JSONL logs require separate handling: take immutable snapshots with
capture time and source hash, distinguish a closed run from a potentially open
sender log, and state that snapshots are not final session cleanup. Exclude live
append targets from the new repo. Do not infer an active TV session from a process
or a historical log line. Old raw photo attachments remain external references;
transfer existing sanitized observations/hashes instead of room photographs.

## Excluded material and repository safeguards

Never import whole Forge/handoff repositories or their private histories. Import
only the reviewed TV scope. Exclude:

- Tokens, PINs, credentials, DPAPI files, keyring/config stores and local secrets.
- Owner-local runtime options, mission/control-plane state, locks and ledgers.
- node_modules, Python environments/caches, generated bundles and temporary files.
- Raw SDK/test-UI captures, live account/config/identity dumps, room photos.
- Firmware/OSS archives, extracted third-party source trees and external toolsets.
- Unrelated Mist, RobCo or Claude documents and publish paths.

Private Git still needs a tracked-file/secret review; PRIVATE is not permission
to commit credentials. Keep host/target setup local, existing encrypted pairing
unchanged, and diagnostics constrained. Historical sanitized topology already in
approved TV reports is evidence, not an invitation to gather new identity data.
No new open-source license is selected and no third-party source is vendored.

## History and clean migration method

1. Re-inventory permitted files and produce SHA-256/size/source-commit receipts.
   Resolve uncommitted TV documents explicitly; leave all unrelated dirty work.
2. Create the standalone local repo only after greenlight. Import the reviewed
   snapshot in a first local commit, preserving original TV relative paths/bytes
   and provenance. Do not bring unrelated Git history or rewrite either old repo.
3. Organize source in a separate local commit. Preserve original bytes through
   the import commit; archive original docs byte-exact, then author concise current
   authorities. Every imported file gets a destination or documented exclusion.
4. Install locked development dependencies without running unreviewed install
   scripts; rebuild ignored generated artifacts. Remove the two memory-analysis
   scripts' hardcoded createRequire dependency on RobCo's package.json by declaring
   reviewed dependencies locally or explicitly classifying them as archival tools.
   Inspect other path dependencies before treating extraction as standalone.
5. Validate the new tree independently; do not use the old folder as a hidden
   source/dependency fallback or leave duplicate editable authorities after cutover.
6. Plan an owner-coordinated hosting cutover. Change only the ignored module path
   after a before/after snapshot and race check; use canonical host lifecycle, not
   a second listener. Verify expected restricted health and disabled research flags.
   This requires a separate greenlight/window because it changes config/restarts
   the Console. Do not launch/wake either TV or stop sender processes implicitly.
7. Once transfer and dependency checks pass, remove the old Forge TV working tree
   and the exact approved handoff TV files in deliberate local commits. Verify
   absolute resolved deletion targets remain inside those approved directories.
   Existing commits retain history; no reset/rebase/filtering/force operations.
   Remove ignored generated/dependency leftovers only from the verified old TV
   folder, after checking no sole-copy assets remain there.
8. Replace old index references with location-only links, or remove their TV entry.
   A migration pointer may contain only destination and source commit, never status,
   current plan or duplicated evidence. No stub console-tv implementation folder
   remains in Forge. The external tracker is archived then pointer-only or removed.
9. Report local commits, receipts, test outcomes and any unverified runtime behavior.
   Owner/Dispatch creates or approves the private remote and uploads; Codex never
   pushes or uses an API/PR merge to move content onto a remote.

## Acceptance before old content removal

- Exact scope manifest accounts for all186 originally tracked Forge TV files,
  four tracked handoff records and individually approved uncommitted TV inputs;
  fresh inventory may revise these observed counts with an explained delta.
- Original evidence/history hashes match their receipts; current relative links
  resolve, and path mappings keep older audit citations retrievable.
- Clean source tree: organized files, locked dependencies, no generated/cache/
  secret/raw-source imports, no duplicate current plan or stray live JSONL target.
- Full maintained Node suite passes (last observed baseline189 tests); existing
  Python DashCast helper suite passes too (last observed18, rerun at migration).
  Compare test identities, not just totals: no weakened/removed privacy or refusal
  tests hidden behind passing numbers. Syntax, formatting and PowerShell parsing
  pass; added path/link/provenance checks pass.
- Local isolated-host tests confirm default-off/main-only diagnostics, peer/Host/
  Origin guards, shared lease ownership/expiry, no credentials in page and no new
  native calls. No TV operation is part of these local gates.
- All current consumers of the old plugin path are identified. Do not remove its
  only reloadable source while a configured host still points there. Live cutover
  validation is explicitly separate from unit tests and from owner display tests.
- Forge and approved handoff TV copies are removed only after verified migration;
  unrelated dirty work is byte-untouched. No duplicate active instructions remain.

## Pickup state that must survive

Current prototype: input-only Conjure document, prepared hosting flag
researchHomeInput default OFF;189 local Node tests passed in the last checkpoint.
No live input diagnostic has run. Physical arrows/OK in the earlier four-tile
demo were owner-confirmed; receipt/focus/activation in the new page remain a
targeted verification gap, not proof remote input has never worked.

Next live phase: owner-present main-TV input test, followed later by one validated
app launch and distinct Back/Home observations. All device operations currently
held; owner no-stop instruction not released. Actual default Home, persistence,
native toast text, playback detection and firmware recovery remain unproved.

Retain LAN/Vite/Tailscale extraction and in-Mist Tailscale configuration requests
as integration requirements with their original owner context, not the identity
of this TV project. Retain scheduled-task AND Startup-folder inventory requirement,
existing read-only Console behavior and Input Lab preservation. No normal queue,
runtime mission state, startup tasks or system settings changed by this migration.

## Decision requested

Astra reviewed the migration constraints read-only. Its key guard is incorporated:
destination tests and evidence accounting must pass, then the approved runtime
module-path cutover must be verified, before old source removal. Snapshot import
preserves provenance but is not a transfer of the old repositories' full Git
history. Untracked Claude material stays untouched until individually resolved.

Approve or revise the proposed name/path, structure, scoped import and eventual
old-copy removal. Greenlight to create the local repo does not by itself approve
remote publication, runtime cutover, TV operations or persistent TV changes. Bring
the reviewed uncommitted-TV file manifest and runtime cutover delta back before
those consequential steps if their ownership/scope is not already explicit.
