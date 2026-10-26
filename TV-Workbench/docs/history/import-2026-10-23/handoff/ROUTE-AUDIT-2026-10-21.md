# Mist TV route audit and next experiments

2026-10-21. Offline audit requested by owner, with an independent GPT-6 Astra
medium advisor. No TV request, discovery, credential access, live capture, power,
input/settings change, Console restart, configuration edit or remote push.

## Verdict

Keep investigating. We have two demonstrated custom-content display routes:
Conjure web content and the default Cast media receiver. Neither is a persistent
Home tile or a native quiet popup. DashCast is partly functional and inadequately
controlled, not exhausted. The Home implementation investigation stopped on an
ambiguous measurement failure, not evidence that membership cannot be changed.

Three concrete next candidates emerge: a clean DashCast LAN iframe control, the
separate vendor Cast receiver A60E880D, and local repair/calibration of Home parsing
failure diagnostics. These serve full-screen entry or tile research; none should
be sold as a likely quiet-toast solution. A native popup still needs a production
display contract. Do not substitute a phone notification for the owner's TV goal.

Owner's new Vizio Mobile clarification: pair once, remain connected afterwards,
no further popups on saved connections. This closes the speculative recurring
reconnect-toast trigger for the observed app flow. The initial PIN prompt and
success toast remain separate UI events; arbitrary text is unestablished.

## Scope and evidence rules

Reviewed the capability index; relevant historical/current sections of entry,
software, firmware, attention, layout, execution and handoff records; actual
DashCast helper, installed controller, vendor launcher snapshot, parser/worker,
server headers, profiles and selected result JSON. This is a selected-source audit,
not a replay of every archived command or a complete firmware/API census. The
companion evidence manifest hashes the principal local inputs at audit time.

Separate: observed TV pixels; reported protocol state; static code; hypothesis;
untested outcome. A listed SDK definition is not a successful call. A sender-side
HTTP200 does not establish a TV request. URL echo is not document retrieval.
Current repository source does not prove exact historical or running-TV identity.
No external claim of impossibility, proprietary ownership or complete source absence.

Forge baseline:4bf47ba560bf1090933d25dd3499773a59b1e388 on
review/mist-console-tv-20261017. Origin verified from Git as
https://github.com/zerckzzyHD/_Mist-Forge.git; visibility not remeasured.
Handoff origin independently verified as _RobCo-Agent-Handoff; Claude has unrelated
uncommitted work. Owner explicitly authorized this audit in our Codex handoff path;
no Claude file is edited, staged or committed.

## 1. Reconstruct DashCast before calling it failed

Evidence: Forge console-tv/research/cast-usb-check.py:16-24,31-35,49-55,69-107;
FIRMWARE-RESEARCH.md:251-297; installed PyChromecast DashCast controller.

| Experiment/configuration | Connection/command evidence | Owner display evidence | Ceiling |
| --- | --- | --- | --- |
| Initial DashCast launch/URL attempt | Receiver84912283 started; initial sequencing had readiness race | Loading screen | Not merely app absence; initial send readiness uncertain |
| Readiness-fixed USB iframe URL | Application ready, message callback and same URL echo | Still loading | Receiver handled message; USB retrieval/render unknown |
| USB force/direct navigation | Socket send; earlier reply timeout later recognized as wrong expectation | Black screen | Top-level navigation loses original receiver context; no request/error trace |
| LAN summary force/direct navigation | Ally preflight200; receiver ready and socket write | Black screen | Does not establish TV retrieved summary; does not isolate USB |
| LAN iframe navigation | Not implemented in helper's allowed argument matrix | UNTESTED | --lan-control requires --direct-navigation at23-24 |

The owner's recollection that we only launched DashCast is too narrow: we connected
and sent URL commands after readiness. However, declaring the whole route exhausted
would also be wrong. The useful untested cell is LAN iframe, with a suitable target.
The source records multiple attempts; exact total invocation count cannot be
reconstructed from the helper's final version alone, so no invented count.

