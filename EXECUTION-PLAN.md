# Customized TV Home: execution plan for Sol

Status: active execution plan, revised 2026-10-23. Owner requested planning plus continued
execution. This is the one component-level next-experiment plan; historical
observations remain in TV-ENTRY.md, HOME-LAYOUT.md, FIRMWARE-RESEARCH.md and the
dated research JSON. It is not a canonical queue rewrite or a final handoff.

Current planning checkpoint: 2026-10-23. Owner clarified that a customized Home
with ads removed is the actual goal; the Mist tile was a proof of concept.
Replacement Home is now an acceptable route. HOME-SPEC.md owns product scope and
acceptance; this file owns experiment order and backlog status. Historical native
tile-only exclusions below are superseded, not evidence against replacement Home.
The former top summary described the
older batch25 boundary and was stale; retain dated checkpoints below as history.
The project-only backlog below is the current priority list. It is not part of
the normal Mist/RobCo queue and must not be copied there or sent to another model
without owner direction. This separation does not change evidence or approval
requirements. TV-ATTENTION-DESIGN.md remains plan-only.

## Project-only backlog, revised 2026-10-23

This section owns priority/status; ROUTES.md owns demonstrated capabilities and
the dated checkpoints/results own evidence. Update these entries as evidence
changes rather than creating another editable queue. No normal queue was read or
modified for this checkpoint. The owner authorized keeping this project plan
current; that does not resume live experiments or authorize stopping the sender.

| ID | Status / priority | Next evidence needed | Exit or decision boundary |
| --- | --- | --- | --- |
| TV-P01 | Secondary: native connection notice | Trace the owner-observed bottom Chromecast notice separately from DashCast's Loading bar and pairing success. Identify emitting component and fixed versus configurable text. | Not a prerequisite to customized Home. No arbitrary-text or non-disruptive API established; no pairing churn or unrelated alerts. |
| TV-P02 | Supporting route: usable DashCast page | Explain inline HTML success versus zero admitted LAN responses only if needed for a candidate Home host. Conjure already displays the real Console. | Do not block the main Home investigation on fixing a secondary host. No blanket framing/CORS exception; scripts, SDK and remote input require evidence. |
| TV-P03 | PRIMARY: customized ad-free Home | Execute the discovery batch below: existing renderer input, app launch/return and Home-button ownership. Compare modification of stock Home against replacement Home. | HOME-SPEC.md governs acceptance. A native Mist tile is optional proof of control, no longer the sole target. Full-screen page display alone is not default-Home integration. |
| TV-P04 | Planned: deeper system research | Target existing firmware/source gaps around notification dispatch, Home components, browser identity and model/build compatibility. Corroborate the screenshot's Vizio renderer-execution claim before treating it as actionable. | No exploit was supplied or verified. Renderer execution, sandbox escape, privileged access, persistence and notification control are separate milestones. Inventory model-compatible recovery options before proposing disruptive device work; no firmware write, persistent service or security-setting change is authorized here. |
| TV-P05 | Held: attention feature design | Preserve OFF-by-default App/Console toggle, manual movie mode, optional schedule, critical-only level, batching/rate limits and measured power/playback detection. | Plan only. Full-screen takeover is not a quiet toast; do not auto-launch over viewing or infer TV idle from Cast idle. |
| TV-P06 | Retained integration requirements | LAN/Vite/Tailscale extraction; in-Mist Tailscale connection configuration; scheduled-task AND Startup-folder inventory; existing read-only Console and Input Lab preservation. | Do not mutate canonical queue, runtime/mission state, startup tasks or public publish paths as a side effect of TV research. |

### Current run evidence and hold

Owner confirmed the inline page a second time: bottom Chromecast connection
notice for less than a second, then DashCast/loading for less than a second,
then the page. This is an owner timing estimate, not instrumented timing.
First run 242785f7e23d4106b19d54598697ce97 subsequently logged
session_lost_before_stop (stopSent false), then explicit cleanup with
ownedStopAttempted false and senderDisconnected true. Cause/time of session loss
is unknown. Rerun ebefa7d9f9b5477fb670f9d16d058b74 also now logs
session_lost_before_stop with stopSent false. Its last saved log has no cleanup
event. These local logs were read at this checkpoint; no fresh TV status query,
STOP, process termination, launch or restart was issued. Do not describe the
captured receiver session as still confirmed active. Owner's no-stop instruction
remains in force and live investigation stays held pending owner continuation.

### Supplied screenshots: assessment, not adopted instructions

Owner supplied 6875.jpg, 6877.jpg, 6879.jpg and 6881.jpg in this turn.
No poster names or handles are recorded. External claims were read from the
images, not independently corroborated or followed to a published write-up.

- Samsung posts claim root access, a forthcoming methodology/new OS, and advise
  disabling automatic updates. They provide no demonstrated Vizio path. No TV
  update setting was changed; the screenshot's advice is not owner authorization.
- The Vizio post claims access through an older Chrome vulnerability but says
  crossing seccomp remains unfinished. No CVE, TV model, firmware/build, payload,
  reproduction or notification/Home result is supplied. Add a corroboration and
  compatibility task under TV-P04; do not record root access as demonstrated.
- A reply proposes SSH after root. That is a proposed persistent access method,
  not evidence that an SSH service is necessary or available on these TVs.
  Do not install one based on the screenshot.

Historical 2026-10-22 priority: deeper system research became an explicit lane,
including browser/build and recovery evidence. At that point TV-P01/TV-P02 preceded
disruptive work. No new exploit, flash plan, automatic-update change or live test
is selected by these screenshots. Native notice and persistent tile goals remain
open; demonstrated full-screen HTML is useful but does not satisfy either.

## Current outcome and next execution batch, 2026-10-23

HOME-SPEC.md supersedes the historical acceptance below. No product or runtime
change is implemented by this planning pass. No new TV experiment was run.

1. OFFLINE PREPARATION: inspect existing Conjure launcher, remote-key path,
   sanitized SDK/test-UI registry and source routing evidence. Produce a bounded
   table of host/input/launch/return/Home ownership capabilities with direct
   evidence pointers. Consult the configured Astra advisor at unresolved design
   boundaries; no TV operation or source-scope expansion by the advisor. Do not
   rescan unrelated archives or execute archive code.
2. FIRST LIVE BATCH, PROPOSED (input only; refined after offline Astra review):
   research/home-input-plan.md specifies exact source/limits. Main TV only, one
   fixed temporary Conjure-hosted
   launcher diagnostic, reusing approved listener and credentials. After explicit
   owner release of the previous hold/no-stop constraint, test directional/OK/Back
   reception using fixed key categories (no text capture), then owner-chosen exit.
   App launch is deferred to Phase B after exact payload/destination are established.
   Observe launch, Back behavior and
   Home destination separately. No interception, polling loop or automatic relaunch.
   Stop on unknown app/session, unexpected modal or playback conflict. No automatic
   STOP; owner chooses when to leave. This is not permission to enable a new route,
   restart hosting or export new diagnostics without specifying that exact change.
3. BRANCH: if remote UI and app launch work but Home goes to stock UI, classify
   manual launcher as a partial result and focus on documented/default-Home or
   model-specific integration. Do not compensate with a watchdog fighting Home.
   If app launch/input fails, resolve that minimal contract before styling a shell.
4. DEEPER ACCESS: only where the measured blocker requires it, investigate exact
   browser/build and production component identity using scoped read-only evidence.
   Recovery and reversal must be specified before persistent changes. Separate
   renderer access, privilege, startup ownership and usable Home milestones.

Bring the capability matrix and exact first-live scope to the owner before device
work. A new disruptive/persistent configuration, installation, firmware write or
recovery test requires a concrete separate approval. No normal queue or push.

### Offline preparation checkpoint, 2026-10-23

vizaio-conjure review is appended to research/home-reference-projects.md: same
Conjure route, useful validation/profile/test interfaces, but no measured speed
gain. Directory serving/all-interface bind and broad target overrides are not
adopted. Future consolidation candidate only; current fixed listener, DPAPI and
Phase A hold unchanged. No install, TV call or source reuse; docs-only update.

Additional vizaio/VizioApps review: reference notes now distinguish catalog id
from launch APP_ID, chipset/firmware variants, cached fallback provenance and
client-side catalog injection from TV writes. Phase B must resolve that mapping
before selecting a payload. /state_extended is a new source-backed read-only
attention-measurement candidate, not executed or a proved playback detector.
Vendor public JSON retrieval via web tool failed on content type; no freshness or
endpoint-death inference. Phase A and all device holds unchanged; docs-only pass.

Vizio reference follow-up: research/home-reference-projects.md adds selected
pyvizio/API-doc/JS-client findings and successor pointer. Useful for Phase B
app/input identities and request/response contracts; current Conjure corroborated,
no Home replacement/advertising-control writer identified in inspected material.
No package install, new bridge, TV operation or change to Phase A. Documentation
only; prior189-test result remains the hosting checkpoint, not rerun here.

