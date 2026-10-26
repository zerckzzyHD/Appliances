# GE speaker bulbs — current reconciliation and scene specification

Date: 2026-10-25. Revision: 3. Current proposal: **Last train home**, using the existing phone app and the lighting presets already reported responsive. Green is parked and is not a scene dependency.

This section is the current bulb planning proposal in this file. It supersedes the dated implementation/test-status statements in the preserved Revision 2 below. This is an owner-reviewable specification, not a certification or authorization to execute every proposed stage. The containing handoff repository is a noncanonical transfer dock; this file does not create a RobCo/Mist mission or runtime authority. No competing bulb queue or new TV work is introduced.

## R3.1 — Decisions and authority reconciled

- Retain the owner-approved atmospheric direction: rain at night, a quiet station, distant train braking, slow pink/purple/blue lighting and sparse fictional announcements. The lead scene remains **Last train home**.
- The owner resumed silent, supervised bulb testing at home on 2026-10-25, installed the existing IR app and imported the public profile. Those actions supersede the old planning-only/no-testing status for this session; they do not authorize a custom app, audio playback, debugging or unattended scenes.
- The owner explicitly deprioritized Green because the intended effect does not require it. Stop Green decoding work unless a later chosen scene needs it.
- USB control is unavailable with the reported broken dock. No ADB tools were installed, no debugging was enabled and no phone-to-Ally control was established. Do not make dock repair or USB a scene prerequisite.
- Current request is reconciliation and a specification only. No audio assets, executable profiles, macro, APK, service or scheduled job is created by this update; no playback, pairing or IR action is performed.
- The owner granted an exact exception to update only this file despite unrelated dirty work. Preserve the original Revision 2 bytes; leave all other files and Git untouched. Memory updates and public uploads are not part of this request.

## R3.2 — Evidence ledger: what tonight actually established

**OBSERVED** below means visible in supplied screenshots/photos, not independently operated by the agent. **OWNER-REPORTED** means the owner's account. **SOURCE** is static upstream implementation/documentation. **UNVERIFIED** identifies missing device evidence.

| Item | Evidence and scope | Limit / consequence |
| --- | --- | --- |
| App installation and phone | OWNER-REPORTED: OnePlus 15, app installed. OBSERVED: IR Blaster Remote-style creation, import and send screens. | Installed package, exact version, signing identity and emitter/carrier capability queries were not independently inspected. Do not infer installed parity with reviewed source. |
| First Red test | OWNER-REPORTED: the phone changed the lamps to red. OBSERVED: screenshot code 1FE807F (leading-zero normalization of 01FE807F), Hex/NEC, MSB compat, 38,000 Hz, 67 durations / 67,980 microseconds, and Test transmit sent; room photo shows two lamps red. | Source arithmetic explains the leading zero. Displayed waveform duration is not measured bulb latency. Exact send count, distance and repeat reliability were not recorded. |
| Imported lighting profile | OBSERVED: app preview recognized one remote and 16 buttons from ge_led_plus.ir. The user then tested it. | The original profile targets generic GE LED+, not an independently identified speaker-bulb revision. Import preview alone is not a device response. |
| Imported results | OWNER-REPORTED: every imported button except Green worked — 15 of 16 profile buttons. | This is not 15 independently witnessed tests, 15/16 of the physical remote, or a reliability denominator. Per-button repetition, precise brightness levels and each lamp's response were not separately recorded. |
| Green | OWNER-REPORTED: imported Green did nothing; a manual 38 kHz/MSB version also did nothing; original physical remote selects green. OBSERVED: imported Green displayed code 01FEA05F and a roughly 38.2 kHz waveform. | Cause unresolved. Neither frequency sensitivity, bulb fault nor a replacement command was established. Leave unsupported in automated scenes. |
| Physical remote | OBSERVED: front has power, Party Mode, Bluetooth, Parent Search, Smooth Fade, W, brightness, color arrows, Left/Mono/Right and media/volume controls. Back photo provides no readable model identifier. | The 16-button import is a lighting subset; no speaker/audio/grouping/party/fade command mapping was established. Do not assume independent bulb addressing or smooth fades. |
| Pairing, sound and scenes | UNVERIFIED: Bluetooth destination, audible routing, volume, stereo/group behavior, background playback, macros and synchronization. | Zero audio or scene tests are recorded in this session. No claim that Bluetooth controls lighting. |