Published receiver source routes force=false through an iframe loader and echoes
before successful target loading is established; force=true schedules top-level
navigation and returns without that echo. Its error-frame indirection also makes
a blank/loading result insufficient to identify the failed fetch. This is upstream
source evidence, not proof which exact receiver revision runs on this TV.
Primary: https://raw.githubusercontent.com/madmod/DashCast/master/receiver.html
Controller: https://raw.githubusercontent.com/home-assistant-libs/pychromecast/master/pychromecast/controllers/dashcast.py

The current summary server sets frame-ancestors 'none' and X-Frame-Options DENY
(src/server.mjs:90-92). Thus the existing private summary is deliberately unsuitable
as an iframe control. This does not explain the historical force=true black screen:
those headers restrict embedding, not ordinary top-level navigation. Do not weaken
the summary's protections to make DashCast work. Actual receiver origin, mixed-
content behavior and effective historical responses remain unmeasured.

## 2. Explored routes and untested branches

| Route | Strongest evidence | Valuable unexplored branch | Relevance |
| --- | --- | --- | --- |
| Paired Conjure17/namespace4 | Main summary visibly renders and refreshes; saved-token relaunch after standby | Correlated display acknowledgement and careful manual exit behavior; in-page notice only while Mist already displayed | Established full-screen Console route; no overlay over other apps |
| DashCast84912283 | Receiver/message bus alive; USB URL echoed | Minimal LAN iframe control with TV request evidence | Alternative full-screen browser route; no tile/toast claim |
| Default CastCC1AD845 | PAUSED/title echo; owner saw custom title take over idle YouTube then Home | Receiver lifetime/quit timing, metadata images, owned-session behavior, if a separate full-screen product mode is wanted | Low priority for quiet popup; never repeat takeover as proof of overlay |
| Vendor CastA60E880D | Manufacturer-hosted sender source identifies receiver and a media LOAD | Exact vendor receiver may handle web URLs differently; not yet launched in inspected records | Distinct entry lead, not already tested by DashCast or default receiver |
| TV-local API test UI | Owner saw landing/App/System sections;312 sanitized named definitions | Select only a source-backed relevant method and finite control | Contract discovery; not evidence all methods work; no Run All/Page |
| SDK companion/loopback bridge | Version getter resolves on both TVs; safe reports received | Overlay subscription semantics if concrete new static evidence is available; current visibility is not playback | Research bridge; callbacks are not display commands |
| Paired REST/navigation | Authenticated current-app reads on both; main UI navigation observed | Owner-labeled power/playback/current-app comparisons | Activity guard exploration, not automatic takeover approval |
| Home root/dependencies | Root parsed; first linked script transferred; parser incomplete; second unread | Differentiate failure, inspect both under a newly reviewed bounded run; prove Home identity | Highest-value continuation for native tile; writer still unknown |
| Config catalog/store | Named sections differ from absent control; route-shaped structure exists; unused generic store key undefined | Connect actual consumer to writer, membership/order and reload path | No speculative writes; internal route counts are not installed-app counts |
| USB | Media browser recognizes card; HTML marker not displayed | Revisit only after web-fetch/render control isolates localhost path | Not a demonstrated code/install route |
| Signed software/assets | Offline source-family trace and signed SC-ASSETS delivery | Exact production UI/package identification if a concrete lead appears | Not evidence modified packages accepted; no flashing justified |
| Pairing/Mobile popup | Initial pairing popup observed; saved Vizio Mobile reconnection has no popup | Production completion-to-template link, if newly identifiable | No demonstrated recurring or arbitrary-text route |

Manufacturer Cast evidence: SOFTWARE-ENTRY-REVIEW.md:47-60; workspace snapshot
work/reference/official-cast-launcher.html:116-130. The sender uses receiverA60E880D
and passes its URL field as MediaInfo(contentId, video/mp4) into LoadRequest.
This does not establish that its receiver accepts arbitrary HTML. Preserve the
manufacturer-specific protocol rather than assuming a default media receiver.
https://scfs.vizio.com/html5-app-dev-launcher/cast-launcher-sender.html
Google distinguishes custom and default receiver applications; one receiver's
result does not determine another's behavior:
https://developers.google.com/cast/docs/web_receiver

