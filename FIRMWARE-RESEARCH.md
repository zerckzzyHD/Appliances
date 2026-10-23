# USB and firmware research

## Owner scope, 2026-10-17

Continue investigating a native Mist Home tile, including USB and firmware/software
reverse engineering with REA. No vendor submissions, partner applications, accounts
or contact. The previously opened unsubmitted form was closed; nothing was submitted.
This supersedes treating vendor onboarding as the next owner action. Research and
local preparation are authorized; no concrete flash, reset, configuration change or
device write has been approved. Keep the demonstrated Console client intact.

Owner has a USB SD-card reader and SD card, described as D:. It was unplugged during
the inventory. Owner says its one file is backed up on another laptop and removal is
acceptable. Neither backup nor card identity has been inspected. Windows reported no
D: volume/partition and only C: as a filesystem drive. No card contents were opened,
deleted, formatted or written. Owner was asked to connect it to the Ally and cancel
any Windows format/repair prompt. TV compatibility of this reader/card is unknown.

## Current TV software baseline: observed

Authenticated read-only GET /system/versions returned HTTP 200, application/json.
System.Text.Json parsed the response successfully; PowerShell ConvertFrom-Json's
default object mode failed because the response contains case-distinct property
names such as FIRMWARE/firmware and SCPL/scpl. Root is STATUS, ITEM, URI; component
versions are in ITEM.VALUE. Raw responses and device identifier values were not
saved. Allowlisted version fields read on 2026-10-17:

| Component          | TV-reported value  |
| ------------------ | ------------------ |
| FIRMWARE           | 1.720.9.1-1        |
| SCPL               | 3.8.1-2626.0002    |
| home               | 26.10.01           |
| system-ui-app      | 2.5.0-2328.17760   |
| system-ui-app-lite | 1.0.1-2248.965     |
| vizios             | mtk5691-1.6.1670.1 |
| castshell          | 0.71.0.3           |
| chromium-libs      | 1.0.0              |
| bsp-patcher        | 1.0                |
| osu                | 1.3.18             |
| sc-config          | PROD v64.37        |
| scu                | 1.4.5-2139.1374    |
| sshd               | 7.1.1              |

These strings establish neither physical board/SoC identity nor update compatibility,
service reachability, debug enablement or a cause/fix for the Home-order regression.
In particular, an sshd component version is not evidence of an accessible shell.
Compare this baseline with a later natural reset if investigating HOME-LAYOUT.md.

## REA reference checkout: observed/source-derived

Cloned https://github.com/morluto/rea into workspace-local work/reference/rea,
verified origin and HEAD f5fcf5216ffb3a266b8c00f6d9a0943051084ab5.
package.json identifies rea-agents 6.5.0. Read AGENTS.md and
docs/firmware-analysis.md. No setup, dependency installation, MCP registration,
third-party executable or firmware analysis was run.

At this revision, REA's documented firmware lane uses caller-supplied Binwalk 3.1.x
and Unblob 26.6.x plus Linux prlimit/process tooling. Its verified platform is Linux
x64; nonempty firmware inputs are capped at 128 MiB. It inspects/extracts acquired
files without device writes. It does not add a Vizio USB installer, raw flash load
profile, bootloader/device-tree semantics or hardware capture. On this Ally,
wsl --list --quiet reports WSL is not installed. Do not install WSL or run REA setup
merely to satisfy a speculative tool path before obtaining an applicable artifact.

Primary source:
https://github.com/morluto/rea/blob/f5fcf5216ffb3a266b8c00f6d9a0943051084ab5/docs/firmware-analysis.md

Additional candidate only: https://github.com/theubusu/unixtract documents Windows
extraction and some MediaTek/Novatek TV formats. Its support list does not establish
compatibility with this TV's package; no binary downloaded or executed. The README
explicitly excludes repacking. Choose an extractor from actual package bytes/header,
not the Vizio brand or a filename from another board.

## Acquisition and recovery ceiling

No verified V435-J01 firmware package, its digest, signed-container format, board
compatibility rule or recovery procedure has been acquired. The official
https://support.vizio.com/s/article/Firmware-Information-174?language=en_US
returned Loading/CSS Error in this pass; it supplied no read instructions or image.
Public searches for this model/version/MTK5691 did not produce a verified image.
Do not turn a search miss into proof that no image or USB method exists.

