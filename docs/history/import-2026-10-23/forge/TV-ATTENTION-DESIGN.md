# Mist comes to the TV — design only

Priority update, 2026-10-23: this remains a secondary, unbuilt feature.
HOME-SPEC.md now governs the main customized ad-free Home goal; replacement Home
is acceptable. No toast API or default-Home integration is established. The
later observed Chromecast connection notice is a separate lead from the pairing
notice below. All device operations are held pending owner go-ahead.

Read-only measurement lead, 2026-10-23: vizaio documents GET /state_extended with
power/input/app/media fields and capability gating; its endpoint table corroborates
the path. See research/home-reference-projects.md. Existence, freshness and playing
semantics on our two builds are untested. Any later test must project bounded
approved states in memory, withhold identity/raw response and compare against
owner-observed native-app/HDMI states. Do not enable polling, automatic launches
or assume a media-state label covers all playback merely from this documentation.

Owner request, 2026-10-18. No feature, observer, event subscription, control or
TV experiment has been built or enabled for this proposal. This is separate from
the persistent native Home tile investigation. Owner resumed bedroom availability
later in this turn; the smallest measurement below remains main-only unless a
separate bedroom-specific plan is selected and approved.

## Presentation and controls

Prefer a small, silent native TV notice: **“Codex needs you”**, with no private
task text. A general-purpose, nonblocking native notification API is not yet
established. Owner clarified in this turn: during PIN pairing a **bottom-left
TV popup said successfully connected**. That is owner-observed system notice
behavior; the remembered similar Chromecast notice is historical recall. Neither
establishes an arbitrary-message API or a callable renderer. An in-page notice is
possible only while Mist is visible; it cannot promise an overlay over other apps.
Do not simulate a popup by launching Conjure over the current content.

One shared **TV attention** setting, OFF by default, appears in Mist App and
the existing normal Console controls. Suggested options: target, **Critical only**
(initial level) or **Decisions and completions**, **Movie mode**, and optional quiet
schedule in an explicit time zone. Show **Off / Quiet / Queued / Unavailable** and
the suppression reason. Both surfaces read and update one settings authority;
Claude must reconcile that authority before implementation. No controls on the TV
summary client or Forge's read-only `view/`, and no new LAN write route.

**Full Console launch** is a separate explicit opt-in. Reuse the existing launcher
and restricted LAN listener. No outside access, new service/task, firmware change,
TV settings change, wake command or automatic input switch. Default preference
is a verified nonblocking popup; if unsupported, queue the notice in Mist. Opening
the full Console is not an equivalent fallback.

## Triggers and quiet rules

- A new gate failure that needs owner action, a waiting decision, or a final run
  outcome can produce one attention event. A typed producer must identify event,
  run revision, severity and whether owner action is still required. Do not scrape
  console text or assume every failed/retried gate needs a person.
- Proposed defaults: batch for 60 seconds, deduplicate by event/run revision, at
  most one TV presentation per 30 minutes across automatic notices and launches,
  and expire stale items. Resolved decisions and superseded failures are removed.
  Re-enabling must not replay a backlog; retain a count and current items in Mist.
- Movie mode and scheduled quiet periods veto all automatic TV presentation,
  including critical notices. Critical-only filters severity; it never bypasses
  quiet mode or the TV-state guard. Manual **Open on TV now** is an explicit action.
- Missing, stale or conflicting state blocks a launch. Current app, a reachable
  network service and a configured power mode do not by themselves prove screen
  on, paused/playing state or safe idleness. HDMI and unrelated apps are occupied.
- Even a positively tested popup can distract: apply the same quiet/rate rules,
  keep it short, silent and without forced focus or navigation. Popup dismissal,
  focus and playback continuity need their own observed test.

Until reliable watching detection is established, no unattended full takeover.
An explicitly armed short availability window can authorize a future launch;
ordinary presence or a Home app ID is insufficient. Recheck immediately before
any launch, cancel on changed observations, and document the remaining race:
separate read and launch operations cannot guarantee atomic no-interruption.

## Measured evidence and limits

Existing paired Conjure launch displayed the Console and owner-confirmed freshness
after standby (`TV-ENTRY.md`, explicit relaunch record). Authenticated `/app/current`
and exact research-URL ownership checks have succeeded (`HANDOFF-NOTES.md`, saved
auth record; `research/run-target-research.ps1`, restoration guard). API acceptance
alone does not prove display or a new client acknowledgement.

