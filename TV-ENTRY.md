# Starting Mist from the TV: evidence boundary

Checked 2026-10-17. No account was created, partner application submitted,
vendor contacted, TV menu changed, or firmware modified.

| Entry path                                    | Current result                                                                                                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ally sends paired Conjure URL                 | Proven on the owner's V435-J01, including real summary display.                                                                                                                          |
| Source launcher from PC/phone-controlled Ally | Implemented explicit action; it is host-initiated, not a TV Home tile.                                                                                                                   |
| Existing Home app management                  | Official Home page documents adding from the Apps catalog and reordering/removing catalog entries. It does not describe registering an arbitrary private URL.                            |
| Official app onboarding                       | Official Content Partners page provides app submission and partner-management onboarding. This is a documented vendor route, not proof that a private personal LAN app will be accepted. |
| Stock-remote private Mist Home tile           | Not established. No supported consumer mechanism was found in the checked public pages; this does not prove impossibility.                                                               |
| Developer specifications                      | Official link redirects to sign-in; the protected specifications were not read.                                                                                                          |
| Automatic power-on Conjure watcher            | Not implemented or authorized; it could interrupt HDMI. Login readiness never invokes launch.                                                                                            |

## Primary sources checked

- https://www.vizio.com/en/home-screen : FAQ describes selecting apps from the
  Apps catalog. This supports catalog management, not arbitrary URL registration.
- https://www.vizio.com/en/content-partners : app-submission link and partner
  onboarding, plus a developer-specification link.
- https://docs.developer.vizio.com/ : redirected to sign-in during this check;
  protected content is unobserved.
- https://support.vizio.com/s/article/How-to-add-an-App-to-your-VIZIO-Smart-TV?language=en_US :
  returned only Loading/CSS Error to the retrieval tool; do not cite its absent
  body as supporting a browser/sideloading restriction.

The previous packet's claim that no verified local Home-tile endpoint was known
is retained as a limitation, not upgraded to a vendor impossibility claim. The
current practical path remains explicit host launch plus quiet listener readiness.
The research does not justify public Funnel exposure, a new native Mist product,
firmware alteration, or automatic input switching.

## Coordinated checks still owed

Actual Windows logon, automatic restart recovery, physical Back/Home behavior
and return to Switch, actual SSH disconnect, WAN-disconnected LAN operation,
second-TV identity, and the separate Vizio settings baseline remain untested.
Coordinate disruptive tests; do not sign out, reboot, disconnect the network or
change the paused control plane without the owner's specific authorization.

## Power-cycle and tailnet milestones added, 2026-10-17

Owner considers losing Mist after TV power-off/on a significant drawback. Current
page polls every 15 seconds if its browser document survives; listener readiness
alone does not preserve or restart Conjure. No power-on watcher is implemented.
Do not report seamless return until the owner observes the real hardware result.

1. Remote standby: leave Console running, turn TV off, wait 20 seconds, turn on,
   wait for network and two refresh intervals. Record resumed Mist, Home, HDMI or
   another app, visible fresh projection time, and whether explicit relaunch was
   needed. Do not claim "connected" from the startup listener line alone.
2. Cold boot and navigation: separately coordinate a cold power cycle and test
   Home/Back/Exit and return to Nintendo Switch. Save settings before any changes.
   Do not cut power or change input without the owner conducting that step.
3. If Conjure is lost, design opt-in resume-Mist behavior with explicit prior user
   intent, power/input/app checks, bounded retries and cancellation. It must never
   steal HDMI or an unrelated app. Discover the real available read endpoints
   before choosing a watcher; no endpoint or Home tile is assumed to exist.
4. TAIL1: phone on cellular (Wi-Fi off), Tailscale connected, existing private
   Console /home via its existing HTTPS tailnet origin. Confirm actual load and
   current timestamp; repeat Tailscale off to establish the expected access limit.
   The TV's current LAN URL is not automatically a tailnet URL.
5. TAIL2: choose and review a summary-only tailnet transport for the TV. Current
   4176 listener rejects tailnet/gateway peers and proxy identity headers. Do not
   broaden that allowlist or expose the full private Console as a shortcut.
   Compare a dedicated trusted gateway/bridge with a supported external TV client.
   Router/Serve/grants changes need a concrete reviewed profile and owner approval.
6. TAIL3: if a remote-site TV is wanted, test direction-specific routing with a
   dedicated gateway and narrow policy. Remote phone->TV access is different from
   TV->tailnet Console access; advertising a subnet alone does not prove the latter.
   No Funnel, public tunnel, native install, firmware change or router change made.

Primary sources rechecked 2026-10-17:
- https://www.vizio.com/en/home-screen : Home Apps catalog management; does not
  document arbitrary private URL registration or native package installation.
- https://www.vizio.com/en/content-partners : app submission and partner onboarding;
  not evidence that this owner can sideload native applications on stock firmware.
- https://tailscale.com/download : supported client downloads; no Vizio client found
  in the checked list. Android/Fire TV/tvOS support does not establish Vizio support.
- https://tailscale.com/docs/reference/devices-without-tailscale : subnet-router
  approach for devices without a native client.
- https://tailscale.com/docs/features/site-to-site : routing between networks;
  actual TV-side routes/gateway and return paths require design and testing.