Latest follow-up: default-off researchHomeInput now connects the fixed input page
to existing isolated-server and Console plugin. No live config/health/restart or
TV access. Main-only nonce lease, exact peer/Host/no-Origin, one GET, expiry and
shared lock; full framing denial and connect-none CSP. Existing page stays loaded
after lease expiry; no automatic STOP/relaunch. All189 Node tests passed,0 failed/
skipped; check, new server syntax and Prettier passed. research/home-input-plan.md
records activation, one-launch limits and exact-config rollback proposal. Pause
before any activation: owner is away and has not approved a live window.
Earlier unwired preparation paragraph below is historical to this same-day step.

Follow-up reference review: research/home-reference-projects.md records selected
Free My TV, CleanMyTV and CleanYourTV source findings. Product handover requirements
in HOME-SPEC.md now explicitly preserve first baseline/current preferences,
confirm fallback before replacement, verify rollback, and review model/build drift.
No Vizio-compatible installation method was established in this bounded review.
Order remains input-only Conjure Phase A, then source-backed app/return Phase B.
No reference commands were run, new hosting enabled or TV operated.

Owner authorized preparation and document alignment, holding tests requiring them
until go-ahead. All TV operations are held, including unattended probes/cleanup.
Prepared unwired research/home-input-diagnostic.mjs, with no native calls, network,
SDK, persistence or app action. Its fake-browser tests separate receipt/focus/
activation and preserve Back/Home defaults. research/home-input-plan.md owns the
source-backed capability matrix and Phase A/B protocol. No hosting integration,
config/restart, credential read, device query or launch was performed. The full
Home UI remains unbuilt. Executed npm test:185 passed,0 failed/skipped; npm run
check, new-module syntax, explicit Prettier checks and git diff --check passed.
Tests use local fake browsers/isolated fixtures, not TV compatibility evidence.
The prior four-tile menu already had owner-confirmed arrows/OK open/return
(STATUS.md earlier hardware evidence). New Phase A isolates current hosted-page
receipt/focus/activation; do not report all remote navigation as untested.

## Historical native-tile outcome and acceptance (superseded 2026-10-23)

The earlier interpretation was a distinct, persistent Mist tile in the genuine Vizio Home app
row, selected manually to open the existing Mist Console TV client. Preserve
other apps and their identities. A replacement Home, modified existing app tile,
recent-session shortcut, injected DOM card, PC/phone launcher, and automatic wake
launch are not that outcome. Record useful partial capabilities honestly.

Acceptance requires separate evidence for:

1. Membership: a distinct Mist entry appears in the actual Home app row.
2. Activation: selecting that entry opens the existing Console TV page; correlate
   a fresh client acknowledgement with that activation, not a lifetime boolean.
3. Persistence: membership survives leaving/reopening Home and an ordinary standby
   cycle. A cold boot and longer delayed-refresh interval remain distinct tests;
   do not claim them from standby. Coordinate disruptive power tests with owner.
4. Independence: the tile remains when the research page is closed and temporary
   research routes are removed. Ally may host the client, but may not continuously
   inject/recreate the tile or auto-launch it to simulate persistence.
5. Reversal: a documented way removes only the added Mist record and restores the
   prior state. Verify existing app membership/order are preserved where observable.

The delayed app-order reset is related research, not a prerequisite for tile work.
Its successful immediate save/standby test is already owner-observed. Do not repeat
that test or ask for the same panel photos. A hours-to-days reset remains unresolved.

## Evidence assessment and the supplied AI screenshots

The screenshots are hypotheses, not architecture specifications. They offer
incompatible levels of certainty: cloud or local database in one, cloud-only in
the other. Neither provides a measured storage path, API, or source for these TVs.

| Question                                    | Current evidence                                            | What is still missing                                             |
| ------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| Can the TV launch our HTML?                 | Paired Conjure launch and owner-visible client on main TV   | No implication of tile registration                               |
| Does Home have customization?               | Owner video and immediate save/standby result               | Storage owner, key/schema, delayed reset cause                    |
| Is there local app routing?                 | Source ChromiumHtmlAppUris mapping; live result type object | Its exact relationship to Home membership                         |
| Is the visible catalog cloud-controlled?    | Plausible hypothesis, not established by our probes         | Actual Home catalog consumer and response schema                  |
| Is order cloud-only, local-only, or merged? | None established                                            | Save call and subsequent load/merge path                          |
| Can web assets be updated separately?       | Source SC-ASSETS installer and signature completion check   | Compatible retail entry/access, accepted custom package, recovery |
| Is an app database a tile database?         | Orchestrator map and registry publication traced            | Home UI consumer and durable registration writer                  |

Keep four contracts separate: catalog membership/metadata, user favorites/order,
namespace/app-ID launch routing, and signed software delivery. A cloud catalog can
coexist with local order; a local routing table can coexist with a cloud catalog.
Do not equate any one of these with all the others.

Primary reference checked 2026-10-18:
https://github.com/socialvibe/truex-ctv-web-reference-app/blob/develop/platforms/Vizio/README.md
describes retail paired REST web launch separately from vendor-enabled development
debugging. It does not document consumer tile registration. Developer portal
https://developer.vizio.com/ exposed only a JavaScript shell to this retrieval;
do not cite it as inspected publishing documentation. The vendor customization
video https://www.youtube.com/watch?v=HXBi6j3DtVQ describes rearrangement, not the
underlying storage authority. No new vendor contact or account submission.

## What this planning pass actually executed

Revision20 searched seven modular SDK names in the known sctv document and at most
four same-origin linked scripts. It omitted legacy store names present in our
already captured test-UI registry. A synthetic document containing those four
legacy methods returned methods=[] before the fix: one regression test failed,
four existing Home-reader tests passed. This is a demonstrated coverage gap, not
proof that real Home uses those methods.

Revision22 adds only getStoreProperty, getStorePropertyAsync, getStoreProperties,
setStoreProperty under the VIZIO reference label. These are lexical references,
not executed calls or proof of the receiver object. Fetch policy, no source export,
one sctv lookup, five-file/2MiB/5-second bounds and no source execution remain.
Old revision20 data is retained; current probe has distinct revision22 identity.

All88 tests passed and npm run check passed. Canonical no-proxy dev restart after
clean public-tree preflight served the new page. One main-TV launch was accepted;
run6c81f362505249bb97477dfa72555ee1 returned SDK loaded/ready=true, resolved,
responseType string, methods[]. Eight metadata GET attempts; no native retry.
Saved research/home-reference-diagnostic-20261018.json contains validated data.
Normal summary relaunch was accepted afterward; actual restored pixels were not
checked. No store/config/installer/firmware write was made.

Result: eleven checked names did not occur in the bounded fetched set. Coverage
of real Home code is still unmeasured. Do not repeat this lexical probe again
unless the target set, coverage, or hypothesis changes.

## Execution order

### 0. Resume from current state, do not rediscover it

- Read git status/remotes and applicable repository instructions. Work on the
  assigned review branches. Commit only owned paths; latest owner rule is no push.
- Forge is the source home. Handoff dock PROGRESS.md is a pointer. Owner explicitly
  permits that pointer despite four other workers' dirty Claude files; leave those
  files untouched. Do not touch control-plane state or publish machinery.
- Main: V435-J01,192.168.4.20, firmware1.720.9.1-1, Home26.10.01.
  Bedroom: D32F-G4,192.168.4.23, firmware4.600.601.0-10, Home25.04.18.
  These are recorded baselines, refresh allowed versions only when needed.
- Both credentials are saved separately with current-user DPAPI. Read only in
  memory. Never reuse main token on bedroom, re-pair unnecessarily, or save PINs.
- Read existing result JSON and source hashes rather than re-reading the8GB
  archive. Current source is a family match, not exact installed binary identity.
- No need to switch models or create another chat to follow this plan. No delegated
  agents are requested. Update this plan's evidence checkpoint after each batch.

### 1. Finish two-TV automation before bedroom SDK experiments

Purpose: every result must identify the intended device and fresh run without
requesting photos or using phone IR for routine work.

Current limitation: probe-bedroom-control.ps1 authenticates successfully, but4176
still admits only main TV and Ally. Do not launch bedroom diagnostics there and
misdiagnose admission failure as missing SDK support.

Implementation tasks:

- Add explicit fixed research profiles mapping target label to IP and DPAPI file.
  No caller-supplied arbitrary IP/token-path combinations; resolve credentials
  from the selected profile immediately before a fixed operation.
- Prefer isolated listener/report state per TV under the existing Console lifecycle.
  Determine a free explicitly configured bedroom port; never wildcard-bind or
  silently fall back. Do not broaden the normal summary listener to the subnet.
- Each channel accepts its TV socket plus Ally reader, exact Host and report Origin;
  reject forwarded identity, unknown fields and cross-profile reports. Bind a
  server-issued run to the target/probe group. An unsolicited run must not become
  an accepted result. Expire completed runs; reject stale/out-of-order duplicates.
- Keep a per-device operation lock: one active native experiment, one launch,
  bounded GET readback, no native retry on timeout. A timeout means unknown outcome.