### Lower-priority contract watchlist

The static SDK registry also lists app lifecycle/visibility/launch methods. In
particular, a previous-app command is a possible restoration lead, not proof it
would restore YouTube, its playback position or the correct prior input. Inspect
its exact source/schema and current-app semantics before proposing a separate
owner-approved test; never append it silently to cleanup. Visibility/background
getters may describe the calling renderer, not whether unrelated media is playing.
Do not generalize from a method name to a system-wide capability.

The official mobile page advertises VIZIOgram photo/video sharing. That is an
unmeasured vendor-account/content workflow, not a demonstrated text-toast API.
No submission, account linking, mobile-app modification or payload capture is
selected. Other receiver/platform routes require a concrete new source contract
before joining the execution queue; this audit is not a claim they are impossible.

## 3. Corrections and confounded evidence

**Home parse result is broader than AST cap versus deadline.**
research/home-dependencies-browser.mjs:169-196 collapses worker error, timeout,
empty result and postMessage failure into parser_failed. classify():399-437 also
maps malformed result/graph and other exceptions to incompleteness/limit. Parser
node/depth caps exist (parser.mjs:10-11,512-515), but current saved output cannot
select among these causes. A passing small parser control rules out some total
failures, not a later resource-specific failure. Do not simply increase budgets.

**Home identity is still open.** Batch25 result8668beae... root1092bytes and first
script150219bytes are complete transfers within bounds; second script was unread.
methods=[] is not evidence of no Home writer. The actual Home consumer, catalog
membership, ordering/favorites, launch routing and signed delivery are separate
contracts. Earlier quoted-src lexical scans missed unquoted script references;
this illustrates why negative scan coverage must be stated, not presumed.

**Cast acceptance is not media decoding or autonomous lifetime proof.**
The fixed title/PAUSED session confirms metadata acceptance. No audio playback was
requested; WAV decoding, universal data-URI media support and speaker silence were
not measured. The prior design's wording about narrowing source-format uncertainty
must be read only as accepted LOAD/session metadata. Owner-estimated couple-second
visibility and sender's20sec wait plus explicit quit do not establish why it ended
when seen. Need no extra playback test to preserve the useful title finding.

**Cast idle is not TV idle.** The helper only checked Cast app ID. The owner told
us the TV was idle, later specifying YouTube. That establishes a previously visible
non-Cast app can be displaced while Cast reports no non-backdrop receiver. No future
automatic launch should use that guard alone. Returning Home is not prior-app restore.

**Catalog and installer negatives are narrower than capability absence.**
Config absent key null versus named object controls are meaningful. Empty filtered
route subsets may reflect projection/shape assumptions, not absent Home/Conjure.
HEAD responses to installer-looking paths do not establish another verb's handler.
No settings/install/write probe is warranted from those names or shapes.
Sources: research/catalog-type-diagnostic-20261017.json;
research/catalog-shape-diagnostic-20261017.json;
research/conjure-route-diagnostic-20261017.json; SOFTWARE-ENTRY-REVIEW.md:779-815.

**Native toast absence/proprietary assertions are unproven.** Our bounded searches
found mocks, fixed internal Loki senders and missing implementation links. They did
not inspect complete production firmware or prove all undocumented interfaces absent.
Opus's stronger prose is not adopted. Source-family identity is not exact running
build identity; matching popup appearance is not renderer identity.

## 4. Vizio Mobile comparison, now resolved to its useful ceiling

Owner clarification during audit: one pairing, remains connected, no more popups.
Official Vizio instructions describe selecting a TV and entering its displayed
four-digit code to pair: https://www.vizio.com/en/mobile . This supports a pairing
flow; it does not establish the exact REST implementation of the proprietary app.
Our client uses external /pairing/start then /pairing/pair. Supplied platform source
only shows a differently shaped internal start/stop -> pincode registry operation.
Do not label that missing bridge resolved just because both use the word pairing.