Next: identify the attached removable medium without changing it; acquire an
exact-model applicable firmware artifact from a traceable source; record URL,
size/hash and header; inspect container/admission/recovery constraints locally;
then select a supported analysis environment. A USB media/update path alone is
not evidence of arbitrary app installation or permanent Home-tile registration.
No flash/update/reset, guessed write endpoint, network interception, root/debug
activation, formatting, notification or background watcher was performed.

## Connected card and historical access leads

After the owner connected the reader, Get-Volume/Get-Partition/Get-Disk observed:
D:, Removable, FAT32, Healthy; volume 31,902,400,512 bytes, free 31,902,236,672;
USB disk 1, MBR, 31,914,983,424 bytes, IsBoot=False, IsSystem=False. This supersedes
the earlier absence, without establishing TV support. No file inventory or writes
were needed; the existing file remains intact and no formatting is necessary.

Inspected a source-only reference checkout of
https://github.com/noktirnal42/VizioRemote at
58f3b31cc45694ac8734e0f3aaf0b75173349f3e. Its recorded downloaded image is for
WHD32M-1030/MT5586, not this model, and is not a candidate to flash here. Its
source/acquisition research led to the primary historical USB advisory:
https://www.eltoncyber.com/advisories/vizio-tv-code-execution-from-a-usb-drive
L9-44-477 describes USB/web-root code execution on 2017 E50x-E1 and 2018 P65-F1,
with listed firmware 6.0.31.4-2 and 10.0.31.4-2. It does not establish V435-J01
compatibility. No CGI, executable or payload was prepared, copied or launched.

Two bounded TCP connection attempts from the Ally to TV ports 12345 (historical
advisory web port) and 22 (SSH) did not connect within two seconds (Windows 10035).
No authentication, commands or HTTP request followed. This is LAN reachability
evidence only: localhost-only listeners and other ports remain unexamined. Do not
equate it with a firmware patch finding or proof that no USB path exists.

## Official artifact acquired and inspected

The real browser loaded the support articles that the web text tool could not.
Article 174 is for D60-F3/D70-F3, not this TV. Official support's model search led
to https://support.vizio.com/s/article/Firmware-Information-302?language=en_US,
which explicitly lists V435-J01 and offers version 1.710.30.5-1 at:
https://cdn.vizio.com/misc/FW/MG302/mg302-1.710.30.5-1F.utv
This supersedes the earlier acquisition gap; the artifact is older than the
installed version, and applicability is a vendor model-list statement, not an
executed compatibility/rollback test. The page's USB installation procedure calls
for factory reset, an empty FAT drive (2 GB recommended) and placing the UTV at
root. It is not a recovery guarantee or modified-image installation method.
No installation/reset was attempted. A single HEAD check for the installed version
under the same naming pattern returned 404; no version/path enumeration followed.

Downloaded into workspace work/firmware, outside Git and D:. Bytes 557545279;
SHA256 971ebf4f95da5058c999c17a171bf198ef30257b9bde4b885b6244868e90f967.
Its 7695-byte envelope declares RS512, MT5691 inner file
mt5691_MstarUpgrade_OTA.pkg, product code 00199D0302 and 107 encrypted blocks.
Declared payload plus envelope and 16-byte tags exactly matches file size.
JWT signature matches embedded leaf; leaf signature matches embedded intermediate.
Independent trust anchor/policy/revocation and payload integrity remain unverified.
The declared audience includes older versions; installed 1.720.9.1-1 is absent.
Audience interpretation/rollback behavior is not tested.

Source inspected from unixtract at 144cf51e3e1b6e832119fde60f676a6def8266f7,
specifically src/formats/utv_qterics/mod.rs. An authored Node inspector used built-in
crypto only, without installing software or persisting key material. All three
published catalog candidates (mg435, mg436, mg438) failed RSA-OAEP/SHA-1 unwrap;
no plaintext recovered. Code and sanitized JSON are under research/. Node syntax
check and actual execution against the downloaded package passed. REA was not run:
this 531.7 MiB input exceeds its documented 128 MiB firmware admission limit.