- A launch acknowledgement must be per-run. Distinguish launch accepted, page
  active, SDK ready, operation settled and owner-visible effect.
- Restore the known summary after main-TV research only if this run still owns the
  session. Do not steal input from someone who navigated away. Bedroom baseline
  screen is not known: do not assume it should be restored to main-TV summary.

Verification: test wrong TV, wrong Host/Origin, forged run, stale run, collision,
expired run, token/profile mismatch, unsupported path and closed Console. Existing
summary tests must still pass. Then one read-only version/ready probe per target,
no simultaneous mutation. Prove reports are independently attributed. Credentials
remain in the launcher, never browser code or report metadata.

Exit: reusable automated read-only comparison without re-pair or photos. If new
host integration would touch an unrelated dirty tree, stop that integration and
report the exact conflicting paths; continue independent source work.

### 2. Establish Home-code coverage before drawing another negative conclusion

Highest information value. Revision22 does not tell us whether the sctv document
is the rendered Home implementation, a bootstrap, a redirecting wrapper, or an old
fallback. Same-origin policy, dynamic chunks and fixed size limits can hide the
relevant code. Do not claim visibility into the live Home window from an isolated
Conjure page, and do not assume a successful fetch runs or observes that page.

First produce a reviewable bounded coverage collector and exact return schema:

- TV-side only: classify the known sctv route and source-defined Home route relation
  as same/different/unavailable without exporting route values. Skip accessors.
- Report document read outcome, MIME category, bytes, script candidates, eligible
  and fetched counts, failures, truncation and budget exhaustion. Distinguish zero
  matches from zero useful files and partial coverage from complete bounded pass.
- Include a harmless same-policy local fixture as a positive control so a broken
  parser/fetch/report path cannot masquerade as a negative Home result.
- HTML parsing must not render/execute source. Any later JS dependency traversal
  must follow only literal static references within a verified scope, with cycle,
  depth, count, byte, origin and time bounds. No arbitrary URL crawler or eval.
- Report only predetermined reference categories and verified SDK method names;
  no raw source, paths/URLs, cookies, IDs, storage values or free-form errors.
  A reference occurrence is not proof of invocation or persistence.

Initial proposed coverage contract (not yet authorized or implemented): reuse
run/probe/sequence/state fields; add only routeRelation=same|different|unavailable,
routeClass=localStatic|external|unsupported, documentOutcome=ok|blocked|httpError|
tooLarge|timeout|unsupported, mimeClass=html|javascript|other|missing,
filesAttempted/filesRead in0..5, bytesRead in0..2097152,
scriptsSeen/scriptsEligible in0..128, truncated and budgetExceeded booleans.
Count script references only until128 and set truncated thereafter. Keep current
five-file,512KiB/file,2MiB total,5-second budget for the first coverage run; raising
it is a later evidence-driven decision. Do not transmit content hashes as a
substitute for forbidden private values. Exact method list remains the eleven
revision22 names. Backend rejects additional fields, enums and out-of-range counts.

Privacy gate: the original channel allows method names/types/fixed errors/version
strings. New coverage counts/categories and new catalog sections exceed the prior
four-target shape exception. Prepare one cohesive schema and bounded batch first,
then obtain the necessary explicit data-scope approval once. General native-command
permission already exists; do not ask again for each read. Do not encode additional
data inside method names/error codes to evade this boundary. Prior one-shot SDK
and test-UI captures are retired, not reusable Home-source capture authorization.

Branch on outcome:

- Real Home static code reached: identify catalog load, save-order and launch
  bindings from source; follow phase3.
- Only bootstrap reached: use its actual discovered dependency/route classification
  to prepare the next bounded read, not guesses. External origin changes require
  an explicit, narrow source scope; no all-origin CSP or proxying credentials.
- Required code inaccessible: record CORS/auth/coverage limit. Browser introspection
  from a different page cannot resolve it. Evaluate an exact static resource capture
  or supported inspection channel, with the existing raw-source rules respected.
- Both TVs differ: compare measured Home/SDK versions and returned categories.
  Model and software differ together; this is not an isolated firmware experiment.

### 3. Trace three specific contracts, each with an evidence chain

For each candidate record resource/component hash, reader, schema, writer, caller,
authorization/context, persistence mechanism, consumer, reset/merge behavior and
rollback. Unknown fields stay unknown. Presence of a setter is insufficient.

**A. Home catalog membership.** Find the code that constructs visible app records.
Does it accept only a supplied catalog, an independently editable favorite list,
locally installed packages, or a merge? Follow the app record into the tile renderer
and its click handler. Determine whether an unknown ID/URL is rejected, filtered,
ignored, or resolved locally. A cloud-only assertion needs this actual consumer.

**B. Saved order/favorites.** Locate the explicit save action already observed in
the owner's video. Trace its load and reconcile paths. A local store can contain
only IDs that must match a remote catalog; then editing order alone cannot add Mist.
Do not guess common SQLite paths or dump all TV/browser storage. Read only a
source-identified key/schema after the data boundary is settled.

**C. Launch routing.** Follow the selected tile's record into namespace/app-ID/URL
resolution. We already have a working Conjure launch, so repeat it only to test a
new linkage hypothesis. getAppInfo(undefined) from both supposed positive and
absent controls is uninformative; do not enumerate more IDs using that method.

Exit: at least one complete consumer-to-writer chain, or a precise missing link
that dictates the next single experiment. A generic SDK function list is not exit.

### 4. First reversible registration experiment, only after phase3

Use bedroom first only if its actual implementation supports the identified
contract. Main5691 source is not sufficient to establish bedroom compatibility.

Before a write: exact operation/payload shape, expected narrow state change,
readback, timeout behavior and tested rollback must be reviewable. Owner's broad
testing permission covers routine work, but no unreviewed persistent config,
installer/security change or firmware write is implied under the latest rules.
Ask only for the concrete consequential change when its prerequisites are ready.

Use a new owner-specific record if the contract supports it. Never repurpose an
existing app ID or silently replace vendor Home. Preserve the exact prior scoped
record in an approved local protected form if necessary; no bulk private-state
backup. If safe rollback cannot be stated, do not write to learn the schema.

One write, one readback, one activation. Reject misleading outcomes: transient
page/card, launcher response alone, current session's in-memory app, or an item
that vanishes on normal Home refresh. Perform acceptance stages incrementally.
Visible tile membership may ultimately need one owner confirmation; network
success cannot prove pixels. Batch that confirmation instead of repeated photos.

### 5. Software/firmware lane: conditional, evidence-driven

Do not keep inventorying unrelated toolchain files. Current archive contains useful
source, but no discovered Home membership writer or demonstrated retail sideload
contract. Head responses matching nonexistent paths are not installer evidence.

Advance only when a named component/binary/package is tied to a missing link:

- Establish exact model/version provenance and component format. Source-family
  similarity is insufficient for an install or compatibility decision.
- Prefer offline static inspection of an acquired relevant component. Verify tool
  support for the actual format and host. REA's checked native Windows lane did
  not support these ELF inputs; naming REA does not resolve that limitation.
- Separate decrypt/read capability from modify/repack, signature acceptance,
  privilege to install, boot-chain acceptance, and recovery. Each needs evidence.
- SC-ASSETS signature validation is an observed source gate, not a proof that all
  conceivable software entry points are closed. Conversely, knowing encryption
  inputs or parsing a manifest supplies no signing authority.
- No forged vendor transaction, security disabling, exploit upload, downgrade or
  flash merely to test an unsupported theory. The old L9 advisory is hardware/
  release-specific; identify applicability and recovery before proposing action.
- Before any firmware action: compatible stock image, independent integrity/
  provenance where available, accepted update path, power constraints and a viable
  software-only recovery path. Bedroom risk tolerance is not recovery evidence.

If this lane lacks a specific artifact/access/recovery hypothesis, park it and
continue the Home consumer investigation. Record the missing prerequisite rather
than declaring the tile universally impossible.

### 6. Diagnose order resets with the same discovered consumer

Once phase3 identifies the actual persistence layer, use the smallest approved
before/after observation: order changed vs membership changed, relevant version/
generation changed, save/load state and timestamps. No exported app history or
account data is needed for an initial category comparison.

No repeat reorder/power loop: the observed failure interval is hours to days.
If long-running monitoring becomes useful, prepare an opt-in bounded observer
under Console lifecycle with expiry; no background restore loop or unrequested
scheduled task. Correlation with a software/catalog change is a lead, not cause.
Internet disconnection or DNS interception would change the system and introduce
confounders; neither is the first experiment or evidence of cloud-only storage.

## Batch discipline, stop conditions and final delivery

Each batch starts with one question and competing outcomes, runs one controlled
experiment, records target/version/run/coverage, and ends with the next decision.
Stop a branch after an uninformative control or unchanged negative result; change
the hypothesis or observation method before trying again. Do not invoke unsafe
Run All/Run Page from the API test UI. Do not equate method arity with call schema.