Conjure launching our HTML page demonstrates a web launch. It does not establish
an app-install service, native executable privileges, or a working Tailscale port.
Keep native-client/sideload research exploratory; do not turn absence of a checked
supported route into a claim that firmware research is impossible.

These are component workstream milestones, not a claim that the canonical private
planning queue was edited. Claude must reconcile with its existing items at final
handoff under that authority's own writer rules, without duplicating CM9/MI34.

### Owner clarification superseding automatic-return interpretation

Remote off/20-second/on returned to Vizio Home; owner says this is normal for
all apps and acceptable. The goal is persistent pairing/reconnect when selecting
a future Home tile, regardless of what app was open before power-off. Automatic
wake relaunch is not requested. Prioritize saved pairing verification after wake,
repeatable explicit launch and future tile activation. Keep opt-in automatic
resume as exploratory only; do not install a watcher from the earlier interpretation.

## Current owner priority: manual Home tile, 2026-10-17

The ultimate goal is selecting a Mist tile on the Vizio Home screen to open the
existing Mist Console TV client. Automatic opening on wake/logon is not wanted.
Actual TV screenshot research is deferred from current scope, and an Ally-made
preview is not a substitute for TV pixels. No capture or notification integration
was installed. The single standard Chrome debug-port probe (9222) was unreachable;
this does not establish that every possible TV capture method is unavailable.

After the owner's remote power cycle, the explicit saved-pairing launcher returned
API SUCCESS. The owner then confirmed: Mist visible, no PIN, projection timestamp
advances over the observation interval. This adds an observed manual relaunch and
refresh pass after standby; it does not establish a working Home-screen tile.

Optional idea only: a Pushover "Mist connected successfully" message following a
user-selected launch. Define success from observed TV client activity after that
launch, separately from listener readiness/API acceptance, and never claim pixel
verification. A real implementation must use a new request/acknowledgement rather
than the existing lifetime tvLocalTimeUISeen boolean, which can remain true after
the TV leaves the page. Avoid repeated notifications on each 15-second refresh.
The owner has not asked to configure credentials or send a test notification.
Pushover image attachments are supported (https://pushover.net/api), but screenshots
are not the current objective. Keep the final Claude handoff deferred and reconcile
these owner decisions with the existing canonical plan under its writer rules.

## Home-entry investigation continued, 2026-10-17

Observed on the owner's V435-J01, using authenticated GET requests only:
- Settings index returned SUCCESS and categories bluetooth_headphones, picture,
  audio, network, channels, accessibility, devices, system, admin_and_privacy, cast.
- System submenu returned ordinary language/time/name/input/power/CEC/PIN and
  remote/mobile-device settings. Only setting identifiers were inspected; device
  names, paired-device lists and setting values were not opened or recorded.
- Cast submenu returned device/session/Cast identifiers, privacy/terms and setup
  network/state setting identifiers. Identifier values were not recorded.
- No app-registration/Home-pinning control was observed in these three responses.
  This is a bounded menu inspection, not an exhaustive API census or proof that
  no undocumented mechanism exists. No setting, input, power or pairing write
  was performed. No probe of guessed modification endpoints was made.

Primary implementation references checked:
https://github.com/socialvibe/truex-ctv-web-reference-app/blob/develop/platforms/Vizio/README.md
separates retail SmartCast 3 web launch through the PIN/REST Conjure sender from
debugging on a Vizio-enabled development TV. It establishes neither a persistent
consumer Home tile nor development activation on this owner's TV. The existing
paired launch remains the demonstrated retail path.
https://github.com/exiva/Vizio_SmartCast_API documents /app/launch and the settings
tree; no Home-tile installation procedure was found in the reviewed README.
https://github.com/noktirnal42/VizioRemote describes a sender-side catalog launcher,
not proof of TV-side tile creation. Its research targets different hardware and
firmware; those claims were not adopted as measurements of the owner's V435-J01.
Developer-document and legacy sender retrievals failed in this pass. They were
not treated as read developer specifications or evidence of feature absence.

Pending owner inspection: Home -> app row/Recently Used -> Apps/Manage Apps if
present; look for Mist, Conjure or a new blank tile, and describe add/favorite/
custom-URL options without selecting any install/remove/reorder operation. No
persistent tile has been created. The outcome determines the next Home-entry
experiment; a PC/phone launcher must not be relabeled as a native Home tile.

## Owner photo inspection outcome, 2026-10-17

Owner reports no Mist/Conjure tile. Three supplied photos show a Home/Recent Apps
overlay, App Search for mist without a visible Mist result, and conju with no
results. The Home Screen Apps tab is visible but its opened management panel is
not pictured. Do not keep the earlier initial Home/search inspection marked
wholly pending: it happened, with the limits stated here. Next inspect that
management panel's actual controls. Separate custom-order reset diagnosis now
lives in HOME-LAYOUT.md; do not duplicate its governing observations here.

Management panel now inspected from the owner's 37.7-second video; see
HOME-LAYOUT.md for source digest, sampling method, timestamps and limits. It
shows ordinary catalog-app move/save/remove controls, with no custom URL/private
registration control in those states. Do not continue asking the owner for the
same initial panel photo. Native Home entry remains unestablished.
