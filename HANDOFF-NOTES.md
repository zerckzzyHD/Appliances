# Running handoff notes - deliver only at the end

Current lifecycle: Console-owned hosting, with the historical TV task disabled.
See CONSOLE-LIFECYCLE.md and the latest dated section below; earlier entries
are retained observations and do not describe current startup.

Latest offline preparation, 2026-10-23: research/home-input-plan.md is the current
capability matrix and two-phase protocol. research/home-input-diagnostic.mjs is
input-only source, no SDK/network/app actions. Hosting integration is now wired
behind default-off researchHomeInput, main only; no live option/restart.189 Node
tests plus syntax/format checks passed locally. Astra reviewed assumptions;
physical remote receipt, app launch and Home ownership remain unverified. All TV
operations are held until owner go-ahead, including background probes/cleanup.
Do not use historical active-session statements as fresh status. No server,
credential, configuration, device or normal queue was touched in preparation.

Reference research: research/home-reference-projects.md distinguishes Free My TV,
CleanMyTV and CleanYourTV, with source links and review ceilings. HOME-SPEC.md
includes original-baseline preservation and verified fallback/handover/reversal.
Their Android/LG/Samsung access paths are not adopted as Vizio support. No install,
device action, copied third-party code or background drift monitor was introduced.
Follow-up includes owner-supplied pyvizio, Vizio_SmartCast_API and vizio-smart-cast:
app/input/key contract leads for Phase B, not default-Home access. pyvizio points
to successor vizaio; neither installed. Keep native SDK, Ally REST and read-only
Console boundaries separate. No TV run or control-proxy expansion occurred.
Deeper vizaio/VizioApps review adds chipset/firmware payload selection and a later
/state_extended measurement lead. Catalog ids/client lookup setters are not TV
registration writers. Current vendor JSON not parsed (web content-type failure).
Phase A unchanged; references and TV-ATTENTION-DESIGN.md record evidence ceilings.
vizaio-conjure review in the same reference notes corroborates namespace4/app17
and suggests future injectable/validated launcher consolidation. Its generic
directory server is not a replacement for our restricted Console-owned listener.
No measured optimization, install, credential migration or changed live scope.

Owner clarification, 2026-10-23: the actual goal is customized Home with ads
removed; adding Mist was proof of concept. Replacement Home is acceptable.
HOME-SPEC.md owns current product scope/acceptance. Old tile-only exclusions are
historical, not current constraints. Native toast is secondary. No build or TV
operation was performed for this planning update.

Current project priorities live in EXECUTION-PLAN.md, "Project-only backlog,
revised 2026-10-23" (TV-P01 through TV-P06). Owner requested this separate TV backlog,
outside the normal queue. No canonical queue update or external handoff was
performed. New screenshots add an uncorroborated Vizio renderer-execution lead,
not a verified exploit/root route. Read that checkpoint for the newer session-loss
evidence: the rerun's log reports captured-session loss without STOP; its cleanup
is unconfirmed. Preserve the owner's no-stop instruction and live-test hold.

This file is a retrieval checklist, not a separate governing plan. The final
Claude message must be standalone and include original-chat context, later owner
decisions, source commits, exact task changes, hardware evidence and open tests.

## Source and original context

Start with CONTEXT.md, STATUS.md, READINESS.md, TV-ENTRY.md and this component's
README.md. CONTEXT.md names the original ChatGPT workstream and v4 Downloads
packet and preserves the original outcomes: existing Mist Console client,
not Mist App; preserve Input Lab; ready without stealing Switch HDMI; TV-native
entry goal; second-TV profile; separate Home/settings and game-latency research.

Source home: C:/Dev/!Mist/_Mist-Forge/console-tv, private repository
zerckzzyHD/_Mist-Forge, current branch view/redesign-comprehensibility.
Check current Git history rather than trusting this list as HEAD:
9a14439 implementation; 0eb5894 unavailable-photo recovery;
e798e09 visible real summary and intentionally paused supervisor;
cbb4178 startup preparation and existing pause-visibility ownership;
38646e1 approved task activation; 5466773 vendor-source TV-entry research.
No push or remote write was performed by this workstream.

## Historical task installation Claude must retain

New owner-approved task: MistConsoleTV-Summary. Current-user logon trigger,
Limited/Interactive principal, hidden built-in Windows PowerShell running the
repo's bin/start-ready.ps1 and installed Node. No stored password. Network wait
up to 120 seconds, three retries a minute apart, no execution time limit,
battery operation allowed, duplicate starts ignored. Binds only configured
192.168.4.26:4176, TV peer 192.168.4.20 plus Ally peer; actual DHCP changes fail
closed. No TV launch, pairing-token access, Vite/Tailscale/firewall changes.
Source installer defaults to plan-only and refuses existing tasks/occupied ports.

Owner expressly approved the scheduled-task exception and transition from our
foreground listener. Only the identified foreground Node process was stopped.
Registered/start-requested then observed task-hosted serving and approved JSON.
Actual relogon and restart recovery require separate evidence.

Pre-existing MistConsoleTV-Probe-HTTP was inspected only and not changed. It
served the older menu on 4174 under PID 2252. Existing Vite PID 12096 listened
on 127.0.0.1:5173. These PIDs are historical, never reuse them as stop authority.
The paused supervisor and all other mission tasks/state were left untouched.

## Where Claude must write the final record

- Retain source ownership, run instructions and actual tests here, updating the
  existing component documents instead of creating competing editable copies.
- Inspect the current private planning authority and its writer/atomic-edit
  gates before updating the canonical queue/log/decision records. This session
  has not granted permission to skip those gates or run sync/push tooling.
- Record the new installed task and exact startup behavior in the existing
  machine-local operational/startup inventory identified by that authority.
  Resolve the inventory's real current home; do not invent a path from memory.
- Record original goals, owner-approved LAN-summary exception, conditional
  network exposure scope, untouched services, current implementation evidence,
  and remaining owner-coordinated tests in their existing governing homes.
- Do not add a duplicate pause-visibility item: current queue ownership is CM9
  D-14 and MI34, cited in CONTEXT.md. No pause fact is currently carried by this
  TV allowlist; do not infer intentional pause from age or turn FAIL into PASS.
- Keep private planning and topology out of public RobCo source and outside any
  public derive/publish path. Dispatch reviews local commits and owns pushes.

## Login test baseline - historical, retained

Captured 2026-10-17 14:55:19 EDT before the coordinated sign-out:
MistConsoleTV-Summary Running; LastRunTime 2026-10-17T14:52:29-04:00;
listener PID 18464. On return verify a newer task run and new task-owned listener,
exact LAN bind, health response, approved live summary and unchanged other
services. Do not manually start the task/server before measuring the result.
Owner must save work, sign out (not merely lock), then sign back into the same
Windows account. No automated sign-out/reboot is issued by Codex.

## Login result for the final handoff

The owner subsequently returned after the coordinated login instructions.
Without a manual start, the task's LastRunTime advanced from 14:52:29 EDT to
14:57:07 EDT and new task-owned Node PID 25320 replaced PID 18464. Exact LAN
binding, health and approved summary passed. Vite returned on loopback with a
new PID and HTTP 200. The old on-demand 4174 demo stayed offline/Ready and was
left untouched. Record one observed login-readiness pass, not universal startup
or automatic-restart certification. No input-switch observation is inferred
from a server check; owner feedback and other test limits remain in STATUS.md.

## Later login feedback and corrective work

The owner confirmed same input and visible live summary after login. The raw
UTC presentation was then corrected to local 24-hour America/New_York with
EDT/EST labeling; JSON remains UTC. A one-time explicit reload applied the new
page, not a startup auto-launch. Updated clock appearance needs owner confirmation.

Record the discovered task-host orphan defect and its source fix: process-job.ps1
ties host/child lifetime through a non-inheritable Windows kill-on-close job.
Synthetic child cleanup and actual dedicated-task stop/free-port/start/health
were exercised. Do not describe automatic crash recovery or the revised helper's
next Windows login as already tested. Retain the original task inventory and
paused-supervisor context; no new paused item is needed.

## Current-document refresh evidence

Owner initially still reported UTC/another issue after the local-clock change.
Manual launch now has a fresh, strictly routed document URL to avoid reusing
the same document identity. A TV-peer-specific fixed script marker changed
from absent to observed after that launch. Record updated-script execution
separately from pending actual clock appearance; do not claim the previous
document's retention was conclusively diagnosed. The URL identifier grants no
access and is not a token. All original LAN/privacy/startup limits remain.

## Latest owner decision: Console owns TV hosting

Clock appearance is now owner-confirmed correct (local hour 15). The owner then
explicitly authorized Vite changes so TV hosting starts/stops with Mist Console.
The earlier independent-task approval is superseded for current startup behavior.
Record the retained MistConsoleTV-Summary task as Disabled, not current autostart.
No new task was added. Original probe/supervisor tasks remain untouched.

Private implementation: console-tv/vite-plugin.mjs. Public routing repo has only
a generic optional loader, documentation and regression checks. Machine settings
are in ignored, HTTP-denied .dev-companion.local.json; keep its private path and
LAN profile out of public files. Vite remains loopback; no Tailscale setting was
changed. Console's existing startup mechanism now brings both listeners up.
Standalone CLI/installer commands refuse activation to prevent independent startup.

Actual same-PID serving, both ports absent after managed Console stop, and both
back after --no-proxy restart were observed. Health and allowlisted summary passed;
the local settings HTTP route returned 403. The current script marker arrived
again from the TV. These checks do not establish a second actual login pass or
new on-TV pixel evidence. Keep historical evidence separate from current behavior.

At final handoff, include both repos' local commit IDs and gate results. Have
Claude update the existing canonical startup/decision homes under their actual
writer rules, retaining the earlier task installation/login history and this
supersession. Do not duplicate CM9 D-14 / MI34 pause-visibility queue work. Do not
resume the intentionally paused supervisor or turn its failed/stale data green.

Full public gate exited 0 after activation (4,061 Node assertions, full browser
checks including save survival and browser offline behavior). Private TV suite:
27 passed, none failed/skipped. PowerShell parse, changed-JavaScript formatting
and whitespace checks passed. Do not equate the browser offline test with an
actual TV/WAN-removal trial. Public cache r69->r70 accompanies the required served
changelog change; this is local source only, not a deployment. No push occurred.

Public routing integration is local commit fb31d46 on Robco-UOS dev. Its normal
commit hook also passed the fast gate. Private lifecycle implementation and
current evidence are recorded in the accompanying private commit; obtain its
exact ID from Git history when assembling the final handoff. Both commits stay
local for Dispatch review; no remote write is authorized.

## Power return, startup display and tailnet plan

Owner flagged TV power-cycle continuity as a major requirement. TV-ENTRY.md now
contains explicit standby/cold-boot, non-hijacking resume and TAIL1-TAIL3 milestones
with official research sources. No native Vizio Tailscale install or app-install
mechanism has been established. No gateway/Serve/ACL/firmware change was made.
Record phone->TV and TV->Console routing as distinct tests. Reconcile these notes
with the canonical queue at final handoff; no queue writer was run here.

Startup output is being revised to show existing Console /home as primary link,
keep RobCo's /terminal/ base intact, and state actual TV listener status separately
from TV display evidence. Managed child color must survive agent NO_COLOR without
mutating its parent's environment. Owner's exact popup launcher and physical
power-cycle feedback remain requested; do not infer them from a captured log.

## Explicit owner handoff requirement: labeled startup inventory

Mist must show all startup mechanisms it owns, including Windows Scheduled Tasks
and Startup-folder scripts. Label the mechanism accurately: a Startup-folder VBS
is not a scheduled task. Include enabled/disabled or unavailable state, trigger,
and what component it starts. Determine actual ownership and report inaccessible
sources as unobservable; do not present a partial scan as "all". Keep names,
credentials and private command material out of any public source or TV summary.
Check the existing canonical queue for this requirement before adding an item.
This session records the requirement; it has not implemented the inventory UI.