Local checks: npm run check, npm test, formatting for changed JS/JSON, PowerShell
parse for changed scripts and git diff --check. Privacy/peer/run isolation changes
need adversarial tests, not just happy paths. Separate synthetic from real-TV
results. Commit exact paths locally, never push. Update HANDOFF-NOTES and the dock
pointer with actual results, without copying raw archives/source/private data.

At research end, retire temporary routes/CSP exceptions and in-memory captures;
verify they are unavailable and normal Console/TV readiness still operates.
Preserve disabled historical task and existing startup ownership. Final Claude
handoff must retain LAN within Vite/Tailscale extraction, configuring the Tailscale
connection from Mist as the owner's queue addition, and scheduled-task plus
Startup-folder inventory. No canonical queue IDs invented or duplicate CM9/MI34.

Immediate next executable batch: implement/test isolated bedroom research profile
and fresh-run admission; concurrently prepare (not transmit) the phase2 coverage
schema and fixtures. This resolves automation and observability before another
catalog/firmware guess. Do not ask owner to reconfirm already granted command or
encrypted pairing permission.

## Execution checkpoint: phases1/2, pause for Astra, 2026-10-18

Owner assigned Sol execution only and requested a stop when further planning is
needed. Phase1 isolated channels implemented under the same Console process:
main4178 and bedroom4177, with fixed profiles and separate DPAPI files. Lease
admission, exact socket/Host/Origin, group/probe binding, one page delivery,
sequence checks,60-second expiry/release and unsupported-route rejection tested.
These guarantees cover the new isolated channels, not every historical4176 route.
Live version calls: mainprod64.37; bedroomprod59.78. No fresh pairing/photos.

Owner subsequently suspended all bedroom testing because the room is occupied.
Local Console researchTargets now contains only main;4177 is not listening.
No bedroom command sent after that instruction. Re-enabling bedroom requires
owner resume. Same process is intentional; separate ports isolate research state
and admission. The normal4176 summary listener stays main-only.

Owner accepted the bounded coverage extension with bedroom deferred. Revision23
coverage schema/collector deployed on main only, within five files,512KiB/file,
2MiB total and5-second static-read budget. Unknown route comparison remains
unavailable; no semantically valid second Home document route was established.
No raw source/URLs/IDs/storage/config values exported. All103 tests passed,
npm check passed. Fixture coverage includes policy refusal, source non-execution,
empty/bootstrap document, file/byte/time limits, readiness race and strict schema.

Live main run0f1c320e874438e65a2a7970a450d2f2: loaded/ready=true, resolved,
localStatic, documentOutcome ok, MIME html;1 attempted/read file,1092 bytes;
scriptsSeen0,scriptsEligible0,truncated=false,budgetExceeded=false,methods[].
Saved research/results/isolated-main-0f1c320e874438e65a2a7970a450d2f2.json.
Script counts cover the collector's quoted-src regex only, not all possible
HTML/JS dependency/navigation forms. This does not establish absence of scripts,
actual live Home coverage, cloud-only catalog, or a usable registration writer.
The main summary relaunch was requested after native current-app MESSAGE matched
this run's page URL; actual restored pixels not independently checked.

STOP FOR ASTRA: interpret the1092-byte response and plan how to distinguish
bootstrap/navigation/fallback/error content from the relevant Home implementation
within the approved privacy boundaries. The current collector deliberately does
not return those content classifications, inspect inline navigation or execute
fetched source. Do not repeat the same negative lexical scan or invent dependency
URLs. No further TV experiment is selected by Sol at this checkpoint. Native tile
and delayed order-reset cause remain unresolved; no persistent TV write performed.

Final local verification after the port-collision case was added:104 tests passed,
0 failed; npm check, JS/JSON/plan formatting and PowerShell parse passed. Occupied
research port fails closed without fallback or stopping its owner. Main completed
run readback now404 after release; normal summary health reports running. No
additional TV call was needed for these listener checks.

## Astra batch24: identify the document before tracing Home

Planning checkpoint, 2026-10-18. Source reviewed: home-coverage-browser.mjs,
home-coverage-contract.mjs, isolated-server.mjs, run-target-research.ps1, their
coverage/contract tests, and the saved revision23 result. Forge baseline b6da14c;
dock baseline 4637bc4. This section is the next execution batch, not a claim that
its implementation or live experiment has run. No new firmware lane is selected.

### Decision and evidence

First determine what syntax the 1,092-byte document contains and whether the local
server returns identical bytes for a deliberately missing sibling. Then, only
when the parsed document provides one unambiguous permitted literal candidate,
read that candidate once. This tests response identity and one dependency edge.
It does not identify the active Home runtime, execute a redirect, or prove a
catalog writer. Do not run another eleven-name-only scan as the experiment.

Four synthetic controls were executed against the unchanged revision23 collector
in this planning pass; all requests were in-memory mocks, with no TV/network I/O:

| Fixture                                             | Files read | Script references counted | Interpretation           |
| --------------------------------------------------- | ---------: | ------------------------: | ------------------------ |
| Quoted external script attribute                    |          2 |                         1 | Existing positive case   |
| Unquoted external script attribute                  |          1 |                         0 | Missed dependency syntax |
| Inline location.replace with a literal local target |          1 |                         0 | Navigation unobserved    |
| Quoted script tag inside an HTML comment            |          2 |                         1 | False dependency fetched |

These are parser-control results, not statements about the real 1,092 bytes.
The current tests do not cover the latter three distinctions. Existing full-suite
104-pass evidence is historical; the planning pass has not changed runtime code.

### A. Prepare locally before requesting the data extension

1. Keep the existing coverage implementation/results intact. Add a distinct
   isolated group homeDocument, probe sdk-home-document-24, page
   /research/home-document/<run>, and POST /research/document-report. No legacy
   4176 route, generic fetch endpoint or caller-supplied URL. Main only: reject
   homeDocument for the bedroom profile at both launcher and admission layers,
   before credential access or native I/O. Keep bedroom opt-in disabled.
2. Use a non-rendering HTML parser and a JavaScript syntax parser. Do not replace
   the regex with another regex crawler, DOM insertion, iframe, eval, Function,
   VM execution or dynamic import of inspected code. Parse5 and Acorn are local
   candidates, not newly approved dependencies or proof of TV compatibility.
   Pin any selected dependencies and reproducible browser build in Forge only;
   do not depend at runtime on another repository's node_modules or change public
   host dependencies. Keep licenses and installation/build scripts reviewable.
   Verify the delivered bundle in the actual synthetic-page harness before live use.
3. Parse tags/attributes, comments, script raw text, HTML entities and the first
   effective base URL correctly. Ignore script-looking text inside comments,
   ordinary text, script strings and inert template content for dependency reads.
   Classify data scripts separately. Parse inline executable JavaScript as syntax
   only; use classic/module grammar as indicated. Do not fold expressions, invoke
   helpers, decode arbitrary packed code or resolve config/storage-derived values.
4. Recognize only these navigation forms: meta refresh with a literal URL;
   direct top-level assignment to location or location.href, including window
   and document prefixes; direct top-level location.assign/replace with exactly
   one string literal. Record conditional/function-contained/computed forms as
   observations, but they cannot select a continuation. Bare identifiers may be
   shadowed: a syntax match is a candidate, never proof of browser execution.
   Detect frame/iframe sources and script src attributes as structural evidence.
   No arbitrary identifier, literal, title, text, argument or source snippet export.
5. Implement the fixed return contract below first. Reject unknown fields at every
   nesting level, invalid enum/count combinations, extra methods and private-value
   sentinels. Preserve lease, exact peer/Host/Origin, one delivery, monotonic
   sequence, expiry and release. Do not put withheld data into error categories.
6. Commit preparation locally, update this checkpoint, and present the tested
   schema plus exact live-read policy once for owner approval. No launch, restart
   to deploy the new group, or scope expansion while that approval is pending.
   Existing command/testing and encrypted credential permissions need no renewal.

### B. Fixed main-only read policy

One admitted run, one native launch, one sctv getter after SDK readiness. Obtain
only its own-data MESSAGE field as before. Keep existing URL policy: http,
localhost or 127.0.0.1, port12345, /scfs/, no userinfo/query/fragment or sensitive
config/token/account/identity/credential path. Never rewrite an external URL to
localhost or strip a denied query to manufacture an allowed resource.

The entire static-read phase has one five-second deadline. Native getter wait is
separately capped at five seconds; discard late settlements without starting reads.
At most three fetches, no redirects, credentials, retries, storage reads or writes:

1. Root document: at most16KiB, require successful HTML response before parsing.
   A larger/changing document is a new evidence condition; stop, do not silently
   raise the cap. Count actual accepted bytes and flag any incomplete read.
2. Negative comparison: at most16KiB from one sibling in the root directory named
   mist-absent-<server-run>.html. Construct on TV, apply the identical URL policy,
   and do not export it. This is a deliberately improbable path, not proven absent
   storage. Compare complete response bytes in TV memory only. Read a bounded
   non-2xx body for this comparison; never return it. Equal bodies suggest shared
   serving/fallback behavior, not necessarily an error. Different/404 bodies do
   not establish that the root is Home. No hashes or normalized content export.