No repeat pairing, auth reset, device-name substitution, PIN capture or phone
traffic capture is selected. The already-paired reconnect comparison is unnecessary
now: the owner answered it. Preserve saved credentials. Reopen only if a specific
production success-template or authorized display API lead appears.

## 5. Ranked execution plan; proposals, not executed tests

Two priorities coexist: establish another web entry (owner's DashCast question),
and repair the Home investigation. Quiet-popup discovery has no actionable call
candidate. We recommend local preparation first, then one chosen live experiment.
This audit approval is not a live-run grant; consumed capture grants stay retired.

### A. Local preparation: repair evidence distinctions and prepare a clean control

No TV needed. Keep current hard read/source/output/privacy caps. Design separate
bounded failure enums for parser syntax, AST node cap, depth cap, worker unavailable,
worker error, worker deadline, post/serialization failure, malformed worker result
and invalid graph. Keep outer collection deadline distinct. Add synthetic controls
for each path, including actual built-worker delivery and minified source of a
representative size. Calibrate cold worker start separately from parse time without
claiming synthetic timing reproduces TV speed. Do not export raw errors/source.

In parallel as a design task, specify a fixed synthetic LAN marker unrelated to
Console data. It must be served through existing lifecycle/peer restrictions, with
one opaque run, finite expiry and bounded request-status counters. Only that marker
may be embeddable; preserve DENY/frame-ancestors for every real summary route.
Prepare denied-peer/Host/path/expiry regression cases. No implementation was made
in this audit. No listener/config change or live permission follows from a draft.

### B. First entry-route experiment: DashCast LAN iframe

After reviewing A's exact delivery profile and approving one idle main-TV window:
abort if a non-backdrop Cast app/session already exists; the owner's idle observation
does not authorize replacing someone else's paused session. Use a fresh receiver
session, verify app ID+namespace+readiness, send one fixed
marker URL with force=false/reload=false. No public target, USB, recursive fetch,
source transfer, full Console payload, credentials in URL or automatic retries.
Bound one session/one URL, deadline30sec; record sender acceptance, same-TV request
status and owner marker visibility as separate fields. No raw headers/UA/URL logs.
Recheck app/session ownership immediately before stopping only the owned test
session; cancel cleanup if ownership changed. Warn beforehand that quit may return Home;
do not promise previous app restoration. No wake or volume/settings change.

Outcomes: no GET -> message/reachability/origin policy unresolved;403 -> peer/Host
policy mismatch before rendering;200 but no marker -> request reached server and response was served; full body
receipt/render/context remain unresolved;visible marker -> LAN iframe display established,
USB and real Console compatibility still untested. HTTP200 alone is not success.
If black/no request, stop and inspect bounded evidence; do not branch automatically
to USB, HTTPS, other receiver IDs or weaker security settings.

**Approval needed:** exact temporary marker route/output schema/lifecycle and one
main-TV receiver launch. This is deliberately different from repeating the old
summary target or direct-navigation experiment. Bedroom excluded by this batch.

### C. Second entry-route candidate: manufacturer's Cast receiver

Offline first: confirm the sender's LOAD schema and finite receiver status/media
namespace checks. Proposed one idle-main session to A60E880D with the same known
synthetic marker and exact manufacturer message shape. No application registration,
account, developer mode or new external access. Inherit B's preexisting-session
veto, 30sec deadline, no retry and rechecked owned-session cleanup. Keep default receiver, DashCast
and vendor receiver findings distinct. If launch unsupported, record that scoped
result; do not claim all Cast paths unavailable. Receiver ready without document
request is not proof of HTML support. A200+visible marker would establish another
entry; a MIME/media rejection establishes rejection of this receiver/LOAD/URL
combination, not which of MIME, content, URL contract or receiver revision caused it.

**Approval needed:** one specific receiver launch and URL effect after preparation.
This can follow B or be selected instead if B's controls cannot be delivered cleanly;
never run both under a one-test permission. No quiet-popup or native-tile conclusion.

### D. Home continuation after local parser repair

First preserve/validate the original result rather than overwrite it. Propose a
new bounded run to the same source-derived root/negative control/dependencies with
failure enums and honest per-resource coverage. Do not increase node/depth/time
caps merely to force a positive. If calibration shows existing caps cannot analyze
the first script, plan a separately reviewed structural/incremental classifier
rather than blind repeats. Do not slice arbitrary JavaScript and treat syntax
failure as evidence about original code. No raw-source export/recapture.

Outcomes: worker failure -> fix compatibility; AST/time limit -> redesign local
measurement; first parsed/second unread -> still incomplete; both parsed -> assess
actual Home identity/consumer, then plan membership writer/persistence tracing.
No writes until schema, exact target, durable reader and rollback are established.

**Approval needed:** new live read/report scope and temporary opt-in through the
existing Console lifecycle. Prior batch25 approval consumed. Preparation/tests
are reversible local work, not a reason to re-ask general command permission.

### E. Activity detection: useful but separate

The existing design proposes six bounded current-app reads across owner-selected
Home, active playback and standby. This can measure those samples, not certify a
universal watching detector. Extend only with explicit phase labels for paused
versus playing, HDMI and app transitions if the initial comparison is useful.
Power/state getters are leads, not a substituted live route or safe-idle oracle.
No wake, keys, input changes or watcher. Unknown/stale state must block automation.

**Approval needed:** finite read/comparison output scope and owner observation
window, per TV-ATTENTION-DESIGN.md:93-108. Not required to perform B's deliberately
owner-armed idle test. Do not collect content titles, IDs or account state.

## 6. Park or avoid these repetitions

- Another generic SDK keyword scan, random notification endpoint or Run All/Page.
- Repeating identical DashCast direct-navigation USB/LAN tests without new controls.
- Repeating the default Cast takeover to prove it is not a native toast.
- Re-pairing to manufacture a popup, or treating DEVICE_NAME as notification text.
- Store Demo/update/consent commands as substitute notice triggers.
- Treating generic store setters, signed asset delivery or app counts as tile writers.
- More archive inventory without a named production component/API question.
- Firmware modification/flash before exact compatibility, accepted package and a
  demonstrated recovery route; current evidence does not justify it.
- New phone notification infrastructure unless separately requested; it remains
  a fallback proposal, not completion of the TV request.

## 7. Acceptance, advisor challenge and validation

Quiet popup: fixed custom text while unrelated viewing continues, no app/input
switch, no sound, no forced focus, bounded duration/dismissal; separately observed
playback continuity. Current evidence does not meet this.
Native tile: distinct Mist tile in genuine Home, manual launch of existing Console,
persistence after leaving/reopening genuine Home AND standby, independence after
research pages/routes close, no reinjection, and verified removal/rollback. Preserve
other apps and their order. Cold boot and delayed refresh are separate untested
durability cases. Transient receiver or repurposed tile does not meet acceptance.

Astra independently inspected code/results. It confirmed the missing LAN iframe
cell, broader parser-error ambiguity, data-URI/decoding ceiling and narrow catalog
controls. It initially ranked a saved-mobile reconnect clarification; the owner's
answer resolved that branch during this audit. Advisor opinion is not authority or
live evidence; code/results and owner observations control the conclusions.

Executed locally: npm run check passed; npm test163 passed,0 failed,0 skipped.
These are synthetic/fixture tests and rebuild private parser assets; not new TV
validation. Principal evidence files hashed; output links/line references and Git
whitespace checks reviewed. No feature or diagnostic implementation changed.

Preserve OFF-default App+Console toggles, Movie Mode/schedule/critical filtering,
batching/rate limits and no automatic full-screen fallback. Preserve LAN/Vite/
Tailscale extraction, in-Mist Tailscale configuration, scheduled-task AND Startup
inventory, read-only Console and existing Input Lab. No canonical queue/routing
rewrite, remote publication, control-plane state or unrelated Claude edits.
