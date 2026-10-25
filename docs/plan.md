# TV implementation strategy and project plan

Synthesis checkpoint: 2026-10-25. This is the single TV-only strategy and backlog.
[Spec](spec.md) owns product acceptance, [status](status.md) owns observed facts,
[routes](routes.md) indexes evidence, and [operations](operations.md) owns live
change boundaries. Detailed protocols belong in experiments, not a second queue.
TV-P01–P06 retain their identities; gates below subdivide TV-P03, not new projects.

## Product destination and current decision

Build an owner-chosen Vizio Home with agreed app/input tiles, stable order,
physical-remote operation and no promotions in the Home surface we control.
Mist is an optional read-only tile. Ads inside streaming/live/HDMI content and
telemetry changes are outside this product's scope.

**Current strategy:** use the demonstrated Conjure display path to cheaply test
replacement feasibility, while keeping stock-Home modification open. Neither
architecture is selected. A manually opened page is an intermediate capability,
not the integrated Home. Resolve integration feasibility before broad UI work.

Evidence already supports full-screen Conjure Console display, earlier four-tile
arrows/OK, and inert DashCast inline HTML. It does not support current-page app
launch, stock edits, Home ownership, persistent settings or durable ad-free use.
The prepared Phase A input diagnostic is still unrun. See [routes](routes.md)
for the dated observations and their ceilings; this plan does not upgrade them.

## Architecture candidates and selection gate

| Candidate                  | Useful evidence                                                                                                       | Decisive unknowns                                                                                                                                  | Continue / change course                                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modify stock Home          | Bounded root/dependency read and static SDK/source material exist.                                                    | Actual Home owner/consumer; permitted membership/order/save contract; promotional suppression; reload and reversal. The prior read was incomplete. | Continue only against a specific source-backed customization contract. An empty method scan is not a rejection. No speculative catalog write.           |
| Replacement using Conjure  | Existing Console display and earlier menu interaction were owner-observed. Current input instrumentation is prepared. | Page-to-app/input action, entry/return integration, settings, host dependence, fallback.                                                           | Preferred inexpensive feasibility experiment, not a selected final host. If it remains manually launched, label that ceiling and compare against stock. |
| Replacement using DashCast | Inert inline HTML rendered.                                                                                           | LAN delivery, scripts/input/native actions and Home integration are unproved.                                                                      | Fallback investigation only when it answers a measured Conjure blocker. Do not repeat receiver/title launches as evidence of a launcher.                |

At G3, compare candidates on remote control, agreed app/input actions, chosen Home
entry/return behavior, no promotions, settings, outage behavior and reversal.
Retain unknowns explicitly. Recommend one route with evidence and remaining risk;
owner settles the desired integration behavior and any persistent-change scope.
If neither route has a credible integration path, report a **manual-launcher
ceiling**. Do not silently redefine acceptance or jump to firmware writes.

## Dependency map: what must be true

```text
Product scope + exact target/build + preserved stock fallback
  |-- Stock: identify actual Home + customization/save contract
  |            -> reversible tile/order/promotional changes
  |-- Replacement: renderer + physical input + page-driven destination action
  |                  -> chosen Home entry/return contract
  |-- Both: owner settings + promotion-free controlled surface
                  -> finite lifecycle/outage checks + verified reversal
                  -> owner assessment of daily-use Home
```

This is a dependency map, not a demand to run everything serially. Static
app-payload and Home-owner evidence can be organized while physical testing is
held. Phase A is required for claims about this replacement page's input, not
for reading existing stock-Home evidence. Stock modification need not use Conjure
at all. Known-safe fallback is required before persistent handover, even though
final reversal verification also appears at the end of acceptance.

## TV-P03 gates: smallest evidence that moves the product

