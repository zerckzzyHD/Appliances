# Firmware and deeper access: evidence ceiling

The supplied7.927GB archive is an OSS/source bundle, not a proven flashable retail
image. Static inspection traced signed SC-ASSETS delivery and app routing; it did
not establish a compatible custom package, signing authority or recovery route.
No archive code executed and no TV firmware was written. Archive bytes stay out
of Git; historical records identify their external hashes.

The production native-notification dispatcher/transport and writable Home
membership/persistence remain unresolved. Bounded absence in source is not proof
that production implementations do not exist. Fixed internal demo/update alerts
are not appropriate substitutes for a custom notification test.

The externally supplied Vizio renderer-execution claim lacks a reproduced CVE,
model/build match and completed sandbox boundary. Samsung screenshots do not
establish a Vizio route. No update/security settings were changed from those posts.
Keep renderer execution, privilege, persistence, default Home and recovery distinct.

Research next only against a measured integration blocker. Before disruptive
device work: exact target/build, bounded experiment, reversal/recovery, explicit
owner approval. Do not flash the source-family archive onto the bedroom TV.

## Vizio prior-art leads: source-only review2026-10-25

The absence of a ready-made Vizio customization project in our earlier reference
set was not proof that nobody had investigated it. New source leads:

| Source                                                                                                                                         | Reported result and ceiling                                                                                                                                                                                                                                                     | Applicability                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [ViziOwn2021](https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/)                                                            | Historical persistent root research on older SmartCast builds.                                                                                                                                                                                                                  | Not current-model compatibility proof; earlier local header checks did not reproduce it.                                               |
| [smartcast-backdoor](https://github.com/vindeckyy/smartcast-backdoor/tree/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc)                            | Author reports webview/internal-API access and store writes on MT5586 onn65S4V4. Requires paired launch. Store persistence was checked across webview lifecycle, not reboot. No root console, OTA decryption, flash dump or UART result. Modal launch is not Home registration. | Different target from both local TV baselines. The report's untested physical-access assertions are not recovery evidence.             |
| [VizioRemote firmware setup](https://github.com/noktirnal42/VizioRemote/blob/58f3b31cc45694ac8734e0f3aaf0b75173349f3e/FIRMWARE_RE_COMPLETE.md) | MT5586 WHD32M-1030 research setup; explicitly blocked on encrypted image, missing root/ADB and hardware access.                                                                                                                                                                 | Title says complete setup, not completed decryption/custom flash. Hypothetical Android partition examples do not identify our layouts. |

These are author reports and inspected documentation, not independently
reproduced device results. No toolkit, payload or extracted third-party SDK was
executed or saved in this review. No TV call, setting, installer, image write or
new REA setup occurred. Do not promote config access into root, boot persistence,
a Home writer or firmware acceptance.

The implementation audit below supersedes the prior next-batch proposal. A
Home-layer route may avoid a firmware replacement, but no such integration is
demonstrated. Firmware analysis, access, Home ownership, persistence,
modified-image acceptance and model-specific recovery remain separate milestones.
No concrete flash is approved or proposed without those dependencies.

## Pinned implementation compatibility audit: 2026-10-25

Inspected public source as text through GitHub at
`aea6dec77bf3c6613c46b2ef45de5444e5f3dccc`: all six root Python/shell helpers,
`findings.md`, `payloads/README.md`, relevant README sections, and selected
definition/call-site slices in all three extracted JS artifacts. The recursive
tree was not truncated. This is a bounded contract audit, not a complete SDK,
native dispatcher or security audit. No third-party program executed and no
upstream source copy was saved locally. Public-source inspection is distinct
from the retired private TV source captures. Pins, blob IDs, local input hashes
and scope are in the [audit receipt](../../evidence/provenance/smartcast-compatibility-2026-10-25.json).

Evidence labels below: **STATIC** = inspected implementation; **REPORTED** =
author's device account, not our reproduction; **RETAINED** = dated local evidence.
Targets: **R** = reported onn 65S4V4 / W4K65M-1030, MT5586,
FW `86.920.9.3-2`, ViziOS `1.8.1767.1`, SCPL `3.7.3-2640`, SDK
`6.0.2-2636.9999`; **L** = living-room V435-J01, historical FW `1.720.9.1-1`,
ViziOS `mtk5691-1.6.1670.1`; **B** = bedroom D32F-G4, historical FW
`4.600.601.0-10`. L/B observations are dated, not current compatibility proof.

| Claim                     | Evidence / actual support                                                                                                                                                                                                        | Target                                                         | Unknown / consequence                                                                                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paired URL launch         | STATIC: `pwn.py` sends HTTPS 7345 `PUT /app/launch`, `VALUE` containing namespace 4, app ID string `3001`, URL in `MESSAGE`; requires a pairing credential and a TV-reachable HTTP origin. REPORTED: modal JS runs.              | R; L has a separately observed Conjure 17 display route        | 3001 behavior on L/B; SDK/native context; no pre-auth access or Home registration follows.                                                                                   |
| Internal API access       | STATIC: page fetches loopback 7346 `app/get_auth_token`, extracts `ITEM.VALUE`, then sends `AUTH` on store requests. REPORTED: tokenless bootstrap succeeded.                                                                    | R                                                              | Reachability, origin policy and response/auth contract on L/B. Pairing-token control and internal app-token access are different stages.                                     |
| Page app-launch contract  | STATIC: modular App export -> `lb` -> `fl.launchApp` -> `M.toAppInfo` -> `Jr.request`, PUT `app/launch`, `VALUE` normalized object. Legacy positional wrapper constructs that object and maps result to callback status.         | External SDK; RETAINED local `ll` trace has matching structure | Known external normalization, unverified local equivalence, page initialization/permission and installed destination. API success is not a visible launch.                   |
| Generic store read/write  | STATIC: direct PUT getter uses array `VALUE`; setter uses key/value map. SDK scalar getter sends a string; plural sends an array. SDK consumes `ITEM.VALUE`, while README illustrates `ITEMS` entries.                           | R source/report; L diagnostic resolved `undefined`             | Response-shape conflict is unresolved; missing key, shape mismatch and failure are not distinguished by local `undefined`. No permission or Home-writer conclusion.          |
| Configuration consumers   | STATIC: config client `ba` reads manifest properties/config roots; separate KV client `om` reads store. D-pad getter consumes store `SmartCastHome:isDpadEnabled`. Test-app helper consumes config debug/internal-mode keys.     | External SDK                                                   | Same-looking keys do not prove store -> config/registry propagation, reload semantics or grid/promotional control on any target.                                             |
| Modal/manual integration  | STATIC: `uml-bundle.js` reads manual URI templates and modal delay, gates on network/ToS/Cast state, redirects to manual URL; OK can exit. It does not implement the raw `MESSAGE` dispatch in this inspected bundle.            | R artifact                                                     | Native 3001 dispatch is not supplied here. Manual redirect and modal are not a Home grid, Home-key handler or autostart contract.                                            |
| Home ownership            | RETAINED: firmware source trace maps namespace 4 through `ChromiumHtmlAppUris`, projects SmartCastHome config into registry, updates default Home URI and subscribes to changes. REPORTED: modal ends on Home/app switch/reboot. | Historical source-family trace; R lifecycle report             | Missing bridge from specific writable store key/registration to actual Home consumer. Grid membership/order, promotions and replacement entry/return remain unknown for L/B. |
| Persistence               | REPORTED: marker read back from LAN after page/app lifecycle. STATIC: helper writes and immediately reads marker while page is still running.                                                                                    | R only                                                         | No independent post-page verification in helper, no reboot/standby/refresh proof, no persistent code or integrated Home.                                                     |
| Reversal                  | STATIC: after about 25 seconds helper launches namespace 4/app 1 with Home descriptor, then shuts its HTTP server. No original-value snapshot, deletion/restore of marker, readback or failure-safe finalizer.                   | R helper only                                                  | Returning to stock UI does not reverse configuration or restore prior playback. Local fallback and exact reversal remain unverified.                                         |
| Root / privilege          | REPORTED: no root console. Legacy exploit shell/probe code exists, but its presence does not establish execution on the reported build.                                                                                          | R; older ViziOwn is supporting history only                    | No local root or crossed privilege boundary; internal API access is separate.                                                                                                |
| Modified-image acceptance | REPORTED: OTA container parsed, not decrypted or flashed. RETAINED: signed software-asset delivery is a different traced contract.                                                                                               | R report; historical source-family trace                       | No signing authority or modified-image acceptance on L/B. Decryption alone would not establish acceptance.                                                                   |
| Recovery                  | REPORTED: no flash dump or UART work. The session account's physical-access confidence has no demonstrated recovery procedure.                                                                                                   | R report                                                       | No model-specific recovery for L/B, and stock-UI return is not firmware recovery.                                                                                            |

### Contract details and controls that change the interpretation

The external normalizer accepts an object (or JSON object string), converts
`NAME_SPACE` with its number converter, converts/trims `APP_ID` to a nonempty
string, and preserves remaining fields, including `MESSAGE`. This is a traced
external implementation, not permission to invent a local app object or choose
sample IDs. Its converter is not a strict namespace allowlist or installed-app
check. External SDK blob and local retained summary differ in bytes
(299,679 versus 299,586 UTF-8 bytes); minified binding `fl` versus `ll` is another
provenance distinction, not a semantic incompatibility finding.

Config client `pa` / instance `ba` splits colon paths into roots, merges manifest
`Properties`, caches results, and selects `app/config/get_properties` or
`app/config/get_property` by its version condition. Store client `om` instead
uses `app/store/get` / `set`. The inspected config reader does not establish that
writing the same colon key to store updates that cached config, native registry
or Home. The D-pad store consumer proves one specific use; it does not own tiles.
The extracted test UI checks presence of `bd`; the SDK launch helper checks
config before appending it. Those are separate client-side gates. Do not enable
debug flags or use deeplinks: the UI can select methods automatically on load.

`pwn.py` is unsuitable unchanged: default marker write; token and raw store-value
beacons in query strings; pairing-token printing; broad HTTP bind; beacon port
hardcoded to 8099 even when the server's `PORT` changes; truncation to 2,700
characters; a fixed wait instead of validated completion; automatic Home launch;
no write reversal or checked restoration. It does not load the companion SDK,
so its direct REST success would not verify the proposed page-native SDK path.
The final `done` beacon is not a semantic success check. Its server shutdown
does not establish restored TV state.

Other helpers are not safer substitutes: `recon.py` scans and over-interprets a
7345 handler as a likely legacy exploit; local retained header controls saw the
same 500 result on installer and absent paths. `cast_probe.py` actively launches
many candidate IDs. `viziown.sh`'s default probe attempts injection/upload;
shell/exec/unpack modes are consequential. Its shell mode references an undefined
`PAYLOAD_DIR` under `set -u`, another reason existence is not a runnable-path
claim. `tvapi.sh` includes pairing/location/raw operations. `castv2_enum.py`
connects and sends status/heartbeat requests. None ran.

### Smallest next experiment: one source-only Home-consumer trace

Question: does a concrete consumer connect a named setting/registration to the
visible Home surface, or to its entry/return routing? Prefer the default-Home
registry consumer already identified in the historical source trace: exact
`platform_orchestrator/src/appsdatabase.cpp` implementation around the recorded
default-URI update/subscription, or a build-identified Home loader/grid source.
Select one eligible artifact, revision and starting symbol first; follow only
the immediate relevant definition/call site. Record setting source -> reader ->
consumer -> reload trigger -> behavior, plus any defined writer and reversal.
Report a grid contract separately from a replacement-entry contract.

**Artifact gap:** the pinned public toolkit supplies neither that native registry
consumer nor production Home grid implementation. Existing local records contain
historical source coordinates/metadata, not this missing program. No new public
repository/revision for that implementation was established in this audit.
Do not repeat the same SDK scans, reopen retired raw captures or manufacture a
trace from summaries. The next trace needs an identified eligible implementation;
if unavailable, report that acquisition gap before any new processing. A bounded
absence rejects support in the inspected artifact, not the existence of a route.

If it identifies only another generic setter/manual/modal, stop that branch. A
real consumer would justify preparing a narrow contract-specific proposal;
it would still need exact target/build, baseline/fallback and reversal before
any approved change. A later metadata-only build/route compatibility read can
narrow applicability but does not substitute for the consumer. No token
bootstrap, marker write, firmware work or device request is part of this proposal.
G1 remains the prepared next live input experiment, paused for owner readiness,
independent of this source lane and REA. Direct inspection answered this batch;
REA would not supply the missing consumer artifact.

Pinned source locators (all at the audited revision):

- [Launcher and automatic return](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/pwn.py#L17-L99).
- [Companion SDK](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/extracted/companion-lib.js): `toAppInfo` on line 1; `fl`, `om`, `sm`, `lb`, `hC`, `uw`, `vw` on line 3. Precise character offsets are in the receipt because the file is minified.
- [Test UI](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/extracted/apiTestApp.js): line 12, launch descriptors and `cm` / `has("bd")`.
- [Manual bundle](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/extracted/uml-bundle.js#L1): `f`, `p`, `i`, `c` and startup handlers.
- [Author's target, lifecycle and limits](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/README.md): lines 101-137, 318, 459-518, 683, 1054-1062; [session account](https://github.com/vindeckyy/smartcast-backdoor/blob/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc/findings.md#L155-L181). Narrative success is not a published raw response/control corpus.
- Retained comparison: [G2/G3 ledger](../experiments/home-actions.md), [SDK findings](../../evidence/analysis/sdk-static-findings-20261017.json), [store diagnostic](../../evidence/analysis/sdk-store-diagnostic-20261017.json), [partial Home read](../../evidence/results/isolated-main-8668beae673964819195dce450d79d5e.json), historical firmware/source traces below. ViziOwn/VizioRemote remain supporting leads; no new reproduction is implied.

Evidence homes:

- [Firmware source trace](../history/import-2026-10-23/forge/FIRMWARE-RESEARCH.md).
- [Software entry history](../history/import-2026-10-23/forge/SOFTWARE-ENTRY-REVIEW.md).
- [Route audit](../history/import-2026-10-23/handoff/ROUTE-AUDIT-2026-10-21.md).
- [Sanitized analysis artifacts](../../evidence/analysis/).

Original paths in historical citations are preserved; use the [path map](../../evidence/provenance/path-map.json)
and [import receipt](../../evidence/provenance/import.json) to resolve their origin.

The [REA6.8.0 review](rea.md) separates JavaScript/offline-evidence opportunities
from firmware constraints. The previous firmware-focused tool assessment does
not rule out a static JS trial; no real artifact, recovery or TV privilege was
established by the release review.
