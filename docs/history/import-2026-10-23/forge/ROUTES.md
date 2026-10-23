# TV routes: demonstrated capabilities and limits

Current scope correction, 2026-10-23: HOME-SPEC.md defines customized ad-free Home;
replacement Home is acceptable and the old native-tile-only goal is superseded.
research/home-input-plan.md maps the next input/launch/Home evidence gaps. Prepared
input-only code and default-off hosting are not a demonstrated TV route. All TV
operations currently held.189 local tests passed after hosting preparation; no
live setting/restart or TV query/launch followed.
Earlier active-session descriptions below are historical: subsequent local logs
record session loss without STOP for both inline runs; no fresh TV query or
rerun cleanup confirmation is claimed. See EXECUTION-PLAN.md current checkpoint.

This is the capability index for the existing Mist Console TV investigation.
Evidence spans 2026-10-17 through the Cast test recorded as 2026-10-21. It is not
an exhaustive inventory of everything the TVs support, nor a fresh live health
check. No TV was operated to assemble this index. Historical observations retain
their original dates. Protocol acceptance and owner-observed display are separate.

## Current audit pointer, 2026-10-21

[Route audit and next experiments](C:/Dev/!RobCo/_RobCo-Agent-Handoff/codex/mist-console-tv-2026-10-17/ROUTE-AUDIT-2026-10-21.md)
records the pre-test review of this index. At that audit DashCast LAN iframe was
untested; the old helper required force/direct mode for LAN. See the new live
checkpoint below for the subsequent controlled run. Real summary headers deliberately forbid
embedding. Home parser failure categories are confounded, not just a proved AST
cap. Owner clarified Vizio Mobile has no more popups after initial pairing.
No new live run or feature is authorized by that audit.

## Confirmed DashCast inline HTML display, 2026-10-21

Owner photo confirms MIST INLINE CONTROL / Self-contained page on main TV.
A fixed inert data:text/html URI was sent through DashCast's ordinary iframe
branch and visibly rendered. This is a demonstrated custom-HTML display route,
not merely receiver launch or URL echo. Sender remains attached; owner explicitly
requested no stop until told. No automatic STOP or timed cleanup is enabled.
[Observation](research/results/dashcast-inline-main-242785f7e23d4106b19d54598697ce97-observation.json).
JavaScript, SDK access, live Console fetch, LAN iframe delivery, native quiet toast,
Home-tile persistence and restoration remain untested by this document. Actual
receiver intermediary loading still exists; only the target page is self-contained.

## Earlier DashCast LAN iframe checkpoint, 2026-10-21

One controlled LAN iframe run acknowledged its URL; owner photo shows DashCast's
bottom Loading status with the exact URL, but no marker. Zero admitted marker
responses were issued. Planned pinned STOP returned to Home; no crash inferred.
Original local options restored byte-for-byte; test disabled and old lease absent.
[Result and owner observation](research/results/dashcast-iframe-main-7dc1f5521164637549f7604fa7cf9a02.json).
This is progress beyond a title screen, but not successful page retrieval/rendering.
No new native toast or private Console embedding exception has been established.

## At a glance

| Route | What actually worked | Evidence level | Main limitation |
| --- | --- | --- | --- |
| Paired Conjure web launch | Displays existing Mist Console summary on living-room TV | Owner saw page and advancing timestamp, including relaunch after standby | Full-screen app launch; not a persistent Home tile |
| Cast default media receiver | Displays fixed custom title, Codex needs you | Receiver reported PAUSED/title; owner saw title | Full-screen takeover; quit returned to Home instead of idle YouTube |
| DashCast inline HTML | Fixed self-contained HTML visibly renders through iframe branch | Owner photo plus URL echo | Full-screen; no LAN fetch, scripts/SDK or persistence proved |
| TV-local SDK test UI through Conjure | Opens Vizio's built-in API test interface | Owner photos show landing page, App and System sections | A test interface, not an installer; listed methods are not all tested |
| Saved paired REST access | Reuses separate encrypted credentials on both TVs | Independent authenticated reads succeeded | Authentication is not unrestricted access or reliable playback detection |
| Remote navigation | Sends directional/OK navigation into test UI | API acceptance plus subsequent owner screenshots | Tested navigation only, not all remote keys or all apps |
| In-renderer companion SDK | Loads SDK and resolves a System version call | Validated automated reports on both TVs | Method presence does not prove each method works |
| Restricted automated diagnostics | TV returns bounded approved results to Ally | Validated run-specific reports saved locally | Temporary research infrastructure, not arbitrary remote execution |
| TV-local static document reads | Reads local HTML and one linked JavaScript resource | Bounded byte counts/parser reports | Actual Home identity and persistence implementation remain unestablished |
| One-shot source capture (retired) | Captured and parsed fixed SDK/test-UI resources in memory | Transfer success, hashes and sanitized registry | One-time permissions consumed; routes removed; no reusable raw capture |
| USB media browser | Recognizes reader/card and shows media categories/root | Owner photographs | No successful HTML launch or native-code execution |
| DashCast receiver/message channel (partial) | Receiver starts and acknowledges a URL message | Receiver status and URL echo | USB and LAN navigation did not display requested page |

