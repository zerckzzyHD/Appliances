# Mist Console TV owner context

Owner clarification, 2026-10-23: customized ad-free TV Home is the broader goal;
the Mist tile was proof of concept and replacement Home is acceptable. See
HOME-SPEC.md for new scope and EXECUTION-PLAN.md for next experiments. The
existing Console summary remains read-only; this does not turn that view into
a backend or authorize implementation of a replacement Home. Older goal wording
below is retained original context, superseded where it excludes replacement.

Current lifecycle: Console-owned hosting, with the historical TV task disabled.
See CONSOLE-LIFECYCLE.md and the latest dated section below; earlier entries
are retained observations and do not describe current startup.

Origin: owner-linked ChatGPT conversation "Reverse Engineer TV Firmware" and
Downloads/Mist_Console_TV_Codex_Claude_Handoff_2026-10-17_v4.zip; continued with
owner-authorized hardware checks in Codex on 2026-10-17. The packet is historical
evidence; current source and later owner decisions take precedence.

The product is existing Mist Console. This is its TV client/launch path, never
Mist App, a separate product, or a duplicate backend. Existing Console routes
are hosted by the RobCo dev server; the private View source is in this repo.
Keep private source private and never run the public derive/publish path.

Owner wants remote navigation, lightweight animation, repeatable launch and a
quiet ready state after Ally login. Auto-ready does not mean auto-open: never
interrupt Nintendo Switch HDMI just because Windows starts. Preserve working
Input Lab, existing Vite/Tailscale and other dirty work. The living-room TV is
V435-J01. A bedroom Vizio/Xbox profile is planned; exact model is unknown.

Sequence retained from the prior plan: validate the four-tile demo; server
survival across SSH close; saved token reuse; coordinated offline-LAN test;
audited real Console integration; TV-native starting feasibility. Later work
must separately test Back/Home and return to Switch, changed DHCP, TV off,
revoked token and failures, without automatic re-pairing or startup hijacking.

True stock-TV-remote-only launch remains a goal. Launching a URL via the paired
SmartCast API does not establish a native Home tile or installable application.
Research supported vendor mechanisms and clearly label a phone/PC shortcut.
Never make firmware changes or routine unsupported OS-debloat proposals.

Separate Vizio settings work: inspect real firmware menus and baseline Home
responsiveness, app ordering, power-on/last-input preferences, Quick Start/Eco,
Viewing Data privacy preference and Switch Game Low Latency. Home UI lag and
HDMI gaming latency are separate measurements. No settings were changed here.

The final Claude handoff must include this prior context, later owner approvals,
source paths/branch/local commit, hardware evidence, executed checks, limits,
rollback and outstanding decisions. Deliver it only at the end of this workstream.

## Existing pause-visibility ownership, checked 2026-10-17

The owner asked for intentional pause to be visible instead of merely showing
failed/unknown checks. Do not file a duplicate item. The canonical queue at
C:/Dev/!RobCo/_RobCo-Archive/!PLANNING/QUEUE.md, inspected at Archive commit
d0eebb5cbea0b42ab05f45f02050d4321283bf75, already records:

- CM9, D-14, line 31057: pause and "paused is visible" land early; resume stays
  after the move (MI34).
- MI34, lines 28640-28657: visible shutdown-state record; actual switch presence
  and recorded intent must agree; say which components remain running. Writes
  belong to the App authority path, never this read-only TV client.

The inspected current View project/sources files did not expose a pause fact
to the approved aggregate schema. Staleness alone cannot establish intentional
pause. Reuse the upstream authoritative pause projection when that ownership
lands, then carry an approved read-only pause indication to Console/TV without
converting unknown/failing checks into PASS. The queue was read, not edited;
operational pause state was not directly inspected. These pointers belong in
the final Claude/Codex handoff alongside the original chat context.

## Later lifecycle decision, 2026-10-17

The owner confirmed local TV time correct, then authorized Vite changes to make
TV hosting exist only while the existing Mist Console runs. The current design
uses the private TV module inside Vite, loaded by generic optional owner-local
settings in the public routing repo. The standalone TV login task is retained
Disabled and its old activation commands retired. This changes only the earlier
TV startup decision; the limited LAN summary approval, private Console boundary,
paused-supervisor context, and deferred final Claude handoff still apply.
See CONSOLE-LIFECYCLE.md and STATUS.md for source and observed evidence.
