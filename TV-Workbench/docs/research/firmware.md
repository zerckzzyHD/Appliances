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

## Native Home-consumer trace: 2026-10-25 follow-up

**Result:** direct inspection establishes a source-level config -> registry ->
Home-alias -> app-return chain in the supplied 5691 OSS family. It also finds a
controller constraint: the default Loki Home removes `uri` from launch data.
This is a replacement-entry research candidate, not a working replacement,
stock-grid editor or writable retail contract.

**Artifact-location correction:** the previous audit left the native source
unlocated. Existing extracted OSS copies were found under the original TV
workspace's `work/reference/vizio5691-focus/` and `vizio5691-routing/`.
Nine implementation files matched their recorded extraction SHA-256 values;
`appsdatabase.cpp` also matches the committed asset-admission receipt. No new
extraction, source capture or raw SDK access was needed. This supersedes the
artifact gap for this historical consumer only. Production Home-grid source and
exact retail-build identity remain missing. The prior audit/receipt stays dated.
The [trace receipt](../../evidence/provenance/home-consumer-trace-2026-10-25.json)
records hashes, source coordinates, search limits and validation.

Coordinates below are relative to `rootfs/ViziOS/` in the supplied archive, not
Git source revisions or newly acquired device files. The archive's recorded
SHA-256 is `b89f726e47ac4dae2c4370cf0748036f3a8076f7f98b2942b7b2c29d73a8ac91`;
the whole archive was not rehashed this turn and its vendor digest remains
independently unverified. Matching extracted files does not identify installed
firmware on either local TV.

| Link / branch                | Direct source evidence                                                                                                                                                                                                                                         | Limit / implication                                                                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Setting producer             | `feature-manager/src/main.cpp:375-415`: top-level `Orchestrator.HomePage` string -> `/app/platformorchestrator/settings/homePage`; then parent settings value `reload`.                                                                                        | This input is not `SmartCastHome` and not the generic TV KV store. No reachable setter follows.                                                                                                                     |
| Registry storage             | Same file `131-140`: update existing node, otherwise create with `SYSREG_FLAG_TMP_STORAGE`.                                                                                                                                                                    | Newly created projection requests temporary storage. Existing-node persistence semantics and reboot survival are not established here.                                                                              |
| Config lifecycle             | Same file `884-901`, `1036-1057`, `1077-1095`: parse config file, call producer on initialization; close-write/create/moved-to notifications on selected path call config handler.                                                                             | Selected-path resolver is called but not defined in this retained main file. File/config acquisition and admission are not equivalent to writable access. No lifecycle test ran.                                    |
| Registry consumer            | `platform_orchestrator/src/include/priv_common.h:22`; `src/appsdatabase.cpp:1282-1303`: resolve `spock://homePage`, merge `uri` into its controller parameters, `addOrUpdate`.                                                                                 | Changes an app description; does not select a controller or edit a visible grid.                                                                                                                                    |
| Publication / refresh        | `src/include/priv_common.h:396-399`; `src/appsdatabase.cpp:949-980,1020-1038,1390-1434`: merge patch, in-memory map update, registry publication; settings/fallback subscriptions rerun default updates; initialization does too.                              | No disk save or direct navigation in these update methods. A registry callback is not proof that the displayed page reloads.                                                                                        |
| Fallback precedence          | `src/appsdatabase.cpp:435-444,1306-1345,1390-1392`: default Home is `vizios-home`/`loki`; SCTV is `browser`. URI update runs before fallback alias/input/legacy swap.                                                                                          | A swap retains each app's controller/parameters. A URI applied to the old alias owner does not automatically transfer to the new owner. Subsequent updates resolve the then-current owner. No flag change proposed. |
| Controller effect            | `src/spock/browserappcontroller.cpp:23-31,98-100,161-169`: browser consumes URI, rejects a changed URI as an in-place context update. `src/spock/lokiappcontroller.cpp:294-308,448-463`: default Loki launch removes URI; only `loki_v1` takes the URI branch. | `Orchestrator.HomePage` is not a universal HTTP replacement knob. Default Loki continues using bundle/app parameters. Active branch, launch validation and recreation must be established separately.               |
| App-return entry             | `src/appsdatabase.cpp:1130-1133,1519-1525`; `src/appmanager.cpp:658-679`: target-app-close handler resolves Home alias and chooses it by default, with previous-app-exited metadata.                                                                           | An on-close target or app-switch filter can redirect. This is static return routing, not a local observed app exit.                                                                                                 |
| Boot / physical Home ceiling | `src/orchestrator.cpp:968-980`: boot module chooses first app when present; otherwise Home alias. `src/keymanager.cpp:192-197`: Home goes to hotkey callback; inspected binding `src/nextgenmtkinterfacelayer.cpp:85-98` records wake-key information.         | Do not generalize the fallback boot branch to every cold boot. Physical Home-key -> alias routing was not established by this bounded trace.                                                                        |