`research/sdk-static-findings-20261017.json` lists `state/device/power_mode` and
`app/overlay`. The static test-UI registry names power getters. These are source
leads, not measured remotely callable getters, screen-on state or a popup API.
`getDevicePlaybackQualities` is not evidence that content is playing. No reliable
cross-app playback detector has been measured in the inspected evidence.
The registry's `subscribeToAppOverlayDisplayed` and `setAppOverlayListener` take
callbacks: they are subscription leads, not text-display commands.
`getIsItvNotificationsAccepted` / its setter belong to Consent; do not change
consent or mistake those names for a delivery mechanism. The next narrow offline
trace is those two subscription wrappers and their `app/overlay` binding.
The earlier Pushover success-notification idea in `TV-ENTRY.md` is a phone-service
proposal, not proof of an arbitrary TV toast. No notification credential was set.

## Smallest measurement and approval

First inspect existing static artifacts offline for the pairing-result and Cast
notice path, an actual bounded native notice call and its parameters; do not infer
semantics from `app/overlay` alone. Do not re-pair or launch Cast to redisplay it.
If a candidate exists, prepare a separate fixed-message test with no wake, sound,
focus/input change or replay, and ask for its exact effect before any live call.
If its effect is unclear, do not call it merely because its name sounds suitable.
If offline sanitized evidence cannot resolve that binding, prepare one separately
approved TV-side static inspection of the fixed SDK resource, exporting only
`subscription | displayCommand | unknown`, fixed payload-field types and transport
category. No source execution/export or revival of a retired raw-capture route.

For the already measured current-app signal, propose one passive main-only
comparison while the owner independently selects Home, active playback and
standby. Two authenticated GET reads per phase, six total, each at most 3 seconds,
no retries or agent-driven state changes. Raw responses stay in Ally memory;
export at most 2 KiB of fixed phase/ordinal/outcome enums, field-presence booleans
and equality/difference of the tuple against phase baselines. No IDs, URLs, names
or values in saved output. Owner supplies the phase labels; no photograph needed.
Do not change power settings or manufacture a REST route from an SDK RPC name.

**Approval still needed before this measurement:** the exact read/comparison
output scope and a convenient owner-controlled main-TV observation window. It is
not a popup test or permission to enable automation. Even distinguishable samples
would not establish reliability: paused-versus-playing, HDMI/input changes, stale
state and concurrent navigation remain follow-up validation. A timeout is unknown,
not off. Bedroom is excluded.

## Failure behavior and handoff

Offline TV/Ally, Console stopped, expired credentials, unknown activity, missing
event authority or unsupported popup: queue in Mist, show the reason, no retry
storm, automatic pairing, wake or full-screen fallback. After an authorized future
launch, require a fresh correlated client acknowledgement with a bounded deadline;
absence is unknown display outcome. Never restore an app/input over owner
navigation. Turning the toggle off cancels pending automatic work.

Implementation and persistent configuration remain unapproved. Preserve existing
LAN/Vite/Tailscale extraction, in-Mist Tailscale connection configuration, and
scheduled-task **and** Startup-folder inventory requirements. Claude must reconcile
this design into existing Mist planning without minting a duplicate queue item.

## Offline popup trace: internal sender found, external contract missing

Read-only trace of the already extracted ViziOS selection, relative to workspace
`work/reference/vizio5691-routing/rootfs/ViziOS/platform_orchestrator/src/`:

- `storedemomanager.cpp:235-255` builds a notification command, fixed
  StoreDemoLaunching template, notifications-bottom zone, countdown/overlay
  parameters and calls `loki::message`. It is store-demo-gated; do not activate it.
- `sysregmultiplexer.cpp:294-324` sends a fixed CheckingForUpdates template under
  an update action. Do not invoke update as a notification test.
- `sysregmultiplexer.cpp:237-265` sets/clears pairing pincode; these lines do not
  connect the owner's success toast to a renderer or template.
- `spock/socketlokisubprocesscommunication.cpp:29-30,314` references loki.hpp and
  tryConnectToLoki. That header is absent from this selected source set; transport
  destination/receiver of the notification call remain unestablished.
- `lokiadapter.cpp:55-96,277` is the reverse-direction Loki-to-multiplexer adapter,
  not demonstrated ingress for our notifications. The global-notification handler
  can redirect to another app; it is not evidence of a nonblocking text toast.

