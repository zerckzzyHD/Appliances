# Mist TV research tracker

Updated 2026-10-17. This is the owner's progress pointer, not another editable
implementation or planning queue. No submissions, vendor contact or remote pushes.

## Latest result snapshot

NEW ACTIVE TEST: MIST SOFTWARE PROBE launched through normal Conjure, with no
DEBUG flag. It displays only exposed interface names/types on the TV, without
calling native methods/getters or collecting values. No new port or result API.
All 31 client tests passed; delivered page HTTP 200 and existing CSP checked.
Awaiting the owner's Exposed interfaces line/page count. Left/right pages; OK
rescans. Normal summary can be restored with the existing launcher. See
SOFTWARE-ENTRY-REVIEW.md for source, scope and exact limits.

Latest software-only experiment: owner-approved DEBUG=1 launch returned SUCCESS,
but development ports 9555/9222 did not respond. Normal launch returned SUCCESS;
ports still timed out afterward. No debugger access established. Live catalogs
and built-in-app replacement feasibility are recorded in
[_Mist-Forge/console-tv/SOFTWARE-ENTRY-REVIEW.md](_Mist-Forge/console-tv/SOFTWARE-ENTRY-REVIEW.md).
No persistent app replacement or native tile exists. An ordinary launch URL
override and sender-browser launch history do not change TV Home registrations.

| Check | Observed outcome |
| --- | --- |
| Reader/card recognition | USB1 media browser visible in owner photos |
| Conjure USB marker URL | Returned to Vizio Home; no marker |
| DashCast iframe USB URL after readiness/echo | Owner saw loading screen |
| DashCast direct USB URL | Owner saw black screen |
| DashCast direct known LAN Mist page | HTTP 200 on Ally; owner still saw black |
| Return via existing Conjure Mist launcher | API SUCCESS; owner confirmed Mist visible again |

Cast direct-navigation failure is not isolated to USB, so it does not prove a
missing/patched USB route. This experiment family is closed unless new evidence
justifies another test. Firmware decryption remains blocked by lack of a matching
key/readable dump; a board-specific documented service path is not yet established.
No reset, downgrade, firmware write or Home tile was produced. The SD card contains
only the added harmless marker alongside its prior file; no firmware was copied.

## Current goal

Owner constraint: SOFTWARE ONLY. No opening the TV, soldering, UART/JTAG/eMMC
connections, adapters, board purchases or hardware modification. Board/service
hardware research is no longer an owner action path. Continue only software/API/
offline-image research. A native Home tile remains unestablished; do not promise
that firmware can be customized or that resetting unlocks anything.

Select a native Mist Home tile on the Vizio V435-J01 to open the existing Mist
Console TV client. Native tile and Home-order-reset remedy remain unestablished.
The previously demonstrated paired launch remains available.

## Where the evidence lives

- [Current research record](_Mist-Forge/console-tv/FIRMWARE-RESEARCH.md)
- [Firmware inspection results](_Mist-Forge/console-tv/research/mg302-inspection.json)
- [Reproducible local inspector](_Mist-Forge/console-tv/research/inspect-utv.mjs)
- [Home-order issue](_Mist-Forge/console-tv/HOME-LAYOUT.md)
- [Native entry investigation](_Mist-Forge/console-tv/TV-ENTRY.md)
- [Running notes for eventual Claude handoff](_Mist-Forge/console-tv/HANDOFF-NOTES.md)

## Observed progress

- TV read-only version query: firmware 1.720.9.1-1, Home 26.10.01,
  system-ui-app 2.5.0-2328.17760, ViziOS mtk5691-1.6.1670.1.
- REA official source downloaded at f5fcf5216ffb3a266b8c00f6d9a0943051084ab5.
  No REA setup/MCP registration performed. Its documented firmware lane has a
  128 MiB input limit; the downloaded firmware is larger.
- Official Vizio Firmware Information 302 explicitly lists V435-J01 and links
  mg302-1.710.30.5-1F.utv. Downloaded 557,545,279 bytes for offline analysis.
  This is older than installed firmware; no downgrade or factory reset performed.