| Gate / state                                                  | Work and dependencies                                                                                                                                                        | Evidence needed to advance                                                                                                                                                                                                                                                                                                                    | Failure / next decision                                                                                                                                                                                                             |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G0 — local migration checked; fresh live preflight still owed | New source home and import accounting are preserved. Before a live batch, establish target/build, current host/LAN, config and ownership.                                    | No unowned edits; exact approved target/scope; reachable host; flags/lease state verified; physical exit plan. Migration health on2026-10-23 is historical, not today's health.                                                                                                                                                               | Dock/network or config uncertainty blocks the live batch, not static planning. Never reuse an old IP or receiver state as proof.                                                                                                    |
| G1 — Phase A prepared, unrun                                  | One main-TV Conjure input-only page under the [existing protocol](experiments/home-input.md), after G0 and owner presence.                                                   | Record physical key receipt, visible focus and inert activation separately; owner chooses one Back or Home exit and reports destination.                                                                                                                                                                                                      | Partial input -> inspect static key-registration contract before another scoped test. Page disappears -> unknown receipt where unobserved. No automatic second launch or STOP.                                                      |
| G2 — app/input action contract unproved                       | Static payload work may start before G1. Live replacement action needs G1, exact model/build and one agreed installed destination.                                           | Verify catalog identity versus launch identity/namespace/message. For replacement, demonstrate the page's actual action transport, API result, visible destination and return separately. For stock modification, verify preserved stock app/input actions; no Conjure page proof is required. Add an input case if the first case is an app. | Ally REST launch alone does not prove page action. Resolve a native SDK or separately approved constrained transport; never put pairing secrets or a general write proxy in the page. Preserve unsupported destinations explicitly. |
| G3 — architecture/integration decision open                   | Static Home-owner/entry/return investigation can proceed alongside G1/G2. Before broad UI implementation, compare the two main candidates and decide the integration target. | Source-backed candidate entry/save/return contract and a separately scoped minimum live probe. Observe chosen Home press, app exit or startup behavior; report every untested lifecycle separately. Verify stock fallback before any persistent change.                                                                                       | Home returning to stock is an integration gap, not proof of impossibility. No supported route -> manual interim only if owner accepts; investigate minimum missing contract, or TV-P04 if justified. No watchdog takeover loop.     |
| G4 — controlled Home/settings not built                       | For the selected viable route, after its architecture-specific G2/G3 proof, build only the agreed tile/input set.                                                            | Stable order, visible focus, action/error states, optional read-only Mist tile. No promotional feed/autoplay. Owner-editing decision, one settings authority, per-TV profiles, save/cancel and reload behavior verified.                                                                                                                      | Missing input/action is a named unsupported case. No global LAN writer. If editing is deferred, record owner agreement and fixed configuration limits rather than implying customization is finished.                               |
| G5 — daily-use acceptance unrun                               | G4 plus the selected integration path, safe fallback and explicit lifecycle-test scope.                                                                                      | Run the finite matrix below. Verify no promotions on the controlled Home, ordinary TV use and reversal; distinguish observed, failed and unknown cases.                                                                                                                                                                                       | First unexpected takeover, account/settings loss or uncertain fallback -> stop dependent changes. A single successful session does not establish persistence or acceptance.                                                         |

G3 feasibility discovery starts early; G1 -> G2 -> G3 live proof is the preferred
cheap execution order, not a reason to postpone learning a decisive Home blocker.
Detailed G2–G5 live protocols are not yet specified or approved. Prepare each at
its boundary from the latest results; do not treat this table as runnable scope.

## Acceptance coverage and missing design work

The [specification](spec.md) remains the acceptance authority. This table assigns
its requirements to work instead of duplicating their definition.

| Spec requirement                                   | Gate / next concrete coverage                                                                                                                   | Current limit                                                                                                    |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Physical remote, focus, OK, safe Back/Home         | G1 instrumentation; G2 launch/return; G4 full layout.                                                                                           | Earlier menu observation is historical; current page is untested.                                                |
| Agreed apps and inputs                             | G2 source-backed action and separate destination cases.                                                                                         | No destination matrix or proven page-driven app action.                                                          |
| Owner order, hiding/labels and profiles            | G4 first resolves whether editing is required or explicitly deferred; then save/cancel/read-before-write/unknown-field preservation and reload. | Settings authority/location/transport not chosen. Fixed prototype data is not saved customization.               |
| No promotions in controlled Home                   | G4 static data/asset provenance; G5 visible reload and delayed-refresh checks.                                                                  | Local HTML without a feed cannot prove the running Home remains promotion-free. App/HDMI ads stay outside scope. |
| Ordinary accounts, audio, apps, inputs and casting | G2 bounded transition checks; G5 regression observations.                                                                                       | Full-screen Cast takeover did not restore prior YouTube; do not promise restoration.                             |
| Integrated Home                                    | G3 names required entry/return cases, then G5 lifecycle evidence.                                                                               | Home press, app exit, standby and cold boot are distinct. Shortcut must be labelled.                             |
| Host/network outage                                | G3 fallback design; G5 approved host-only failure simulation and recovery.                                                                      | Console-host dependence exists; no tested outage behavior or relaunch guarantee.                                 |
| Reversible persistent change                       | G3 preserved baseline and usable stock fallback BEFORE change; G5 exact reversal check.                                                         | Host config rollback, returning to stock UI and firmware recovery are different. None substitutes for another.   |
| Optional Mist and attention                        | Mist read-only tile only in G4; TV-P01/P05 remain separate.                                                                                     | No backend duplication, quiet-toast claim or automatic interruption.                                             |

### Finite G5 matrix to turn into a protocol after architecture selection

For each row, first name expected controlled-Home behavior, stock fallback and
reversal, then record target/build, action, API outcome, owner-visible outcome,
restoration and remaining unknowns. No row below has been run for this product.