3. Optional single continuation: at most512KiB, only if controls pass, root parses
   completely, comparison is available and different, and no ambiguity/truncation
   exists. First preference is exactly one distinct permitted literal navigation
   target, deduplicated across recognized top-level/meta forms. If navigation of
   any other form or frame evidence exists, stop instead of selecting a script.
   With no navigation/frame evidence, exactly one distinct executable script-src
   candidate may be selected. It must have the same exact origin as the root,
   satisfy policy after base resolution, and differ from root and negative path.
   Multiple candidates, computed targets, external destinations, rejected base,
   malformed URL or self-loop mean no continuation. Do not fetch "first match".

The combined body cap is557056 bytes. The continuation is inspected but never
followed again: no recursive imports, chunks, frames, preload/modulepreload or
subsequent navigation. HTML continuation gets the same structural classifier;
JavaScript gets syntax parsing and the existing eleven lexical reference checks.
Other/missing MIME is reported and not interpreted as executable code. Bounds:
32 candidates,32 script elements,8 inline executable scripts,64KiB total inline
syntax input,8192 visited syntax/tree nodes, depth64. Exceeding any bound sets
truncated and prevents continuation; no inference from an incomplete parse.
Parser work must have a tested interruptible deadline or a documented separate
hard time limit; an AbortController fetch deadline alone does not bound parsing.
Sol may use an isolated parser worker with a fixed, locally built parser bundle;
no network APIs in parser execution, arbitrary messages or source-return channel.
If that requires new CSP, allow only its exact self resource, never external origins.

### C. Proposed exact return contract (not yet authorized)

Maximum JSON body8KiB. All objects exact-key, no user-defined property names.
Server envelope retains target=main, run and receivedAt. Report fields:

- probe=sdk-home-document-24; run, sequence, loaded, ready as existing admission;
  state=resolved|unavailable; control=passed|failed; truncated and budgetExceeded
  booleans; methods limited to the existing eleven scope/name/type triples.
- root and continuation: fixed objects with outcome=notAttempted|ok|blocked|
  httpError|tooLarge|timeout|unsupported, mime=html|javascript|other|missing,
  bytes integer0..16384 for root or0..524288 for continuation,
  parse=notAttempted|parsed|partial|failed|limit, and the shape below.
- shape: scripts, inlineScripts, dataScripts, srcScripts, unquotedSrcScripts,
  frames, bases, metaRefresh each integer0..32; jsParse=notAttempted|parsed|
  partial|failed|limit; navigation=none|literalOnly|computedOnly|mixed|unknown;
  literalTargetClass=none|sameOriginAllowed|external|denied|multiple|unknown;
  navigationContext=none|topLevelOnly|nestedOnly|mixed|unknown. Counts saturate
  with truncated=true, never wrap. A syntax error gives unknown, not none.
- negative: outcome using the same enum, bytes0..16384,
  comparison=equal|different|unavailable. Only complete root/negative reads permit
  equal/different; HTTP error bodies are eligible solely for this comparison.
- continuationReason=none|literalNavigation|singleScript;
  stopReason=controlFailed|rootUnavailable|parseIncomplete|sameResponse|
  comparisonUnavailable|noCandidate|ambiguous|external|policyDenied|selfLoop|
  budget|continuationInspected|continuationUnavailable. Selection uses the
  conservative policy above; document a deterministic reason priority in tests.
- filesAttempted integer0..3; bytesRead integer0..557056 equals the three byte
  counters; candidate counts stay on TV except the fixed structural counters.
  No URLs, paths, origins, app names/IDs, titles, header values, text, source,
  syntax trees, hashes, cookies, configuration/storage values or free-form errors.

For no-attempt nodes use zero counts/bytes, missing MIME, notAttempted parse and
JS parse, none navigation/target/context. Failed/partial parse uses unknown
navigation as appropriate. Resolved means the root read completed, not Home
identity. Validate cross-field consistency and the reason for each skipped read.
Only this new contract may enter document-report; legacy contracts remain closed.

Suggested single approval request, after preparation and tests: "Approve one
main-TV document-identity batch: classify the existing sctv HTML, compare one
generated missing sibling, and optionally inspect one unambiguous same-origin
literal dependency? At most three reads/544KiB, five-second read budget; source
stays on TV. Only the fixed counts, syntax categories and equality result in
EXECUTION-PLAN.md batch24 return to Ally. No bedroom operation, raw capture,
external fetch or TV state write." This is new return-data/read scope, not a
request to repeat command or token-storage authorization.

### D. Controls and gates before the single live run

- Regression fixtures: the four measured cases above; strings containing fake
  script tags; attribute-order/case/entities/quotes; first base and denied base;
  non-executable data script; inert template; frame; direct versus nested or
  conditional navigation; computed concatenation; mixed targets; self-loop;
  malformed syntax; root and negative identical bytes with different statuses;
  different bodies of equal length; overflow, timeout and late getter settlement.
- Positive continuation fixtures: one literal local navigation and one sole
  unquoted script candidate. Verify exactly three mocked fetches, no child-of-child
  fetch, no source execution, no credential/referrer, no raw source in report/log.
  Negative/path-denial/error cases must exercise all stop reasons. Private sentinel
  values in every source position must never occur in serialized reports.
- Embed small owner-authored positive and negative parser fixtures in the TV page.
  Run the same parser/bundle before the SDK getter. Fixed expected counts and
  candidate categories must match; failure means controlFailed, no native getter
  or source fetch. These validate parser delivery on TV, not cross-origin fetch
  behavior. The root/negative reads provide separate server-response evidence.
- Add actual delivered-page tests, admission tests for homeDocument/main-only,
  cross-group and forged reports, release/expiry, parser limits/termination,
  and refusal of unknown nested keys. New code needs node --check explicitly:
  the existing npm check script names only the six core files, not research files.
- Run npm run check, npm test, research-file syntax checks, formatter, changed
  PowerShell parsing and git diff --check. Record actual commands/results; never
  carry forward104 as the expected new count. Review only owned staged paths.

After approval: verify clean tracked public host state, use only canonical Console
restart if deployment needs it, retain main-only local options, run one main group,
save only the validated bounded result. Poll at most the existing15 seconds, no
native retry. Release even on failure. Restore summary only after ownership match;
preserve any user navigation and report timeout as unknown outcome. Check release
from Ally without another TV operation. Keep bedroom listener disabled.

### E. Branches and handback to Astra

| Observation                                                          | Meaning and next action                                                                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Parser control fails / cap / timeout / parse failure                 | Measurement failed or partial; repair locally from fixtures. No automatic second TV run.                                     |
| Root equals negative body                                            | Shared response lead, not identified Home. Stop source traversal; Astra selects a source-backed route/context discriminator. |
| Unique permitted literal navigation or sole script                   | Inspect one continuation in this run; retain relation as static candidate, not observed runtime transition.                  |
| External, computed, nested-only, frame, ambiguous or rejected target | No follow. Return exact categories to Astra for a concrete next resource/context plan. No broad CSP/CORS/URL exception.      |
| Continuation contains known store/config/launch reference            | A lexical lead only. Astra must define a scoped consumer-to-writer trace before any store read/write.                        |
| No recognized forms / continuation still a wrapper                   | Current observation language reached its limit. Do not declare cloud-only or absent registration; stop for Astra.            |

This batch ends after one live report (or its failed/unknown outcome). Sol updates
this plan and the existing dock pointer with fixture evidence, target/run, coverage,
omitted forms and the exact missing link. Do not launch phase3 automatically.
If static shape remains insufficient, Astra should prepare one precisely scoped
memory-only capture of the identified resource, with an offline parser and no
raw logs/files, instead of inventing repeated tiny classification extensions.
Earlier SDK/test-UI capture grants do not cover that future resource.

No Home catalog membership, order/favorite persistence, launch routing or signed
software delivery contract is collapsed into another. No firmware/package write,
reset, security change, vendor contact or scheduled observer in this batch. Keep
LAN within Vite/Tailscale extraction, owner-requested in-Mist Tailscale connection
configuration and scheduled-task plus Startup-folder inventory in the eventual
Claude handoff. Final handoff stays deferred. Local commits only; never push.

Planning-pass checks after writing this batch: npm run check passed; npm test
ran104 tests,104 passed,0 failed. The four additional mocked parser controls above
were exploratory checks, not added tests or a claimed batch24 implementation.
New document sections passed the local Markdown formatter; staged whitespace and
owned-path checks are required before committing. No live-TV behavior was retested.

## Batch24 preparation checkpoint: awaiting the single live scope approval

Sol prepared the implementation locally on2026-10-18. This supersedes "not yet
implemented" language in the preserved plan above, not its live-data approval gate.
No TV request, credential read, Console restart or owner-local option edit in this
batch. Bedroom remains suspended; all new target guard tests used local stubs.