These are layers, not eleven independent app launchers. The test UI, SDK calls,
static reads and reporting used the Conjure renderer. The three demonstrated custom
content display paths are Conjure web content, default Cast media receiver UI
and DashCast self-contained HTML in its iframe. They are still app/session displays.

## 1. Conjure: the established Mist display route

Chain: saved pairing -> HTTPS REST on TV port7345 -> PUT /app/launch ->
VALUE {APP_ID:'17', NAME_SPACE:4, MESSAGE:<approved URL>} -> TV web renderer.
Existing summary URL is on Ally192.168.4.26:4176; the launcher creates a fresh
/client/<nonce> URL. The existing Console process owns this LAN listener.

Use the existing main-TV launcher, from this directory in PowerShell7:

```powershell
.\bin\launch.ps1 -AllyIP 192.168.4.26 -TVIP 192.168.4.20
```

This deliberately opens a full-screen app. It does not add/install a tile or promise
to restore a previous app. Console/listener readiness alone is not proof of display.
Owner verified summary display, correct local time, refreshing timestamp and explicit
post-standby relaunch without another PIN. No automatic wake/logon launch is enabled.
Summary presentation was visually confirmed on main; bedroom SDK rendering is
separate protocol evidence, not a bedroom summary-pixel confirmation.

Sources: [launcher](bin/launch.ps1), [entry evidence](TV-ENTRY.md),
[lifecycle](CONSOLE-LIFECYCLE.md), [summary server](src/server.mjs).

## 2. Cast media: custom title with full-screen takeover

Chain: direct Cast connection to main192.168.4.20:8009 -> media LOAD -> default
receiver CC1AD845 -> receiver media UI. Separate from DashCast's receiver84912283.
One fixed-title, one-second silent PCM WAV was sent as an in-memory data URI,
autoplay=false, BUFFERED. No external media host or new LAN server was used.
Receiver started, echoed title and reported a paused media session. Sender later
requested quit only while its newly observed receiver session still matched;
subsequent protocol status showed no receiver/backdrop.

Owner saw full-screen title, then Home after a couple seconds; prior idle YouTube
was not restored. Owner duration is an estimate and differs from the sender's
20sec observation window. No speaker output measurement was made. A paused silent
item is not a background toast. No image-artwork display or real media playback
was tested. No claim about another active app accepting metadata in place.

The one-shot harness remains a workspace research artifact, not an integrated
launch button: work/cast-metadata-once.py under the original Codex workspace.
Do not silently replay it or overwrite its result. A future repeat needs a new
result artifact and deliberate idle/ownership checks. No product feature exists.

Source: [protocol result and owner report](research/results/cast-metadata-main-20261021.json),
[attention design](TV-ATTENTION-DESIGN.md).

## 3. TV-local SDK test interface

Same Conjure launch, destination:
http://127.0.0.1:12345/scfs/cl/js/apiTestApp.html (localhost means the TV).
Owner saw VIZIO BROWSER COMPANION / API TEST APP, legacy/modular cards, and App/System
method pages. This demonstrates the local interface really renders. It does not
prove launchApiTestApp's wrapper succeeds in every context or that every test works.

Existing main-only helper: [launch-sdk-local-test-ui.ps1](research/launch-sdk-local-test-ui.ps1).
It opens the interface; it does not run all tests. Run All/Run Page could invoke
unrelated state changes and must not be used as a generic discovery shortcut.
Static parsing produced312 sanitized named definitions; definitions are contracts,
not312 successful live method tests.

Sources: [owner UI checkpoints](HANDOFF-NOTES.md),
[registry](research/test-ui-static-registry-20261017.json).

## 4. Saved pairing and remote control

MainV435-J01 is192.168.4.20; bedroomD32F-G4 is192.168.4.23. Separate current-user
Windows DPAPI credentials are reused; never copy/print token contents. Pairing
start/pair are setup operations, not a repeatable notification channel. Owner saw
a bottom-left success popup during pairing; its renderer/custom-text API is unknown.

Authenticated GET /app/current succeeded on both TVs; main reuse after standby and
bedroom fresh-process decrypt/read were separately checked. This reads app state,
not proof of screen power or active playback. No reliable playing/idle detector has
been established. Do not replace the owner-provided idle observation with this API.

