# Customized TV Home - product specification

Owner clarification: 2026-10-23. Status: proposed behavior and acceptance, not an
implemented launcher. This is the product authority for this TV project only.
EXECUTION-PLAN.md owns the backlog/next experiments; ROUTES.md owns demonstrated
routes. No normal Mist/RobCo queue entry or external model handoff is created.

## Goal and advertising scope

Give the owner a customizable, uncluttered Home on their existing Vizio TVs,
without sponsored Home banners, recommendations or promotional rows in the
surface we control. Mist is an ordinary optional tile and proof of extensibility.
Both modifying stock Home and replacing it are valid candidate architectures.

Home advertising removal is the initial acceptance boundary. This does not claim
removal of ads inside YouTube/streaming apps, live channels or HDMI content, or
disable vendor telemetry. Those are separate requested-scope/feasibility decisions.
No network-wide DNS filtering, update blocking, privacy-setting changes or service
disabling is implicit in an ad-free Home. A screenshot is not such authorization.

## Experience

- A quiet initial screen: owner-chosen app/input tiles, stable order, optional
  clock/status; no automatic promotional feed, autoplay or fetched advertising.
- Physical remote: deterministic directional focus, visible focus, OK to open,
  Back to dismiss a panel or return one level. No hover/touch/phone dependency for
  normal use. Do not assume Home-button interception is available.
- Open the owner's installed apps and selected HDMI inputs by their real identity.
  Preserve app login, casting, audio and ordinary TV operation. Confirm necessary
  inputs/apps with the owner before promising their launch contracts.
- Mist tile opens the existing read-only Console client. No new control-plane
  actions or credential/configuration panels in that TV view.
- Editing, if feasible: reorder, hide/show and label tiles; explicit save/cancel,
  one private settings authority, stable per-TV profiles. Normal Console/Mist App
  may expose configuration later; no new public/LAN write endpoint is assumed.
- No automatic takeover of an app, HDMI session or playing content. Owner-chosen
  startup/default-Home behavior must distinguish cold boot, standby resume, Home
  press and app exit. A full-screen Cast session is not a native toast.

## Candidate architectures and evidence ceiling

| Candidate | Existing evidence | Required new evidence |
| --- | --- | --- |
| Stock Home modification | Owner-controlled app reorder/save has been observed; delayed resets remain unresolved | Actual supported customization surface or storage/consumer, ability to suppress promotional sections, durable edits and reversal |
| Conjure-hosted replacement | Actual Console page visibly loads through saved paired launch | Remote key delivery, app/input launching and return, default Home/startup ownership, lifecycle and offline behavior |
| DashCast-hosted replacement | Fixed inert inline HTML visibly rendered twice | Scripts/input, LAN delivery, app launch privileges, lifetime and Home integration; current inline proof is insufficient |
| System-integrated replacement | Static firmware/source routing evidence; unverified external renderer-execution claim | Exact model/build access and recovery, privileged integration only if necessary; no deployable/recoverable package or root established |

Begin with the demonstrated Conjure host for a temporary launcher diagnostic,
not a full visual build. Share UI code across TVs only after capabilities are
known; keep credentials, target selection and capability profiles separate.
Do not assume an Android ADB launcher-install workflow applies to these TVs.

## Lifecycle and failure behavior

Prefer existing Console-owned hosting and restricted LAN listener. No new outside
access, task, public deployment or Tailscale change. A LAN-hosted Home depends on
Ally availability; that dependency must be visible and tested before daily use.
If the host/network is unavailable, ordinary TV Home/apps/inputs must remain
reachable with the physical remote. Do not solve outages with relaunch loops.

Inventory where preferences persist and what is restored after reload, standby,
cold boot and vendor/Home refresh. Test those separately, with owner coordination.
Two TVs can share one hosting process but cannot share mutable run ownership,
pairing tokens, target identity or assumptions about firmware capabilities.

No silent replacement of another app's identity, broad security-policy relaxation,
automatic firmware flashing, update suppression or persistent SSH installation.
Any persistent integration needs exact before/after state, owner approval and a
model-compatible reversal/recovery plan. Leave original Home reachable during
prototype work. Local server/source rollback is not proof of TV firmware recovery.

## Acceptance ladder

Reference-derived handover requirements, 2026-10-23: see
research/home-reference-projects.md for selected source evidence and limitations.
Before any approved persistent handover, preserve an immutable original baseline
and explicit delta tied privately to the intended target/build. Verify fallback
is usable before removing/replacing an active Home candidate; fail closed on
unconfirmed rollback. Verify actual Home ownership, visible navigation and exact
reversal independently. Read current preferences before editing and preserve
unknown fields; reruns must not overwrite the original baseline. Use fake-device
failure tests before live writes. Firmware/build drift requires review, not silent
reapplication. No monitor, new identity collection or TV change is authorized by
these requirements. An installed launcher, shortcut and default Home must be
labelled separately. Third-party root-free/restore claims are not our test evidence.

1. Temporary prototype: remote can navigate a fixed launcher, open an agreed app,
   and leave safely. Clearly label this as manually launched, not default Home.
2. Useful customized Home: chosen apps/inputs and Mist are reachable, saved order
   is stable, controlled Home contains no promotional content, normal remote use
   works. Record unsupported destinations rather than simulate success.
3. Integrated Home: owner-selected Home press/app-exit/startup behavior works
   without a phone/PC command or a background takeover loop. Distinguish native
   integration from a documented shortcut and record any device-setting change.
4. Durable daily use: independently verify reload, standby, coordinated cold boot,
   host/network outage, Cast/app exit and a longer delayed-refresh observation.
   Do not infer durability from a single session or count no ad network requests
   as proof that all TV telemetry/advertising stopped.
5. Reversible: owner can return to stock Home and ordinary apps/inputs without
   losing pairing, app accounts or unrelated TV settings. Verify reversal of any
   persistent change, not just removal of the local HTML file.

## First experiment and approval boundary

Preparation pointer, 2026-10-23: research/home-input-plan.md and
research/home-input-diagnostic.mjs implement the input-only preparation. Hosting
integration is now present behind default-off researchHomeInput; no live option
was enabled or server restarted. Phase A
has no app actions; app-launch Phase B awaits input results and an established
destination/payload. All device operations are held while the owner is away.

Prepare offline a fixed temporary launcher diagnostic on the known Conjure route,
with two or three focusable controls and no private Console data. Establish input
delivery before adding an action. One agreed installed-app launch and an owner
Home press then reveal whether we have only a page or a workable launcher loop.
Record bounded key categories and success/failure states; no arbitrary keyboard
text, account contents or raw configuration collection. Reuse approved reporting
only if its exact contract admits those fields; otherwise propose the extension.

No live batch runs under this specification alone. The earlier sender hold and
no-stop instruction remain until the owner releases them. Before live work,
present the exact page/hosting changes, allowed target/actions/outputs and exit
behavior. This batch must not alter default Home, persist settings, flash software,
install services, stop the old sender or operate the bedroom TV implicitly.