Reviewed the primary ViziOwn article:
https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/
Its old SCPL sideload exploit and filesystem edits are historical, not a verified
path for this firmware. Two authenticated GET-only checks on this TV, /install
and /scpl/, returned HTTP 500 with 218-byte responses; neither response matched
the documented sideload form or device-group message. No POST/upload/command was
issued. Generic errors establish neither handler presence nor patch status.

## Next prepared test and latest owner authorization

Owner explicitly permits testing/downloading software versions and REA and requests
a tracker in C:/Dev/!Mist. TV-RESEARCH-TRACKER.md there points into these canonical
component records. Owner is willing to reset for an established benefit; no reset
was issued, and a reset does not itself supply a firmware customization path.

Prepared research/mist-usb-check.html (395 bytes) and copied it exclusively to
D:/mist-usb-check.html; readback matched SHA256
d58d8fe9f5a658199f458bd72cb3da7654df21c88453c990f665aaa18091624d.
No scripts/external requests/executables/firmware. Existing card file preserved.
research/launch-usb-check.ps1 parses without errors and is not yet executed.
It requests http://127.0.0.1:12345/usbparts/sda1/mist-usb-check.html through the
existing paired Conjure launcher. This tests an unverified historical static-file
path from the TV itself; the LAN port timeout does not answer that question.
Owner has instructions to safely eject, connect to powered-on TV and say ready.
Awaiting physical insertion before launch. No code execution/root/tile claim follows
even if the static marker appears. No need to erase/format the card for this test.

## USB inserted and diagnostic launch issued

Owner supplied four photos (6702 through 6705) and reports automatic USB input
opening after insertion. Photos show USB1, Music/Video/Photo categories and root
browsing with System Volume Information visible. This establishes reader/card
recognition and media-browser access, not HTML exposure or executable access.
The HTML marker is absent from the photographed media views; those are category
views, not evidence that the file is missing from the card.

After the owner's ready response and existing test authorization, executed the
reviewed research/launch-usb-check.ps1 once. API RESULT: SUCCESS. Requested URL is
the exact historical localhost USB path recorded above. The owner was asked to
wait 15 seconds without remote interaction and report marker, black/error screen,
unchanged USB menu or another outcome. Display result remains pending; API
acceptance does not establish retrieval or rendering. No firmware/reset/shell
operation was issued, and no further URL variants were launched.

## Owner-requested repeat: Vizio Home, no marker

Owner thought remote interaction might have interrupted the first attempt and
explicitly requested a repeat. Executed the same unchanged launcher once more;
API RESULT: SUCCESS. Owner then reported the Vizio main menu, not the USB media
browser or USB-302 marker. A subsequent authenticated GET /app/current returned
SUCCESS and ITEM.VALUE APP_ID=1, NAME_SPACE=4. The owner observation establishes
the visible Home outcome; the API identifiers are recorded without independently
asserting an app-name mapping. The first current-app read assumed ITEMS and yielded
only status; a follow-up parsed the actual ITEM.VALUE structure.

This exact localhost:12345/usbparts/sda1 static HTML launch is not demonstrated
working on this firmware. Unknowns include whether the local service/path exists,
Conjure accepts this destination, and whether the document was requested/rendered.
No request log or TV browser error was obtained. Do not claim that USB itself failed
(media browsing succeeded), that HTML files cannot ever load, or that code access
is available. Do not repeat this exact test without new evidence or owner request.
No firmware/reset/formatting action followed the negative result.

## Older package, extractor coverage and Cast correction

Downloaded the source-linked historical archive directly from Vizio CDN:
https://cdn.vizio.com/misc/FW/MG302/1.10.15.5-4MG302.zip
HTTP 200, 522220291 bytes, SHA256
fd6665f1ecfb2687bcaa270a1322fd00a70fce2dcbd2239a7f95cdd916486f59.
ZIP contains mg302-1.10.15.5-4.utv (522219952 bytes) and updatelogic.txt (21 bytes,
just the UTV filename). The UTV remains Qterics, not the alternative older
UpdateLogic binary format; marker text filename alone is not format evidence.
UTV SHA256 bdd999e80a22bdfa31e3c0f348150309905d842cc78affca20d11c61295a2b66.
The same local inspector verified size framing and embedded signature consistency;
all three published candidates failed unwrap again. Sanitized result is
research/mg302-legacy-inspection.json. No plaintext recovered, installation or
V435-J01 compatibility established for this historical image. No file went to D:.

