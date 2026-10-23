# Mist Console TV client

Private presentation client for the existing Mist Console. It reads the existing
loopback /view.json projection, discards everything except the approved aggregate
summary, and serves its own small TV page. It is not Mist App or another backend.
No packages need installation; Node 20+ and PowerShell 7 are required.

Current project scope, 2026-10-23: [HOME-SPEC.md](HOME-SPEC.md) defines customized
ad-free Home, including replacement Home as an acceptable candidate. The existing
Console client remains read-only. [EXECUTION-PLAN.md](EXECUTION-PLAN.md) owns the
project-only backlog. [Input preparation](research/home-input-plan.md) records
current capability evidence and the default-disabled diagnostic; all TV operations are
held until owner go-ahead. No replacement launcher has been hosted or installed.
Prepared option researchHomeInput enables one main-TV input page through the
existing isolated research lease; it is OFF by default and no local options were
changed. See the input plan for exact scope and rollback before enabling it.

Capability index: [ROUTES.md](ROUTES.md) separates demonstrated display, control,
SDK and research paths from partial/failed tests. Latest Cast metadata test showed
a visible full-screen title and returned to Home instead of idle YouTube. It is
not a native quiet popup. Pairing-toast renderer remains unidentified; see
TV-ATTENTION-DESIGN.md for current evidence and feature boundaries.

Historical DashCast test preparation: [marker plan](research/dashcast-marker-plan.md).
That LAN run subsequently executed; see ROUTES.md for its zero admitted responses
and later successful inline HTML. This is not the selected next test.
Only the synthetic no-data marker may be embedded; the real Console keeps its
framing protections. Main-only default-off researchDashcastMarker uses the existing
isolated listener/lease. The Python helper prints a plan unless --apply is supplied.
Home dependency failure diagnostics were repaired locally without raising limits;
no new Home run or consumed capture permission is activated by these changes.

Historical batch25 boundary: the EXECUTION-PLAN.md final batch25 live checkpoint
records the approved
run read the first direct script150219 bytes but hit a parse limit; second script
unread. Both temporary opt-ins disabled; no retry selected. The later project-only
backlog supersedes its former planning hold. TV-ATTENTION-DESIGN.md remains
plan-only; the native Home tile and popup API are unestablished.

Batch24 has a separate main-only group homeDocument, default disabled. Its worker
and page are reproducibly built from locked development dependencies, outside the
public mirror. For research development use npm ci --ignore-scripts, then npm test
(pretest rebuilds the private parser/page). Normal summary hosting needs no parser
build or installed parser packages while this group is disabled. Generated output
and dependency licenses stay in ignored research/generated/; node_modules is ignored.

After its scoped approval only, enable researchDocument24:true in the existing
ignored companion options with researchTargets:["main"], canonical Console restart,
then research/run-target-research.ps1 -Target main -Group homeDocument. The launcher
checks the health opt-in before token access or any native call. Remove that option
and restart through the same manager to retire this group. No new process/task.
The prepared code is not evidence of TV worker/CSP compatibility or Home identity.

Isolated temporary research runs use research/run-target-research.ps1 with fixed
Target main|bedroom and Group version|homeCoverage. Profiles select the TV and
encrypted credential together. Listener health/admission is checked before native
access, one native launch is attempted, bounded metadata is saved under
research/results/, and the lease is released. No native retry or automatic pairing.
The same Console process owns all listeners. Existing main summary stays4176;
opt-in main research4178, bedroom research4177. Current ignored local settings
enable main research only; bedroom4177 is not listening. To retire the isolated
channels remove researchTargets from owner-local companion options and use the
canonical Console manager restart; do not install a separate server/task. Prior
settings backup is workspace-local work/research-lifecycle/, outside the repository.

Software-only research status is in SOFTWARE-ENTRY-REVIEW.md. The opt-in URL
fragment #mist-capabilities displays interface names/types inside the renderer;
it calls no native methods/getters and sends no result to the listener. Normal
URLs retain the summary. This diagnostic is not developer/root access or a tile.

This directory is authoritative. Earlier files in a Codex output folder are
historical staging snapshots, not another editable implementation.

## Owner decision and boundary

On 2026-10-17 the owner approved LAN access to verdict, aggregate outcome counts
with denominator, and freshness, conditional on no outside-network access. The
owner reported no router port forwarding, DMZ or public tunnel. Host inspection
found no enabled Tailscale Funnel or Windows port-proxy entry. Router settings
and a real external connection were not independently tested.