Main [send-navigation.ps1](research/send-navigation.ps1) sends PUT /key_command/
with an allowlisted Right/OK/Back/Up/Down/Left mapping. Directional/OK calls and later
screenshots support navigation in the SDK UI; do not generalize every supported
parameter to a tested physical result. The script does not target bedroom.
Bedroom [control probe](research/probe-bedroom-control.ps1) contains historical
HEAD controls too; it is not a read-only current-app-only convenience launcher.

Sources: [pairing trace](research/pairing-source-trace-20261021.json),
[main/bedroom checkpoints](HANDOFF-NOTES.md), [entry](TV-ENTRY.md).

## 5. Companion SDK and automated reporting

TV-local library: http://localhost:12345/scfs/cl/js/vizio-companion-lib.js.
The probe loads it inside Conjure, waits for readiness, then invokes the finite
approved method. SDK bridge needs TV-loopback connection to127.0.0.1:7346 in its
specific research CSP; that is not an externally open Ally RPC listener.
System.getScConfigVersion resolved a string on both: main prod64.37, bedroom prod59.78.
Legacy callback observations did not establish an equivalent useful version result.
No broad claim that other312 registry methods work.

Research profiles isolate credential/target/run identity. Main summary4176,
main research4178, bedroom research4177 are distinct routes in the same Console
process. Availability is opt-in; historical success does not mean a listener is
currently enabled. Server-issued run, exact peer/Host/Origin checks, expiry and
release restrict approved metadata. No arbitrary URL proxy or unrestricted source.

Existing entry: [run-target-research.ps1](research/run-target-research.ps1), finite
Target main|bedroom and Group version|homeCoverage|homeDocument|homeDependencies.
Do not enable/replay a consumed one-run scope merely because its helper remains.
Current local settings were not inspected/restarted for this documentation task.

Sources: [main version](research/results/isolated-main-version-ec73be53483e517b88247e3600997524.json),
[bedroom version](research/results/isolated-bedroom-7756bb9da274a295a73ca21f8fdc13dc.json),
[isolated server](research/isolated-server.mjs).

## 6. Static reads and retired captures

Bounded TV-side fetches read a1092-byte local root document; later parsed two
unquoted script references. First linked script150219bytes fetched, but parser
hit a limit; second unread. This establishes readable resources, not genuine Home
implementation identity, a catalog writer or a persistent app registration path.

Earlier individually approved memory-only transfers captured the fixed companion
JS and test-UI HTML. Source was parsed as data on Ally, not executed; raw source
was not committed. Captures were released and active routes removed. Those expired
permissions are not a permanent raw-source export facility.

Sources: [dependency result](research/results/isolated-main-8668beae673964819195dce450d79d5e.json),
[execution checkpoints](EXECUTION-PLAN.md), [capture history](HANDOFF-NOTES.md).

## 7. Partial and negative routes: retain the distinctions

| Route | Observed result | What it does not establish |
| --- | --- | --- |
| DashCast LAN/USB pages | Receiver starts, readiness and URL-message echo obtained; force navigation stayed loading/black; controlled LAN iframe issued0 admitted page responses | A working arbitrary-page display route, or proof USB files cannot be served |
| USB | Reader/card recognized and media browser visible | HTML loading, native install or shell |
| TTS speak/stopSpeech | Operations settled; owner heard no sound on repeat | Audible attention route |
| Store getter | Unused Mist key resolved undefined | Home tile registration, writable catalog or durable persistence |
| DEBUG=1 | Launch accepted; checked9555/9222 unavailable | Remote debugger or developer activation |
| Catalog/app lookup probes | Bounded response shapes/types and incomplete controls | Successful membership change or tile installation |
| SC-ASSETS/firmware | Offline source reveals signed delivery; archives readable/inspectable to stated limits | Accepted modified package, recovery method or successful firmware write |
| Native system popup | Pairing popup owner-observed; fixed internal Loki template senders found in source | Externally callable arbitrary-text, noninterrupting popup |
| Persistent Mist Home tile | Not demonstrated | Transient Conjure/Cast display does not meet acceptance |

Sources: [firmware/research history](FIRMWARE-RESEARCH.md),
[software entry review](SOFTWARE-ENTRY-REVIEW.md), [attention design](TV-ATTENTION-DESIGN.md).

## Operational boundary

This index documents existing routes; it neither enables them nor grants a new run.
Keep the Console view read-only, privacy allowlists intact and notifications OFF by
default. No automatic takeover fallback. LAN/Vite/Tailscale extraction, in-Mist
Tailscale configuration and scheduled-task plus Startup inventory remain queued;
this inventory does not implement them. No TV setting, credential, server config
or runtime state was changed while writing it. No remote push.