Reviewed openlgtv/epk2extract at 2b6af078b56dbedb89efc0f4943036150f1ecae9.
Its README supports MediaTek inner PKG among other formats; bounded source search
found no Qterics/MG302 implementation. It does not supply a demonstrated outer
decryption path. No build/install/execution of this reference checkout occurred.
Primary MediaTek August 2023 and February 2024 bulletins contain MT5691-family
entries such as CVE-2023-20809 and CVE-2024-20001 requiring existing System
privilege. These do not establish initial access or applicability/patch state on
this TV. No vulnerability payload was prepared or executed.

Important correction: the historical USB advisory used catt cast_site / Google
Cast; the first marker test used Conjure APP_ID=17. Its Home outcome does not test
the Cast receiver path. Targeted TCP checks: 5555 timed out; 8008 and 8009 connected.
GET http://192.168.4.20:8008/setup/eureka_info?options=detail returned HTTP 200;
allowlisted build_version 514379118, cast_build_revision
1.68.cast_20230306_0602_RC12.514379118, release_track stable-channel. Identifiers
and friendly names were not printed or saved. No broad scan or debug activation.

Installed PyChromecast 14.0.10 and its dependencies from PyPI into workspace-only
work/tools/cast, with pip --only-binary=:all: --target. No global installation,
PATH/MCP/startup changes, discovery or receiver registration. Its DashCast
controller uses receiver 84912283 / urn:x-cast:com.madmod.dashcast. References:
https://github.com/skorokithakis/catt/blob/master/catt/cli.py
https://github.com/skorokithakis/catt/blob/master/catt/controllers.py
https://github.com/home-assistant-libs/pychromecast/blob/master/pychromecast/controllers/dashcast.py

Research script cast-usb-check.py targets only the known TV; default is read-only
status, --launch is explicit. Initial Cast launch reported receiver ID 84912283
and successful send; owner saw just DashCast loading. Read-only follow-up showed
Application ready and the expected namespace. Source review of catt revealed its
documented DashCast readiness race: initial launch acceptance is not readiness.
Updated the script to wait for Application ready and check the URL message echo.
Repeated with this new evidence: receiver_ready, message_sent=true,
callback_received=true, receiver_echo_received=true, application_id=84912283.
Echo proves receiver handling of the URL message, not successful file retrieval or
pixels. Owner screen observation after this corrected send is pending. Sender
disconnected without stopping the receiver; no background process was installed.
This remains only the static HTML marker: no CGI, binary, firmware or root shell.

## Cast display results and controlled navigation comparison

Owner reports the readiness-corrected, echoed USB request still shows DashCast's
loading screen. That echo establishes receiver message handling, not retrieval.
Added --direct-navigation to test the receiver's documented force=true branch
(top-level navigation rather than an iframe) with the same static URL. Owner
subsequently reports a black screen, not USB-302. Exact USB document retrieval
remains unobserved; there is still no root/firmware/tile capability finding.

Two direct-navigation commands ran. Their callback timeouts were initially
misinterpreted as send failures. Source inspection corrected that interpretation:
PyChromecast callbacks with request IDs await a receiver reply, but DashCast's
force branch schedules window.location then returns before sending its URL echo.
The second command used send_message directly and returned without a socket
exception. Updated the sender to omit the unused request ID/callback in direct
mode, report socket_write_returned separately and retain the connection briefly
for the published receiver's one-second navigation timer. No acknowledgement or
pixels are inferred from that report. Earlier timeouts are not USB failure proof.

To separate the USB path from Cast direct-navigation behavior, added an explicit
--lan-control target: the already approved existing summary page at
http://192.168.4.26:4176/. It requires --launch --direct-navigation. Preflight GET
returned HTTP 200 with MIST CONSOLE text. Executed one Cast LAN control:
receiver_ready, socket_write_returned, target=lan_control; no reply is expected in
this mode. Owner display observation is pending. No bind, firewall, Tailscale,
startup, Console content or firmware changes were made for this control.

## Control result and return to the demonstrated client

Owner reports the LAN Mist control also stayed black. Therefore these direct Cast
navigation results do not isolate USB file access: the same mechanism did not
display the independently HTTP-200 LAN page either. Do not label the result as a
confirmed absent USB web service, filesystem restriction, patched exploit or
firmware incompatibility. No browser error/request evidence resolves the cause.