- Size framing and signatures against the embedded certificates passed; independent
  vendor trust not verified. All three published candidate decryption keys failed.
  No payload plaintext recovered. Declared inner file: mt5691_MstarUpgrade_OTA.pkg.
- USB reader/card D: is healthy, FAT32, about 32 GB. Existing file untouched.
- Copied only mist-usb-check.html to card root and read it back byte-for-byte.
  Static HTML: no scripts, executable, firmware or external requests. Marker USB-302.
- Historical ViziOwn GET pages /install and /scpl/ returned HTTP 500; no sideload
  form observed. No upload/exploit/shell activation performed.

## Owner approvals and remaining boundary

Owner permits software-version/REA downloads and testing, and is willing to factory
reset if a concrete procedure offers bug-fix/customization benefit. This is not a
claim that a reset unlocks firmware or that a compatible modified image exists.
No blind flashing, startup/Tailscale/firewall changes, or vendor submissions.
Final Claude handoff stays deferred to the end of this workstream.

## Immediate physical test: repeat returned to Vizio Home

Latest update superseding the Conjure-only result: the published USB method uses
Google Cast. Cast 8008/8009 respond; direct Cast handshake succeeded. DashCast
receiver 84912283 launched; owner initially saw its loading screen. Corrected a
documented startup-readiness race in the test sender. The next send waited for
Application ready and received the URL echo from DashCast. Awaiting whether the
TV now displays USB-302 or a loading/error screen. Reader should remain inserted;
no reset, formatting or firmware installation is needed.

Subsequent owner results: echoed iframe USB request stayed on DashCast loading;
direct USB navigation produced black. Corrected the sender's acknowledgement
semantics: direct navigation intentionally has no receiver echo, so its reply
timeout was not proof of send failure. Now testing a control through the same
Cast navigation mode: the existing LAN Mist page returned HTTP 200 and its command
was sent. Awaiting whether the TV displays Mist or stays black. No firmware/reset.

Additional offline result: downloaded an older MG302 archive from Vizio's CDN;
it also remains encrypted and the public candidates failed. Both inspection
reports and the Cast script are in _Mist-Forge/console-tv/research. PyChromecast
14.0.10 is isolated under this task's work/tools/cast, not globally installed.

Owner connected the reader to the TV. Four supplied photos show USB1 and the
Music/Video/Photo root browser. The one prepared localhost USB-page launch returned
API SUCCESS. Owner requested a repeat after possible remote interference; the
unchanged repeat also returned API SUCCESS, but the owner saw Vizio Home and no
marker. Read-only current-app response then reported APP_ID=1, NAME_SPACE=4.
The exact historical static-file route is not demonstrated working. Cause unknown;
USB media recognition still passed. Do not repeat the insertion steps below.

1. Close File Explorer windows showing D:.
2. Safely eject the reader from Windows; if Windows reports it in use, stop there.
3. Unplug the reader from Ally.
4. With TV on, insert the reader into the TV's USB port.
5. Tell Codex ready. The prepared launch requests the historical localhost USB
   page URL and replaces the current TV view for this test.
6. Report MIST USB CHECK / USB-302, a black/error screen, or no visible change.

Only an observed marker establishes this exact static USB route. It does not
establish executable code access, app installation, firmware editability or Home
tile persistence. No need to delete the existing card file or format the card.


## Current update: renderer photos received

Owner supplied all eight pages. See console-tv/SOFTWARE-ENTRY-REVIEW.md for
observations and ceilings. Prior pending photo requests above are historical.
Focused probe removes standard WebKit noise and inspects constructor prototype
descriptors without calls. No CSP/SDK/security-policy change. An inferred public
companion-library URL returned 403; TV-local library has not been read.
Final Claude handoff remains deferred.

Focused revision: 32 tests passed; HTTP 200 and unchanged CSP observed.
TV launch API SUCCESS; awaiting owner screen evidence. No SDK/native calls.


## Current: focused probe photos received

Both pages observed. External prototype shows only the two browser search-provider
method names; no Vizio-specific matched root appeared. See console-tv research
notes for evidence ceilings. Next test is a prepared one-resource text-only SDK
read; policy exception is pending approval, not active. No need for more metadata
photos. Final Claude handoff remains deferred.


