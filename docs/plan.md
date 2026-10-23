# TV project plan

This is the single TV-only backlog. Product acceptance is in [spec.md](spec.md);
current evidence is in [status.md](status.md), and demonstrated route ceilings
are in [routes.md](routes.md). The IDs are project-local and do not belong in a
Mist/RobCo queue.

| ID     | Priority and state                                                    | Next evidence                                                                                                                                                                                         | Boundary                                                                                                                                                                                                                  |
| ------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TV-P03 | **Primary — preparation ready; live Phase A held**                    | Owner-present, main-TV, input-only Conjure diagnostic described in [the experiment protocol](experiments/home-input.md).                                                                              | No new route activation, Console restart or TV operation until the owner is present and explicitly releases the existing hold/no-stop constraint. App launch is Phase B and waits for a verified destination and payload. |
| TV-P01 | Secondary — native connection notice                                  | Identify the emitting component and whether notice text is fixed or configurable.                                                                                                                     | Not a prerequisite to customized Home. Pairing success, receiver loading UI and a native notice are separate. No arbitrary-text or noninterrupting API is established.                                                    |
| TV-P02 | Supporting — DashCast page route                                      | Revisit only if a candidate Home host needs the unresolved LAN-delivery distinction.                                                                                                                  | Do not block the primary Home work. Preserve production framing and network controls; scripts, SDK access, remote input and Home integration remain unproved.                                                             |
| TV-P04 | Planned — scoped system research                                      | If a measured blocker requires it, identify the exact production Home/browser component and model/build compatibility; inventory recovery before proposing persistence.                               | Renderer access, privilege, persistence, notification control and recovery are separate milestones. No exploit, root, firmware write or security-setting change is authorized.                                            |
| TV-P05 | Held — attention feature design                                       | Keep the documented design OFF by default; revisit only on a separate request.                                                                                                                        | No automatic takeover. Full-screen display is not a quiet toast, and Cast idle is not a TV-idle signal.                                                                                                                   |
| TV-P06 | Carry-forward — retained integration requests outside this TV product | Keep LAN/Vite/Tailscale extraction, in-Mist Tailscale configuration, scheduled-task **and** Startup-folder inventory, and read-only Console/Input Lab preservation with their owning Mist/RobCo work. | These requests are not TV Workbench milestones. This project does not edit normal queues, mission/runtime state, startup tasks or public publish paths.                                                                   |

## Current execution order

The approved module-path cutover passed health checks. All186 tracked Forge
source files were removed locally; checked leftover dependencies/generated files
and preserved log originals remain after deletion was blocked by automatic review.
They are not editable authorities. Untracked Claude TV documents remain excluded
pending individual ownership resolution. No remote is configured or uploaded.

1. Keep all TV operations held. The owner must be present and explicitly release
   the earlier no-stop constraint before any live activity. Do not infer that
   previous sender sessions are active or safely stopped from historical logs.
2. If that hold is released, review the exact Phase A hosting change and rollback
   with the owner. The prepared `researchHomeInput` option remains false by
   default; enabling it and restarting Console are separate changes.
3. Run one fixed, main-TV input-only diagnostic under the bounds in
   [the protocol](experiments/home-input.md). Do not use a remote API command to
   substitute for physical input evidence. The owner chooses Back/Home and the
   exit behavior.
4. Only after Phase A, resolve app identity and the exact launch payload from
   source-backed evidence, then propose Phase B separately. Do not launch an
   arbitrary test app.
5. Branch on the result: if input/launch fails, resolve the minimum contract
   before styling; if a manual launcher works but Home returns to stock, record
   it as partial and investigate documented Home ownership. Do not fight Home
   with a watchdog.
6. Pursue deeper system access only where a measured blocker justifies it, with
   exact compatibility and a model-compatible recovery/reversal plan first.

No live batch is approved by this plan. A prior approval is consumed and cannot
be reused for another run, target, operation or output scope.