| Case                                   | Evidence question / dependency                                                                                                                                              |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reload and settings save/cancel        | Do chosen order/labels survive, and cancelled edits stay absent? No cross-TV profile bleed.                                                                                 |
| Chosen Home entry and app/input exit   | Where do Home and Back go from each agreed destination? Is manual re-entry still required?                                                                                  |
| Standby/resume                         | Does the selected entry contract still hold without unwanted wake/takeover?                                                                                                 |
| Coordinated cold boot                  | What depends on TV, Ally and network startup order? Owner schedules disruptive power actions.                                                                               |
| Host or LAN unavailable, then restored | Is failure clear, stock usable and recovery manual/safe? Do not disable adapters or change routing without separate scope.                                                  |
| Cast/app exit and ordinary playback    | Are stock apps, casting, audio and account state preserved after bounded transitions?                                                                                       |
| Delayed vendor refresh                 | Recheck controlled Home promotions/order after a documented bounded interval or observed refresh; choose the interval from the actual mechanism, not an invented guarantee. |
| Exact reversal                         | Restore the selected delta and demonstrate stock Home/apps/inputs; firmware recovery is separately unestablished.                                                           |

## Supporting work: why it exists and when it runs

| ID     | State / relation to primary product             | Resume condition and evidence boundary                                                                                                                                                                                                                    |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TV-P03 | Primary: customized Home, G0–G5 above.          | Next live action remains G1; no broad UI build or device mutation in this synthesis.                                                                                                                                                                      |
| TV-P01 | Secondary: native connection notice.            | Resume for a specific notice-emitter/text contract. A vendor connection toast does not establish arbitrary text or background presentation. Not a Home prerequisite.                                                                                      |
| TV-P02 | Conditional: DashCast fallback display.         | Resume only against a named renderer/delivery gap. Preserve framing; no repeated generic launches or extrapolation from URL echo.                                                                                                                         |
| TV-P04 | Conditional: deeper system/Home-owner research. | First name the blocker, exact production component/build, minimum required capability and recovery/reversal evidence. Renderer, privilege, persistence and Home ownership are separate. No exploit, firmware write or security-setting change authorized. |
| TV-P05 | Held: attention feature design.                 | Separate owner request; OFF by default, quiet rules and no takeover fallback. [Design](experiments/attention.md). Activity detection is not needed for a manually invoked Home.                                                                           |
| TV-P06 | Carry-forward outside this product.             | Preserve LAN/Vite/Tailscale extraction, in-Mist Tailscale configuration, scheduled-task AND Startup-folder inventory and read-only Console/Input Lab with owning Mist/RobCo work. Do not edit their queues here.                                          |

Repository housekeeping is not a product gate: the
[private remote](https://github.com/zerckzzyHD/tv-workbench) was created and the
checked source history uploaded under explicit owner approval on2026-10-25. The
two untracked Claude TV documents remain outside this repo pending ownership
resolution. Neither justifies duplicating current plans or holding G1 research.

## Current batch and handover

**Synthesis baseline:** no device requests, live run, research activation, host
restart, config repair, new build or remote operation. Input
hashes and bounded restore observations are in
[the synthesis receipt](../evidence/provenance/plan-synthesis-2026-10-25.json).
The checkpoint skill was read as a reference, not invoked or copied; no RobCo
queue/lease/checkpoint/deployment tools ran. Existing repo Git history preserves
the before-state; no imported historical evidence was rewritten.

**Static G2/G3 preparation now recorded:** [contract ledger and action/Home
proposals](experiments/home-actions.md) separate object SDK, legacy callback,
host REST, input listing, store and Home-routing evidence. Exact destination,
SDK normalization/context and Home consumer remain unresolved. Nine synthetic
failure-reason tests passed; no new device evidence was added.

**Next without the owner:** use that ledger to resolve retained source references
for the exact missing G2 argument/context contract, or prepare one bounded G3
coverage question. Do not rerun the
incomplete Home collector without a new hypothesis, parser reason distinction,
coverage/control budget and exact approval. Retired raw-source exceptions stay
retired. No website/repository claims were refreshed by this synthesis.

**Next with the owner:** G0 fresh local/LAN/config preflight, then one main-TV G1
run after the existing hold is explicitly released for that exact action. The
[protocol](experiments/home-input.md) owns commands, owner steps, outputs and
exit/rollback. No bedroom action is implied. An approval already covering the
same action persists; do not request it repeatedly. Prior one-shot source/run
approvals do not extend to a new experiment.

After each result, update status with evidence, routes only with demonstrated
behavior, this plan with the next decision, and the affected protocol. Record
partial/unknown cases and remaining acceptance before advancing. This is manual
planning reconciliation, not a newly installed checkpoint mechanism or gate.

## Tooling assessment: REA6.8.0

[Release review](research/rea.md) now distinguishes the useful static JavaScript
and offline-evidence lanes from the still-constrained firmware lane. Optional
next step is a pinned CLI-only synthetic positive/decoy trial after exact package
and local-write scope review. No installation, setup or real-source capture is
approved by this entry. REA adoption is not a prerequisite for G1. The current
input test was paused at owner request before flags changed or any TV launch.