Prepared source is research/home-document-{policy,parser,worker,contract,browser,
entry,prepared}.mjs plus build-document-parser.mjs. Integration adds homeDocument
only to the isolated server and launcher. New researchDocument24 opt-in defaults
false; bedroom admission refuses it even if requested. Launcher tests show a
bedroom request stops before I/O, and a disabled main group stops before credentials
or native access. Existing listener and summary profiles are preserved.

Selected development dependencies: parse5 7.3.0, Acorn8.17.0, esbuild0.25.12,
exact versions with package-lock integrity. Installed with --ignore-scripts.
Generated worker/page and third-party licenses stay in ignored research/generated/;
no copied dependency on public Console node_modules at runtime. npm test runs the
owned build first. Disabled normal hosting does not read generated files.
The prepared worker bundle is305780 bytes; two successive private worker/page
builds matched byte-for-byte. Sizes identify this build, not future invariants.

The fixed report in home-document-contract.mjs enforces the batch24 field set,
closed nested objects, enums, counters, byte sums, stopped/continued relationships
and eleven method references. No raw text, URL/path, source, hashes, IDs or storage
values are emitted. Worker-to-renderer candidates stay on TV. Exact HTTP report
cap8KiB. Worker delivery is a separate single-use TV-only resource bound to the
same served page/lease; its CSP denies network, imports/eval and further workers.
Page CSP permits self workers without opening external script destinations.

Body ceilings remain16KiB root +16KiB negative +512KiB one continuation =544KiB.
Five seconds cover source reads/classification; each parser request has a separate
maximum one-second worker termination deadline, also shortened to remaining time.
Native sctv getter has a five-second settlement ceiling; late settlement starts
no reads. SDK startup expires after12 seconds; later readiness starts no getter.
Embedded controls run before that getter. At most8 inline scripts are parsed;
a ninth observed script records limit/unknown and prevents continuation. Event
handler attributes are conservatively treated as unmodelled nested navigation.
JavaScript syntax beyond the parser's configured2022 grammar yields unknown;
linked module-only syntax may likewise stop as partial rather than being guessed.
No claim of actual browser execution/active Home context follows from syntax.

Checks executed: npm run check; explicit node --check for every new research file
and the modified isolated server; changed PowerShell parser; full npm test with
124 tests passed,0 failed,0 skipped. Tests execute the built page/worker on Ally
with synthetic inputs, not TV source. Cases cover comments/unquoted/inline forms,
base/entity handling, no source execution, private sentinels, all stop reasons,
exact aggregate cap and oversized child, accessors, lease/Host/Origin/group/run,
main-only/default-off admission, hard parser timeout, failed controls and late
SDK/native results. Formatting/whitespace and deterministic build checks are
passed; two successive builds matched. TV worker startup/CSP/fetch compatibility remains
unobserved until approval and the one live run. No tile or persistence claim.

The owner-supplied social comment saying the platform is closed is unverified;
it supplies neither an identified Home consumer nor an absence proof. It does not
change this batch. No new firmware or generic launch experiment was selected.

Pending approval is exactly sectionC's main-only three-read/544KiB static batch,
including the missing-sibling comparison and fixed structure/equality return. It
also permits activating only the new opt-in through the existing Console lifecycle.
After approval, run once, release, ownership-check restore, record the outcome,
then return to Astra under sectionE. No bedroom resume, raw capture or persistent
TV write is included. No push. Preserve the queued handoff requirements above.

## Batch24 live checkpoint: two unquoted scripts, stop for Astra

Owner approved the prepared exact batch. One main-TV homeDocument run executed:
03a6541cf1e1606a683510c2a2708de1, received2026-10-18T11:04:33.989Z. Source-home
artifact: research/results/isolated-main-03a6541cf1e1606a683510c2a2708de1.json.
SDK loaded/ready=true, embedded parser controls passed, root read resolved.
This demonstrates the delivered worker/control/getter/read/report path on this
main-TV run, not universal browser/CSP compatibility or Home-runtime identity.

| Observation                   | Returned evidence                                                    |
| ----------------------------- | -------------------------------------------------------------------- |
| Root                          | Successful HTML,1092 bytes, parsed                                   |
| Script elements               | 3 total:1 inline,2 src, both src attributes unquoted                 |
| Inline JavaScript             | Parsed; no recognized location/meta navigation forms                 |
| Other structural counts       | Frames0,base elements0,meta refresh0                                 |
| Missing-sibling comparison    | Non-success HTTP response,341 bytes; complete body differs from root |
| Continuation                  | Not attempted; stopReason=ambiguous                                  |
| Total source reads            | 2,1433 bytes; no truncation or budget exhaustion                     |
| Eleven lexical SDK references | None in inspected root                                               |

The new document contains two unquoted dependencies the old quoted-src regex
would miss. The same1092-byte size as revision23 does not establish identical
content across runs: no raw text or content hash was exported. Root/negative
inequality refutes identical response bytes for this pair, not all fallback/error
behavior. The negative HTTP status code itself was not in the return contract;
do not label it404. Likewise, navigation=none covers recognized syntax only,
not runtime calls, aliases, dynamic imports or behavior of the unread scripts.

With two distinct script candidates and no recognized navigation/frame/base
complication, the prepared policy refused to choose the first script. Neither
script was fetched. No raw source/URLs/IDs/configuration/storage values returned,
no source executed, and no persistent TV write, installer or firmware operation.
This is a useful coverage finding, not a native tile or registration capability.

One research launch was accepted. The launcher found current-app MESSAGE matched
the run URL before requesting the normal summary relaunch. Actual restored pixels
were not independently observed. Lease release confirmed: Ally GET run returned404.
No native retry, extra experiment or bedroom request. Bedroom4177 stayed absent.

Cleanup: researchDocument24 is now explicitlyfalse in the existing ignored local
companion options, main-only researchTargets retained. Canonical Console stop/start
with --no-proxy applied it. Health confirms document24=false and summary running;
one Vite process11968 owns loopback5173 and LAN4176/4178, with no4177. Public
tracked tree remains clean. Original option bytes remain backed up outside Git
at workspace work/research-lifecycle/batch24-companion-before.json. Current JSON
is semantically disabled but not byte-identical to that backup because the false
flag is retained. A combined restore/restart command was rejected before execution
with only "blocked by policy"; the narrower single-flag disable and separate
canonical lifecycle operations succeeded. Do not report a byte-for-byte restore.

STOP FOR ASTRA: choose a concrete bounded way to inspect/disambiguate the two
source-derived script candidates and reach the actual catalog/order consumer.
No next TV experiment is selected by Sol. Do not repeat the original regex scan,
infer cloud-only or SQLite storage, guess URLs, broaden CSP or revive a retired
raw-source exception. Existing four contracts and all final handoff queue
requirements remain distinct. Bedroom needs explicit owner resume. No push.

Runtime code unchanged fromc26946e; its124-test pass is the preparation result,
not a suite rerun during this live-only batch. Validate the saved report against
the fixed contract, format new metadata/doc sections and check staged whitespace
before local commits. Final Claude handoff remains deferred.

## Astra batch25: inspect the two direct dependencies as a closed set

Owner requested the configured Sol / Astra / Luna workflow on 2026-10-18. The
first explicit Astra request hit a usage limit; the resumed read-only advisor
returned this recommendation after reading the collector, parser, contract,
tests and actual batch24 result. Advice is not live-scope approval. Primary Sol
owns integration/review; Luna has a bounded new-module/test implementation task.
Both must preserve the earlier batch24 behavior and historical result.

### Hypothesis and finite reads

Batch24's two direct source-derived script dependencies may expose a static
consumer/save/load relationship or an identifiable bootstrap boundary. Neither
has been read, and neither is selected as more important from its filename or
position. Inspect both as one closed set, not one arbitrary first candidate.
This can find syntax leads; it cannot establish that the root is the active Home
catalog consumer or authorize a catalog/store write.

New main-only `homeDependencies` group, probe `sdk-home-dependencies-25`, separate
default-false `researchDependencies25` opt-in. The same Console-owned main channel
and lease/peer/Host/Origin/page/worker/report restrictions apply. No credential or
TV access when the target is bedroom or the group is disabled. Batch24 opt-in
remains false; do not widen its contract or reuse its completed approval.

1. Embedded parser controls pass, SDK readiness observed, then one fixed sctv
   lookup as before. Require complete successful root HTML parsed without unknown
   inline navigation, frames or invalid base. Resolve/deduplicate direct script
   destinations preserving classic/module type. Require exactly two; reject a
   mismatched root instead of discovering a larger set.
2. Read a generated missing sibling again and compare complete bytes on TV.
   Require different root/negative bodies in this run. Historical comparison
   does not cover a new response. HTTP outcome remains a category, not a guessed
   numeric status.
3. Validate BOTH script destinations against the existing localhost/127.0.0.1,
   port12345, /scfs/, same-origin, no-query/fragment/credentials policy before
   fetching either. Both must pass. Anonymous dependency1/dependency2 slots follow
   document order only. Read each at most once; stop on a failed/partial read or
   parse. No recursive import, source map, frame, navigation or endpoint follow.