**Writer, durability and reversal:** source identifies feature-manager as a
registry producer, not an owner-accessible save API. Neither generic store writes
nor a `SmartCastHome` prefix bridge to this `Orchestrator` input in the inspected
chain. No original settings were read or changed. Reapplying a prior URI cannot
be promised as reversal: alias/controller selection, config precedence and
refresh behavior matter, and removing a missing field does not execute a restore
branch in `handleOrchestratorConfigUpdate`. A known baseline and a tested stock
fallback are still prerequisites to any future persistent experiment. Access,
grid/promotional control, standby/reboot persistence, image acceptance and
firmware recovery remain separate and unestablished.

**Next decision:** resolve applicability of the concrete controller branch on
the living-room target before designing a write. First prefer an already eligible,
build-identified configuration or factory-selection artifact; the traced source
defaults alone do not identify the retail branch. If that artifact is unavailable,
a later bounded read-only proposal should answer current build, effective Home provider/controller and
whether that build exposes the named config through an allowed read interface;
version agreement alone is insufficient. No such device request is authorized
or run here. Physical Home-key routing remains a separate exact source question
if that entry behavior is selected. Stop this batch at the immediate producer,
alias/fallback and return consumer rather than widening into every registry
writer. G1 remains paused and independent. REA adds no missing runtime evidence.

## Controller applicability check: 2026-10-25

**Outcome: Loki is consistent with the source default and the owner's current
recollection; the living-room TV's effective controller is not confirmed.**
This pass inspected retained factory/build selectors and sanitized records, not
the TV. The [receipt](../../evidence/provenance/home-controller-applicability-2026-10-25.json)
records source hashes and bounded inputs. No build-identified retail config or
saved effective Home-provider/controller value was established in that scope.

| Discriminator                    | Inspected evidence                                                                                                                                                                                                                                                                                                                                         | Consequence                                                                                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Factory support versus selection | `platform_orchestrator/src/orchestrator.cpp:265-295` registers common Loki factory; `src/platform/mtk/platformadapter_mtk202X.cpp:729-762` registers browser factory. `src/spock/browserappcontrollerfactory.cpp:11-16` accepts controller `browser`; `src/appmanager.cpp:390-417` takes the first accepting factory only when no instance already exists. | Both available is not evidence of which owns Home. Effective app description and instance lifecycle matter. Existing Loki acceptance/default behavior remains in the preceding trace.                                                  |
| Fallback producer                | `feature-manager/src/main.cpp:61,960-981,1060-1074` reads the capabilities file and `VIZIOS_CONJURE_HOME_FALLBACK` (default false), then calls `updateRegistry` for `conjure_home_fallback`.                                                                                                                                                               | This is a concrete producer lead. The helper definition was not located in the retained feature-manager subset; boolean serialization to the consumer's literal `on` remains untraced. The retail file/value is not retained evidence. |
| Build/config selection           | `platform_orchestrator/src/platformadapter.cpp:10-27` selects vendor adapter; `src/utils.cpp:216-236` selects MTK config path by vendor and file existence.                                                                                                                                                                                                | No exact V435-J01 installed-build binding. Mutable-file precedence is not proof of which file exists or its values on the TV.                                                                                                          |
| Current-app interface            | `src/orchestrator.cpp:1221-1238` returns legacy identity; `src/apibuilder.cpp:130-143` serializes APP_ID, namespace and MESSAGE, not native controller. Prior fallback swaps preserve legacy identity.                                                                                                                                                     | Historical namespace 4/app 1 cannot discriminate Loki/browser. Current app need not be the configured Home provider. Do not repeat this getter alone as a controller test.                                                             |
| Retained live-derived records    | Source-mapping probe reports Orchestrator `null`; Home/Chromium sections object types. Home-reference probes retain only string types. Version sample is dated `prod 64.37`. No effective-controller field was found in the inspected sanitized evidence.                                                                                                  | Null does not distinguish absence, access failure or contract differences. String/object type and version do not identify Home's destination/controller.                                                                               |

The owner recollection is retained as a lead, not upgraded to an observation of
the current controller. The inspected source still favors Loki as the default
candidate; no new evidence selects browser or proves the fallback's runtime value.
No raw/private config, retired SDK capture or unrelated machine state was read.

**Next exact gap:** a bounded read interface that resolves native Home alias ->
effective application -> controller, on the exact retail build. Native registry
publication is known, but its availability through an owner-accessible read API
is not established. The [metadata contract](../experiments/home-actions.md#home-controller-identification-proposal-not-runnable)
is prepared with that prerequisite explicit. Do not substitute a flag write,
generic config dump, token bootstrap, launch or a guessed registry endpoint.
No executable controller probe is ready or run. G1 remains paused independently.

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
