# Customized TV Home

This specification owns product scope and acceptance for TV Workbench. The goal
is an owner-chosen Home on the owner's Vizio TVs, with no sponsored banners,
recommendations or promotional rows in the Home surface we control. Modifying
stock Home and replacing it are both valid candidate architectures.

The claim is limited to that controlled Home surface. It does not promise ad
removal inside streaming apps, live channels or HDMI content, and it does not
disable vendor telemetry. DNS filtering, update blocking, privacy changes and
service disabling are outside scope unless separately requested and approved.

## Intended experience

- A quiet screen with owner-selected app and input tiles in a stable order; an
  optional clock or status display may be added after the core Home works.
- No fetched promotional feed, autoplay or automatic takeover of an app, input,
  Cast session or playing content.
- Deterministic physical-remote focus with visible focus. OK opens the selected
  item; Back dismisses one panel or returns one level. Do not assume that the
  Home key can be intercepted.
- Launch only agreed installed apps and inputs by their verified identities and
  supported contracts. Preserve ordinary TV use, app logins, audio and casting.
- Mist may appear as an ordinary optional tile opening the existing read-only
  Console client. The TV view adds no control-plane actions, credentials or
  configuration panels.
- If editing is feasible, reordering, hiding/showing and labeling tiles require
  explicit save/cancel and one private settings authority with stable per-TV
  profiles. No public or LAN write endpoint is assumed.

## Architecture and evidence ceiling

The existing Conjure route visibly opens the Console page, and an earlier
four-tile page had owner-confirmed arrows and OK behavior. This demonstrates a
manually launched display path, not a default Home or a working app launcher.
The current input-only page is prepared but has not been launched on a TV.

Stock Home modification remains a candidate; actual Home ownership, a supported
customization surface, durable edits, promotional-row suppression and reversal
are not established. A replacement Home is acceptable, but the current
Conjure-hosted prototype is not a built Home and has no demonstrated startup,
Home-key or app-exit ownership. DashCast inline HTML is a separate full-screen
display route; it does not prove scripts, app privileges or Home integration.

No default Home, root access, persistent installation, native custom-text toast,
or reliable playback/idle detector is established. See [routes](routes.md) for
the evidence index and [research references](research/references.md) for the
selected source findings.

## Lifecycle and acceptance

The original Home and ordinary apps/inputs must remain reachable during
prototype work. A Home hosted on the Console machine depends on that host and
network; its outage behavior must be visible and must not be handled by a
watchdog or relaunch loop. Distinguish cold boot, standby resume, Home press and
app exit. Keep credentials, pairing state and mutable profiles separate by TV.

Acceptance proceeds in separate steps:

1. **Temporary diagnostic:** manually launched page receives remote navigation,
   opens one owner-approved app only after its destination contract is verified,
   and exits safely. It is not labeled default Home.
2. **Useful customized Home:** agreed apps and inputs are reachable, order is
   stable, controlled Home is free of promotional content, and ordinary remote
   operation works. Unsupported launch destinations remain explicitly
   unsupported.
3. **Integrated Home:** the owner-selected Home press, app-exit or startup
   behavior works without a phone/PC command or background takeover loop.
   Document whether it is native integration or a shortcut.
4. **Durable daily use:** separately verify reload, standby, coordinated cold
   boot, host/network outage, Cast/app exit and delayed vendor refresh. A single
   session is not durability evidence.
5. **Reversible:** confirm return to stock Home and ordinary apps/inputs without
   losing pairing, accounts or unrelated settings. Verify reversal of any
   persistent change; deleting local HTML is not device rollback.

For any future persistent handover, preserve an immutable original baseline and
an explicit target/build-specific delta; verify fallback before replacement;
read current preferences before editing; preserve unknown fields; and stop if
rollback is unconfirmed. Firmware/build drift requires review. These are
acceptance requirements, not permission to change a TV.

The current first experiment is the input-only protocol in
[docs/experiments/home-input.md](experiments/home-input.md). Its preparation
does not approve activation or a live run.