4. Parse root inline scripts and the two bodies as data on TV with parse5/Acorn.
   Never execute inspected source or insert it into a document. Source, resolved
   paths and identifier/binding values stay in the private TV parser/renderer.

Ceilings: four content attempts total, root16KiB + negative16KiB + two scripts
512KiB each = 1,056KiB (1,081,344 bytes). Collection AND classification have one
five-second deadline; each worker parse has at most one second and remaining
budget. Retain node8192/depth64 and existing bounded inline/script handling;
limits produce unknown, not a silently larger traversal. Native lookup and SDK
startup keep their existing separate finite ceilings. No native launch retry.

### Structural output and evidence ceiling

New exact closed report, at most8192 UTF-8 bytes. Counts/enums/anonymous integer
slots only, plus the existing run identity and fixed approved method names.
At most two dependency rows and a GLOBAL graph of32 nodes/32 edges across the
root and fetched scripts. Preserve source truncation, parse incompleteness and
explicit graph saturation separately. No URL/path, app/native ID, source name,
free text, raw body, source hash, configuration/store key or value exports.

Recognize bounded syntax for direct network reads/response consumers, storage
reads/writes, fixed SDK config/store/launch calls, event handler registration,
DOM creation/insertion and direct function calls. Edges must say what the syntax
supports (for example containment or a direct callback), not guessed runtime
flow or arbitrary co-occurrence. Shadowed names cannot establish SDK/storage
identity. Unsupported aliases, dynamic dispatch, imports and opaque wrappers are
unknown boundaries. Direct response-to-render/save relationships require an
explicit supported binding/call relationship; lexical proximity is insufficient.
No graph node is named a Home catalog writer merely because it stores/renders.
Four conclusion fields stay `unestablished`: catalogMembership, favoritesOrder,
launchRouting and signedDelivery. Candidate syntax never certifies those contracts.

### Controls, outcome branches and approval

Local tests must cover: two scripts reversed, duplicate resolved URLs, one denied
candidate preventing both child fetches, external/denied base, classic/module,
string/comment method decoys, shadowed fixed identifiers, supported versus unknown
aliases, unrelated storage/rendering, handler-to-save and read-to-render positive
fixtures, no inspected-source execution/export, no recursion, exact aggregate
bytes, saturation, worker/timeouts/late SDK events, pagehide, accessors, admission,
forged/replayed/cross-group reports and mocked launcher guards before credentials.
Run the full existing suite, syntax/PowerShell parsing, formatting and whitespace
checks after implementation. Record actual results in a preparation checkpoint;
this recommendation itself has not run those checks.

After preparation ask ONCE: approve one main-only batch25 launch, root/negative
and BOTH direct same-origin scripts (four reads/1,056KiB, five-second collection),
with the precise new structural report above, temporary opt-in/lifecycle and
ownership-aware normal-summary restoration? Source stays TV. No bedroom/raw
capture/store write/firmware/settings/external access. This is a new read/output
scope, not repeated command or encrypted-storage permission. Do not run it first.

If approved, use canonical Console lifecycle, main-only targets, one run, validated
saved report, release even on failure, then disable the new opt-in. Restore only
when the current app still belongs to that run; actual pixels remain unobserved
unless separately observed. Retain any owner navigation. Do not auto-run again.

- Direct consumer/save/load syntax: return exact anonymized relationship evidence
  to Astra for the next semantic trace. No setters.
- Bootstrap/import/loader boundary: specific lead only; do not follow it.
- Libraries, unrelated storage or launch routing only: report limited coverage;
  no absence claim about the Home catalog.
- Shape change, denied/external resource, comparison/read/parse failure or budget:
  stop; mark the exact partial/unknown ceiling.
- Both parsed but attribution remains ambiguous: consult Astra about one concrete
  next resource/meaning scope. Do not invent another generic grep or revive raw
  capture grants. Later evidence must connect actual Home row to consumer, writer,
  load behavior, persistence and verified rollback before a first write.

`TV-ATTENTION-DESIGN.md` is a separate owner-requested design only, favoring a
native nonblocking notice if established. Its passive current-app comparison and
any future notice-call test are NOT part of this batch25 approval. No observer,
settings toggle, event wiring or live popup has been built. Keep bedroom suspended
and queued LAN/Vite/Tailscale, in-Mist connection settings and task PLUS Startup
inventory requirements intact. Local owned commits only; never push.

### Owner availability update, 2026-10-18

Owner explicitly resumed bedroom-TV availability after the batch25 recommendation.
This lifts the earlier sleeping-person suspension for future specifically planned
work; it does not authorize a new data channel or change batch25's main-only target.
No bedroom request, wake, launch or listener activation was sent on that update.
Historical suspension statements above remain dated history. Select and review
any later bedroom experiment separately; retain separate target/credential profiles.

## Batch25 preparation checkpoint: one live approval pending

Prepared locally, no TV requests, credential read, Console restart or ignored
option edit. Owner has resumed bedroom availability, but this group intentionally
remains main-only. `researchDependencies25` is default false; existing runtime
configuration was not enabled or restarted. Batch24 remains retired.

New source: research/home-dependencies-{parser,worker,contract,browser,entry,
prepared}.mjs and build-dependency-parser.mjs. New pretest build uses the already
locked parser/bundler development dependencies. Normal disabled hosting imports
no parser packages or generated assets: a child-process import test rejects those
loads and still constructs the unused default server/plugin without listening.
Group page, worker and report paths are bound to the same main-only lease. The
launcher refuses disabled or wrong-target groups before credentials/native I/O.

The inspector resolves and policy-checks both direct candidates, reads at most
four resources and never follows their children. Syntax graph is deliberately
limited: direct named function bindings/callbacks, supported awaited-fetch/then
response consumption, known DOM creation/insertion and fixed unshadowed APIs.
Reassigned bindings are invalidated; unsupported aliases/control flow remain
unknown. Containment is not dataflow, resource order is not runtime order, and
cross-resource graph edges are not inferred. Imports/wrappers/dynamic/computed
boundaries increment bounded unsupported coverage. Graph/count saturation,
source read truncation and parse incompleteness are distinct. All four operational
conclusions remain unestablished regardless of a positive syntax graph.

Independent Astra review found false evidence around reassignment, Promise vs
Response, fetch POST classification, navigation flags, graph provenance and
contradictory reports. Those cases became local regressions. Primary built-page/
real-worker testing also caught a message-key ordering error missed by direct
parser tests; corrected before the passing run below. No diagnostic was deployed
while these failures were being repaired.

Executed after final source formatting: npm run check passed; npm test163 passed,
0 failed,0 skipped; explicit node --check for all new/changed JavaScript research,
integration and test files passed; PowerShell launcher parse passed. Tests cover
real parser/closed metadata, negative200 and HTTP-error bodies, unknown/failing
content, whole-pair policy veto, no source execution/export, exact aggregate byte
cap, graph saturation, unresponsive stream/cancel deadline, parser termination,
pagehide during controls and late native lookup, strict leases/Origin/Host/group/
replay/expiry and mocked no-credential guards. Actual built page and worker ran
on Ally using synthetic source, not on either TV. Two private builds matched
byte-for-byte: worker319240 bytes, page39839 bytes; third-party licenses3. TV
compatibility and actual Home dependency behavior remain unobserved until approval.

Generated bundles/licenses and node_modules stay ignored; no raw TV source was
captured or put into Git. Final Markdown-section formatting, whitespace/staged
path review and local commit follow these checks. The old historical sections
were compared to HEAD after an interrupted Windows encoding edit; historical
body/notes remain unchanged except intended current-pointer edits. UTF-8 is explicit.

READY TO ASK ONCE: approve one main-only batch25 run plus temporary opt-in through
the existing Console lifecycle: root16KiB, generated negative16KiB, both direct
scripts512KiB each, at most4 reads/1,056KiB, five-second collection/classification,
fixed <=8KiB anonymous structural metadata only? Source stays TV. One native
research launch, no retry; release and disable afterward, request summary restore
only after ownership match. No raw capture, external fetch, TV settings/firmware/
store write or bedroom operation. New output/read scope is required by this plan
and is not covered by completed batch24/retired source grants. Do not execute it
before the owner's reply. This approval does not cover a popup or attention watcher.


## Batch25 live checkpoint: partial first dependency, stop for planning

Owner approved one run and requested sparing remaining usage. One main-only run
8668beae673964819195dce450d79d5e, received2026-10-18T16:13:29.535Z, is saved in
research/results/isolated-main-8668beae673964819195dce450d79d5e.json.
SDK loaded/ready and embedded controls passed. Root1092-byte HTML parsed with
three scripts, two distinct direct references; negative341-byte HTTP-error body
was different. First classic script returned successful JavaScript150219 bytes,
then parse=limit/jsParse=limit. StopReason=parseIncomplete; second script UNREAD.
Total three reads151652 bytes. Source truncation=false, global budgetExceeded=false,
graph saturated=false, parseIncomplete=true and partialCoverage=true. The fixed
report does not distinguish the precise AST limit from the worker parse deadline;
do not assert which caused it. No live retry or automatic limit increase.