Executed the existing bin/launch.ps1 once with the known Ally/TV addresses to
restore the Conjure client. API SUCCESS; owner then confirmed Mist visible again.
This establishes the original client remains displayable after these experiments.
Native Home tile, firmware plaintext, debug/root access and layout-reset fix
remain unestablished. No reset, downgrade, firmware installation, settings change
or further USB/Cast URL experiment followed. Stop repeating this test family
without new evidence. A matching decryption key, readable software dump or
documented board-specific service-access route is the next firmware prerequisite.

## Owner scope correction: software only

Owner explicitly rejects hardware work and soldering. Do not pursue TV opening,
UART/JTAG/eMMC connections, adapter/board purchases or physical modification.
The preceding hardware/service-path suggestion is superseded by this constraint.
Continue software/API and offline-image analysis only. No concrete software
unlock/native Home registration path is currently demonstrated.

Before this correction, public parts research found several V435-J01 variants,
including 756TXKCB02K071 and 756TXLCB02K039 associated by sellers with different
serial families. Neither the versions endpoint nor deviceinfo serial matched the
three reviewed mappings; identifiers were compared in memory, not printed, saved
or transmitted to a seller. No board was identified as installed in this unit.
The read-only deviceinfo endpoint now parses via System.Text.Json and reports
SYSTEM_INFO MODEL_NAME=V435-J01, MODEL_GROUP=302, CHIPSET=2, SOC=1, PANEL_TYPE=0,
VERSION=1.720.9.1-1. Numeric enums have no verified mapping here and must not be
converted to a physical chipset/board identity. No hardware action occurred.

## Continued software / firmware path after revision19

Owner explicitly wants to continue toward a native tile and is interested in
firmware/software download, modification and upload. The no-brick and software-only
constraints remain. This authorizes further offline research/preparation; no
specific firmware image, flash operation or recovery procedure has been selected.
Earlier no-device-write scope above is historical, not a reason to stop offline
analysis. Flashing has not been attempted or established safe.

Rechecked both existing artifacts by SHA256: 1.710.30.5-1F remains
971ebf4f95da5058c999c17a171bf198ef30257b9bde4b885b6244868e90f967;
1.10.15.5-4 remains
bdd999e80a22bdfa31e3c0f348150309905d842cc78affca20d11c61295a2b66.
No re-download needed. unixtract origin and remote HEAD read back at the same
144cf51e3e1b6e832119fde60f676a6def8266f7 as the inspected checkout. No new
extractor revision to justify repeating the same failed three-candidate decrypt.
Upstream README explicitly excludes repacking; extractor support is not a
modified-image installation capability. No new program or firmware executed.
Sources refreshed:
https://github.com/theubusu/unixtract
https://raw.githubusercontent.com/theubusu/unixtract/master/src/formats/utv_qterics/mod.rs

Priorities, with evidence needed to move each forward:
1. Home software/catalog consumer: identify the loader or fixed static asset that
   consumes the saved app order and route mapping. Start with existing sanitized
   metadata and public manufacturer resources; do not dump live configuration,
   accounts or secrets. Need an actual save contract before a reversible tile
   experiment. Generic SDK store and launch APIs have not supplied that contract.
2. Developer installer: obtain a concrete endpoint/package format applicable to
   retail firmware. TV Labs documentation describes Conjure ZIP installation in
   managed sessions; it does not specify the endpoint/body or promise Home tile
   persistence. A QA deployment guide explicitly requires vendor whitelisting.
   No vendor contact/account/submission, blind package upload or guessed write.
3. Firmware: trace an exact-current compatible artifact or an applicable plaintext
   analysis path. Separate outer decryption, inner filesystem extraction, format
   rebuilding, signature acceptance, rollback and recovery. None follows merely
   from a successful download. Need verified image acceptance and software-only
   recovery before proposing a concrete upload/flash. No key material in reports.

Primary deployment sources refreshed:
https://docs.tvlabs.ai/platform/platforms/smartcast
https://www.blackboxqa.ca/vizio-installation
https://github.com/socialvibe/truex-ctv-web-reference-app/blob/develop/platforms/Vizio/README.md