These are supplied-source observations, not a claim of exact running-firmware
compatibility or identity with the owner-observed pairing toast. The next missing
contract is loki::message implementation -> notification dispatcher -> template
schema -> any supported authenticated external bridge. Need custom-text support,
expiry/dismissal, focus/input/audio effects and authorization before proposing a
one-shot native notice call. Do not guess a LAN endpoint from the internal names.
No source in this trace was executed and no new archive was inventoried.


## Toast source checkpoint, 2026-10-20: production implementation still missing

Owner requested continued toast research and said the TV might be off. No TV
request, wake, launch, pairing, setting change or live diagnostic was performed.
The two-day-old temporary usage window was not treated as a current measurement;
one bounded read-only Astra consultation sequence guided this source search.

`research/toast-source-trace-20261020.json` records the exact scopes/provenance:

- ViziOS GPL:177009 entry headers visited; targeted regular-file basename/path
  search found only two loki.hpp files, both test mocks. Eight relevant text files
  totaling44190 bytes were copied outside Git for inspection. Mock message invokes
  a test callback or returns LokiError; it does not reveal production transport.
  This is not an all-filenames/all-entry-types source absence proof.
- CMake's external/sysroot-vizio/loki-ipc includes at303/315 are under
  BUILD_DEBUG_APP. Host tests explicitly include mock/loki-ipc. Neither identifies
  the production package location or external API; do not drop that branch context.
- Exact nested Loki.zip:8 entries, five OTF-named font files, two directories and
  a90-byte README. README describes licensing material and gives no source pointer.
  No font content inspected/extracted; no notification/IPC source filename listed.
- Exact nested release.tar.gz: completed481417 entry headers in52.59 seconds within
  60sec/500000-entry budget. Matched exact loki.hpp, loki-ipc/sysroot-vizio path
  components and Loki-path notification/template names, including link targets.
  Zero matches, no match overflow, no links followed or bodies extracted. This
  eliminates those exact leads in that member, not unknown names or every archive.

A public vendor document titled Notification System API is a separate partner
webhook/transaction-event service, not an established local TV toast contract.
Read only the public OpenAPI document, no accounts or API operations:
https://api.developer.external.plat.vizio.com/apis/63ea675e8c0bfb0001159b04/documentation/raw
Do not confuse that business notification service with Loki's on-screen renderer.

Source evidence still ends at internal fixed-template loki::message calls.
Production transport, notification dispatcher/template schema, arbitrary text,
authenticated external ingress and noninterrupting behavior remain unestablished.
The SDK overlay subscriptions do not close this gap; another generic SDK read or
random notification command is not a useful next test. Do not turn on either TV
solely for that. No Store Demo/update/pairing/Cast action to manufacture a toast.

Next native-toast work requires a concrete production implementation/API lead.
No new live experiment or scope extension is selected at this source ceiling.
This is not proof that native toasts are impossible. Keep the feature design OFF
by default, no full-screen fallback, and all quiet/privacy rules intact. Home tile
batch25 parser-limit work remains separate and deferred. No firmware modification
is proposed as a shortcut. Source copies stay outside Git; only metadata/notes
are committed. No canonical routing/queue change and no push.


## Pairing-first checkpoint, 2026-10-21

Owner selected offline pairing-popup tracing first, then exploration of Cast media
metadata. No live TV request, pairing, power/input change or credential access.
The peer report is external review evidence, not a replacement for measured scope.

Observed client path: the existing bedroom pairing helper sends DEVICE_ID and
DEVICE_NAME to PUT /pairing/start, then sends the PIN challenge response to PUT
/pairing/pair and saves the returned credential with DPAPI. A separately available
reference Swift client uses the same two endpoint shapes. Neither client supplies
a toast template, message, expiry or display zone. DEVICE_NAME is an identity field;
its presence does not establish that arbitrary text can appear in a popup. Do not
repurpose names or repeat pairing as a notification delivery mechanism.

The supplied platform source handles a different message shape at /pairing/start:
message.VALUE -> registry /pairing/pincode (sysregmultiplexer.cpp:237-250), and clears
that registry value at /pairing/stop (:253-265). This is not the external PIN-completion
handler. The connection between external /pairing/pair and the observed success
popup remains missing; matching route names alone do not close it.

