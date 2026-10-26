# Home reference projects - bounded source review, 2026-10-23

Purpose: owner-requested motivation and safer workflow ideas for customized TV
Home. No third-party code downloaded to disk, installed, built or executed; no TV
operation. Retrieved selected public source text through the web tool. This is
not a complete security audit, compatibility certification or test of their
restore promises. URLs below track main and can change; pin a reviewed commit
and record content hashes before any future code reuse. No code/assets copied.

## Project identity and inspected sources

- FreeMyTV interpreted as [simbasjungles/free-my-tv](https://github.com/simbasjungles/free-my-tv).
  Inspected [README](https://github.com/simbasjungles/free-my-tv/blob/main/README.md),
  [webOS installer](https://github.com/simbasjungles/free-my-tv/blob/main/webos/install.py)
  and [Tizen installer](https://github.com/simbasjungles/free-my-tv/blob/main/tizen/install.py).
- CleanMyTV interpreted as [wingedpanther/cleanmytv](https://github.com/wingedpanther/cleanmytv).
  Inspected [README](https://github.com/wingedpanther/cleanmytv/blob/main/README.md),
  [launcher.ts](https://github.com/wingedpanther/cleanmytv/blob/main/src/main/launcher.ts)
  and selected [debloat.ts](https://github.com/wingedpanther/cleanmytv/blob/main/src/main/debloat.ts)
  sections. It describes itself as a desktop front end for the next project.
- The earlier owner-linked [Gathin23/cleanyourtv README](https://github.com/Gathin23/cleanyourtv/blob/main/README.md),
  especially recovery and post-update drift sections, was also inspected.
  These are three distinct repositories, not interchangeable names.

## Findings and transferable practices

Free My TV's README describes Android default-Home integration, but the LG and
Samsung versions as apps leaving stock Home in place. Its other-TV fallback is
an HDMI streamer. Those are different integration levels; none supplies a Vizio
installation path. Its documented protection of inputs, remote and core services
is a useful design principle, not a validated Vizio allowlist.

CleanMyTV's README describes per-device selection, read-current configuration,
pinned upstream content and a fake-TV development mode. Its first-baseline
restore and rollback claims still require execution evidence on each target.
These are useful workflow ideas; no dependency/package lists are adopted.

In launcher.ts, detectStock refuses unknown Home owners; installation and start
are checked before stock launcher disabling. The code then sets Home, queries
ownership and attempts rollback if ownership is wrong. Rollback itself checks
the returned owner. This is stronger than assuming an accepted command changed
Home. A source-level start success still cannot prove visible, navigable UI.
Not every branch is guaranteed safe: incompatible-signature replacement awaits
rollback but does not require its boolean success before uninstalling. Our future
handover must require confirmed fallback before removing any active candidate.

Selected debloat.ts code preserves/reuses a device-associated recovery record,
rejects a device mismatch and writes the record through a temporary file. Device
model/build similarity alone is not unique identity; a future Mist record needs
a private target binding within owner-approved data boundaries, never identity
material committed to Git. Do not add new identity collection in this pass.

CleanYourTV documents retaining the first per-TV/list baseline across reruns,
restoring earlier disabled states rather than enabling everything, and checking
post-firmware-update drift. These are documented practices, not tested guarantees
for our TVs. Detection should request a decision, not automatically reapply a
stale change after updates.

## Patterns not copied

- Android ADB package controls and Home ownership APIs; LG Developer Mode/SSH;
  Samsung Developer Mode/SDB and signing. No equivalent access established here.
- The inspected Free My TV webOS installer disables SSH host-key verification
  and retains an unlocked private key. These implementation choices are not a
  recommendation for Mist. Preserve our encrypted credential handling and peer
  verification; don't weaken authentication just because an example does.
- Automatic disabling of services, broad package lists, DNS changes, update
  suppression, debug-port changes, blanket permissions or opportunistic discovery.
- A claim of reversible settings as proof of firmware/boot recovery; those are
  separate risks. A root-free path is preferable when sufficient, not proof that
  any path without root is harmless.

## Changes to our specification and experiment order

Retain the input-only Conjure experiment. Add later handover requirements:
immutable original baseline, explicit proposed delta, confirmed fallback before
replacement, verified ownership/display/input after handover and verified exact
reversal. Fail closed if recovery is incomplete. Keep install/display, shortcut,
default-Home ownership and startup behavior separate in results and UX labels.
Read current user preferences before editing, preserve unknown fields, avoid
replacing the original baseline with an already modified state, and test changes
against a fake device before any approved live write.

Future model/build drift detection is manual/read-only by default. No scheduled
task, background monitor, auto-repair or new normal-queue item is created. Current
diagnostic has default-disabled hosting integration (see home-input-plan.md);
all TV operations remain held.

## Vizio-specific references, follow-up 2026-10-23

Owner supplied the three repositories below. Selected README/implementation
inspection only, not a repository-wide absence claim. No install, dependency
change, code execution, token access, account/catalog request or device call.
Refs track master/main and are not pinned compatibility evidence for our TVs.

### pyvizio

[README](https://github.com/raman325/pyvizio/blob/master/README.md) marks maintenance
mode and points to [vizaio](https://github.com/raman325/vizaio), whose README
describes it as the successor. Do not install/re-pair or migrate encrypted tokens
to CLI arguments/config files just to follow these examples.

[apps.py](https://github.com/raman325/pyvizio/blob/master/pyvizio/api/apps.py)
constructs app launch VALUE from APP_ID, NAME_SPACE and optional MESSAGE, and
maps names through app configurations. Its current-app name is inferred from
known mappings; unknown labels do not prove no application or no playback.
The command-level process_response returns true; inspect the outer protocol and
actual screen before interpreting a library boolean as successful visible launch.

[const.py](https://github.com/raman325/pyvizio/blob/master/pyvizio/const.py)
contains launch/current-app/input/power/key endpoints and a SmartCast key mapping
(codeset4/code3). Its APP_HOME entry is namespace4/app1 with a TV-local sctv
main.html URL. That is an existing Home launch destination, not a default-Home
setter. Namespace2/4 equivalence in name matching is a library heuristic, not
permission to interchange namespaces in writes. No mapping was tested here.

[input.py](https://github.com/raman325/pyvizio/blob/master/pyvizio/api/input.py)
distinguishes internal input identity from extended metadata and constructs a
current-input change command. Useful for later input tiles; not authorization
for an input switch or evidence that every firmware exposes the same schema.

### Vizio_SmartCast_API

[Community protocol documentation](https://github.com/exiva/Vizio_SmartCast_API/blob/master/README.md)
already appears in TV-ENTRY.md, so this is a targeted reinspection, not discovery
of a new access mechanism. It documents authenticated app launch, key commands,
current/list inputs and status-result checking beyond HTTP success. Input change
uses the current-input HASHVAL, not the list's hash. Its app table is a candidate
mapping reference, not a fresh installed catalog. No listed URL was followed.
Power-state/standby claims are historical documentation, not measured behavior
of our current TV builds. Do not treat power/current input as playback proof.

### vizio-smart-cast

[index.js](https://github.com/heathbar/vizio-smart-cast/blob/master/index.js)
app.launch sends VALUE {MESSAGE, NAME_SPACE, APP_ID}, defaulting to namespace4/app17,
matching our existing Conjure launch. It checks STATUS.RESULT before resolving.
Input selection resolves internal/user labels and checks list/current success.
These corroborate paired REST control; they do not establish renderer privileges,
default-Home replacement or Home ad removal. No client is added to the runtime.

### Consequence for execution

Phase A remains input-only. Phase B can use these references to establish one
owner-selected app's exact candidate payload and later HDMI input contracts.
Keep Ally-side authenticated REST distinct from an in-TV SDK call. Never embed
the pairing token in HTML or add a general LAN control proxy to make a tile work.
If direct renderer launch fails, an Ally-side action bridge is a separate proposed
architecture requiring explicit control/security scope; it is not smuggled into
the read-only Console. An externally commanded app launch alone does not prove
the tile activated it. No native toast/default-Home writer was identified in the
selected material; this is bounded inspection, not proof such APIs cannot exist.

## vizaio and VizioApps deeper follow-up, 2026-10-23

Selected public documentation/source only, no TV calls or installed dependencies.

- [vizaio client.py](https://github.com/raman325/vizaio/blob/main/src/vizaio/client.py)
  distinguishes transport/status validation, bounded concurrency, command timeout
  and endpoint fallback. Useful implementation reference, not tested compatibility
  on our TVs. Do not automatically adopt write retries or credential persistence.
- [vizaio apps.py](https://github.com/raman325/vizaio/blob/main/src/vizaio/apps.py)
  joins catalog and availability by id, selects chipset/firmware payloads and
  bundles fallback data. This is a stronger Phase B lead than a flat app-ID list.
- [vizaio documentation](https://github.com/raman325/vizaio#app-catalog-injection)
  describes catalog setters on the Python Vizio instance. These replace the
  integration's lookup data, not the TV's Home membership. Its documented
  state_extended feature includes power/input/app/media state with capability
  detection; whether it exists or accurately tracks native apps/HDMI on our
  builds remains untested. No playback oracle established by documentation alone.
- [vizaio endpoints.py](https://github.com/raman325/vizaio/blob/main/src/vizaio/endpoints.py)
  corroborates GET /state_extended with profile-based authentication. Add a later
  bounded read-only candidate to attention research; no polling/identity export
  or live request is authorized by this reference pass.
- [VizioApps README](https://github.com/kbrown01/VizioApps) deprecates its own
  copies in favor of scfs.vizio.com appservice vizio_apps_prod.json and
  app_availability_prod.json. It is a lookup-data repository, not a TV installer.
  Attempted vendor URLs through the web tool failed on unsupported octet-stream
  content; no current vendor dataset was parsed/validated in this pass. Do not
  describe them as dead endpoints or substitute the historical copy as fresh.
- [apps.json](https://github.com/kbrown01/VizioApps/blob/main/apps.json) gives
  metadata including catalog id/name/country and image links. These catalog ids
  must not be used directly as launch APP_ID values.
- [apps_availability.json](https://github.com/kbrown01/VizioApps/blob/main/apps_availability.json)
  maps the same catalog id to chipset-specific serialized launch payloads with
  firmware bounds. Example catalog id33 has wildcard namespace2/app4 versus
  MT5691 namespace3/app3. This demonstrates differing data entries, not tested
  launch behavior or either TV's established chipset. Null/zero bounds require
  understanding resolver semantics before selection. No payload was sent.

Plan consequence: Phase A stays unchanged. Phase B should use verified target
chipset/firmware plus a provenance-labelled, reviewed catalog/availability pair
for one owner-selected destination; record fallback/staleness instead of silently
calling cached data current. Read public JSON as data only; do not execute MESSAGE,
download logos, follow arbitrary embedded URLs or import remote source into Git.
Pin/hash any future reused snapshot. Neither selected repository establishes
default-Home takeover, native toast text or Home advertising removal.

## vizaio-conjure follow-up, 2026-10-23

Selected source review of [vizaio-conjure](https://github.com/joebeeson/vizaio-conjure),
not installed or executed. README uses the same established namespace4/app17
route; its no-device dry-run and device-profile UX are useful preparation patterns.
It explicitly excludes internal app3001 and privileged Conjure surfaces. No new
Home integration, popup, privilege or faster-rendering result established here.

- [client.py](https://github.com/joebeeson/vizaio-conjure/blob/main/src/vizaio_conjure/client.py)
  keeps a small injectable device interface around launch_app_config. Returning
  the normalized target after awaiting the call is not proof of rendered content.
  This supports separating target validation/transport from the visual result,
  already required by our test protocol.
- [models.py](https://github.com/joebeeson/vizaio-conjure/blob/main/src/vizaio_conjure/models.py)
  has an immutable launch target and validates absolute HTTP/HTTPS URLs without
  embedded credentials. It permits arbitrary such hosts and nonnegative namespace
  overrides. Those ergonomic freedoms are broader than our fixed diagnostic scope;
  retain exact target/run/host checks rather than adopting a generic launcher.
- [credentials.py](https://github.com/joebeeson/vizaio-conjure/blob/main/src/vizaio_conjure/credentials.py)
  separates profile metadata from OS-keyring tokens, injects a credential backend
  for tests and derives stable per-installation/profile pairing identities.
  Useful for future extraction, not a reason to re-pair or migrate our DPAPI tokens.
- [server.py](https://github.com/joebeeson/vizaio-conjure/blob/main/src/vizaio_conjure/server.py)
  is a directory-serving smoke-test server defaulting to 0.0.0.0. It lacks our
  exact peer/Host/run restrictions in the inspected implementation. Do not replace
  Console-owned fixed-document hosting with this development server.

Consequence: potential future launcher consolidation, immutable validated targets,
and transport/credential fakes belong to the retained LAN/Vite/Tailscale extraction
lane, after a concrete need and scoped design. No current performance gain was
measured; no dependencies, server, pairing or experiment order change. Phase A
remains default-disabled and held for owner presence. Source links track main;
pin/review licensing before any future source reuse. No third-party code copied.