Tile status: unresolved, not proven impossible. Revisions18/19 gave no useful
known-Home positive control, so neither proves Conjure absent. This is a next-step
research plan; no Home consumer, installer or modifiable firmware was acquired in
this follow-up. Do not repeat identical SDK/USB/Cast tests without new evidence.

## Continued matching-family source lead

Found published public5691_FUR7.2_OpenSourceSoftware listing for1.720.X.Y:
https://github.com/opensource-vizio/5691_FUR7.2_OpenSourceSoftware
The organization README maps firmware prefix1->5691 and720->FUR7.2:
https://github.com/opensource-vizio
This supports a firmware-family lead for recorded1.720.9.1-1, not exact-build
source identity or a repack/install/recovery method. Root GitHub contents are only
README.md. Five README history revisions all point to a CloudFront download form;
latest9f03845a6db45d5d8b6bd2eb3e9c5420dac16078 names5691_OSS_FUR7.2.zip.
Gateway requires contact-details submission. No submission/contact/identity or
fake details supplied, no gate bypass, and no archive downloaded. No installable
modified image exists. Follow lawful publicly available source/mirror evidence;
retain no-vendor-contact and software-only scope. Detailed checks in HANDOFF-NOTES.

## Owner-supplied source archive acquired, 2026-10-18

Owner downloaded the matching source-family ZIP and expressly authorized fetching
it from their supplied Drive link. Acquired5691_OSS_FUR7.2.zip,7927233880 bytes,
SHA256 b89f726e47ac4dae2c4370cf0748036f3a8076f7f98b2942b7b2c29d73a8ac91.
Local artifact: original Codex workspace work/firmware/5691_OSS_FUR7.2.zip.
Drive source file1pSoheHhTeRIKE89LkxRlmqX9HEai9Kk-. This supersedes the prior
acquisition block: owner supplied the file; Codex did not submit the vendor form
or contact Vizio. No vendor digest independently acquired, so checksum identifies
the received bytes and does not certify manufacturer authenticity.

Download completed in123s, matching declared Content-Length. ZIP central directory
has23 entries,8000021680 declared uncompressed bytes; all23 outer-entry CRCs
passed a full16s read. No encrypted outer entries or absolute/parent traversal
paths observed. Nested archives are not all integrity-tested or inspected. No
archive-supplied code/script/installer was executed. Original8GB archive stays
outside Git; committed JSON contains bounded metadata/provenance only:
research/source-bundle-inspection-20261018.json.

Observed package contents and limits:
- Conjure.zip:9 entries, FFmpeg dependency build and libffmpeg.so; not the Conjure
  launcher implementation. README explicitly calls it Conjure Dependencies.
- Scpl.zip:47 entries,36 third-party Python source tarballs and build scripts;
  no application/bin/manage or SCPL route implementation in this small ZIP.
  Embedded README/build labels say FUR7.2 Build5583 despite outer5691 label.
  Do not silently treat that reuse/mismatch as exact installed-build identity.
- release-x.720.7.1-5583-5691-5695-5695s-20260312-54ff60.tar:2 entries,readme.md
  and nestedrelease.tar.gz; inner3.9GB archive not yet inventoried. README describes
  MT5583/5691/5695/5695s OSS-library/toolchain builds, not a retail install recipe.
- ViziOS-GPL_5691_FUR7.2.tar.gz:177009 tar entries,5247360335 member bytes;
  OSUpdater and ViziOS platform services are present as actual source. Bounded
  scan1490 files/6131365 bytes under ViziOS,OSUpdater,tools; no qterics or .utv
  lexical hits there. This is not a whole-package absence claim.

Eight selected document/source files (156873 bytes) and60 unpacker implementation
source files (155320 bytes) copied verbatim to workspace-local reference folders
for static reading; hashes retained. No source JSON sample, private-key file,
executable, or raw live-TV configuration was extracted. Focus source hashes in
metadata JSON. Archive instructions remain untrusted input, not commands to run.
In particular, scripts use host modifications/Docker, and one GPL build script
has a defaultmtk5695 target; no script was run or silently corrected for this TV.