## Current: approved one-resource text read launched

Owner approved. 37 tests passed. Existing Console restarted --no-proxy; normal
and temporary diagnostic policies checked over HTTP 200. TV launch API SUCCESS;
awaiting one owner screen result. Temporary /research/sdk-source-read exception
is active and must be removed after observation, then normal summary restored.
No SDK execution, source upload/storage, native calls or automatic retry.


## Current: local SDK read observed; native investigation authorized

Owner photo: HTTP 200, 299586 bytes read in TV memory; minified names only.
Owner authorized native/SDK investigation. Text-only route retired in source;
replacement SDK interface page executes initialization and displays metadata,
without additional unknown native calls or value collection. Awaiting launch.
38 tests passed before final ordering-only adjustment; see repository notes.

SDK-interface launch API SUCCESS. Normal page HTTP 200 with original policy;
old text-read route HTTP 404; new diagnostic HTTP 200. Actual SDK readiness and
interfaces await owner photo. Temporary SDK route remains active pending result.


## Current: SDK interfaces observed; targeted modules prepared

All nine photos received. VIZIO, Mojo, _debug and modules App/System exposed;
SDK loaded true, ready false. Earlier global list capped at 80 before ordering,
so absence of later names is not evidence. New probe inspects fixed modules and
reports limits, with one getConfigVersion call and strict output filtering.
40 tests passed. No auth/identity/mutation method called; no Home tile established.

Targeted-module probe served HTTP 200, launch API SUCCESS; awaiting actual
version getter/module results. Active temporary route remains for observation.


## Current correction: photos show older SDK document

Ready event now true in older nine-page probe. Targeted module/getter revision
not observed. Launcher reused URL; changed to fresh document ID and explicit
MIST SDK MODULES / 2 title. All 40 tests passed. See repository notes for limits.

Revision-2 fresh URL served HTTP 200; launch API SUCCESS. Canonical restart --no-proxy PID 17088. Actual revision-2 screen and native getter result await owner observation. Local commit 135bb79; no push. Temporary diagnostic route remains active.


## Current: revision 2 observed, version callback pending

VIZIO own names 207, selected/shown 45. Getter called before ready; no reply seen.
Revision 3 now waits for readiness before its single call and compacts filtered
metadata with App/Mojo first. All 40 tests passed. No callback/version/native Home
registration established; no need to capture 14 revision-2 pages.

Revision 3 fresh document HTTP 200; API launch SUCCESS. Canonical restart --no-proxy PID 10300. Local commit e0efade, clean private/public trees checked. Owner screen/getter reply pending. Temporary SDK diagnostic route remains active; normal policy unchanged.


## Current: revision 3 SDK ready and callback observed

Pages 1-2 of 4 show SDK ready true. Getter callback first argument undefined;
additional arguments were not captured, so no version value or native read
failure is established. App module exposes 14 lifecycle/lookup/launch functions;
Mojo send/sendMojoCommand and debug launchApiTestApp names observed, none called.
Await remaining System/root method names on pages 3-4; current document unchanged.
No need to repeat prior SDK launches or version call. See repository evidence notes.


## Current: four module pages captured; call-shape probe prepared

All four revision-3 pages recorded. Selected SDK methods show app launch and
subscriptions, no verified Home installer. Revision 4 inspects fixed wrapper
arity/call references without bodies/strings, and captures version callback
argument counts/types. No debug app or Mojo command invoked. 42 tests passed.

Revision 4 served HTTP 200 and launch API SUCCESS. Canonical restart --no-proxy PID 18720. Local commit 521631c; no push. Actual callback argument shape/function references await owner screen evidence. Temporary SDK diagnostic route remains active.


## Current: version callback confirmed undefined; test-app command prepared

Revision 4 photo: exactly one undefined callback argument, SDK ready true.
Owner reiterated command authorization. Revision 5 calls launchApiTestApp once
with no arguments after readiness; returns/types only, no values. 44 tests passed.
No Home tile/native backend success established; actual test-app result pending.