Owner clarified power-cycle intent: normal return to Vizio Home is expected.
The requirement is retained pairing and a future Home tile that can reconnect on
selection, not automatic page reopening or input switching on TV wake. Treat the
auto-resume watcher above as an optional earlier interpretation, not requested
current scope. Owner reports remote off/20-second/on returned to Vizio Home.
Owner visually confirmed the current startup popup looks good, then supplied
actual output showing the TV LISTENING line twice and requested only the first
copy removed. A regression check covers a listener ready before banner printing.

Post-standby saved pairing was checked without launching TV: /app/current returned
200 SUCCESS with saved auth and 403 without it. Record one retained-auth pass,
not cold-boot/factory-reset resilience or a working Home tile. Real Vite captured
startup confirmed ANSI, /home, TV LISTENING, /terminal/ base intact and HTTP home
200; normal manager then restored without proxy changes. Owner supplied actual
popup output and confirmed appearance. Duplicate early ready line removed with
regression coverage. Normal dev-server file log was stale; do not claim that log
captured new output or that its capture behavior was repaired. Public full gate
passed (4,063 Node checks and all browser checks), private TV suite 29/29 passed.

Public child-color change: local Robco-UOS dev commit 49855f6; normal commit
hook fast gate passed. This supplements the earlier fb31d46 lifecycle hook.

## Current owner priority: manual Home tile, 2026-10-17

The ultimate goal is selecting a Mist tile on the Vizio Home screen to open the
existing Mist Console TV client. Automatic opening on wake/logon is not wanted.
Actual TV screenshot research is deferred from current scope, and an Ally-made
preview is not a substitute for TV pixels. No capture or notification integration
was installed. The single standard Chrome debug-port probe (9222) was unreachable;
this does not establish that every possible TV capture method is unavailable.

After the owner's remote power cycle, the explicit saved-pairing launcher returned
API SUCCESS. The owner then confirmed: Mist visible, no PIN, projection timestamp
advances over the observation interval. This adds an observed manual relaunch and
refresh pass after standby; it does not establish a working Home-screen tile.