Concrete source leads, paths relative to ViziOS-GPL archive:
1. rootfs/ViziOS/feature-manager/src/main.cpp:585-618 maps namespace4 to
   ChromiumHtmlAppUris and resolves APP_ID as a string-keyed URI. Our earlier
   VIZIOApps subset checks do not cover this distinct mapping. No new config
   read/export/write has yet been performed on TV for these newly identified keys.
2. feature-manager/doc/features.md:373-385 documents SmartCastHome config projected
   into system registry;348-354 documents SmartCastHome/LocalAssetsUri. These are
   source contracts, not exported live config values or a proven SDK write API.
3. platform_orchestrator/src/appsdatabase.cpp:949-980 publishes app descriptions,
   aliases and deeplinks into system registry;1282-1303 updates default Home/error/
   OOBE URI from registry settings;1399-1414 subscribes to settings/fallback changes.
   This is platform application routing, not proof it owns the visible Home grid's
   saved order or accepts a new tile through the network SDK.
4. rootfs/OSUpdater/osu/src/commands/scpl_command_handler.cpp:39-47 registers
   internalcheckForUpdate/startUpdates/rollback/decrypt;84-98 uses an IPC broker
   connected to SCPL.270-282 decrypt writes a destination using configured public
   certificate. Not a discovered HTTP endpoint and not invoked on either TV.
5. rootfs/OSUpdater/unpacker/src/decrypt.cpp:65-98 derives IV/key inputs from a
   configured certificate digest;116-126 separates a256-byte trailing signature;
   163-168 rejects failed verification. data_flow/impl/data_stream_digest_calculator
   usesSHA256;data_stream_decryptor_proxy.cpp:318 usesAES128CBC. This software-asset
   format differs from inspected JWT/AES-GCM Qterics UTV images. It does not decrypt
   our OTA packages or supply signing authority. No modified package produced.
6. OSUpdater README deployment assumes existing SCP/filesystem access and discusses
   development SELinux changes. Those instructions were NOT executed and do not
   establish a recoverable retail update path. Preserve existing security settings.

Next source-first questions: trace delivery and admission of the separate Home/
SC-ASSETS payloads; locate reachable read interfaces for the now-known mapping;
trace installer authorization and signature requirements before proposing writes.
No persistent tile, Home-order remedy, package upload, forced update, reset,
firmware flash or proven software-only recovery follows from this download.

Owner also offers bedroom TV for higher-risk testing, while preferring it remain
usable. Model, firmware and LAN address requested; no test, discovery, pairing or
command sent to a second device. Risk tolerance is recorded, not treated as an
identified flash target or permission to disable gates/security.

## REA applicability and bedroom baseline update

REA reference origin rechecked https://github.com/morluto/rea.git at pinned
f5fcf5216ffb3a266b8c00f6d9a0943051084ab5; package6.5.0. Read current checked-out
AGENTS/README/provider/firmware docs. No REA dependencies installed, provider
registered, agent config changed or third-party analysis/build code executed.
This checkout's firmware lane remains Linux-verified with128MiB admission; Windows
Ghidra P0 admits supported PE/raw inputs, not ELF. Neither Docker nor an analysis
provider was found on PATH. C++ source is directly readable; REA is a potential
later binary-analysis tool with a suitable provider/host, not a necessary C++
source reader or a newly demonstrated firmware-decryption capability. Earlier
commentary suggesting general C++ source benefit was corrected.

Owner photos identify bedroom target D32F-G4, firmware4.600.601.0-10,
SCPL3.0.12-2507.0002, ConjureMTKA-7.600.2, Home25.04.18; LAN192.168.4.23.
Photo serial/ESN/MAC/SSID values deliberately not copied into notes or source.
Different firmware family; never substitute the5691 source/UTV as its flash image.
Owner explicitly requires automated bedroom testing because IR navigation is slow
and no physical remote is available. Network control/readback is the plan, not
repeated photo/button loops. No riskier write was issued.

Unauthenticated bedroom HEAD checks: /scpl/install404 text/html, same-prefix
absent control404 text/html, /app/current403 application/json. Follow-up GET
/app/current parsed with HTTP-error allowance: REQUIRES_PAIRING. No main-TV token
reused. This does not establish installer absence or a patch state. Network
pairing started successfully; initial helper input was closed, so no supplied
PIN was submitted. Its pending challenge has bounded cancellation. Owner then
explicitly requested saving bedroom credentials like main TV; corrected helper
uses current-user Windows DPAPI, no plaintext file/log/command argument. New
pairing/save/readback results must be recorded after execution; not yet claimed.