Targeted archive content search: research/pairing-source-trace-20261021.json.
Visited177009 headers; read1014 selected regular text files/4759864 bytes under
rootfs/ViziOS and rootfs/tools, completed in19.8sec. Exact terms included external
pair completion/start/stop paths, pincode, PAIRING_REQ_TOKEN, DEVICE_NAME and the
observed English success phrase. No /pairing/pair, PAIRING_REQ_TOKEN or success
phrase match in that scope. PIN start/stop matches resolve to the known handler;
other DEVICE_NAME matches do not identify the pairing front end. This is bounded
content evidence, not absence from complete firmware, other languages or other
filenames/formats. No source was executed, and no raw source added to Git.

Next evidence needed for pairing: an actual external pairing-service implementation,
its build/package ownership or the production success-toast template. Re-pairing
would reproduce a known effect without revealing that missing link; no new live
pairing run selected. Do not overwrite the saved credentials just to obtain a popup.

### Next in order: Cast metadata exploration

Offline local PyChromecast inspection establishes that play_media constructs a LOAD
with contentId/contentType/metadata, and send_message may launch the supporting
receiver when the media namespace is unavailable. Evidence: local reference
controllers/media.py:390-449,476-548 and controllers/__init__.py:123-171. Setting
autoplay=false changes playback intent; it does not disable receiver launch or
prove absence of focus/input changes. This is receiver media UI, not an established
system-wide notification API. No Cast message sent in this checkpoint.

Smallest useful later visual experiment: one fixed, silent, short local media item
with a fixed title, on a deliberately idle owner-selected TV, no active Cast session
replacement, no wake, no retries and no settings/volume changes. Record acceptance
separately from visible title/artwork, audio, focus/input change and post-stop state.
Stopping a sender-owned session does not guarantee restoration of the prior app.
Do not claim interruption-free from an idle-screen test. An unavailable title is
not proof all Cast metadata is unsupported. A test over real viewing is a separate
step only if the idle experiment warrants it and the owner chooses the interruption.
No feature/watcher or live experiment built here. Keep OFF-default/quiet rules and
native pairing toast and persistent Home tile as separate unresolved contracts.


## Owner-authorized idle main-TV Cast test, 2026-10-21

Owner reported living-room TV idle after the proposed one-shot metadata test.
One direct fixed-target Cast connection; no discovery, wake, pairing, credential
access, new listener, external media host, volume/settings change or retry.
Aborted by design if a non-backdrop Cast app were already present; baseline passed.
A one-second unsigned PCM WAV was generated in memory and checked to contain only
silence samples. Sent once as a self-contained data URI with autoplay=false,
BUFFERED stream and fixed title Codex needs you. No file/media server route added.

Saved research/results/cast-metadata-main-20261021.json reports default receiver
started with a new session; PAUSED, media session present, exact fixed title echoed.
After20sec observation, quit requested only while default receiver session matched
the newly observed session; subsequent status reported no active receiver/backdrop.
This is protocol/status evidence, not a pixel observation or proof of input/app
restoration. No media playback requested; actual sound/focus/input effects were not
observed by the sender. Owner visual report pending. No automatic fallback/retry.

The successful data-URI media session narrows an earlier uncertainty about this
particular source format. It does not establish a system toast, metadata overlay
over another application, or a reusable noninterrupting notification feature.
Do not build attention delivery or test over active viewing from this result alone.


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


## Audit clarification, 2026-10-21

Owner clarified the Vizio Mobile PIN appears only for initial pairing; saved app
connections remain connected without additional popups. No recurring reconnect
trigger is established; do not repeat pairing or rename identities for notices.
Native success-template/display contract remains missing. Official app pairing
instructions were checked at https://www.vizio.com/en/mobile; they establish a
four-digit pairing flow, not the proprietary client's exact REST implementation.

Clarify the earlier Cast source-format wording: PAUSED/title echo establishes
acceptance of LOAD/session metadata, not successful WAV decoding or universal
data-URI media support. No playback or speaker measurement was performed. Sender
wait20sec and owner-estimated short display do not resolve spontaneous exit vs
explicit quit timing. The owner-observed full-screen takeover/Home return stands.
No further test is needed to exclude this implementation from quiet-popup use.

The route audit is linked from ROUTES.md and recorded in the Codex handoff. It
separates Conjure/DashCast/vendor Cast full-screen entry, native quiet notice,
Home persistence and activity detection. No popup candidate, feature or new live
scope is selected here. Retain OFF-default App/Console UX and all quiet rules.
