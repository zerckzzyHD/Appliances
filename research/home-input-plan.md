# Home launcher discovery - offline preparation, 2026-10-23

Status: hosting integration prepared but default-disabled; not live-hosted or
launched. HOME-SPEC.md defines the
product; EXECUTION-PLAN.md owns priority. This is the exact first-experiment
proposal and evidence matrix, not another queue. Owner is away from the TV:
hold ALL TV operations, including automated probes, wake, launch and cleanup.

## Capability matrix

| Capability | Current evidence and source | Ceiling / next observation |
| --- | --- | --- |
| External Conjure launch | bin/launch.ps1 sends saved-pairing PUT /app/launch, namespace4/app17; owner-visible real Console recorded in ROUTES.md section1 | A REST result is not display proof; script always reads main credential despite configurable TV address. Do not use it for bedroom. |
| Navigation in our earlier page | STATUS.md Earlier hardware evidence records original four-tile menu with owner-confirmed arrows, OK open and OK return; src/capabilities.mjs contains current Arrow/Enter handlers | Historical usable navigation is established. Physical input origin and current document's receipt/focus categories were not separately instrumented in that record. Phase A is a narrow current-host check, not a claim that navigation was never demonstrated. |
| Synthetic navigation in vendor UI | research/send-navigation.ps1 fixed main target, six-key allowlist; ROUTES.md section4 records acceptance and subsequent screenshots | Does not establish physical remote delivery to our page, Home-key ownership or all app behavior. |
| Native key registration | research/test-ui-static-registry-20261017.json Keyboard/registerKeyEvents lists additionalKeyEvents array and callback | Static contract lead only. Not called by this diagnostic; inspect further only if ordinary DOM input fails. |
| Page-to-app launch | Same registry: VIZIO_MODULES.App.launchApp(appInfo object); legacy VIZIO.launchApp(NAME_SPACE, APP_ID, MESSAGE, callback) | No verified destination/payload for our prototype. Static example IDs are not an approved destination or proof of privileges. |
| Return, Home, startup | No demonstrated replacement-Home ownership | Distinguish Back from diagnostic, Back from app, Home from app, manual re-entry, standby and cold boot. No watchdog or interception. |
| App/input identity | Existing SDK/source maps and routing evidence in FIRMWARE-RESEARCH.md | Neither a durable tile writer nor complete working app/input launcher. Do not fetch raw live catalog values as part of input testing. |

## Prepared artifact

research/home-input-diagnostic.mjs exports HOME_INPUT_PAGE and HOME_INPUT_CSP.
Three fixed controls; initial focus once, clamped one-row navigation, visible
focus, separate delivered-key counts and activation count capped at99. Repeated
OK keydowns are counted but do not activate again. Unknown/printable/modified
keys are ignored without capturing their text. Only fixed categories appear on
screen; no log buffer, uploads, network, storage, timers, SDK or native calls.
Back/Home are never prevented; only known delivered categories are counted.
Keyboard Home is not treated as proof of a remote Home button.

Hosting integration now exists in isolated-server.mjs and vite-plugin.mjs, behind
researchHomeInput:false by default. Main only, requiring explicit main research
target. Existing Console lifecycle, exact peer/Host and forwarded-header refusals,
one active60sec lease and one page fetch. Only Ally without Origin may reserve a
homeInput run; only TV without Origin may GET its exact /research/home-input/<run>
path. Query/trailing-slash aliases, wrong groups and replay/expiry are refused.
Matching script-hash CSP/connect-none plus header frame-ancestors none, XFO DENY,
no-store, no-referrer and nosniff remain. No new report endpoint, proxy, filesystem
route or credential handling. Health exposes only the option boolean homeInput.
Admission expiry removes permission to fetch; it does NOT navigate/stop an already
loaded page. Browser has no timeout, polling, relaunch or cleanup operation.
Current owner-local options were not read/edited; no live server was restarted or
queried. Local tests use isolated loopback fixtures, never the configured TV LAN.

## Phase A - input only, proposed live scope

Before execution: owner present and gives go-ahead, selects main TV idle window,
and releases the earlier hold/no-stop conflict before any replacement launch or
sender cleanup. Check ownership freshly; do not assume the old receiver persists.
Default-off hosting integration and fake admission tests are prepared. Before
enabling, explain the temporary researchHomeInput:true option, existing main-only
research target, and canonical Console restart. Snapshot original ignored options
privately and check for races; restore exact bytes after the owner ends the test,
then canonical restart and verify opt-in off/run unavailable. Do not do any of
that during the current hold. Never include credentials in a backup or report.
With owner present: validate main health/target/homeInput, reserve exactly one
homeInput lease via existing Ally control route, validate returned nonce/path,
then send exactly one fixed main Conjure launch with existing encrypted pairing.
No generic arbitrary-URL launcher or automatic summary restoration. No live helper
was run and no new launch script is included in this preparation.
No new field/export scope is proposed: this version reports on screen only.

One Conjure launch of the fixed page. Owner uses physical Left/Right, Up/Down
and OK; compare delivered categories, focus and activations separately. No
remote-command injection substitutes for this evidence. No automatic STOP or
relaunch. Owner chooses Back or Home last and describes destination; if both are
needed, a second launch requires an explicit selected follow-up, not an automatic
retry. If page disappears before reading a counter, mark receipt unobserved.
No photo is required. Current display evidence may require owner text because
this diagnostic deliberately has no telemetry or external observer.

Stop dependent actions on unexpected playback/modal/app, target ambiguity, unknown
keys or unavailable hosting; preserve physical exit. No app/settings/input switch
or bedroom operation in Phase A. A missing DOM key is not a terminal failure:
inspect the narrow SDK registration lead before deciding the host is unsuitable.

## Phase B - app/return, not yet prepared

Reference follow-up: home-reference-projects.md now records pyvizio, its vizaio
successor pointer, Vizio_SmartCast_API and vizio-smart-cast. Their app/input/key
contracts guide candidate payload validation; they do not enable Phase B or a
new control bridge. Keep authenticated Ally REST separate from renderer SDK
capability; no tokens in the page, broad proxy or new Console write route.
Further source review found chipset/firmware-specific availability payloads in
VizioApps/vizaio. Catalog id is not launch APP_ID. Establish target compatibility
and provenance/freshness of both lookup datasets before choosing a Phase B payload.
No vendor dataset was successfully parsed by this review and no app was launched.

Only after Phase A results, owner chooses one installed app; establish its exact
source-backed launch identity, payload and response semantics before wiring any
control. Separately observe SDK acceptance, actual display, Back behavior, Home
destination and manual Conjure re-entry. A successful relaunch is not return-stack
restoration. Home going to stock UI identifies a present integration gap, not
proof no integration exists. No automatic interception/default change.

## Review and tests

Astra read-only review supported input-only first. It required separating receipt,
focus and activation; preserving Back/Home default behavior; using physical input;
and deferring app launch until payload/destination are established. These are
incorporated. No advisor device/server/credential operation or file edit.
Subsequent read-only hosting review found no consequential defect; corrected a
stale source comment and added a valid legacy-report attempt under the input-only
lease to verify rejection409, beyond invalid-body rejection400. Advisor did not
execute the tests; parent executed the full suite after these corrections.
Executed after integration:189 Node tests passed,0 failed/skipped; npm run check,
isolated-server syntax, explicit Prettier and diff-whitespace checks passed. Four
new hosting tests cover disabled/main-only validation, shared lock, peer/Host/
Origin and proxy guards, exact path, one delivery, headers, release/expiry/group
isolation, invalid and valid-but-wrong-group reports, and unapproved sockets.
No live compatibility claim.