## Asset delivery, admission and routing trace, 2026-10-18

Bedroom pairing pending text above is historical: saved DPAPI pairing and a
fresh-process authenticated200 SUCCESS were subsequently observed. See the latest
HANDOFF-NOTES.md section and research/probe-bedroom-control.ps1. This source pass
sent no new TV request and made no runtime configuration change.

Static source only, paths below relative to ViziOS-GPL_5691_FUR7.2.tar.gz.
Hash provenance and nested inventory: research/source-asset-admission-20261018.json.
Additional local source copies:140 updater C++/header files342011 bytes and183
orchestrator C++/header files1297527 bytes. No archive-supplied code executed,
no source copied into Git, no live TV/account/configuration data acquired.

- rootfs/OSUpdater/osu/src/manifest/impl/manifest_parser.cpp:24-52 parses separate
  SC-CONFIG and SC-ASSETS URL/hash/size records and manifest install-action and
  signature fields. Parsing a signature field is not itself signature validation.
- rootfs/OSUpdater/osu/src/asset_installers/impl/sc_assets_installer.cpp:42-85
  selects the alternate install location.88-105 obtains SC-ASSETS from the
  manifest, falling back to the config manager's local_apps_url. The log calls
  this LocalApps; the config provider parsing implementation was not traced.
- Same file143-172 sets up a temporary scfs destination, configured public key
  and decompression, then invokes unpacker.217-238 renames temporary assets after
  installation.255-290 syncs the web-server scfs symlink to installed assets,
  falling back to /application/scfs. This is a separate application/web-asset
  update lane, not a demonstrated persistent Home tile registration interface.
- rootfs/OSUpdater/osu/src/common/common.cpp:6-10 chooses public certificate path
  by target build. No certificate file was fetched from either TV.
- rootfs/OSUpdater/unpacker/src/unpacker.cpp:239-248 requires more than256 bytes;
  282-324 derives decryption inputs from the configured certificate and separates
  the trailing256-byte signature.328-353 streams decrypted/decompressed output;
  363-389 performs completion checks and rejects signature failure. Optional MD5
  is conditional on expected_md5; it must not be described as universally required.
  data_flow/crypt_utils.cpp:55-94 reads a public key and uses OpenSSL SHA256
  signature verification. This source does not provide signing authority; simply
  editing/repacking assets does not satisfy this validation. Actual retail
  acceptance/build identity and recovery remain untested.
- rootfs/OSUpdater/osu/src/manifest/impl/manifest_manager.cpp:139-201 handles
  INSTALL_NO, blacklist, required-app checks, current-manifest comparison and
  alternate manifest saving. These are additional observed policy checks, not a
  complete security audit. No manifest endpoint request, identity-bearing request
  body, bearer generation or vendor transaction was attempted.
- rootfs/ViziOS/platform_orchestrator/src/scpladapter.cpp:197-206 registers
  app/current and app/launch handlers. orchestrator.cpp:441-460 resolves a target
  to an app definition and switches it. appsdatabase.cpp:1020-1038 inserts into
  the in-memory map and publishes the database. These call paths do not establish
  a network registration writer, disk persistence or a visible Home-grid tile.

The formerly uninspected BSP release.tar.gz was streamed through all481417 tar
headers,10500715813 declared regular-file bytes,0 absolute/parent-traversal paths.
Entries:373812 under release/toolchain,107602 under release/apollo,2 under
release/docker and1 root entry. Path-term counts: u-boot1950,bootloader339;
scpl,conjure,chromium,sc-config,osupdater,platform_orchestrator,smartcasthome all0.
This is bounded filename evidence, not a content scan or proof proprietary
implementations cannot be embedded in nested archives. No members extracted or
build/bootloader scripts executed. No full recursive nested integrity claim.

Current useful distinction: namespace4 app routing, Home UI/catalog/order state,
and signed SC-ASSETS delivery are different contracts. Replacing an existing
route or whole Home is not acceptance for the owner's native tile goal. Next
research should identify the actual Home catalog registration/persistence
consumer or a model-compatible documented installation contract; do not replay
generic launch tests or flash this family archive onto the bedroom TV.