Pinned imported file: [GE lighting profile](https://github.com/Lucaslhm/Flipper-IRDB/blob/829884b4a7a1458b76b33fc2b00b0e6feec28a06/LED_Lighting/GE/ge_led_plus.ir), blob 2fddf30a18d8a3f396c9fce087708e5a0cfaf38e. The file contains eight named colors plus power, brightness and white entries. Source-derived MSB representations: Red 01FE807F; Pink 01FE20DF; Purple 01FE10EF; Blue 01FE609F; Turquoise 01FEE01F. These representations are provenance, not instructions to transmit now. Only the owner's result categories above establish bulb responses.

Conversation evidence dates to 2026-10-25 in the current bulb session. Useful supplied attachment basenames: 6991.jpg (manual Red and send status), accompanying room photo (two red lamps), 6997.jpg (16-button import preview), 6998.jpg (Green details), and the subsequent front/back remote photos. Private images remain in their existing attachment location; none is copied into the dock or uploaded publicly.

## R3.3 — Product target and minimum scope

The experience should suggest shelter beside a nearly empty, rain-soaked transit platform late at night. Most of the time it should be comfortable enough to ignore; the occasional distant train and short PA line add place and depth.

Required for the first useful scene:

1. One local audio file with rain, restrained station/ventilation hum and one distant train arrival/braking event.
2. Static Pink for the first preview; Pink → Purple → Blue → Pink for the timed extension.
3. An optional original fictional announcement, with a no-announcement alternative.
4. Owner-chosen comfortable brightness and volume; understandable stop controls.
5. Finite playback and lighting sequence. The owner decides whether a longer version is useful afterward.

Not required: Green, a complete remote replica, custom Android development, USB/ADB, independent lamp control, beat synchronization, Bluetooth lighting control, Party Mode, pairing changes for stereo, or a promise of continuous RGB/fading. Color changes are discrete presets separated by long holds. Audio fades are a production choice; lamp fades are not established.

## R3.4 — Existing-app architecture and its limits

Preferred first arrangement: **phone → Bluetooth audio → intended speaker bulb/group**, with the same phone's internal IR controlling lights. GE documents Bluetooth audio in this product family; exact owned SKU and present routing still need an authorized check. The Ally remains optional for later playback, not a requirement with the dock unavailable.

Reviewed app source is pinned to c2fbf7887d594fd795393d0d7847771bc9ab9b2f (release label 3.4.6+49); the installed version is unknown.

- [Macro steps](https://github.com/iodn/android-ir-blaster/blob/c2fbf7887d594fd795393d0d7847771bc9ab9b2f/lib/models/macro_step.dart) define send, delay and manualContinue. A combined audio-playback step was not established by this review.
- [Macro runner](https://github.com/iodn/android-ir-blaster/blob/c2fbf7887d594fd795393d0d7847771bc9ab9b2f/lib/widgets/macro_run_screen.dart#L118-L125) cancels a running macro when hidden, paused or detached. Its send branch resolves a button, sends sequentially and stops on a missing button/error; these are SOURCE findings, not executed local tests.
- Therefore start audio first, then open the macro runner and leave it foreground with the phone aimed. Verify that the chosen player continues audio in the background. If it does not, use static lighting and foreground audio for the first scene; do not silently change battery/security settings.
- Source-level cancellation does not retract an IR command already sent and does not stop a separate audio player. Two starts are not one-button synchronization.
- Optional automation broadcasts are unnecessary for these initial stages. Do not enable that separate interface merely to run a local macro; the upstream documentation warns it allows installed apps to request transmissions.
- Confirm installed version, actual macro availability, stop behavior and screen/aim requirements before choosing the macro lane. No background or locked-screen reliability is promised.

## R3.5 — Proposed artistic specification

### Sound design and future assets

Use a stable rain bed with light roof/glass detail, a low ventilation/station hum and restrained distant ambience. One train arrives off in the distance: soft approach, braking, then a settling station bed. Keep the event distant enough to support the scene rather than demand attention. Avoid sudden horns or intrusive impact peaks.

Optional PA, original fictional line already proposed in Revision 2:

> The 02:17 service to the lower district is delayed. Please remain beneath the illuminated canopy.

The time and place are fictional content, not a real service or scheduled task. Use a generic synthesized announcement voice selected for intelligibility; no imitation of a real person or private voice recording. Keep it understandable at the agreed listening level; if it competes with the rain, adjust the mix or use the no-PA version.

Future production deliverables after authorization: a 60-second audio proof; a 180-second full scene with PA and a no-PA variant; a short cue sheet; a small provenance record for generated or licensed components. No assets exist from this task. Prefer original procedural/synthesized material or clearly reusable sources. Review the actual generation tool and usage terms when selected. No copyrighted film/game samples, new paid service, audio engine installation or remote publication is assumed.

Production targets, not measurements: gradual opening/closing audio fades, no clipping, restrained event peaks, consistent level between variants, and a common file format playable on the chosen phone. Decide the final format from the actual existing player rather than requiring another app. Speaker listening comfort is decided in the supervised preview; a file peak/loudness reading does not measure room volume.

### Proposed 180-second cue sheet — all times are design targets

| Audio-file time | Audio | Light |
| --- | --- | --- |
| 0–10 s | Rain and low station hum fade in. | Pink, at the pre-agreed brightness. |
| 10–45 s | Stable sheltered rain, sparse distant detail. | Hold Pink. |
| 45 s | Continue the bed without a sharp sound cue. | Change once to Purple. |
| 70–95 s | One distant train approach/brake/settle event. | Hold Purple; no flashes. |
| 105–115 s | Optional single PA line over a gently reduced ambience bed. | Hold Purple. |
| 125 s | Return to rain and station hum. | Change once to Blue. |
| 160 s | Scene settles; prepare the closing fade. | Return once to Pink. |
| 170–180 s | Audio fades to silence and playback ends. | Hold Pink; no automatic power-off. |

A future IR macro would contain four sends and waits between them, with an optional final wait to finish its display at 180 seconds; no repeat/loop. Starting brightness is established separately, not guessed in the macro. Cue times are relative to audio start. The audio file and macro may start at different times: record the actual offset or owner's estimate; IR response latency remains unmeasured. Proposed initial tolerance is roughly five seconds for broad color cues, not a measured timing result or beat-sync promise; agree it before testing.

## R3.6 — Staged execution plan and gates

| Stage | Agent work after that stage is authorized | Small owner involvement | Evidence to advance |
| --- | --- | --- | --- |
| A — preserve and choose scene controls | Guide export/backup of the working remote; record installed version and existing app behavior without private-phone inspection; select Pink/Purple/Blue plus one comfortable brightness and final state. | Save/export through app when requested; report any chosen control not behaving as expected. | Known starting state and a finite selected-control check, with per-lamp results if they differ. Existing 15/16 report is retained, not discarded or upgraded. |
| B — prepare 60-second preview | Produce the audio proof and validate duration/levels/provenance; use static Pink. No macro needed. | Approve asset generation separately, then confirm readiness and intended Bluetooth destination for playback. | Actual file exists, opens locally and passes offline checks; no device-performance claim yet. |
| C — supervised quiet audio proof | Guide connection to one agreed audio destination and one playback, using existing pairing if possible. | Set comfortable starting volume, know immediate pause/volume control, listen once for up to 60 seconds. | Audible destination, comfort and stop observed. No unwanted output, pairing reset or surprise switching. |
| D — 180-second manual scene | Produce full audio and cue sheet; guide one finite manual color sequence while it plays. | Start audio and make the three subsequent color changes, or leave static Pink if preferred for this review. | Mood/PA preference established, audio remains stable, chosen colors support the scene, normal completion and early stop are understandable. |
| E — existing-app timing, only if useful | Review installed macro/import format and button references; prepare one finite macro after approval, preferably imported rather than manually typed. | Start audio first, then macro; keep phone aimed and macro foreground. | Four intended sends, each observed or unknown; one cancellation test; no restart/loop; observed audio continuation and start offset. |
| F — longer-use decision | Reconcile results; change only demonstrated shortcomings. Consider one-button coordination/custom app only if the existing app cannot meet an agreed need. | Choose whether the preview is useful and whether longer playback/automation is wanted. | No unsupported seamless-loop, unattended, background, stereo or persistence claim. |

Stages B–F are proposals, not active execution. This request does not authorize audio generation or audible playback. A later request to create a preview can authorize asset work; device connection/playback still needs its stated target, volume/stop and supervision scope. No new phone setup, Bluetooth reset, purchase, listener or scheduling follows automatically.

## R3.7 — Acceptance, stopping and fallback

For the selected scene, record these separately:

- Recognizable mood: owner hears the intended rain/station/train space and likes the chosen palette.
- Control: selected colors and chosen brightness respond under the agreed aiming arrangement. Count attempts and observed responses for that batch; do not convert the generic 15/16 report into a reliability rate.
- Audio: intended bulb/group receives audio at a comfortable level, without an unwanted device taking playback.
- PA: understandable without an intrusive level change, or owner selects the no-PA variant.
- Timing: broad cues fall within the agreed tolerance, with the two-start offset recorded if a macro is used.
- Finite finish: audio ends at the planned duration; lamps remain Pink or another explicit owner-chosen final state.
- Early stop: pause/mute the audio immediately through the known player/phone control; cancel any macro separately. The current light remains until an explicitly chosen manual restoration command. Canceling a macro is not audio stop or rollback of prior colors.

First unexpected audio, missed/ambiguous destination, unwanted pairing/group change, uncomfortable sound, stuck macro or inability to stop: stop dependent steps and record the uncertainty. Do not automatically retry toggles, relaunch, reset pairing or power-cycle. Static Pink plus a finite audio file is a valid first effect if timed IR is inconvenient.

## R3.8 — Next concrete work and deferred decisions

Recommended next build deliverable, after explicit authorization: **one 60-second audio preview with static Pink**, not a custom app or full remote. First validate the atmosphere, Bluetooth output and comfort. Then add the three-minute color sequence if wanted.

Only choices needed at the next boundary: phone versus Ally audio source (phone is the current recommendation), whether to make a PA variant, and later the comfortable volume/target for the supervised playback. Exact bulb SKU, Green capture, stereo assignments, Party Mode and Smooth Fade can stay deferred because they are not required by this specification.

Tonight's outcomes are preserved as source/screenshot/owner-report categories. No Bluetooth audio, macro, scene, independent-lamp control or reliability run has been performed by this reconciliation. The TV remains paused; its saved commits are separate.

## R3.9 — Preservation and validation receipt

- Original Revision 2 file: 27,889 bytes; SHA-256 **644dfe17b9fd52b1285919568dbc2932a578b6acbbd17f067d7ed8499787f1f3**.
- Its full bytes are retained below, beginning at the historical title after the marker. Historical no-tests/no-install claims apply only to 2026-10-22 and are superseded for current state by R3.1–R3.2.
- This update changes only the owner-approved plan file. No backup copy, new queue, raw image, executable asset, audio file, memory update or Git mutation is created.
- Scope review: Astra supplied read-only planning advice from the evidence and draft summary, not a full-draft inspection or independent reproduction; final checks concern document integrity, not device certification. No software test suite is appropriate for this prose-only deposit; no device test is run during saving.
- Exact-byte preservation, strict UTF-8 decoding, replacement-character absence, local link targets and revision/source markers are checked by readback. Report their actual results in chat.

---

# Preserved Revision 2 — historical record, 2026-10-22

The following original document is preserved verbatim. Its status and authorization describe that earlier phase. Use Revision 3 above for the current proposal.

<!-- BEGIN ORIGINAL REVISION 2 BYTES -->
# GE RGB speaker bulb: provisional research, test, and app plan

Date: 2026-10-22. Revision: 2. Status: atmospheric creative direction OWNER APPROVED; implementation and device testing NOT STARTED.

## 1. Objective and current authorization

Replace the physical GE A21 RGB Speaker Bulb remote with phone controls, minimize owner effort, and investigate creative combinations of lighting and Bluetooth sound. Prefer a compatible existing app and an imported remote profile before considering a new Android app.

Current owner decision (2026-10-22): "Okay, mark that as owner approved. We won't test until I'm home and we'll focus atmospheric like that". Approval applies to the atmospheric creative direction: the tiny cyberpunk weather system and immersive fictional places built from layered ambience and slow lighting. All device testing, including silent IR tests, waits until the owner is home and resumes the test session. This does not lift the earlier no-build instruction or authorize installations, settings changes, audio playback or unattended tests now.

Current authorization covers research and saving this plan only. Do not build an app, create executable test tools or remote profiles, install software, change settings, connect debugging, transmit IR, play audio, schedule work, or purchase equipment in this phase. The owner explicitly permits continuing despite existing uncommitted work; this permits writing this new document without editing, staging, committing, or reverting other files. No remote Git operations or publication.

This plan is deliberately revisable. Research findings and real tests may change the app choice, codes, architecture, or required equipment. A future execution request must select the next phase and its device/settings permissions.

## 2. Established context and evidence ceiling

| Item | Evidence | What remains unknown |
| --- | --- | --- |
| Phone | Owner reports OnePlus 15, NA version, OxygenOS 16.0.10; screenshots show its built-in IR Remote app | Third-party emitter access and supported carrier ranges on this exact phone/build |
| Missing preset | Supplied screenshots show Lights category searches for GE and General without a matching GE entry | Whether another preset coincidentally shares codes; no need to guess through brands |
| Bulb | Owner identifies GE A21 RGB Speaker Bulb; supplied photo shows a combined lighting/audio remote | Exact SKU, hardware revision, remote identifier, bulb count, group behavior |
| Connectivity | GE describes this product family as Bluetooth audio with remote lighting control, without Wi-Fi being required [S1] | No established Wi-Fi control interface or Bluetooth lighting service |
| Available overnight setup | Phone goes to work with owner; no camera; all device testing deferred until owner is home | No emitter/observer left at home has been established |
| Sound testing | Atmospheric cyberpunk ambience is owner-approved as the creative focus; home testing starts with silent control checks | Volume, source device and Bluetooth latency; additional scene choices |

Remote photo visibly includes power, Bluetooth symbol, Parent Search, Party Mode, Smooth Fade, white/W, brightness controls, color arrows, playback controls and volume. Left/Mono/Right markings are also visible; inspect their physical control mechanism before treating each label as an independently transmitted command. These labels do not establish code values or exact behavior.

The earlier generic GE LED+ reverse-engineering project concerns a different remote [S2]. Its codes are candidates, not confirmation for this speaker bulb. An IR transmission returning successfully is not evidence that the bulb received it or changed state. No commands have been tested on this bulb. Source research is not a hardware test.

## 3. Recommended route and decision tree

1. Establish emitter access and obtain trustworthy command candidates.
2. Test a small imported profile in an existing Android app.
3. If basic control works, map the actual remote and add optional computer-driven test automation.
4. Build a custom app only if existing apps cannot provide the desired layout, evidence logging, or scenes.

Primary candidate for evaluation: Android IR Blaster, upstream project `iodn/android-ir-blaster` [S3]. Its documentation describes built-in IR, custom imports and optional automation broadcasts. Verify the available release actually contains these features; upstream documentation may describe newer code. Package identity, signing, permissions and release provenance need review before installation. Compatibility with this phone is UNTESTED.

Fallback candidate: irplus supports custom remote layouts and imported codes [S4]. It may suffice for manual control; do not assume modern OxygenOS compatibility or an automation interface.

Do not modify the stock OnePlus app or presume it accepts arbitrary code imports. Keep it as a useful existing control reference. If third-party IR access fails, document the failure before deciding whether an external transmitter is worthwhile; rooting or firmware changes are outside this plan.

## 4. Work split: maximum automation with little owner input

| Stage | Agent handles after phase authorization | Owner input that cannot be assumed away |
| --- | --- | --- |
| Research | Locate exact-model codes/manuals, compare sources, pin revisions, audit candidate app and release | Confirm SKU/remote identifier once, if available; no need to dismantle fixtures |
| Setup | Prepare one short install/setup checklist and one import file if an existing app is suitable | Approve installation/settings changes and accept Android prompts |
| First test | Prepare and select one command, preserve timing/encoding details | Aim phone, keep bulb powered, report changed/no change/unexpected behavior |
| Mapping | Generate small test batches and record results automatically where possible | Identify observed function only when required |
| Automation | Handle ADB commands, sequencing, app-scoped logs, comparisons and report generation | One-time trusted-computer approval and physical positioning |
| Sound session | Prepare effects, scene timing, volume limits and synchronized event logs | Approve audible test and judge volume, timing and experience |

Owner should never need to type hexadecimal codes, write files, use a terminal, or repeat large setup sequences. First session uses a small number of direct observations rather than an unattended command sweep. Treat setup duration as unknown until the phone is tested.

## 5. What can happen while the owner is at work

With the only known IR emitter in the owner's pocket and no home observer, no unattended end-to-end bulb test is currently feasible. Bluetooth audio availability elsewhere does not establish an IR lighting path. IR requires a local optical path; an internet connection does not supply one.

Useful work under the current planning scope: exact-model code research, app-source/release review, refinement of this document and test cases. Preparing executable profiles, harnesses, assets, or an APK requires a later implementation request. Nothing has been scheduled; a future background session must be explicitly arranged through a supported mechanism. Do not imply that this chat continues working by itself after the turn ends.

Current owner instruction prohibits testing while away, even if another emitter becomes available. Do not arrange an unattended workaround. If the owner later changes that instruction, separately reassess equipment, observation and permissions. Without an observer, classify sends only as attempted or transport-reported, never bulb behavior confirmed.

## 6. Phase A: exact identity, source research and emitter checks

Agent research tasks:

- Match the photographed remote to an exact bulb/remote revision using authoritative manuals and independent signal captures. Request only the missing product identifiers, not unrelated phone data.
- Search code repositories for this speaker variant. Preserve source URL, retrieval date, source revision where available, protocol, carrier frequency, address, command, bit order, repeat behavior and source-model identity.
- Maintain a small command registry with states: candidate, captured, tested-working, tested-no-response, ambiguous. Keep source claims separate from local observations.
- Assess whether an existing app can import and transmit known raw timings without modifying the stock app. Review permissions and release identity before proposing installation.

Future phone capability test: check `ConsumerIrManager.hasIrEmitter()` and `getCarrierFrequencies()` through an approved app. Android exposes `transmit(frequency, pattern)` using alternating on/off microseconds, with patterns shorter than two seconds [S5]. A null frequency result is a diagnostic condition, not proof that no emitter exists. A missing service or rejected send should be recorded, not hidden by a success-looking UI.

Do not assume the phone can receive or learn remote signals merely because it can transmit them. Android's cited API establishes transmission, not a general learning receiver. A camera seeing an IR flash would not establish the decoded command or accurate pulse timing.

Exit evidence: exact identity confirmed or explicitly unknown; chosen candidate app/version; emitter-access result; supported/unknown carrier; provenance for each first-test command. If no usable codes exist, move to capture rather than blind guessing.

## 7. Phase B: silent, supervised proof of control

Initial conditions: owner home, one powered target where practical, physical remote available, no music playing, phone aimed at target. Record original bulb state and any existing grouping without changing pairing. Establish that the physical remote controls the target before testing the phone. Ask whether a test may disturb other bulbs in the same optical area.

First candidate set from generic GE LED+ research: NEC address `0x80`; Red `0x01`, Green `0x05`, Blue `0x06` [S2]. The source does not establish these for this speaker model. Select one color command first and allow observation before sending another. Resolve carrier and encoding before transmission; do not label an assumed carrier as measured.

There is a real representation trap: a Flipper-IRDB contribution uses address bytes `80 7F 00 00` and complementary command bytes, whereas the original write-up names an address of `0x80` [S6]. Decode protocol semantics and validate emitted bits; do not blindly paste a little-endian field into an unrelated encoder. That contribution derives from the same generic source and is not independent speaker-model verification.

Proposed test cases, all UNEXECUTED:

| ID | Procedure | Required evidence |
| --- | --- | --- |
| T01 | Physical remote sends a known lighting command | Owner confirms target changed; record starting condition |
| T02 | One documented candidate color from phone | Send result plus observed changed/no change/ambiguous |
| T03 | If T02 worked, alternate two established colors three times each | Responses counted as N of 6, including misses |
| T04 | Repeat after reopening app and after a normal lock/unlock | Separate results for each condition; no assumption of background delivery |
| T05 | Test one additional distance/angle relevant to actual use | Record geometry and responses; establish practical aim requirement |
| T06 | Restore a previously established lighting setting | Owner confirms restoration; report if not observable |

Use approximately five seconds between exploratory commands so the owner can observe; adjust only for a stated test. Do not send unknown codes unattended: an assumed lighting command could mean something else on this model. No Bluetooth/pairing, Parent Search, volume, Party Mode, power cycling or broad scanning in this first batch. Silence means no deliberate audio; unexpected audio or behavior stops the batch immediately.

After a failed first command: verify app emitter detection, aim, phone case obstruction, carrier, format and positive control. Try at most three documented encoding/timing variants in one reviewed batch. If these fail, record no-response under tested conditions and move to better evidence; do not call the device incompatible.

## 8. Phase C: capture fallback and full mapping

If no matching library is found, a compatible external IR receiver/learning device can supply actual remote timings. Do not buy one or assume a specific dongle works without approval and compatibility research. Prefer an already-owned receiver if available.

Agent prepares the capture workflow. Owner presses each requested remote control once in a guided sequence; repeat only ambiguous captures. Capture several presses of representative keys and distinguish short press, held repeat and release behavior. Preserve raw captures, decoded interpretation, checksum/complement validation and source button photo reference. No firmware access or bulb disassembly is proposed.

Map lighting before audio and grouping. Test physical controls individually; do not infer their semantics from icons alone. Bluetooth pairing, parent search and stereo assignments get their own explicit, supervised session because they may affect current connections. Audio controls may operate through the bulb and its connected source; verify behavior instead of assuming the phone app can control arbitrary media devices.

Coverage report: observed controls mapped N of M after the remote inventory is resolved; list missing controls. Also report source-backed candidates separately from controls that produced observed responses. Disable or clearly label unresolved controls in any eventual app.

## 9. Phase D: optional computer-driven testing

Prefer temporary USB debugging to the Ally for a home session. Android requires developer/debugging setup and trusted-computer approval [S7]. Agent supplies exact instructions for this phone after verifying menu labels; owner handles permission prompts. Do not weaken device security, disable authorization expiry, expose ADB to the internet, or read messages/accounts/notifications. Collect only this app's diagnostics and necessary device capabilities.

The candidate IR Blaster project documents an opt-in explicit broadcast interface with result codes; it also warns that enabling it lets installed apps request IR sends [S3]. Treat enabling it as a separate informed setup decision. Prefer a shell-restricted interface in a custom harness if broad app access is unacceptable. Establish installed-version behavior before selecting either approach.

Proposed runner requirements: one command in flight, command allowlist, finite batch, no automatic retries of toggles, explicit delay, stop on disconnect/error/unexpected observation, stable test IDs, and no resume after a crash without re-arming. Default exploratory batch maximum: ten sends; no endless loops. The agent handles phone UI automation only through approved tools or purpose-built device APIs.

Log each attempt with timestamp, app/version, command-profile revision, carrier, raw-pattern hash, semantic command, send result, observation method, observed result and confidence. A broadcast return code only describes the transmission path. Require owner observation for bulb-state claims in the current setup.

Cleanup: disable any temporary automation interface; return debugging settings to the recorded original values when no longer needed; remove only temporary installed components if requested. Keep the physical remote and original stock app available. Do not promise automatic state restoration where only an unobserved toggle exists.

## 10. Conditional custom Android app specification

Build only after the command path is demonstrated and existing apps are assessed against actual needs. Use native Kotlin with a small UI; keep protocol/encoding separate from Android transmission and from the command registry. Choose current stable build tooling from official sources at implementation time. No dependency versions are pinned by this planning document.

Proposed modules/responsibilities:

- Remote profile: model/revision, button IDs, captured or sourced codes, carrier/repeats, provenance and evidence status. One editable authority; exportable versioned profiles.
- Encoder/validator: well-defined bit order, positive bounded durations, carrier checks and finite repeat limits. Keep raw timings as an option for unusual captures.
- Emitter adapter: `ConsumerIrManager`, capability detection, serialized sends and explicit errors. Required IR permission/feature declarations are checked against official Android documentation during implementation.
- UI: photo-derived controls, large touch targets, favorite scenes, clear Stop, test mode and accessible labels. Show requested/last-sent state; never present inferred state as live bulb feedback.
- Scene engine: cancellable finite sequences with separate lighting and audio actions. Keep unverified commands out of unattended scenes. First version operates in the foreground; background scheduling is a separate reliability decision.
- Diagnostics: app-scoped export with no personal identifiers, secrets or full-device logs. No internet permission needed for basic IR control. App storage and imports follow current Android rules.

Host-side tooling may generate profiles, compare captures and reports; it must not become a public remote-control endpoint. A browser page alone is not the proposed IR emitter; use a native Android component for the documented API.

Acceptance checks before a personal install candidate: repository-required lint/format/tests; encoder golden vectors against actual capture data; malformed profile rejection; no duplicate toggle on timeout; cancellation and disconnect behavior; accurate unknown-state UI; device tests for emitter and bulb response. An emulator can test UI/encoding, not certify physical IR output. Preserve local build/test output and APK hash. No publishing or remote Git changes. Local repository/branch and commit handling must be agreed before implementation, with existing work preserved.

## 11. Sound and light ideas for supervised home sessions

### Owner-approved focus: an atmospheric place inside the lamps

Lead concept: tiny cyberpunk weather system. Favor an immersive, comfortable environment over isolated novelty effects. Use a steady bed of rain, distant ventilation and muffled city life; occasional passing hover traffic and sparse fictional announcements supply detail. Lighting changes slowly between established blue, magenta and muted warm presets, subject to actual bulb capabilities. Avoid abrupt flashes and intrusive volume jumps.

First scene to develop in a later authorized implementation phase: **Last train home**. Rain against glass, a distant train braking, low station hum, and a sparse fictional transit announcement. Example original line: "The 02:17 service to the lower district is delayed. Please remain beneath the illuminated canopy." A tired pink lighting mood and a distant malfunctioning vending machine are optional details. The announcement time is fictional scene content, not a scheduled task.

Related variations: **Rainy apartment** (sheltered rain, room hum, distant traffic) and **Back-alley noodle shop** (rain under an awning, ventilation, muted street activity). These extend the approved atmospheric direction; individual sounds, mixes and behavior remain proposals for home review.

Proposed scene controls: ambience level, optional announcements, event density, lighting enable/disable, scene duration and immediate Stop. Keep a stable ambient bed with sparse events; introduce variation without repeatedly drawing attention to a short loop. Start with a finite preview before considering longer sessions. Evaluate comfort, loop repetition, intelligibility and whether the lighting supports the atmosphere. The agent handles sourcing/synthesis, mixing, timing and packaging after implementation authorization; owner chooses the mood and provides listening feedback.

The following wider brainstorm is retained as a secondary backlog. Atmospheric scenes take priority; the other concepts are not individually owner-approved for implementation or playback.

These are scene concepts, not demonstrated features. Bluetooth carries audio; IR carries lighting commands. Their timing paths are separate, so measure perceived lag before designing tight synchronization. Begin with a short quiet preview and a user-set volume ceiling. No surprise overnight playback, personal voice recordings, or microphone monitoring.

| Idea | Experience | Practical first experiment |
| --- | --- | --- |
| Spaceship reactor startup | Relay clicks, turbine rising, calm blue light settling after a warm-up sequence | One finite 10-second sequence with a visible Stop |
| Haunted radio station | Static, station tuning and a fictional transmission from inside the lamp | Pre-made audio with two established lighting changes |
| Tiny cyberpunk weather system | Rain, distant city ambience, passing hover traffic and a slow color scene | Stable ambience with sparse, gentle transitions |
| Portal opening | Low hum, expanding shimmer, a color transition and a quiet arrival chime | Compare audio-first versus light-first offsets |
| The lamp has opinions | A button plays a fictional robotic complaint, then reluctantly changes color | Curated local lines; no listening assistant required |
| Underwater research base | Sonar pings, distant metal creaks and blue/green ambience | Low-volume scene with an automatic end |
| Alien greenhouse | Gentle bioluminescent mood, strange birds and synth droplets | Color presets with a seamless ambient track |
| Impossible elevator | Elevator chime, doors, and a fictional floor announcement: lunar cafeteria or submarine deck | One tap per short scene, fully offline |
| Quest reward ritual | A deliberate button press triggers a short victory fanfare and a celebratory color | Trigger manually first; computer-event integration later |
| Robot assembly line | Servo chirps and coordinated bulb changes suggest a machine building something invisible | Short sequence using confirmed colors only |
| Interstellar dinner service | A polite fictional computer announces a ridiculous menu from deep space | Optional speech generation or prepared synthesized clips, no private names |
| Distributed room creature | Multiple bulbs appear to answer each other with calls and colors | Stretch goal only if independent channel/address control is demonstrated |

Agent grunt work after authorization: synthesize original effects or assemble assets with documented usage rights; normalize levels, create short previews, prepare scene timelines and offsets, and package one-touch controls. No copyrighted film/game sound clips are assumed available. Owner chooses favorites and listens; no audio editing required.

Do not promise continuous RGB values, precise dimming, independent control of every bulb, stereo placement, or beat synchronization. Start with confirmed presets. If all bulbs receive the same IR command or linked speakers duplicate audio, adapt scenes to that limitation. A scene can still be interesting with one color transition and well-designed sound.

## 12. Milestones and revision rules

| Milestone | Deliverable after authorization | Evidence needed to advance |
| --- | --- | --- |
| M0: this phase | Saved provisional plan | File readback and integrity checks only |
| M1: research narrowed | Exact identity or explicit gap; reviewed app/version; candidate registry | Source provenance, no invented matches |
| M2: silent control | Small imported remote or approved test app | Observed response and reliability denominator |
| M3: remote replacement | Mapped lighting and optional audio controls | Coverage N of M, unresolved controls listed |
| M4: automation | Cancellable finite runner | Error/disconnect/stop cases and observed bulb results |
| M5: creative scenes | Selected home sound/light experiences | Owner approval, volume and timing observations |

If the existing app covers the need, stop at a profile and scenes rather than build a duplicate. If generic codes fail, prioritize capture. If access requires weakening phone security, stop and report the constraint. If no observer is available, reduce claims rather than fabricate confirmation. If circumstances change, append a dated revision note and update the current plan deliberately; preserve prior research provenance and executed results.

Open decisions, answer only when needed: exact SKU/remote identifier; bulb count; whether other IR equipment is already available; preferred app install route; willingness to enable temporary debugging; acceptable starting sound level; additional atmospheric scene choices. The phone-away/no-camera/home-only-testing constraints and atmospheric priority are already answered and should not be asked again.

Revision history:

- Revision 1 (2026-10-22): initial research, staged test plan and creative backlog; no implementation or device tests.
- Revision 2 (2026-10-22): recorded owner approval of the atmospheric direction, made Last train home the lead proposed scene, retained other ideas as secondary backlog, and deferred every device test until the owner is home. No build or device action authorized or performed by this revision.

## 13. Sources and work actually performed

Sources consulted 2026-10-22. Web documentation supports proposals; installed-release behavior is untested.

- [S1: GE product family description](https://www.gelighting.com/led-lights/bulbs/medium-base/ge-led-speaker-lamp-led-light-bulbsgeneral-purpose-a21-bulb-9-watts-1): Bluetooth speaker, remote-controlled lighting; exact owned SKU not confirmed.
- [S2: Generic GE LED+ reverse engineering](https://hackaday.io/project/183381-ge-led-bulb-reverse-engineering): NEC/address and candidate lighting commands; different remote, unfinished investigation of extra functions.
- [S3: Android IR Blaster upstream](https://github.com/iodn/android-ir-blaster): import formats, built-in emitter and optional automation behavior. Documentation is not a release/device test.
- [S4: irplus upstream](https://irplus-remote.github.io/): custom/importable remote layouts; current phone compatibility untested.
- [S5: Android ConsumerIrManager](https://developer.android.com/reference/android/hardware/ConsumerIrManager): emitter detection, carrier query and transmission API.
- [S6: GE LED+ Flipper-IRDB contribution](https://github.com/Lucaslhm/Flipper-IRDB/pull/1070/files): alternative representation of generic GE codes, not a verified speaker-bulb profile; no assumption about merge/release status.
- [S7: Android hardware-device setup](https://developer.android.com/studio/run/device) and [ADB documentation](https://developer.android.com/tools/adb): device authorization and debug transport setup.
- [S8: OnePlus global specifications](https://www.oneplus.com/global/15/specs): lists infrared remote control. NA hardware identity is owner-reported; no direct third-party API test performed.

Work performed in this planning phase: reviewed supplied images and conversation constraints; browsed the listed technical sources; read repository identity and uncommitted-file names in the required handoff location; created this one document under the owner's exception. No existing work was edited or staged. The repository remote identifies `_RobCo-Agent-Handoff`; visibility UNVERIFIED. No app, profile, test harness, sound assets, installation, phone connection, device transmission, scheduled automation, commit or push was created by this planning phase.

Execution counts: 0 phone capability tests; 0 IR sends; 0 observed bulb responses; 0 audio tests. M0 document checks are reported in chat after saving and do not certify the proposed implementation.