Optional idea only: a Pushover "Mist connected successfully" message following a
user-selected launch. Define success from observed TV client activity after that
launch, separately from listener readiness/API acceptance, and never claim pixel
verification. A real implementation must use a new request/acknowledgement rather
than the existing lifetime tvLocalTimeUISeen boolean, which can remain true after
the TV leaves the page. Avoid repeated notifications on each 15-second refresh.
The owner has not asked to configure credentials or send a test notification.
Pushover image attachments are supported (https://pushover.net/api), but screenshots
are not the current objective. Keep the final Claude handoff deferred and reconcile
these owner decisions with the existing canonical plan under its writer rules.

Home-entry follow-up: authenticated GET inspection of the real TV's settings
index, System and Cast menus found no Home-tile registration control within
those responses. Scope and primary implementation references are in TV-ENTRY.md.
No TV settings or firmware changed. Owner Home/app-list inspection is pending;
do not record a native tile as implemented or a sender-side shortcut as equivalent.
The trueX deployment guide distinguishes retail Conjure launch from Vizio-enabled
development debugging; it does not establish persistent consumer Home registration.

## New Home UI evidence and separate layout-reset issue

Owner supplied three Home/App Search photos and reports no Mist/Conjure tile.
Home Screen Apps exists as a tab; its opened panel remains unobserved. Preserve
this negative finding with its search/photo limits, not as proof of impossibility.
HOME-LAYOUT.md owns the new issue: custom app order intermittently resets while
other settings stay saved; owner reports a second same-model TV does the same.
Store Demo was read as Off on the inspected TV. No firmware or layout fix is
established; no update/reset/reorder/DNS/account/firmware change was made.
Firsthand external owner reports corroborate symptoms only, not a confirmed cause.
Check existing canonical planning ownership before adding this issue at handoff.

Owner video has now supplied Home Screen Apps panel evidence. HOME-LAYOUT.md
records its Drive ID, local file SHA256 and sampled-frame observations. Actual
edit controls: left/right move, OK save, Down remove. The footage shows Netflix
moving across Prime Video; it does not show a spontaneous persisted-layout reset
or yield reliable per-button latency. No private-tile registration control was
visible. Reuse the existing reorder as a persistence marker rather than asking
for another general navigation clip. No TV changes were issued during analysis.
A workspace-local decoder was used; no dependency/project/runtime configuration
was installed or changed. Do not confuse these owner-video crops with automated
TV-side screenshot capability or claim a reset/lag/firmware fix from this clip.

Latest layout finding: owner confirms the explicit save/immediate Home/normal
standby persistence test passes. Resets occur later, from a couple of hours to a
couple of days. Stop treating this as an unsaved edit or mandatory off/on reset;
do not keep requesting that immediate test. Preserve a baseline and collect the
next natural recurrence's timing/membership/order/update observations. No watcher,
notification, restoration, firmware change or proven reset fix exists. Keep native
Mist Home-tile capability research distinct from this delayed vendor-UI issue.

Layout regression onset: owner says the same customized arrangement stayed saved
for years, with resets starting a few months ago. Exact onset/release correlation
is unknown. Preserve this pre-Mist history alongside hours-to-days recurrence and
the second same-model TV report; do not describe the symptom as longstanding normal
behavior, a missing save, or a demonstrated consequence of this workstream.

USB/firmware research is now explicitly requested, including REA; no vendor
submission/contact is wanted. FIRMWARE-RESEARCH.md owns the current approval scope,
fresh TV component-version baseline, pinned REA source review, unplugged SD-card
status and acquisition/recovery gaps. No firmware or card write occurred. Include
these decisions in the final Claude handoff, which remains deferred until the end.

Further progress: official Firmware Information 302 yielded an older MG302/MT5691
image. FIRMWARE-RESEARCH.md owns its hash, signature checks, failed published-key
checks and REA size limitation. Owner permits tests/downloads and conditionally
accepts reset for an established benefit. Requested tracker exists at
C:/Dev/!Mist/TV-RESEARCH-TRACKER.md. Only a harmless static HTML marker was copied
to the existing FAT32 card; TV-local USB-route test awaits physical insertion.
No reset, downgrade, firmware write, shell activation or Home tile exists yet.

USB test progressed: owner photos show actual USB1 media-browser recognition.
Executed the prepared static-page launcher once after owner said ready; API
SUCCESS, actual display observation pending. Tracker and FIRMWARE-RESEARCH.md
retain that distinction. No firmware/reset operation or additional URL launch.

USB result supersedes the pending observation: owner requested one identical
repeat due to possible remote interference; repeat API SUCCESS, owner saw Vizio
Home with no marker. Current-app GET then returned APP_ID=1, NAME_SPACE=4. Exact
historical USB webpage route is unestablished; cause unknown. Media recognition
passed. No root/tile/firmware-read capability follows, and no reset was attempted.

Continued offline inspection of a second, older MG302 image also failed public
candidate decryption; see the new legacy JSON and provenance in FIRMWARE-RESEARCH.
Corrected a method mismatch: historical USB advisory uses Cast, whereas first
attempts used Conjure. Cast is reachable; isolated PyChromecast launched DashCast.
First owner observation was loading only. Corrected catt's documented startup
readiness race and obtained receiver URL echo after Application ready. Actual
marker rendering remains pending. No firmware/root/debug access is established.

Latest Cast results supersede pending marker rendering: owner saw loading after
the echoed iframe USB request, then black after direct USB navigation. Corrected
a mistaken interpretation of direct-mode callback timeouts: receiver code returns
before echoing in that mode. Sender now distinguishes socket write from reply and
display. A same-mode LAN Mist control returned HTTP 200 and was sent; owner screen
result pending. All changes/evidence remain reversible local research only.

Control result supersedes that pending state: owner reports LAN control stayed
black too, so Cast direct navigation does not isolate USB access. Returned via
the original Conjure launcher: API SUCCESS and owner confirmed Mist visible again.
Preserve the original client's success alongside research ceilings. No firmware
plaintext/root/native tile/reset remedy was established. Do not repeat the same
USB/Cast tests without new evidence or infer that a factory reset unlocks software.

Hard owner scope correction: SOFTWARE ONLY. No opening the TV, soldering,
UART/JTAG/eMMC hardware access, adapters, board purchases or modification. Earlier
hardware/service-access suggestions are superseded. Keep this prominently in the
eventual Claude handoff. No hardware action occurred or board identity was proven.

Software-only follow-up lives in SOFTWARE-ENTRY-REVIEW.md: live 345-entry Vizio
feeds, manufacturer launcher source and explicit distinction between transient
launch and persistent replacement of an existing tile such as Viziogram. Owner
approved one specific DEBUG=1 launch and read-only checks, followed by normal
relaunch. Executed: debug API SUCCESS; ports 9555/9222 did not respond; normal API
SUCCESS; both ports still timed out afterward. No debugger, writable Home mapping
or app replacement is established. Do not confuse sender localStorage history
with TV tile persistence, or claim DEBUG=1 permanently enables development mode.

Continued software path: optional in-renderer metadata probe, documented in
SOFTWARE-ENTRY-REVIEW.md. New src/capabilities.mjs and exact #mist-capabilities
branch reflect names/types only, no getters/native calls, values, SDK load or
network result collection. Normal summary remains default. All 31 private tests
passed. Existing Console restarted through its manager with --no-proxy after
public tree clean check; actual HTTP/CSP checked. Probe launch API SUCCESS;
owner display/metadata pending. No root/debug/native tile conclusion follows.


## Owner photos: all eight metadata pages observed

The owner supplied nine photos covering pages 1 through 8. The diagnostic page
rendered and pagination operated. The bounded matched-name list contained External,
external and standard WebKit APIs, with no VIZIO/conjure/bridge root shown. This is
not a complete enumeration of native access or evidence that no bridge exists.
External was a function with constructor metadata; external was an accessor whose
value was intentionally not read. The probe did not inspect External.prototype's
members. Standard webkitRequestFileSystem names do not establish OS/USB/root access.
Some wrapped output exceeded the visible screen; do not request these eight pages
again. Photos remain in the task attachment area, outside the source repository.

A focused revision omits standard WebKit-prefixed globals (retaining the exact
webkit namespace if present), includes data-descriptor constructor prototype
member metadata, wraps text at 72 characters, and uses 12 lines per page. No
constructor, method or accessor invocation, SDK loading, network collection or
CSP change was added. Local tests are recorded in the following progress entry.

Companion-source follow-up: public search did not yield the actual library source.
One inferred CDN candidate, https://scfs.vizio.com/scfs/cl/js/vizio-companion-lib.js,
returned HTTP 403 from the Ally. This inferred public URL is not the documented
TV-local localhost:12345 URL; its failure establishes no TV-local result.
The public integration article remains the source for that local filename:
https://www.tothenew.com/blog/vizio-smart-tv-a-comprehensive-guide-to-start-initial-app-development/
No SDK was loaded or executed. Reading its text inside the renderer would require
review of CORS and the existing self-only connect-src policy. Do not weaken that
policy or execute the unreviewed SDK as a shortcut. Home tile, app replacement,
firmware plaintext and a remedy for app-order resets remain unestablished.


Focused revision execution: npm run check passed; node --check on capabilities.mjs
passed; all 32 tests passed, zero failures. Prettier ran on both changed JS files;
git diff --check passed. Public dev tree was clean before canonical stop/start
with --no-proxy (new PID 9816). HTTP 200 returned the focused revision with the
unchanged restrictive CSP. Executed launch-capability-check.ps1 once: API SUCCESS.
Owner observation of this revised probe is pending. No native methods/accessors
were invoked by the implementation; actual native prototype contents are unknown.


## Focused probe owner result: two pages observed

Two owner photos show pages 1 and 2 of the focused probe. External.prototype
exposes AddSearchProvider and IsSearchProviderInstalled, both typed function.
external remains an accessor (not read); page 2 contains only the continuation
No member metadata read. No additional matching global is displayed.
Chromium's published HTML interface definition contains the same two External
methods. This supports interpreting these names as browser compatibility APIs,
not evidence of a Vizio native app-installation or Home-tile interface. No method
was called and the TV's implementation/body was not obtained. Absence of other
matched own names does not prove absence of every native interface.
Primary source:
https://chromium.googlesource.com/chromium/src/%2B/5de2157f1e7fb9b16f92472fcdf635911f478495/third_party/WebKit/LayoutTests/external/wpt/interfaces/html.idl

Do not request more photos of this metadata probe or repeat it without a new
hypothesis. Next proposed experiment is research/sdk-source-read-plan.md;
it is a proposal, not an active route, CSP exception or executed network request.


## Owner approval and prepared text-only implementation

Owner explicitly replied Yes, I approve to the bounded SDK source-read proposal.
Added the exact temporary /research/sdk-source-read document/policy exception;
normal document CSP remains unchanged. Browser fetch uses redirect:error,
credentials:omit, mode:cors, no-referrer, AbortController ten-second timeout and
bounded streaming of at most one MiB. Missing safety features stop before fetch;
missing stream support aborts without reading. No fallback, retry or SDK execution.
Response stays in renderer memory, then is discarded; only HTTP status, byte count
and up to twelve lexical function-name labels appear. Labels may match comments
or strings; they are not a verified SDK API inventory. Nothing is sent back or
saved. No device identifiers/values/raw source are shown. Launch script uses the
same paired APP_ID17/namespace4 and exact fixed diagnostic route, no DEBUG.
All 37 tests passed, syntax checks passed, Prettier ran, git diff --check passed.
Actual launch and owner result are not yet recorded. After observation, restore
normal summary and remove the temporary route/import/policy before restarting.


SDK-text experiment launch: public dev tree was clean. Canonical manager stop/start
with --no-proxy brought Console up as PID 23704. HTTP 200 observed on normal and
exact diagnostic document; inspected returned policies: normal connect-src self,
diagnostic only the fixed localhost script. Executed launch-sdk-source-read.ps1
once: API RESULT SUCCESS. This is launch acceptance, not proof of file access,
fetch completion or visible output. Awaiting the owner's single screen result.
The temporary route is active pending observation and must then be removed.


## Text-read owner result and expanded software authorization

Owner photo shows TEXT READ: HTTP 200; 299586 bytes. The twelve displayed lexical
function labels were minified (Qe, W, T, E, D, O, at, ot, st, ct, lt, ut), not a
usable API inventory. This establishes a readable TV-local response under the
bounded fetch implementation; raw source was not sent back, saved or executed.
It does not establish Home registration or root access.

Owner then explicitly authorized native method calls and continued investigation.
This expands the earlier metadata/text-only testing scope to SDK initialization
and software interface investigation. Hardware, firmware/reset/write gates,
no publishing/vendor submission and private-data restrictions remain in force.

Replaced the active text-read route with /research/sdk-interfaces. The former
route now returns 404. New document loads the exact TV-local companion script,
registers readiness handling before loading, then inspects descriptor metadata.
VIZIO roots and relevant app/Home/launch/install/input/configuration method names
are ordered first. Script initialization executes; no additional unknown method
is explicitly invoked by our probe. The SDK's internal initialization is not
claimed side-effect-free. Values, identifiers and native return data are omitted.
Diagnostic CSP permits inline script and that one local script path; connect-src
none blocks document connections. This may prevent SDK initialization/handshake,
so a missing ready event/root would not establish absence of those interfaces.
Normal summary CSP remains self-only. No report collector, raw SDK storage,
telemetry upload, new listener or pairing. Old text-reader code is retained as
inert historical research, not imported by the server. Temporary diagnostic route
must be retired after recording the result. Final Claude handoff remains deferred.


SDK interface launch execution: full 38-test suite passed; after changing only
metadata ordering, the SDK-probe test passed again and PowerShell launcher parsed.
Public tree clean. Canonical restart --no-proxy yielded PID 18964. HTTP checks:
normal page 200 with original self-only policy; SDK-interface page 200 with exact
script-src exception and connect-src none; retired text-read route 404.
Executed launch-sdk-interfaces.ps1 once: API RESULT SUCCESS. Owner actual SDK
load/readiness/interface results pending. No Tailscale/startup setting changed.


## Owner SDK photographs: all nine pages observed

Owner supplied pages 1-9. SDK script loaded true, load error false, ready event
false. VIZIO and VIZIO_MODULES objects are present. Displayed VIZIO members include
getConfigVersion, getCurrentApp/Async, getInputUIList, getConfigProperty/Async,
activeAppObject accessor and Mojo/_debug objects. VIZIO_MODULES exposes App,
System, Device, User, Account, Bluetooth, Captions, TextToSpeech, Tuner and _debug.
Auth-token/device-identity method names also appear, but none was invoked or its
value read. The mere presence of wrappers does not prove a native binding works.
The blocked connect-src policy could affect readiness. No mutation API tested.

Found a measurement ceiling: initial describeNativeInterfaces caps each root at
80 members before relevant-name ordering. Later alphabetical names can be absent.
Do not infer no register/set/launch method from the nine-page report. Implemented
fixed direct module inspection: VIZIO (relevant app/Home/config/input names),
VIZIO.Mojo, VIZIO._debug, VIZIO_MODULES.App/System/_debug. Data descriptors only,
no getters or bodies; emits own/selected/shown counts and caps 120 selected names
per target. No prototype/inherited-member completeness is claimed.

Under the owner's expanded native-testing approval, revised probe calls only
getConfigVersion once after script load, with a callback. A strict numeric-version
format may be displayed; other replies expose type only, values withheld. Throws
omit details; undefined return leaves callback pending. Metadata rescans do not
repeat the getter. No auth token, identity, input mutation, install, settings write,
factory reset or firmware update method is called. Diagnostic connections remain
blocked; normal summary policy unchanged. Tests cover >80-name filtering,
getter/privacy non-invocation, one-call behavior and withheld arbitrary values.
All 40 tests passed; syntax, Prettier and git whitespace checks passed.


Targeted-module execution: public dev tree clean; canonical restart --no-proxy
new PID 26460. HTTP 200 confirmed revised diagnostic contains the one-call getter.
One launch-sdk-interfaces.ps1 invocation returned API SUCCESS. Its console message
still described the prior no-additional-method revision; corrected that text after
launch without repeating the launch. Owner actual getter/module result pending.
Temporary diagnostic route/policy remains active for observation; no native reply
is yet observed. No additional network collection was introduced.


## Owner photos reveal old document retained

Four new photos show the previous nine-page UI: original SDK initialization
caption, no version-getter line and no module counts. Ready event now reads true
on page 1. This updates the readiness observation for that older document, not
proof of a successful native version getter or targeted-module scan. Actual getter
execution remains UNCONFIRMED despite the accepted previous launch.

Launcher reused /research/sdk-interfaces. Suspected same-URL retention/cache is
not proven; corrected the avoidable URL reuse using a fresh 32-hex document path
under that diagnostic route, still serving only the fixed page and same policy.
Added visible MIST SDK MODULES / 2 title so owner evidence can identify revision.
Tests check fixed fresh-ID content equality, malformed path refusal and unchanged
normal policy. All 40 tests passed, syntax/format/whitespace checks passed. No
native method repeated merely by metadata rescan; a new document attempts the one
version getter. No Home/firmware/system setting changed.


## Revision 2 owner screen and timing correction

Owner photo confirms MIST SDK MODULES / 2, page 1 of 14. SDK loaded true, ready
false, load error false; getConfigVersion called once, awaiting callback. Root
VIZIO own-name count 207; filtered/selected/shown count 45. This establishes
execution reached the method call without a synchronous exception; no callback
reply, config version value or complete native connection is established.

The implementation invoked the version getter on script.onload, before the
separate SDK-ready event. Early invocation is a possible reason for the pending
callback, not a proven diagnosis. Revision 3 invokes the getter only upon the
ready event, still at most once per document; repeated ready events and OK do not
repeat it. No fallback call if readiness never arrives. No network policy change.

Reduced owner capture burden: compact comma-separated names, () denotes function
metadata rather than a call; module order App, Mojo, debug, System, relevant root.
System selection now focuses on app/Home/input/config/debug/version/connection
names; auth/token/HomeKit names excluded from this scoped report. This is a filter,
not a complete SDK audit. Counts still disclose total/selected/shown. Data values
and function bodies remain omitted. Header MIST SDK MODULES / 3, fresh URL ID.
All 40 tests passed, including zero getter calls before readiness and one after
repeated readiness; syntax, formatting and whitespace checks passed.


## Revision 3 owner result: pages 1 and 2 of 4

Owner photos confirm MIST SDK MODULES / 3; SDK loaded true, ready true, load error
false. Version callback handler ran with its first argument undefined. No actual
version value was observed. The handler currently captures only its first
argument: additional callback arguments were neither inspected nor recorded.
An error-first callback convention is a hypothesis, not established behavior.
Do not call this a failed native read or a verified native-version response.
Do not repeat the getter until callback shape/signature is handled deliberately.

App module own/selected/shown counts 14/14/14. Listed functions:
exitApplication, getAppInfo, getAppVisibilityState, getCurrentAppInfo,
getIsAppInBackground, getIsAppVisible, getIsCurrentVizioAppByCname,
getVizioAppInfoByCname, launchAmbient, launchApp, subscribeToAppOverlayDisplayed,
subscribeToAppVisibilityChange, subscribeToAppVisibilityStateChange,
subscribeToCurrentAppChange. These names identify lifecycle/lookup entry points;
no persistent Home registration was demonstrated. They were not invoked here.

VIZIO.Mojo own/selected/shown counts 3/3/3: mojoStream$ object, send function,
sendMojoCommand function. No command/message sent. Both _debug objects show
8/8/8: launchApiTestApp, account object, getPartnerReport, getReport,
getStartupReport, getSummary, setVerboseLogging, telemetry object. No report,
identity/account, telemetry, logging setter or test-app launch invoked.
The existence of launchApiTestApp is a new source/argument-inspection lead, not
permission to assume a debugger, registration tool or firmware mechanism exists.

System module own count 72, selected/shown 25/25. Page 2 ends partway through its
list (getConfigProperty, getInputLists, getIsNetworkConfigured, getScCon... clipped
by pagination). Pages 3-4 are still needed for the remaining method-name evidence.
Preserve current document; no restart/relaunch/new native call while owner captures
remaining two pages. The temporary diagnostic route/policy remains active; normal
summary route remains unchanged. Current private commit before this note e0efade;
40 tests previously passed on that code. This update changes documentation only.


## Revision 3 pages 3 and 4 received

Owner supplied remaining pages. System selected methods include getScConfigVersion,
setPartnerAppFailed/Ready, subscribeToAppConfigChange, input context/enabled/list/
name/visibility subscriptions, version/network getters and setBinaryVersion.
Root relevant names include launchApp, launchApplication, launchLink, launchCastApp,
launchCastAppWithChannel, launchAmbient, gotoPreviousApp, registerEvents,
registerKeyEvents, app/input listeners and partner-ready/failed methods. All are
method-name observations only. No Home tile installer, writable catalog API,
settings mutation or input mapping write is established. Do not invoke a setter
or launch primitive by guessing its argument meaning.

Revision 4 inspects four fixed functions: VIZIO.getConfigVersion,
System.getScConfigVersion, debug.launchApiTestApp, Mojo.sendMojoCommand. Reflection
uses data descriptors and Function.prototype.toString; full bodies are never
shown/saved/uploaded. Strings/templates/comments removed before bounded lexical
property-call references are extracted. Reports declared arity and at most eight
references per function. Lexical references are hints, not verified API call paths;
no inspected function is executed by that inspector. Native-code wrappers may
provide no useful references. No raw SDK copy, commands, URLs or device data logged.

Version callback now records total argument count and types of at most first three
arguments; accepts only strict version-shaped primitive text. Arbitrary values and
object properties remain unread/withheld. Handles potential additional argument
positions without assuming an error-first convention; synchronous returns labeled
separately and do not overwrite a synchronous callback result. Once-after-ready
version invocation retained. No test-app launch, Mojo command, auth/identity call,
setter or firmware action added. No policy/listener/Tailscale/startup change.
New visible revision MIST SDK CALL SHAPES / 4, fresh document ID. All 42 tests
passed; syntax, formatting and whitespace checks passed. Actual launch pending.


## Revision 4 observed; direct native test-app command authorized

Owner photo confirms revision 4, ready true, load error false; version callback
exactly one argument of type undefined. This rules out an unrecorded second
argument for that specific observed callback. It does not identify the backend
reason or prove native binding success. Declared arities: root getConfigVersion 1,
System getScConfigVersion 0, debug launchApiTestApp 0, Mojo sendMojoCommand 0.
Observed lexical references: root j._tlm, _.nil, a.then; System j._tmm; Mojo j._tlm;
no references extracted from launchApiTestApp. These may be wrapper/telemetry or
stub behavior; no-body/static reference analysis cannot distinguish conclusively.

Owner again explicitly authorized commands, then asked whether further permission
was needed. Explained no additional authorization needed for current reversible
SDK/native tests; destructive/broader-exposure steps remain separate. Prepared
revision 5, MIST SDK TEST APP / 5, to call only VIZIO._debug.launchApiTestApp with
zero arguments once after readiness. Repeated ready events do not repeat it.
No version getter, arbitrary Mojo send, settings/firmware/reset/install request,
private value collection, new network-policy exception or additional listener.
SDK initialization remains executed. Return type alone cannot prove effective
launch; throws have no exception detail and no retry. If a new interface opens,
record owner observation before further interaction; do not submit forms.
Normal summary restoration remains available through bin/launch.ps1.

All 44 tests passed, including readiness gating, correct receiver/zero args,
one-call guard, return-value non-disclosure, missing method and throw/no retry;
syntax/format/whitespace checks passed. Actual native call/screen result pending.


## Revision 5 owner result: object returned, diagnostic stayed visible

Owner photo confirms SDK loaded/ready true, launchApiTestApp called once, return
type object; our diagnostic remains on screen. The implementation did not observe
that returned operation. Do not infer the command completed, failed or was a no-op.
No destructive command or settings mutation was requested by the probe.

New hypothesis: returned value may be a Promise or cold Observable. RxJS primary
reference describes deferred execution beginning on subscription:
https://rxjs.dev/guide/observable
This is not proof Vizio returned an RxJS Observable. Revision 6 detects data-method
subscribe/then descriptors across at most four object/prototype levels, never
invoking accessor getters. If subscribe exists, invokes it once with next/error/
complete callbacks, which can start the authorized test-app operation. Otherwise,
if then exists, attaches fulfillment/rejection handling once. No fallback from a
failed subscribe to then, no automatic retry and no arbitrary command send.
Opaque objects remain opaque. Values are not serialized/shown/saved/uploaded.
Emissions expose type only; errors map to fixed broad categories from message
text in memory, never raw contents. Bounded four-message display history.

This new handling justifies one fresh test-app invocation: prior call's result
could not be recovered from the existing document without another script entry.
Once-after-readiness and repeated-ready guards retain one invocation/subscription
per explicitly launched document. No firmware/reset/install or system setting
request added. CSP and listener remain unchanged. Revision label
MIST SDK COMMAND OUTCOME / 6. All 48 tests passed, including cold subscription,
promise rejection privacy, non-invoked accessors and integrated one-call/one-
subscription handling. Syntax, formatting and git whitespace checks passed.
Actual return interface/settlement and test-app display remain pending.


## Owner additions for final Claude reconciliation (2026-10-17)

Keep this running handoff current; final copy-paste Claude handoff is still deferred
until the end of Codex work. Include earlier source conversation, approvals,
scheduled-task/Startup-folder transitions, Vite coupling, LAN exposure contract,
SDK/native experiments, measured ceilings and any temporary routes awaiting cleanup.

1. LAN TV support must be included in the Vite/Tailscale extraction. Treat this as
   the existing Mist Console's client/transport lifecycle, not a separate Mist app.
   Carry the private aggregate projection, exact bind/peer/Host restrictions,
   start/stop coupling, startup ownership and truthful connection evidence into
   the extraction plan. Preserve the existing private Console/tailnet boundary.
2. NEW OWNER REQUEST: configure the Tailscale connection from inside Mist. This is
   a planning/queue request, not an implemented or tested feature, and not present
   authorization to alter live Tailscale configuration during TV research. Claude
   must reconcile it into the authoritative queue/extraction plan, define which
   connection settings/actions are supported, and separate observed connection
   state from desired configuration. Credentials/auth flows must not be written
   into source or exposed by the LAN TV client. Do not silently turn on Funnel.
3. Retain earlier handoff requests: labeled inventory of all Mist scheduled tasks
   AND Startup-folder entries; pause-aware display already maps to CM9 D-14/MI34
   and must not be duplicated as a new queue item.

Read-only queue search this turn: searched canonical QUEUE.md for Tailscale/Vite
with nearby extraction/configuration/connection/serve terms (52 matching lines),
plus direct extraction/configuration phrases. Found prior dev-server/route-table
history including closed DS8 around line 51205, but did not locate an explicit
in-Mist Tailscale connection-configuration item in that bounded search. This is
not a full corpus uniqueness certification. No new queue ID assigned; canonical
QUEUE.md untouched. Claude/Dispatch must check linked extraction plans/other
records before deciding whether to extend an existing item or add one.

Latest runtime note: revision 6 fresh diagnostic HTTP 200, launch API SUCCESS,
canonical restart --no-proxy PID 17892, local commit 5b9cd48. Owner photo now
confirms Promise-like return rejected in category other; diagnostic stayed
visible. No test app launch established. Error contents were withheld; need more
bounded diagnostic detail, not blind command retries. Temporary diagnostic route
still active. No Tailscale, startup, supervisor, firmware or public-repo setting
change was made for these SDK experiments.


## Error diagnostic prepared after observed Promise rejection

Revision 7 adds inspected error-field types (fixed message/code/status/error/reason/
name descriptors only, no getters), bounded integer code/status values and fixed
classification categories. It normalizes underscore/hyphen/camel-case wording in
memory and inspects one nested error field. Raw text, arbitrary object values,
identifiers, tokens and unknown payload fields remain withheld. These categories
are keyword matches, not a verified manufacturer error-code map.

Browser securitypolicyviolation events recorded on the diagnostic page, limited
three messages, showing directive plus loopback origin only; paths, queries,
credentials and non-loopback origins withheld. This can identify an observed CSP
block instead of guessing more ports/relaxing the policy. No CSP relaxation added;
connect-src remains none. Absence of an observed event is not proof no transport
failure/security restriction exists. The command still runs once after readiness,
with one then/subscribe attachment and no automatic retries. This instrumented
retest is for new error/policy evidence, not repeated blind command attempts.

MIST SDK ERROR DIAGNOSTIC / 7. All 50 tests passed, including structured error
privacy/accessor avoidance and loopback-origin-only policy reporting; syntax,
formatting and whitespace checks passed. Launch and observed error details pending.
Owner planning additions are recorded in the preceding HANDOFF-NOTES block; do not
lose LAN extraction scope or Mist Tailscale configuration while pursuing TV SDK.


## Revision 7 owner result: observed TV-loopback CSP block

Photo confirms SDK loaded/ready true, one launchApiTestApp call, Promise-like
rejection. Error is object with own message[string]; no other inspected fields
or numeric codes shown. Three connect-src violations target http://127.0.0.1:7346.
This establishes our diagnostic blocked a transport used by the SDK. It does not
prove that transport is the sole cause of rejection, that the service is reachable,
or that this TV authorizes the test app. Earlier undefined getter/rejection
results cannot be used as proof of a TV-native lockout; SDK ready does not imply
its backend bridge is connected.

Owner repeatedly authorized software/native commands and reversible tests. Under
that scope, revision 8 permits only the observed TV-loopback HTTP origin on the
temporary diagnostic document: connect-src http://127.0.0.1:7346. No wildcard,
other port, WebSocket, unsafe-eval or same-origin data read added. Normal summary
retains connect-src self. Script-src still only inline and the exact TV-local SDK
script. This changes browser egress policy for the diagnostic, not a socket bind,
firewall, router, Tailscale or TV LAN exposure rule. SDK internal initialization
can now reach that origin; no additional arbitrary/native command is introduced.

Run the same identified zero-argument test-app command once after readiness with
Promise/Observable outcome handling and policy diagnostics. This is a retest after
a measured policy correction, not a blind retry. Visible MIST SDK LOCAL BRIDGE / 8,
fresh document ID. Temporary route/exception must be removed after research.
All 50 tests passed; server tests assert exact new diagnostic connection origin
and absence of that origin on normal documents. Syntax, formatting/whitespace
checks passed. Actual native outcome with the permitted transport is pending.


## Resume after usage limit; revision 9 read-only bridge check

Owner requested sustained software investigation of SDKs/Conjure/DashCast and a
real Home tile. No new hardware/submission/publication scope. Interruption save
149c862 contains the partially written revision-9 module and server import; both
repos were clean before resuming. Preserve this history, no reset/rewrite.

Latest revision-8 owner photo is Vizio Home. Read-only /app/current subsequently
reported namespace 4/app 1. This establishes Home became current after the observed
launch sequence, not a successful native test-app interface. No test-app response
was captured after page navigation. Stop repeating that launch without new evidence.

Finished revision 9: one System.getScConfigVersion call after SDK readiness,
handling Promise-like or Observable-like operation with descriptor-only method
lookup. Only strict primitive version text or four named version data fields are
eligible for display; accessors, arbitrary response values and errors stay withheld
or use prior bounded error metadata. No app launch, setter, auth/identity call.
Also inspects the test-app wrapper shape without invoking it: literals/comments
and numeric literals removed, max 240 characters, no raw SDK storage/transfer.
This may clarify its implementation but is not a complete source audit.
TV-loopback policy from revision 8 retained; normal summary unchanged.

All 52 tests passed, including once-after-ready version read, no debug launch,
accessor non-invocation/private value non-disclosure and serialized script parse.
Syntax, Prettier and git whitespace checks passed. Actual revision-9 launch and
native version result pending. Extraction/Tailscale planning requests remain in
HANDOFF-NOTES; final Claude handoff remains deferred.


Revision 9 execution: public tree clean; canonical stop/start --no-proxy PID 1836.
Fresh diagnostic HTTP 200 with revision 9, launch API SUCCESS. Actual System
version result pending owner observation. A Prettier-only server import reflow
was omitted from the preceding explicit staging list and is included in this
follow-up commit; no unrelated work was present. No native app command repeated.

Additional primary sender-library review (2026-10-17):
https://github.com/get-air/vizio README describes Conjure launch as APP_ID17/NS4,
URL in MESSAGE, and explicitly distinguishes it from permanent install/Home tile.
https://github.com/heathbar/vizio-smart-cast provides sender controls and app
launch. These are useful implementation comparisons, not evidence of another
persistent registration interface on this TV. No package installed or executed.
Historical ViziOwn sc-config/VirtualInputs editing remains a root/filesystem route,
not a feature unlocked merely by loading the companion SDK. No firmware/root access
is claimed. Broader read-only source/entry research continues while TV result is
pending. User was asked whether to approve a temporary restricted diagnostic report
channel to reduce photo loops; no such channel has been activated or data sent.


## Review branches and restricted return channel explicitly authorized

Owner created review branches and explicitly authorized commits and pushes there,
then explicitly included existing uncommitted handoff edits. This narrowly
supersedes the earlier no-push instruction for these two named review branches;
normal branches/public paths remain untouched. Forge origin verified PRIVATE by
GitHub; remote review/mist-console-tv-20261017 was 149c862, an ancestor of the
current work by two commits. Created local tracking branch at existing current
HEAD, preserving history, no merge/rebase/cherry-pick/reset/force operation.

Handoff origin verified PRIVATE; on review/agent-handoff-20261017, owner-authorized
three existing Claude Markdown updates committed 2b819e6 and pushed. ls-remote
confirmed 2b819e6a3e7dec0c4d32b523b3240655c8b96d11 equals local HEAD. An oddly named
untracked file is a 34364-byte/670-line captured less help screen. Preserved on
disk, excluded as accidental terminal output; no deletion/stash/blanket staging.
These supplied document claims were archived for review, not independently certified.

Owner expressly approved a temporary TV-to-Ally diagnostic channel limited to SDK
method names, fixed error categories, response types and version strings, with no
raw SDK, tokens, IDs, accounts or private Console payload. This extends the earlier
aggregate-only LAN exception for temporary research. Implementation /research/report:
POST only from configured TV socket and exact existing document Origin/Host;
application/json, explicit bounded Content-Length <=32768, no chunked upload.
Schema rejects unknown keys, arbitrary strings/type coercions and disallowed
scopes. Own descriptor metadata only; accessor values never invoked. Version
format now permits known PROD/DEV/TEST prefixes plus bounded numeric segments.
The run ID is the existing 32-hex document cache identity, not an auth token.
Sequence values prevent older snapshots replacing newer ones. Latest validated
report stays in process memory; GET under the existing peer/Host guard returns
only validated metadata and a server timestamp. No file write, generic command
executor, raw source collection, new listener or CORS relaxation. Diagnostic CSP
adds self for this one report route; original summary CSP remains unchanged.

Revision-9 owner photo: System getter returned string, value withheld by previous
strict format. SDK ready true. Debug wrapper shape ()=>hw() observed without
invocation. No verified version value from that photo. Revision 10 sends typed
method inventory plus the same one read-only version operation to Ally. No app
launch, setter or identity/auth getter. All 58 tests passed (real delivered script
executed in test VM), syntax/format/whitespace checks passed. Actual TV report is
pending. Temporary diagnostic route/channel/policy must be removed after research.
Final Claude handoff remains deferred; ongoing notes stay here as source record.


## Live restricted return channel verified (revision 10)

Full 58-test suite passed. Forge review push 1f935543c7960bec0ce18f90dc457d8ee5470ee1
was verified via ls-remote after ordinary non-force push. Public dev tree clean;
canonical restart --no-proxy PID 21508. Diagnostic HTTP 200; report initially
available false. One launch API SUCCESS, run 5b323317324e4581aaddbed4d41f7595.
GET /research/report then returned matching run, sequence 3, loaded/ready true,
state resolved, responseType string, version prod 64.37. This is actual backend
version response + TV-to-Ally channel evidence, not only API acceptance or a unit
fixture. SDK method snapshot saved as research/sdk-diagnostic-20261017.json,
validated metadata only; no raw SDK/device payload or credentials.

Inventory cap 256 reached: App 14, System 72, Mojo 3, debug 8, VIZIO 159. The
module inventories shown precede the capped root inventory; do not claim all root
methods captured. System exposes getTvStoreProperties/getTvStoreProperty/
setTvStoreProperty as further source-inspection leads; none was invoked. A generic
store setter is not established as a Home registration interface. No arbitrary
store values, account data, network names or device IDs have been read/returned.

Primary lab-service documentation found:
https://docs.tvlabs.ai/platform/platforms/smartcast
It describes ZIP Conjure sideloading and CDP9555 in TV Labs managed sessions.
It does not give a verified ZIP install endpoint/body or establish that the same
capability/native Home persistence exists on this retail TV. No lab account,
submission, CLI installation or new ZIP/install command performed. Read-only DIAL
service-description request /ssdp/device-desc.xml on existing8008 returned HTTP
error; not proof no DIAL transport exists. No discovery scan/app-ID fuzzing.

Next useful step requires static SDK source-level analysis, because inspected
wrapper ()=>hw() and native store/RPC methods do not expose implementation through
name metadata. Prepared research/sdk-source-capture-plan.md: one fixed SDK fetch,
one TV-origin upload to same listener, memory-only on Ally, no raw source files/
Git publication or execution on Ally, ten-minute expiry. Current approved return
channel explicitly excludes raw SDK, so this separate request is pending; no
source capture route has been activated. Final Claude handoff remains deferred.


## Approved memory-only SDK capture and structural results

Owner approved the exact one-resource memory-only capture. Revision 11 launch API
returned SUCCESS; the TV uploaded 299586 UTF-8 bytes (299500 JS characters), SHA-256
9579ff1eeca0af2c9c1ce095480048dace96d509e6814539a390def3d4c88029.
Acorn parsed it in a separate local process without executing/evaluating/importing
SDK code. No raw source file or raw source output was produced. Sanitized output:
research/sdk-static-findings-20261017.json. The analyzer saves no source itself;
its dependency is the already-installed public app Acorn parser, not a new install.

Observed mapping in this exact SDK:
- System.getScConfigVersion -> pv -> ta.get (the version store derived from SC_INFO).
- getConfigProperty -> R_ -> ba.getProperty; configuration reads use
  app/config/get_property or app/config/get_properties.
- getTvStoreProperty -> Q_ -> rm.getProperty; plural getter uses the same helper.
  Store reads/writes map to app/store/get and app/store/set. Setter receives key
  and value. No store method was invoked and its scope/ownership is not proven
  to be the Home catalog. Do not treat the generic setter as an installer.
- App.launchApp -> ob -> ll.launchApp -> Jr.request with app/launch and VALUE.
- launchApiTestApp -> hw: gathers debug/config/version/current-app inputs,
  constructs URLSearchParams, has optional conditional early return, then calls
  window.location.replace. apiTestApp.html and a TV-local loopback resource prefix
  appear. This is browser navigation, not observed persistent app registration.
- Full captured-text case-insensitive substring counts: install 0, tile 0,
  favorite 0, VirtualInputs 0, HtmlAppURI 0, DashCast 0; register 20. Identifier
  matches include key-event and identity/session/display registration names;
  those names do not establish Home tile registration. Counts are lexical bounds,
  not proof that these capabilities are absent from firmware or other resources.

Raw bytes were released through DELETE (HTTP 204); metadata immediately showed
captured=true, available=false. Buffer cleanup is not a secure-erasure claim.
Capture routes were then removed from active server code; historical capture
module/launcher retained as evidence. No raw SDK Git upload, configuration values,
identity/account/token data, store writes, test-app repeat, or firmware work.

TV Labs docs were refreshed: ZIP sideloading remains described only for managed
TV Labs sessions without a concrete retail install endpoint/body. Its SmartCast
WebDriver GET/PUT escape hatch is an existing Conjure proxy, not a new persistence
mechanism. Sources: https://docs.tvlabs.ai/platform/platforms/smartcast and
https://docs.tvlabs.ai/platform/integrations/appium/smartcast-webdriver .
No vendor/lab contact or account, build submission or guessed install write.

Native Home tile remains unresolved. Useful next scope is a concrete Home/catalog
consumer or a documented installer contract; avoid repeating debug launches or
blind store writes. Running Claude progress pointer retains LAN extraction,
in-Mist Tailscale configuration request, startup inventory and evidence ceilings.

Cleanup verification: canonical no-proxy restart PID18496; both sdk-source-status
and sdk-source-once returned HTTP404 from the live listener. Normal client launch
API SUCCESS, health HTTP200 with tvLocalTimeUISeen=true after launch. This is
script activity, not a new visual confirmation. All61 tests, syntax and whitespace
checks passed. One combined restart/launch command was automatically blocked
without a stated reason; individual lifecycle and launch operations succeeded.
Owner additionally authorized hands-on reversible TV commands; no-brick boundary
continues to exclude unvalidated firmware/reset/storage writes.


## Store getter and direct local test UI (revision 12)

Owner reiterated hands-on TV function/command permission with a no-brick boundary.
The new fixed-key probe invokes System.getTvStoreProperty exactly once for
com.mist.console.tv.research.absent, never the setter. Result values and rejection
text are withheld; only the approved response type/fixed categories return to Ally.
The report schema adds only fixed probe label sdk-store-12, no new data fields.
Delivered-page tests check one call despite repeated ready events, no writes, no
result/rejection text disclosure and preserved final state after script.onload.
All63 tests plus syntax, formatting and whitespace checks passed. PowerShell
launcher parsed without errors. Public dev tree clean before canonical no-proxy
restart PID17452; launch API SUCCESS. Matching run7b9d84100d3b487794a418efe66cff67
returned loaded/ready=true, resolved, responseType=undefined. Saved only validated
metadata in research/sdk-store-diagnostic-20261017.json. This is a usable getter
response for the unused key, not evidence of writable Home catalog ownership.
No store write/cleanup contract is established; no test setter was called.

The captured helper referenced apiTestApp.html and TV-loopback resource prefix
http://127.0.0.1:12345/scfs/cl/js/. A direct Conjure navigation to their combination
was requested once with the existing durable token; API SUCCESS. The path is an
inference from those static pieces, not a verified file listing. No source capture,
settings command, firmware request or developer-mode toggle accompanies it.
Owner UI observation is pending; do not claim the test interface rendered.

Primary-source refresh bounded to local Conjure/SDK/Home entry points returned
sender APIs and managed TV Labs sideloading again; no retail persistent installer
contract was found. Sources: https://github.com/get-air/vizio and
https://docs.tvlabs.ai/platform/platforms/smartcast . This is a search ceiling,
not proof an undocumented path cannot exist. Genuine Home tile still unresolved.


## Owner visually confirms native SDK test UI

Owner photo codex-clipboard-d4edff5f-d58c-4e3a-a378-3494087e00d2.jpg shows
VIZIO BROWSER COMPANION / API TEST APP, with VIZIO Legacy API and VIZIO_MODULES
New Modular API cards, plus SUMMARY, KEYS, GAMEPADS, TUNER, TTS, CAPTIONS, CODECS,
STREAMS. This supersedes the preceding pending visual observation: direct local
navigation rendered the SDK test UI. It is not a native Home tile/install proof.
Right then OK navigation was accepted (two API SUCCESS results) toward modular
APIs; next UI observation pending. Bounded navigation script supports only
Right/OK/Back/Up/Down/Left. Key codes verified from primary implementation:
https://raw.githubusercontent.com/heathbar/vizio-smart-cast/master/index.js .
No source transfer, configuration value export, setter or firmware command.


## Modular test UI navigation observed

Owner photo6756.jpg confirms VIZIO_MODULES App section and editable argument
examples (getAppInfo APP_ID string3, NAME_SPACE number4). Owner's next photo
image-1792291363144.jpg confirms System selected and subgroups Dynamic Capability,
Environment, Identifier, Menu, Network, Power, Support, Time, Version. The displayed
capability example key is BT_GAMEPADS. No Run All/Run Page/method Run was pressed.
Down, Right, OK toward Environment were accepted; next screen observation pending.
The test UI is a real new entry point for API contracts, not an installer finding.
Raw-source follow-up is a separate prepared proposal in
research/test-ui-source-capture-plan.md. No additional capture is active pending
its exact one-resource approval. Existing TV native-command permission retained.


## Test UI capture completed; native catalog controls distinguish missing keys

Owner approved the exact one-resource HTML capture. Revision13 upload confirmed
both in owner photo and listener:374655 bytes, SHA-256
2aebe583db96750fa7d1f628f3c597caa8b03dc86116d8f8b25e57ab5e786809.
Existing parse5+Acorn parsed one323411-character inline script, no execution and
no linked fetch. Sanitized registry has312 accepted named records; AST counted314
deeplinkId properties (two entries failed the name filter). Earlier commentary
said314 definitions; corrected to312 extracted records, no full coverage claim.
Saved only static namespaces, method/parameter names/types and reviewed example
keys/IDs; no raw HTML/JS. App14, System52, legacy VIZIO123 records among16 namespaces.
Registry is test-definition metadata, not proof all listed APIs work on this TV.

TV Store sample keys ToadName/FrogName/NewtName/SalamanderName reinforce that this
is a generic demo store API; no Home registration contract. Config example keys
use colon delimiters, e.g. AppConfigs:CL:Logging:verbose. Modular Environment
contains country/Cast-state methods, not a catalog editor. TextToSpeech documents
speak(text) and stopSpeech(), not executed. No Run All/Run Page or setter invoked.

Raw HTML released (DELETE204, available=false). Removed active capture wiring;
live sdk-source-once and sdk-source-status each404 after canonical no-proxy restart.
Historical capture module/launcher remain as evidence, not an active source route.
All67 tests pass; syntax, format, whitespace and launcher parse checks passed.

Revision14 uses five fixed read-only calls; no result payloads transferred:
System.getConfigProperty('VIZIOApps'), ('VirtualInputs'), ('AppMigration'),
('MistResearchAbsentControl20261017'), App.getVizioAppInfoByCname('sctv').
Added only finite probe labels to the existing metadata schema, and bounded
per-probe RAM snapshots at GET/research/reports (same socket/Host restrictions).
The normal aggregate page remains separate; no summary upstream read by this route.
First four-call run resolved object types; one readback was interrupted while the
listener remained healthy. Later metadata read succeeded; cause of the transient
transport abort was not established. No dropped SDK response was claimed.

Negative-control run aa082a85b0854a6ca3a2d396de697581 (PID6224, API SUCCESS):
absent control resolved null; VIZIOApps, VirtualInputs, AppMigration and sctv each
resolved object, all loaded/ready=true. This distinguishes the named sections from
the missing control in this run. Their schema, contents, writability and role in
Home persistence remain unverified. Validated types-only snapshot:
research/catalog-type-diagnostic-20261017.json. No URLs, IDs, account values,
configuration scalars, raw source or credentials were exported by the live probes.
No configuration/store writes or installation requests. Home tile remains open.


## Approved automated catalog structure (revision15)

Owner approved the bounded catalog-structure proposal and reiterated automated
hands-on testing rather than repeated photos. No further photo needed for these
routine results. Four sequential SDK reads produce a descriptor-only projection
on TV: at most3 levels/128 objects/4096 properties; no accessors invoked; no scalar
values or arbitrary keys returned. Backend validates exact schema, fixed targets,
field/type enums, bounded counts and rejects added data. Same socket/Host/Origin
restrictions; no generic command or configuration proxy. Source capture remains
retired. All72 tests plus syntax/format/whitespace/PowerShell parse checks passed.

Run c9519d6a14ee4e38919702fea5bcdceb, VitePID7708, API SUCCESS, four validated
structural projections received automatically:
- VIZIOApps: array18 root entries;37 visited objects, no truncation within bounds.
  Observed18 CNAME string occurrences and18 occurrences each of nested route-shaped
  NAME_SPACE number, APP_ID string, MESSAGE string/null. No actual names, IDs, namespaces or messages exported.
- VirtualInputs: array2 root entries;8 visited objects, depth-bound truncation.
  APP_ID is an object at entry level; NAME_SPACE/APP_ID/MESSAGE fields occur
  at the next level. Parent-child edges were not exported.
- AppMigration: object654 root children;128 visited objects, truncated. Observed
  children contain route-shaped NAME_SPACE/APP_ID/MESSAGE fields. Do not claim
  full traversal, current Home app count, or that every entry is launchable.
- sctv lookup: one object with CNAME, NAME_SPACE, APP_ID, MESSAGE typed fields.

Saved only validated projection in research/catalog-shape-diagnostic-20261017.json.
This shows routing/catalog structure and separates it from the generic TV store;
no persistent Home tile writer/registration contract was discovered or exercised.
Do not equate18 internal routes or654 migration children with installed Home apps.
No app/order/config/firmware write and no actual catalog values exported. The LAN
scope and in-Mist Tailscale configuration request remain in the running handoff;
no live Tailscale change. Final Claude handoff remains deferred.


## Hidden SDK factory guarded inspection (revision16)

No new raw source transfer. Inspect _docker locally on TV; invoke only if its
Function.toString is exactly a zero-argument arrow/function returning one bare
identifier (no calls, construction, property access or expressions). Otherwise
collect descriptor metadata without invocation. Only SDK method names/result type
returned under the existing approved channel; no source text, literals or values.
Delivered-page tests reject a call-containing function before invocation, never
call returned methods/read getters, and withhold data. All74 tests and syntax/
format/whitespace checks passed. Normal public dev checkout clean; canonical
no-proxy restartPID24964. One launch API SUCCESS, fresh run
93ff94d80ae346cd8c416e475319b9eb. Native result: loaded/ready=true, resolved,
responseType=undefined, method metadata only _docker. Thus this exposed pure
getter does not yield a useful internal container in this observed retail context.
Not a Docker daemon, RPC service or root-access discovery. Saved validated record
research/sdk-internal-diagnostic-20261017.json. No settings/storage/firmware write.


## Native speech and historical SCPL header controls

Revision17 used documented TextToSpeech.speak(text) with fixed phrase 'Mist is
connected to this TV.', then stopSpeech() after5000ms. No volume/TTS/Voice Guide
setting setter. Separate finite start/stop probe labels keep cleanup success from
masking speak rejection. All76 tests passed, including one utterance/one cleanup,
no setting call, and no raw error values. Syntax/format/whitespace checks passed.
Normal public dev clean; canonical no-proxy restartPID20388. First run
63849a57c75543549e0edf3818839270: both operations resolved undefined; owner missed
it. One announced retry after10s, run eb246bef4e144cb1b639e24bb54bdf09: both resolved
undefined, owner reported NO SOUND. Thus native operation settlement verified,
audible playback NOT verified. No further retry/toggle. Saved validated metadata
and owner observation in research/sdk-speech-diagnostic-20261017.json.

Primary ViziOwn source documents historical /install and /scpl/ on7345:
https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/ .
Performed HEAD ONLY with existing durable token, no redirects/body/source read,
POST/upload/package/script/injection or setting command. /install500 text/html;
/scpl/500 text/html; /app/current control200 application/json; fixed nonexistent
/mist-research-absent-check500 text/html. Installer paths are indistinguishable
from the missing-path control by this check. No exposed installer/vulnerability
or root discovery is claimed. Historical install.sh/command injection was NOT
attempted, and no staging directory/firmware filesystem was touched. Script
research/probe-scpl-head.ps1 retains the exact bounded header-only checks.

Next related read-only question: whether Conjure17 is an actual named VIZIOApp
route vs a generic launch facility. Existing static UI documents App.getAppInfo
(APP_ID string, NAME_SPACE number) and getVizioAppInfoByCname(cname string).
Use an absent-app control before interpreting a returned object as registration.
Home tile remains unresolved; no persistent catalog write contract established.

## Controlled app lookups and automated result collection (revisions18-19)

Revision18 invoked documented App.getAppInfo(APP_ID string, NAME_SPACE number)
for known Home1/4, Conjure17/4 and absent99999999/4, plus the literal cname
conjure lookup. All four operations resolved undefined, including known Home.
Runs c151add01abe456390799521fc29170e and4004c9124d114c05b9ef6c9e18a06d24.
These results do not establish registration or absence; the cname may differ.

Added run-sdk-research.ps1 and await-diagnostics.mjs: one explicit native launch,
then bounded GET-only collection of strict validated metadata for that fresh run
and finite probe group. Retries never replay native commands. Stale runs ignored;
transport errors do not imply native failure. App lookup wrapper actually returned
complete=true after20 reads. Completion denotes collection, not native success.
Polling now backs off to1s and caps the total budget at15s/response512KiB.

Revision19 reads VIZIOApps once and derives three fixed route subsets on the TV:
Home1/4, Conjure17/4 and absent99999999/4. Only existing approved bounded catalog
counts/types leave the TV; matched entries, names, scalar IDs and URLs do not.
Descriptor-only traversal skips accessors and sensitive branches, capped128
objects/two child levels per entry. These are derived subsets of the previously
approved VIZIOApps projection, not arbitrary configuration or source transfer.

Actual canonical no-proxy restartPID7032; one accepted native launch, fresh run
194d6307c73f4bb1af3380b7c81c3009. Automatic collection completed after9 metadata
GET attempts; SDK loaded/ready=true, operation resolved. All three validated
subset arrays contained0 entries, truncated=false. The known Home control also
failed to match, so this is NOT evidence that Conjure is absent or unregistered.
Saved sanitized projections: research/conjure-route-diagnostic-20261017.json.
No write, installer, persistent tile, sound or Home-order fix is established.

Latest owner AGENTS instruction reinstates no remote pushes and stop on another
worker's uncommitted files. The handoff dock currently has four such Claude
Markdown edits; left untouched. This Forge note records the checkpoint until
Dispatch reconciles the dock. Earlier review push authorizations above describe
historical actions; no push was attempted under the latest instruction. LAN/Vite
extraction, in-Mist Tailscale configuration and labeled task/Startup inventory
remain queued requirements, not implementations. Final handoff remains deferred.

Checkpoint checks after revision19: npm run check passed; npm test82 passed,
0 failed; Prettier check passed for new/modified JS, tests and saved projection;
three new PowerShell scripts parsed without errors; git diff --check passed
(CRLF normalization warning only). Restored the normal summary using the existing
launcher, native API SUCCESS. Actual post-restore screen not visually confirmed.
Latest instructions require local commits only; no new remote push.

Owner requests continued native-tile and firmware/software work after revision19.
FIRMWARE-RESEARCH.md now records the three next evidence paths: Home catalog
consumer/save contract; concrete retail installer contract; and exact-current
firmware/decryption/rebuild/admission/recovery. Both on-disk UTV hashes rechecked
unchanged; unixtract upstream still at inspected144cf51, so no identical decrypt
rerun. No new TV command, raw source capture, device write or firmware flash.
No verified software-only recovery exists yet. Native tile unresolved, not proven
impossible. This plan is preparatory evidence, not a promised implementation.

## Home static-reference check and exact installer controls (revision20)

One fixed sctv lookup feeds a descriptor-only MESSAGE read inside the TV. Fetch
only http localhost/127.0.0.1:12345 /scfs/ static routes; reject credentials,
query/hash, sensitive/config paths and other origins. Home document plus at most
four same-origin linked script references;512KiB/resource,2MiB total,5s budget.
No downloaded code execution, dynamic-import following, cookies/auth, redirects,
raw source/URL/config export, or setter. Only seven fixed known SDK method names
can leave as lexical references. Lexical matches would not prove call execution.
This is renderer-local inspection, not a new raw-source transfer to Ally.

Executed after clean public dev preflight and canonical no-proxy restartPID23256.
One accepted launch; run84b6b969552b49a6b8c217d524ba05f1. Automated readback after
8 metadata GETs: loaded/ready=true, resolved,string, methods[]. This establishes
that the permitted document read completed and no checked lexical methods were
found within the bounded fetched set; no per-resource counts were exported, so
it does NOT establish four linked scripts fetched or complete Home coverage.
Saved validated research/home-reference-diagnostic-20261017.json. No Home save
interface discovered, no absence-of-capability conclusion. Normal summary
relaunch accepted afterward; actual restored screen not visually confirmed.
86 tests0 failures; npm check, formatting and PowerShell parse checks passed.

Primary advisory L9-44-476 identifies /scpl/install, distinct from prior /install:
https://www.l9group.com/advisories/vizio-tv-unauthenticated-remote-code-execution/
Applies to historical E50x-E1/P65-F1 and6.0.31.4-2/10.0.31.4-2, not established
for V435-J01. Its sequence changes device group and forces an update before a
TGZ install. None of those write/update/upload/shell steps was attempted here.
Exact /scpl/install and same-prefix absent control each HEAD500 text/html, then
GET-with-ResponseHeadersRead500 text/html; body never read for GET checks.
/app/current positive control200 application/json for both methods. No endpoint
presence/absence, developer eligibility or patch conclusion follows generic500.
Scripts research/probe-scpl-install-head.ps1 and probe-scpl-install-get-headers.ps1
retain fixed checks. No path fuzzing, raw response dump, or package submission.

## Matching published source-family lead

https://github.com/opensource-vizio maps chipset prefix1 to5691 and release720
toFUR7.2. Its public5691_FUR7.2_OpenSourceSoftware README explicitly lists
1.720.X.Y, closer to the TV's recorded1.720.9.1-1 than our older OTA artifacts.
https://github.com/opensource-vizio/5691_FUR7.2_OpenSourceSoftware
Repository root currently contains README only, not module source. README lists
Ubuntu22.04 build instructions and5691_OSS_FUR7.2.zip download gateway. This is a
family match, not exact-build identity, completeness, flashability or recovery.

Read public repository README history (five revisions): newest
9f03845a6db45d5d8b6bd2eb3e9c5420dac16078; all five link the same CloudFront form,
with older filename5691_FUR7.2.zip vs current5691_OSS_FUR7.2.zip. No direct archive
URL found in those revisions. Public gateway source requires name/email/phone/
company submission to obtain a download URL. No form was submitted, identity
supplied, endpoint POSTed, download gate bypassed, or vendor contacted. Existing
owner no-contact scope retained. No matching source archive acquired. This lead
is worth retaining for a lawful public mirror/direct link, not claiming extracted
firmware. TV Labs ZIP sideload statement remains no concrete retail contract.

## Source archive acquired and initial implementation trace, 2026-10-18

Owner-supplied Drive download completed:5691_OSS_FUR7.2.zip,7927233880 bytes,
SHA256 b89f726e47ac4dae2c4370cf0748036f3a8076f7f98b2942b7b2c29d73a8ac91.
All23 outer ZIP entry CRCs passed; no independent vendor digest. Archive/raw source
outside Git; metadata in research/source-bundle-inspection-20261018.json.
FIRMWARE-RESEARCH.md owns detailed provenance, paths/line evidence and limits.
Conjure/SCPL small bundles are dependencies, but ViziOS bundle includes actual
platform orchestrator/feature-manager/OSUpdater source. Source now identifies
ChromiumHtmlAppUris fornamespace4, SmartCastHome registry projection, default app
routing and separate software-asset decryption/signature checks. No live getter
for new keys, registry write, installer call or downloaded code execution.
No Home-grid order/tile write contract, modified firmware or recovery established.
Bedroom TV offered as separate test candidate; model/firmware/IP requested and
no second-device command sent. Continue source-first in agreed order; no push.

## Source-backed native mapping checks (revision21)

Reused the existing bounded type-check runner with a fixed alternate query list,
retaining the historical revision14 tests. New source-derived keys are
ChromiumHtmlAppUris,SmartCastHome,Orchestrator, plus VIZIOApps positive and fixed
missing-key control. Only result types/method metadata returned. No values,
scalar URLs, shapes, account/identity data, writes or installer commands exported.
87 tests passed,0 failed; source/syntax/format and two PowerShell parse checks
passed. Normal public dev tree clean before canonical no-proxy restartPID3656.
Run3e6d266058c24860b119f3512c72f6f0: SDK loaded/ready=true for all five; missing
controlnull, VIZIOAppsobject, ChromiumHtmlAppUrisobject, SmartCastHomeobject,
Orchestratornull. Thus two source-identified sections are exposed and distinct
from missing control in this retail context. Their contents, permissions and
Home-grid write/persistence role are not established. Saved strict validated
research/source-mapping-diagnostic-20261018.json. Normal main-TV summary relaunch
accepted afterward; actual restored screen not visually confirmed.

Bedroom owner now requires network automation; device/photo/version baseline and
initial unpaired HTTP checks recorded in FIRMWARE-RESEARCH.md. Owner explicitly
requests Windows-encrypted saved bedroom pairing, like existing main TV. Current
pairing restart is pending; no saved credential or authenticated control claim
until observed. Do not retain the supplied PIN or photo identifiers in artifacts.
REA checked: current pinned lane not ready for these ELF files on native Windows;
no installation/configuration change or REA analysis occurred.

## Bedroom saved pairing verified, 2026-10-18

Supersedes the pending pairing checkpoint above. Fresh owner-supplied challenge
completed successfully; no PIN retained in artifacts. Separate bedroom token saved
using current-user Windows DPAPI at LOCALAPPDATA/Mist/ConsoleTV/d32f-g4.token.dpapi.
Save/readback matched in memory. A fresh PowerShell process independently decrypted
that file and GET /app/current returned HTTP200, STATUS.RESULT SUCCESS. Main TV
credential remains separate. Interactive helper then closed; its closing
credentialPersistence=none describes released process memory, not deletion of the
verified encrypted file. No unpair request sent.

Reusable research/probe-bedroom-control.ps1 was parsed and executed from another
process: authenticated GET /app/current200 SUCCESS; HEAD /app/current200 JSON;
HEAD /scpl/install404 HTML and fixed same-prefix absent control404 HTML. These
identical404 responses do not establish an installer handler or patch status.
No launch, configuration, firmware or installer write. No remote navigation needed.
The4176 diagnostic listener still permits only the original TV and Ally; bedroom
SDK reporting needs separate explicit peer/profile implementation before use.
Bedroom D32F-G4 firmware4.600.601.0-10 is distinct from main V435-J01 firmware
1.720.9.1-1. Do not treat the5691 archive as a bedroom flash candidate.

## Separate web-asset delivery lane traced, 2026-10-18

New static-source pass recorded in FIRMWARE-RESEARCH.md with11 source-file hashes
in research/source-asset-admission-20261018.json. SC-ASSETS comes from a manifest
or config-manager fallback, unpacks to alternate temporary scfs, then updates the
local web-server symlink. Unpacker always performs the inspected trailing-signature
completion check; MD5 checking is conditional. No signing authority, modified
package acceptance or retail recovery follows. No certificate fetched from TV,
vendor manifest request, native write, config export or downloaded code execution.

Nested BSP release.tar.gz now inventoried:481417 headers,10500715813 declared
file bytes,0 absolute/parent paths; chiefly toolchains and apollo platform source.
Seven named SCPL/Conjure/Home-related path terms had0 matches; filename evidence
only, no recursive source-content absence claim. No nested members extracted.
Orchestrator set-target resolves/switches apps; addOrUpdate changes its in-memory
database and registry projection. Neither traced path proves a durable Home tile
writer. Next target remains actual Home catalog/persistence consumer or concrete
compatible installation contract; tile and Home-order cause remain unresolved.
No TV request issued during this static pass. Owner's automated-bedroom and
LAN/Vite/Tailscale planning requirements remain unchanged; final handoff deferred.

## Planning review and revision22 execution, 2026-10-18

Owner requested a next-step execution plan for Sol and explicitly continued the
research execution. EXECUTION-PLAN.md is now the component's next-experiment plan,
not a canonical queue edit. It distinguishes catalog membership, saved order,
launch mapping and signed asset delivery. Supplied Google AI screenshots are
hypotheses, not proof of cloud-only membership or a particular SQLite database.
Primary retail launch documentation was rechecked; no consumer registration
contract follows from it. Developer portal retrieval yielded only a JS shell.

Found a concrete limitation in revision20: it checked seven modular names but
omitted four legacy store names present in the captured test-UI registry. Added a
regression fixture; before correction it failed with empty references, while the
other four reader tests passed. Revision22 adds those exact legacy names, with
unchanged fetch and metadata boundaries; method occurrence remains lexical only.
All88 tests passed, npm check passed. One main-TV launch after canonical no-proxy
restartPID23280: run6c81f362505249bb97477dfa72555ee1; loaded/ready=true, resolved,
string, methods[]. Saved home-reference-diagnostic-20261018.json after strict
readback. Normal summary relaunch accepted; restored pixels not independently
observed. No native retry, config/store/installer/firmware write or raw export.

The negative result still has no file-coverage telemetry and must not be called
complete Home-source inspection. Plan next: isolated bedroom profile/fresh-run
admission, then coverage-first Home tracing. Expanded coverage schema is proposed,
not active; any additional data-scope approval should be one prepared bounded
batch, not repeated permission for already authorized native reads. No further
identical lexical probe without a changed hypothesis. Plan includes acceptance,
rollback, conditional firmware lane, delayed order-reset investigation and cleanup.

## Execution-only batch: isolated channels and coverage, 2026-10-18

Owner told Sol to execute the plan and stop for Astra when new planning is needed.
Implemented explicit main/bedroom profiles, Console-owned isolated research servers,
server-issued runs, per-channel operation lock and expiry/release. These new channels
admit only fixed version/coverage groups and matched TV/run/probe metadata. Legacy
4176 research routes are not claimed to have these new admission guarantees.
Same process owns the summary and research sockets; no separate task/server process.
One existing ignored local companion option was extended; its prior three-option
settings were backed up outside Git. No public tracked-file edit or Tailscale change.

Both version probes executed automatically before bedroom suspension: main
runec73be53483e517b88247e3600997524 returnedprod64.37; bedroom
run7756bb9da274a295a73ca21f8fdc13dc returnedprod59.78, loaded/ready=true, resolved
string. Main full method list was printed but not retained; its saved artifact is
explicitly a selected-field transcription. Bedroom full validated metadata saved.
No repeated PIN/photos. Main restoration checked native current-app ownership
before requesting summary relaunch; actual restored pixels unobserved.

Owner then suspended bedroom testing. Removed bedroom from active researchTargets;
4177 confirmed absent,4178 main and4176 summary present under ConsolePID28868.
No bedroom command since the suspension. Do not re-enable until owner resumes it.
Owner's continue-with-bedroom-deferred reply accepted the prepared bounded Home
coverage extension. Only main received revision23 coverage. No raw source/URL/
identity/storage/config export or persistent TV change.

All103 tests passed, npm check passed, changed launcher parsed; final formatting
and whitespace checks recorded with the commit. Live main coverage
run0f1c320e874438e65a2a7970a450d2f2: one HTML file1092 bytes, zero recognized
quoted script-src references, no truncation/budget exhaustion, SDK loaded/ready.
This is not complete Home-source coverage. Inline/unquoted/dynamic navigation
and content identity are unobserved. No semantically valid comparison route was
invented from LocalAssetsUri or another asset-package URL.

STOP FOR ASTRA is recorded in EXECUTION-PLAN.md: select the next content identity/
navigation inspection from this specific coverage result. No further native test
selected. The native tile and order-reset cause remain unresolved. Preserve LAN/
Vite/Tailscale, in-Mist connection configuration and scheduled-task/Startup-folder
inventory requirements. Final Claude handoff remains deferred; local commits only.

Final checks for this batch:104 tests passed0 failed, npm check and formatting
passed, changed launcher parsed. Added explicit occupied-port/no-fallback test.
Completed main run readback404 after release and normal summary health running;
these were Ally listener checks, not additional TV operations.

## Astra planning handback: document identity, 2026-10-18

Current next batch is the final batch24 section of EXECUTION-PLAN.md, superseding
the previous stop for planning. Implementation and live use have not occurred.
Prepare a structural HTML/JavaScript classifier, fixed report contract and
adversarial fixtures locally, then request its single new bounded data/read scope.
One main-only run would read the known root, compare one generated missing sibling,
and optionally inspect one unambiguous permitted literal continuation. No external
follow, raw capture, source execution, recursive traversal or persistent TV write.
Bedroom remains suspended. Return to Astra after that one outcome.

This planning pass actually ran four synthetic in-memory controls against the
unchanged revision23 collector: quoted src counted1/read2 files; unquoted src
counted0/read1; inline navigation counted0/read1; a commented-out script counted1/
read2. The last is a false dependency. These explain collector limitations, not
the real 1,092-byte document. No TV/network request, Console restart, credential
access or runtime configuration change was needed. No package was installed.
Prior104-test evidence remains historical; current changes are documentation only.

The new counts/navigation categories/equality comparison are proposed, not silently
included in the old coverage permission. Sol must prepare/test the reviewable
implementation before asking once; routine command/token approval remains valid.
Do not use the retired SDK/test-UI capture grants for Home content. Preserve the
LAN/Vite/Tailscale, in-Mist connection setup and task/Startup inventory requirements.
Local commits only, no push; final Claude handoff remains deferred.

Planning-pass validation subsequently reran npm run check and the existing suite:
104 tests passed,0 failed. New Markdown sections passed formatting. This confirms
the unchanged baseline checks ran again, not that proposed batch24 exists or that
its TV parser/continuation behavior has been tested.

## Batch24 prepared locally: live scope still pending, 2026-10-18

See the final EXECUTION-PLAN.md preparation checkpoint for the exact implementation,
schema, boundaries and next action. Structural HTML/JavaScript parsing, isolated
main-only worker/page/report, default-off opt-in, fixed byte/time ceilings and
adversarial controls are prepared. Exact locked parser/build development packages
were installed with lifecycle scripts disabled. Generated parser/page/licenses are
ignored, built privately; no public source edits, copied TV source or raw capture.

Full suite124 passed0 failed0 skipped; npm check, explicit new-file syntax and
PowerShell parse passed. Actual bundled page/worker tested with synthetic inputs.
Real TV worker/CSP/fetch compatibility and the root content remain unobserved.
No Console restart, local option edit, credential read or TV operation in this
preparation. Bedroom remains suspended; launcher refusal tests used local stubs.

One scoped approval is pending for the fixed three-read/544KiB main-only batch and
its bounded syntax/equality metadata, followed by one run and Astra handback.
Command and encrypted token permissions already exist. No generic URL/capture
route, state write, firmware experiment or vendor transaction. Preserve LAN/
Vite/Tailscale, in-Mist connection setup and task/Startup inventory requirements.
Final Claude handoff deferred; local commits only, no push.

## Batch24 approved and executed: return to Astra, 2026-10-18

One main-only run03a6541cf1e1606a683510c2a2708de1 returned SDK loaded/ready and
parser controls passed. Root HTML1092 bytes contains3 scripts:1 inline and2 src,
both src attributes unquoted. Inline syntax parsed, no recognized navigation.
Negative sibling returned341 bytes under a non-success HTTP outcome, different
from root. Two candidate scripts made continuation ambiguous; neither fetched.
Total2 reads/1433 bytes, no truncation/budget exhaustion, no eleven-method matches.
Saved validated result is under research/results/; EXECUTION-PLAN.md final live
checkpoint gives exact observations, ceilings and the next planning question.

Normal summary relaunch was requested after current-app ownership match; pixels
unobserved. Released run now404 from Ally. Temporary document flag explicitlyfalse
after canonical no-proxy stop/start; summary health running, same process11968
owns5173/4176/4178, bedroom4177 absent. Original options backup retained outside
Git; this is a disabled false flag, not a byte-identical option-file restoration.
Combined cleanup command was policy-rejected before execution; narrower flag
disable plus separate lifecycle operations succeeded. No unresolved cleanup block.

No bedroom request, native retry, raw source export, persistent TV write or firmware
action. The root result identifies an actual quoted-src coverage gap; it does not
identify the active Home consumer, catalog writer or persistence. Sol selected no
further experiment: Astra must plan how to disambiguate the two dependencies.
Code unchanged sincec26946e; prior124 tests are not claimed rerun here. Preserve
LAN/Vite/Tailscale, in-Mist connection configuration and task/Startup inventory.
Final Claude handoff deferred. Local commits only, no push.

## Resumed with advisors; batch25 local preparation and TV-attention design, 2026-10-18

Owner reports pushing prior commits. Read-only ls-remote confirms Forge branch
at e4837475b4cf1b8e079d63060ae635061ea5a30c and handoff branch at
4550b8d2ddde15e96a6fc826fa412992d9c94920 before this work. No agent push.

The configured advisor setup is now part of the eventual Claude intake:
Codex primary Sol high, independent Astra medium, scoped Luna max, with explicit
roles/efforts and observed versus requested outcomes. Config readback confirms
these values; it does not establish an already-running chat's model. First Astra
request hit usage limit; resumed request returned a bounded batch25 plan. Luna
prepares assigned new modules/tests; Sol handles integration/review. The dock's
CODEX-MODEL-ROUTING-INTAKE.md points Claude to the existing model-routing authority
and pending brief-skill migration, without creating a competing policy home.

EXECUTION-PLAN.md batch25 proposes root + generated negative + BOTH direct scripts,
four reads/1,056KiB, five-second collection, fixed structural graph/categories only.
New main-only group and default-off opt-in. New read/output scope needs one approval
after local preparation/tests; batch24 remains retired. No live probe, Console
restart, credential read or ignored option edit in this preparation. Bedroom
remains fully suspended. Do not copy the historical running PID as current proof.

New owner idea is DESIGN ONLY: TV-ATTENTION-DESIGN.md describes an OFF-default
attention toggle in Mist App and normal Console, manual Movie Mode/optional
schedule, critical-only filtering, dedup/batching/rate limits and fail-quiet
behavior. Prefer a silent nonblocking TV popup, no automatic full-screen fallback.
Native arbitrary-text toast and reliable on/playing detection are unestablished.
The smallest proposed current-app observation is passive main-only six reads,
with owner-selected phases; it is separate from batch25 and not yet approved.
No feature/observer/control/event wiring or notification call has been built.

Owner clarified the observed connection popup was bottom-left on the TV after
PIN pairing; prior Chromecast similarity is recollection. Offline supplied-source
trace found fixed-template notification senders ending at loki::message, not an
external arbitrary-message contract. Do not activate Store Demo, check-for-update,
pairing or Cast to reproduce a toast. Design sidebar records exact source leads
and missing IPC/dispatcher/template/external-bridge contract. No raw capture revived.

Keep the final Claude handoff deferred but these changes in its progress pointer.
Preserve LAN/Vite/Tailscale extraction, in-Mist Tailscale connection setup, task
AND Startup inventory requirements, existing Console client/Input Lab and no
wake/logon auto-launch. Full-screen event attention remains a separate opt-in
proposal; it does not supersede the manual native-tile acceptance goal. No push.

Owner availability update: bedroom TV explicitly available again later in this
turn. Sleeping-person suspension lifted prospectively; no bedroom request, wake,
launch or listener activation sent. Batch25 main-only guard remains intentional.
Older suspension text is historical, not a currently pending owner permission.

Batch25 preparation gate result: full suite163 passed,0 failed,0 skipped after
independent review fixes and actual built page/worker synthetic execution. Explicit
new/changed JS syntax, launcher PowerShell parse and deterministic double build
passed (worker319240/page39839 bytes). No TV compatibility claim. Execution plan's
final preparation checkpoint carries exact scope, tested boundaries and one pending
approval. New opt-in remains default-off; no runtime restart/configuration change.
Luna returned28 targeted passes; parent independently ran the integrated suite.
No push, no bedroom operation, no popup/attention feature built or enabled.


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


## Toast source checkpoint, 2026-10-20

Owner requested continued native-toast research; TV might be off, so no TV calls.
Current detailed findings/limits: TV-ATTENTION-DESIGN.md final source checkpoint;
metadata/provenance: research/toast-source-trace-20261020.json. Targeted GPL pass
found only mock headers; Loki.zip contains fonts/licensing text; completed bounded
nested-release filename/link scan found no matching production lead. Public vendor
Notification System API is a partner-webhook/transaction service, not an established
TV toast route. No production dispatcher, custom-text schema or authenticated LAN
ingress identified. No source execution, feature build, setting change or push.

Stop this source path pending a concrete production/API lead; no useful new live
test selected and no reason to turn a TV on. This is not an impossibility claim.
Native tile parser-limit work remains separate. Existing quiet/privacy design,
routing intake and extraction queue requirements retained in the dock pointer.


## Pairing-first then Cast metadata, 2026-10-21

Owner order retained. Offline external pairing-client vs internal PIN-handler trace
completed; no success renderer identified. Targeted content scope1014files/4759864
bytes finished; see research/pairing-source-trace-20261021.json and the final
TV-ATTENTION-DESIGN.md checkpoint. No TV operations or credential access.
Cast metadata is queued next: local client inspection shows LOAD and possible
receiver auto-launch even with autoplay=false. Idle visual test would establish
receiver UI only; no noninterrupting overlay claim, live test or feature build.


## Idle main-TV Cast metadata test, 2026-10-21

Owner reported living-room idle; one fixed-title silent media LOAD with autoplay
false. Receiver started, PAUSED/title echo/session present; sender-owned receiver
quit requested and subsequent status absent/backdrop. No wake/settings/credentials,
new listener or retries. Pixels/input/focus unobserved, owner visual report pending.
See TV-ATTENTION-DESIGN.md and results/cast-metadata-main-20261021.json. This proves
receiver metadata acceptance only, not a system-wide noninterrupting popup.


## Owner visual result for Cast metadata test, 2026-10-21

Supersedes visual-report-pending text above. Owner observed the test title take
over the whole screen, disappear after a couple seconds, and return to Vizio Home.
The prior screen was idle YouTube, not Home; it was not restored. Protocol baseline
only established no active non-backdrop Cast app, not that no other TV app was open.
Owner timing is an estimate; sender's20sec observation is not proof of display duration.
Result: visible custom-title Cast receiver UI, with full-screen interruption and
loss of prior app view. This does not meet quiet-popup acceptance and must not be
used as its fallback. It could inform a separately opted-in full-screen mode only.
No further TV request or feature implementation followed this report.


## Route capability index

Owner requested documentation of all demonstrated routes. ROUTES.md now indexes
Conjure summary, Cast metadata, local test UI, saved pairing/REST/navigation, SDK
version/reporting, bounded static reads, retired captures, USB and partial DashCast.
Evidence levels, target coverage, launch side effects, current-vs-historical and
negative-result ceilings are explicit. README points to it. No new TV request,
feature, listener/config change or consumed-scope replay.


## Offline route audit and Astra challenge, 2026-10-21

Owner authorized audit and its output in our Codex handoff path despite unrelated
Claude work. ROUTE-AUDIT-2026-10-21.md and hashed31-file companion evidence manifest
are saved there; ROUTES.md links the audit. No unrelated handoff file changed.

Findings: DashCast had URL-message tests beyond launch, but no LAN iframe control;
summary DENY/frame-ancestors intentionally blocks embedding and is not to be
weakened. Vendor CastA60E880D is a distinct untested lead. Batch25 error handling
conflates multiple failure causes; repair/calibrate locally before any new run.
Owner resolved mobile observation: pair once, stay connected, no later popups.
PAUSED/title echo does not prove media decode, and Cast idle is not television idle.

Astra independently reviewed source/results and challenged these findings. Local
syntax and163 tests passed,0 failed/skipped. No TV call, credentials, live capture,
configuration/lifecycle change or feature implementation. Planned finite experiments
and exact approval boundaries are in the audit; no old one-run grant is revived.
No canonical queue/routing edits or push. Preserve all earlier extraction items.


## Recommendation preparation, 2026-10-21: no live run yet

Prepared exact no-data DashCast iframe control in research/dashcast-marker-plan.md,
fixed main-only/default-off marker group, inert HTML, strict existing lease/peer/
Host checks and max2 responses. Production summary headers remain DENY; marker
Origin-present refusal is reported as policy, not DashCast failure. Plan-default
Python helper pins message transport/session and STOP session, aborts existing
Cast activity and independently handles disconnect/release with honest failure.
No configuration/lifecycle/TV/credential operation performed.

Home parser optional fixed failure reasons now prepared with original caps and
historical-report compatibility. No live Home run. Luna scoped implementation and
Astra review informed parent integration; parent caught multi-inline/graph reason
coherence issues before final passing tests. Final181 Node tests,15 Python tests,
syntax/format checks passed locally. Actual worker used synthetic source only.
Local code preparation does not activate the marker or revive old raw captures.


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
