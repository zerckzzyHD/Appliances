# Remote input: next owner-present experiment

Status: prepared and locally tested; OFF in the local host config at the
2026-10-25 file check. Running health requires fresh G0 preflight. All TV operations
remain held until owner go-ahead. [Plan](../plan.md) owns priority and approval;
[status](../status.md) owns current evidence. This is the protocol, not another queue.

## Question

Does the current Conjure-hosted document receive physical remote input, distinguish
receipt/focus/activation, and leave by Back or Home as expected? Earlier four-tile
navigation was owner-confirmed; this checks the current page, not whether remote
navigation has ever worked. A page launch does not establish default Home ownership.

## Source and local restrictions

- [Page](../../src/research/home-input-diagnostic.mjs): three inert controls;
  capped fixed-category counts; separate focus and activation. No app actions,
  SDK, network uploads, storage, timers or arbitrary text logging.
- [Listener](../../src/research/isolated-server.mjs): default-off homeInput group,
  exact main peer/Host, absent Origin, no forwarded headers, shared60sec lease,
  one exact nonce GET. No report endpoint for this page.
- [Lifecycle adapter](../../src/hosting/vite-plugin.mjs): researchHomeInput must
  explicitly be true with main research target. No second hosting process.
- CSP script hash, connect-none, frame-ancestors none, XFO DENY and no-store.
  Lease expiry prevents later delivery; it does not stop a loaded page.
- Back/Home defaults are preserved. Home may leave without delivering an event;
  owner-observed destination and received key category are separate evidence.

## Activation prerequisites

Repository hosting-path cutover passed the2026-10-23 checks in
[operations](../operations.md); refresh local/LAN/config preflight before launch.
The owner must be present and agree that main TV can be interrupted under the
exact test/exit scope. The old local sender has already exited without TV STOP;
that release needs no repeat approval. Any replacement launch/current session
needs its own exact scope. Do not infer idle from Cast state or operate bedroom
implicitly.

Snapshot the existing ignored options privately after checking for secrets; do
not copy any token or entire config into Git. Temporarily enable only
researchHomeInput:true on the main research profile, using canonical Console
restart. Verify fixed health/target/flag, reserve one homeInput lease via the
existing Ally control route, validate nonce/path, then send one saved-pairing
Conjure launch. Token remains in process memory. No automatic retry or restoration.
Exact live commands are selected only after fresh local-path/ownership checks.

## Owner steps and result recording

1. Confirm the fixed MIST HOME / INPUT ONLY heading and initial focus.
2. Use physical Left/Right, then Up/Down and OK. Compare delivered counts, focus
   and activation separately. No synthetic REST keys substitute for physical input.
3. Choose Back or Home last and describe its destination. If both exit paths need
   testing, select another bounded run explicitly; no automatic second launch.
4. Record owner text as owner-observed evidence. No photo required. If the page
   disappears before a counter is seen, receipt is unknown, not negative.

Stop dependent steps on unexpected playback, modal, target ambiguity or unknown
keys. Preserve physical exit. No TV setting, app/input launch or Home interception.
Owner chooses when to leave; no automatic STOP. After the owner ends the test,
release only its lease, restore exact previous options after race checks, restart
canonically and verify flag off/old run unavailable. Do not stop unrelated sessions.

## Decision served

This is G1 in the [strategy](../plan.md). It validates current Conjure input and
exit only, not stock-Home feasibility or selection of the final architecture.
Static destination and Home-owner work may proceed independently. G2 must prove
how this page triggers a destination, and G3 must address Home entry/return
before broad UI implementation.

## Branches

- DOM input works: proceed to a separate app/return protocol after establishing
  one owner-selected destination and source-backed payload.
- Input absent/partial: inspect the static registerKeyEvents contract before
  declaring the host unsuitable. No native registration in this phase.
- Home goes to stock: current integration gap, not proof replacement is impossible.
- Later app phase must distinguish page-native SDK action, Ally REST request,
  API acceptance, actual display, Back from app, Home from app and manual re-entry.
  No credential-bearing page or general LAN write proxy.

Historical preparation detail is retained under [history](../history/import-2026-10-23/forge/research/home-input-plan.md).
