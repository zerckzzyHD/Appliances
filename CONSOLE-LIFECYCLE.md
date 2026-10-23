# TV listener owned by Mist Console

Owner decision 2026-10-17: the TV server runs only with existing Mist Console
(Vite). This supersedes independent TV login startup. Correct local 24-hour
time on the TV was confirmed by the owner immediately before this decision.

## Current source contract

`vite-plugin.mjs` creates the existing restricted summary server inside Vite's
process after its loopback HTTP server starts. It waits up to 120 attempts for
the configured LAN interface, never falls back to another interface, and cancels
the pending start when Console closes. Normal Console shutdown closes the TV
listener; process termination closes both sockets because they share a process.
No child server, scheduler, watchdog or automatic TV launch is created.

The public routing repo has only a generic optional development-plugin loader.
Machine settings live in its gitignored, HTTP-denied `.dev-companion.local.json`:

```json
{
  "module": "C:/Dev/!Mist/_Mist-Forge/console-tv/vite-plugin.mjs",
  "options": { "bind": "192.168.4.26", "tv": "192.168.4.20", "port": 4176 }
}
```

The private source owns the implementation, profiles and privacy boundary. The
public tracked source contains no private path or machine addresses. An absent
local file is a no-op, including on other clones; builds never load the module.
The existing Vite bind remains 127.0.0.1:5173. The TV still sees only approved
aggregate data through its separate strict LAN listener, never arbitrary routes.

## Transition and verification

Disable only the owner-approved MistConsoleTV-Summary task and stop its current
owned host before enabling this local extension; retain the disabled task for
history. The old launcher commands now refuse independent hosting. Do not change
the original probe/supervisor tasks or Tailscale mappings.

Tests use actual loopback fixture HTTP servers to observe the listener down
before Console startup and closed after Console shutdown, plus cancellation of
a delayed LAN start. Production checks must compare the two listener PIDs,
confirm the historical task disabled, and check the approved summary/loopback
Console. A later actual Windows login must not be claimed from source tests.

To load changed private TV source, restart the Console process; no private
source hot-reload guarantee is made. For rollback restore the machine-local
extension settings and source revisions deliberately; do not re-enable independent
TV startup unless the owner changes this lifecycle decision.

## Startup display acceptance, 2026-10-17

Requested: a colored startup display, Console /home as the primary printed link,
and a TV listener status. Acceptance: the printed link reaches existing Console
home; RobCo's /terminal/ base and resolved URLs stay intact; TV status states
STARTING, LISTENING or STOPPED from the actual socket, without claiming a TV
screen is connected; managed Vite children can emit color despite the agent's
NO_COLOR environment. Exercise source tests and actual captured startup output.
Physical power-cycle return remains an owner-observed hardware check.