Revision 5 HTTP 200; API launch SUCCESS. Canonical restart --no-proxy PID 28512. Local commit e366fe0. Subsequent read-only /app/current: namespace 4, app ID 17 (Conjure); no effective native test-app launch is established by that early snapshot. Await owner screen/command status. Temporary route active, normal summary policy unchanged. No push.


## Current: native launch returned object; settlement was not observed

Owner revision-5 photo: SDK ready true, command called once, object return,
diagnostic still visible. No completed native launch established. Revision 6
handles data-method Promise/Observable result once; cold-operation hypothesis
is not yet verified. 48 tests passed. Values/raw errors withheld; policy unchanged.


## Owner extraction and planning additions saved

HANDOFF-NOTES.md now records LAN TV support as part of Vite/Tailscale extraction
and the new request to configure Tailscale connection from Mist. Planning request
only; no Tailscale changes. Bounded canonical queue search found related DS8
history but no explicit matching UI configuration item; Claude must reconcile.
Revision 6 observed Promise rejection, not a completed native test-app launch.

Revision 7 served HTTP 200; launch API SUCCESS. Canonical restart --no-proxy PID 26804. Commit 2700433, 50 tests passed; actual error shape/policy events await photo. Commit c78dbea records new owner extraction/Tailscale planning requests. Temporary SDK diagnostic active; no Tailscale config change, no push.


## Current: measured diagnostic CSP blocked the TV SDK transport

Revision 7 owner photo: repeated connect-src blocks to http://127.0.0.1:7346.
This is our diagnostic policy, not proof of native lockout. Revision 8 permits
only that TV-loopback origin on diagnostic page and retests the authorized command.
Normal summary policy/LAN bounds unchanged, no new port/tunnel. 50 tests passed.
LAN extraction and in-Mist Tailscale configuration planning requests retained
in HANDOFF-NOTES.md; final Claude handoff remains deferred.

Revision 8 HTTP 200, diagnostic exact loopback connect origin and normal self-only CSP read back. Launch API SUCCESS. Canonical restart --no-proxy PID 27780. Commit 8ce4046, no push. Actual permitted-bridge command outcome pending. Temporary diagnostic exception active; no LAN socket/firewall/Tailscale change.


## Live read-only SDK and diagnostic channel confirmed

Matching revision-10 run returned state resolved, SDK ready, version prod 64.37
and 256 bounded method records. Snapshot in Forge console-tv/research. No Home
tile exists yet. Forge review 1f93554 and handoff review 2b819e6 pushed and remote
heads read back. Extra source-capture approval requested separately; not active.


## Memory-only SDK capture executed and retired

Owner approved one fixed SDK capture. 299586 bytes; SHA-256 9579ff1eeca0af2c9c1ce095480048dace96d509e6814539a390def3d4c88029. Parsed without execution; only sanitized findings saved in Forge. Raw vault released (HTTP204, available=false), source routes removed. Store API maps app/store/get and app/store/set; not proven Home installer. Test-app helper is browser navigation. Native Home tile still unresolved. Current running dock pointer: codex/mist-console-tv-2026-10-17/PROGRESS.md.


Owner photo confirms the actual Vizio API TEST APP rendered, with Legacy and New Modular API cards. Bounded Right/OK navigation accepted toward modular API. Store getter unused Mist key resolved undefined; no writes. 63 tests passed. Forge8a2edcd remote verified. Home tile remains unresolved.


Current checkpoint Forge7f54dcc: test UI captured once under separate approval; raw released and routes404. Sanitized registry312 accepted records, not314 full coverage. Native catalog sectionsVIZIOApps/VirtualInputs/AppMigration and sctv returnedobject versus absent-controlnull. 67 tests pass. Only types returned; no config values/writes. Bounded catalog structure projection proposal pending in Forge research/catalog-shape-plan.md.


Latest currentcheckpoint Forge42663fd: 76tests; automatedcatalogshapes18/2/654(capped128). _docker puregetterundefined. SpeechAPIresolved but ownerNoSound; no settingschanged. HEADinstall/scpl500sameasabsentcontrol; no installerproof. NextlookupConjure17nativeappinfo vsabsentcontrol. Rawcapture routesretired. Fullfinalhandoffdeferred.
