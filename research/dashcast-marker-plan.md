# One DashCast LAN iframe control: prepared, not executed

## Why a separate page

The real summary uses X-Frame-Options DENY and CSP frame-ancestors none. Those
browser rules deliberately prevent another website embedding the Console.
They do not prevent direct Conjure navigation. They remain unchanged.

This test serves only fixed MIST DASHCAST CONTROL text, black background/white
letters, no private/Console data, scripts, images, forms or outbound requests.
Only its successful, admitted response omits framing denial. All errors and
all existing pages retain denial. This is not the production Console in an iframe.

## Scope requiring one owner approval before live use

- Main/living-room TV only, explicitly owner-confirmed idle for this run; no wake.
- Temporarily enable researchDashcastMarker:true with main research profile in
  the existing ignored companion options, then use canonical Console stop/start
  with --no-proxy. No independent process/server/task/firewall/Tailscale change.
- Preserve an outside-Git pre-edit options backup; do not change other options.
- One direct known-host Cast connection; no discovery or credential access.
  Abort if status unknown or another non-backdrop Cast app/session exists.
- Reserve one server-issued main dashcastMarker lease, sharing the existing lock.
  Lease expires60sec without refresh; release after collection.
- Launch receiver84912283 once, require its new session/namespace/readiness.
  Send one fixed marker URL in force=false, reload=false mode, pinned to the
  captured transport/session. No USB/public target, retries or follow-up branches.
- Up to12sec display observation, within30sec sender observation budget after
  startup; connection/cleanup have separate bounded calls. Protocol timing is not
  a claim of visible duration. The receiver is a full-screen app and may displace
  idle YouTube/Home. Stopping may return Home; prior-app restoration is unproven.
- Stop only captured session after a current ownership check; STOP explicitly pins
  its session ID and never substitutes a newer session. Independently disconnect
  sender and release lease; incomplete cleanup returns nonzero and is reported.
- Disable/remove temporary marker option and restart through same Console manager;
  verify opt-in false and old marker path unavailable. Do not replay a run.

No TV settings, pairing/auth reset, store/firmware write, new outside access,
raw source capture or payload execution outside the fixed receiver URL message.
No marker result authorizes the real Console to be embedded or a quiet popup.

## Server and exported evidence

Existing main research listener4178; exact Host, permitted peer and no proxy
identity headers. Main TV only can GET the exact active marker path. Origin must
be absent in this first experiment; unexpected Origin is rejected, not learned.
Only two successful marker responses allowed; a third is refused. No GET extends
the lease. Other methods, query/trailing-path variants and wrong groups are denied.

Saved fields are finite: responsesIssued0..2, lastRejection none/method/
origin_present/request_limit, message count0..1, URL echo boolean, fixed outcome,
STOP/disconnect/release booleans, captured-session-absent confirmation and unobserved visual result. Session/transport
IDs, raw responses, Origin/UA/referrer, media/account/config values and tokens
are not saved or printed. Owner provides visibility, takeover and ending screen
as a text observation; no photo required.

## Outcome interpretation

- No admitted GET: reachability, receiver URL handling or policy unresolved.
- origin_present/403: chosen control policy rejected request; do not call DashCast
  unsupported or relax policy automatically.
- Response issued but no visible marker: full receipt/render/context unresolved.
- Marker visible: this LAN iframe route displays the fixed page. USB, real Console,
  native notification and persistent Home tile remain separate untested contracts.
- Cleanup incomplete: retain results but stop; no automatic retry or second receiver.

## Entry and local-only preparation

`python -B research/run-dashcast-marker.py` prints its plan and makes no connection.
After approval and enabled listener, --apply additionally requires the existing
isolated --packages directory. A fresh result is created under results/ with its
run nonce; no existing result is overwritten. The test does not enable its own
listener or edit options.

Local fixture/launcher tests use loopback or fakes, never a TV. Source-level Home
parser reason improvements are separate preparation; no live Home run belongs
to this permission. Retired source capture grants and old batch approvals stay retired.

Cleanup confirmation requires a receiver-status reply showing the captured session
absent. A correlated error, malformed reply or still-present session is incomplete,
not success. Raw replies remain in process memory and are not saved. Another app
may exist after cleanup; this never claims prior-app restoration or safe TV idleness.