Graph contains nine root nodes/five edges, no dependency graph and no fixed method
matches. These are syntax only; catalogMembership/favoritesOrder/launchRouting/
signedDelivery remain unestablished. Complete first-body transfer is not complete
analysis, and the second script has not been inspected. No raw source/value export,
TV settings/store/firmware write, popup test or bedroom operation.

Launcher requested normal summary restoration only after current-app ownership
matched this run; pixels unobserved. Run absent afterward (Ally HTTP404). Temporary
researchDependencies25 explicitlyfalse, document24=false; canonical --no-proxy
stop/start applied cleanup. Health confirms disabled flags and summary running;
one process27072 owns5173/4176/4178;4177 absent. Group admission now400, no run
issued. Public host tracked tree clean. Original ignored options backed up outside
Git at work/research-lifecycle/batch25-companion-before.json; false flag remains,
so not a byte-identical restoration. Combined cleanup command was automatically
rejected before execution with only 'blocked by policy'; split flag update and
separate canonical stop/start succeeded. No unresolved cleanup block.

STOP: defer new Astra planning until capacity is appropriate. Next question is
how to distinguish the parser/worker limitation and inspect the two dependencies
meaningfully without another blind repetition or unapproved scope expansion.
Approval for this one run is consumed. No new TV experiment selected. Runtime code
unchanged from829a105;163-test preparation result was not rerun for this data-only
checkpoint. Saved report independently passed validateHomeDependencies. Preserve
TV-attention plan-only status, routing intake and queued extraction requirements.
Bedroom is available per owner but was not operated; batch25 remained main-only.


## Route audit checkpoint, 2026-10-21: local preparation before any new run

Owner requested an offline six-lens route audit with Astra challenge. Full audit
and ranked proposals are in the Codex handoff ROUTE-AUDIT-2026-10-21.md; ROUTES.md
links it. No new batch/run approval is implied. The earlier budget deferral is
historical, not a current reason to avoid this owner-requested review.

Home batch25's limit is more ambiguous than earlier AST-vs-deadline wording:
worker error, empty result, post failure, invalid result/graph and timeout also
collapse into incompleteness. Next preparation should expose bounded reason enums
and calibrate actual built worker with synthetic fixtures before a new TV scope.
Keep hard caps, retired capture status and all four unresolved Home contracts.

Separate full-screen entry candidates: untested DashCast LAN iframe control with
a minimal synthetic embeddable marker (never weaken real summary headers), and
vendor-provided Cast receiver A60E880D's own LOAD contract. Each needs a concrete
reviewed one-run scope, controls, outcome branches and idle owner window. Neither
is a native quiet-popup test or a persistent tile. No implementation or live run
was made by this audit. Current suite163/163 and syntax passed locally; this is
fixture evidence, not TV compatibility. Preserve queued extraction requirements.


## Local preparation after route audit, 2026-10-21

Owner selected the recommendations. Prepared synthetic DashCast iframe marker,
main-only/default-off flag researchDashcastMarker through existing isolated
listener. Fixed marker text/no scripts/private data/outbound assets. Only exact
active main-TV marker response omits framing denial; shared error/summary headers
stay unchanged. Existing60sec lock/lease, exact Host/peer, absent-Origin policy,
max2 marker responses and bounded metadata; no raw request/header logs.
research/dashcast-marker-plan.md is the exact proposed live scope. Separate Python
launcher is plan-default; one receiver/URL, fixed target, pinned transport/session,
preexisting Cast-session veto and independently bounded STOP/disconnect/release.
No current owner config was edited; no Console restart, credential access or TV call.

Home root/dependency failureReason is optional/closed enum; historical records
without it remain valid and are not rewritten. New labels distinguish syntax,
AST node/depth limits, worker availability/error/deadline/empty/post failure,
collection deadline, invalid result/graph and unknown internal failure. Negative
comparison schema, source/read/time/output limits and default-off flags unchanged.
Worker and parser keep source private; no new raw messages/values/errors exported.
Parent review corrected first-inline-failure attribution and malformed-graph
precedence; successful parse cannot claim an unknown failure.

Luna supplied scoped modules/diagnostic changes; parent reviewed/integrated them.
Astra reviewed actual marker integration/launcher and identified session-switch and
cleanup defects, now covered with fake lifecycle tests. No live compatibility claim.
Executed final local checks:181 Node tests passed,0 failed/skipped, including actual
built worker synthetic delivery;15 Python tests passed, including default no-I/O,
full fake apply flow and STOP/disconnect/release failure paths. Syntax and explicit
Prettier checks passed. No separate public-tree gate applies: no public code edited.

Next: ask once for the exact main-only DashCast scope and idle window after local
commit. This is a full-screen receiver experiment; quit can return Home. It does
not authorize embedding actual Console data, a popup feature, another Home read,
new receiver ID, retries or any firmware/settings change. Old capture/run grants
remain consumed. No live test follows solely from a source helper being present.


## Main DashCast iframe result, 2026-10-21

Owner approved TV use including interrupting idle YouTube. One prepared run
7dc1f5521164637549f7604fa7cf9a02: receiver launched, one fixed LAN marker URL
sent with force=false/reload=false, URL echo true. Server marker status reported
responsesIssued0, lastRejection none. This is zero admitted marker responses,
not zero HTTP traffic; global peer/Host refusals are outside marker counters.

Owner photo6862.jpg shows DashCast and a bottom Loading status containing this
exact run URL; owner reports no marker page and subsequent Vizio Home. Published
DashCast receiver loadFrame sets this status before successful target display;
it is receiver-owned status UI, not a new system popup. Running receiver source
identity is not established merely by matching the published implementation.
https://raw.githubusercontent.com/madmod/DashCast/master/receiver.html

Sender intentionally stopped the captured session after its bounded observation.
STOP send/receiver-status response and captured-session absence confirmed; sender
disconnected and lease released. Home outcome is not proof of spontaneous crash
or automatic return after failed loading. No prior YouTube restoration established.

Temporary owner-local options restored byte-for-byte after hash/race checks;
canonical Console stop/start --no-proxy completed. Post-restart health: main edge
running; marker/document24/dependencies25 false. Marker admission400, old lease404,
summary edge running. Public host tracked tree clean. One combined restart/health
command was automatically rejected before execution with only blocked-by-policy;
separate canonical start and separate health check succeeded. No unresolved cleanup.

Saved protocol plus owner observation: research/results/
dashcast-iframe-main-7dc1f5521164637549f7604fa7cf9a02.json. No source/credential,
firmware/settings write, new server/task or Tailscale change. Approval consumed;
no retry. Local tests were not rerun for this result/docs-only checkpoint.

Astra interpretation: HTTPS receiver to HTTP iframe blocking is plausible, not
identified; actual running receiver origin and global refusal evidence remain
unknown. This would not itself explain earlier top-level navigation failure.
Next candidate is one fixed inert data:text/html iframe marker, no scripts/assets
or LAN target. That isolates target network delivery but the DashCast receiver
still uses its own intermediary error.html, so it is not a fully network-independent
receiver test. Visible marker would prove this iframe document can render; failure
would still leave data-URI policy/receiver loader unresolved. New finite plan and
owner go-ahead before another run; no change to private Console embedding policy.


## Confirmed self-contained DashCast HTML, 2026-10-21

Owner said to run the proposed inline control, then explicitly prohibited stopping
until told. New plan-default research/run-dashcast-inline.py sends only a fixed
inert base64 data:text/html document through DashCast84912283's iframe branch,
no scripts/assets/LAN target. No Console restart, config change, listener, token
access or additional receiver path. Captured new session/transport pins the message;
one URL echo received. Sender remains attached in an interactive research session.
No timed STOP, receiver expiry or automatic cleanup command is scheduled. Only an
explicit owner stop command will invoke captured-session cleanup. An unexpected
transport failure cannot guarantee the receiver stays alive; no autonomous STOP
is issued, including EOF/error handling.

Owner photo image-1792631250309.jpg visibly shows MIST INLINE CONTROL and
Self-contained page. This confirms actual custom-HTML rendering, beyond the old
DashCast loading/title screen. Sanitized observation/photo hash saved at research/
results/dashcast-inline-main-242785f7e23d4106b19d54598697ce97-observation.json.
Active run log is append-only JSONL; it is not final cleanup evidence. Do not mark
the session released/stopped or edit the original owner no-stop instruction away.

This target avoids the LAN page fetch; it does not make the DashCast receiver
itself network-independent because its own error-page intermediary remains.
Earlier LAN failure now lies in an unresolved target-delivery/policy distinction;
HTTPS-to-HTTP restrictions are still a hypothesis, not identified cause. No proof
of arbitrary scripts, SDK access, live Console data, popup-over-other-apps, durable
Home membership, original-app restoration or an unattended delivery feature.

New helper tests use fakes only: plan no-I/O, fixed inert content, and no STOP until
explicit owner command with captured session. Existing tests are not TV evidence.
Record pending owner stop and final cleanup separately; no push.