This is a scoped exception to the older one-server/tailnet-only ruling. The
existing View, Vite loopback bind and Tailscale routes remain unchanged. The
owner subsequently approved Vite-owned TV lifecycle; see CONSOLE-LIFECYCLE.md. The
View still has no script, controls, listener, or new action path. Only this
presentation client has a listener and a refresh script.

The server requires explicit private IPv4 bind and TV addresses on one local
subnet. It binds that address only and drops sockets whose source is neither
the configured TV nor Ally. It requires the exact Host, rejects proxy identity
headers, exposes no files and has no arbitrary proxy or write endpoint.
IP restrictions are not cryptographic authentication and do not protect against
an allowed LAN device relaying content. No outside-access certification is made.
Never expose this listener through Funnel, a public tunnel or port forwarding.

## Console-owned hosting

See CONSOLE-LIFECYCLE.md for the current startup contract. Vite owns the TV
listener in its own process. Start/stop the existing Mist Console normally;
there is no independent TV startup. The old standalone command and task installer
now refuse activation. The historical task is retained disabled for audit history.

Run source checks with `npm run check` and `npm test` here. When Console is
running, explicit owner launch is still:

```powershell
.\bin\launch.ps1 -AllyIP 192.168.4.26 -TVIP 192.168.4.20
```

The launcher reuses the existing encrypted token without printing or writing it.
It never re-pairs automatically. The Console-owned listener never auto-launches TV.

## Routes and unavailable behavior

- GET/HEAD / returns the TV presentation page.
- GET/HEAD /summary.json reads only the fixed loopback Console destination and
  applies the allowlist. Invalid/unavailable input returns 503 with UNAVAILABLE.
- GET/HEAD /health describes only this listener; it does not certify upstream.
- Other routes return 404; write methods return 405. No CORS access is granted.

Upstream redirects are refused. Reads have a five-second timeout and one-MiB
body limit. Concurrent reads share one in-flight request. No projection data is
written to disk, cached for later success, or printed in error logs. The TV
refreshes every 15 seconds and clears the displayed summary on a failed fetch.
Unknown freshness remains unknown; a fresh projection timestamp does not make
old supervisor data current.

Tests use synthetic data and loopback-only temporary listeners. They cover
redaction, unknown/stale states, denied peers and proxy headers, route isolation,
write refusal, upstream failure, and concurrent requests. Hardware results and
remaining milestones are in STATUS.md; broader owner context is in CONTEXT.md.

Rollback: disable the optional machine-local Console extension and restart
Console. Retain the historical TV task disabled; Tailscale needs no rollback. Local source changes remain reviewable in Git; never push here.

## Startup readiness

CONSOLE-LIFECYCLE.md owns current startup instructions. READINESS.md retains
the superseded dedicated-task proposal and its observations as history.
The health check verifies that Console and TV listeners share a process.
Explicit TV launch remains a separate action.

TV-native entry research and source limitations are recorded in TV-ENTRY.md.

## Display time

Projection-generated time is presented in America/New_York using 24-hour time
and an EDT/EST label. Daylight-saving conversion uses Intl timezone rules, not
a fixed offset or the TV runtime's possibly UTC timezone. The upstream JSON
timestamp remains UTC. Invalid/missing timestamps stay unknown.

## Explicit page refresh and diagnostics

Each manual launch uses a fresh /client/<32 lowercase hex characters> URL.
That route serves only the same fixed TV page. The identifier is a document
cache identity, not a credential; peer/Host restrictions remain unchanged.
Unexpected query strings and other client paths still return 404.

The current script sends a fixed UI-revision header on its normal summary
request. /health exposes only a boolean tvLocalTimeUISeen, set when that header
arrives from the configured TV peer. This resets when the listener restarts.
It proves the expected script requested data, not that the owner saw correct
pixels or that an IP address constitutes cryptographic authentication.

## Vizio Home layout persistence

HOME-LAYOUT.md records the separate owner-reported custom app-order resets,
read-only observations and pending diagnosis. No firmware or layout fix is claimed.


## Temporary owner-approved SDK diagnostics

During current TV research, /research/sdk-interfaces/<32-hex> serves a fixed SDK
probe. /research/report accepts only bounded schema-validated metadata from the
configured TV peer and exact page Origin; authorized peers can read its latest
in-memory report. No raw source/private data or command execution is accepted.
See research/restricted-diagnostics.mjs and HANDOFF-NOTES.md for the explicit
exception and cleanup requirement. This channel is temporary, not part of the
normal aggregate Console presentation contract. Normal page policy stays unchanged.
