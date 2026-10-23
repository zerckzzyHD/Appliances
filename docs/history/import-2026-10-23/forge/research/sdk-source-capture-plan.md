# Proposed fixed SDK source capture for offline analysis

Status: EXECUTED ONCE AND RETIRED. The separate owner approval was received.
The original proposed procedure below is retained as history; execution is recorded
at the end. The general diagnostic channel still excludes raw SDK source.

Purpose: resolve the observed test-app wrapper ()=>hw() and native RPC/property
implementations without further blind native commands or repeated photo probes.
The fixed source is the TV-local companion script already read in revision 1:
http://localhost:12345/scfs/cl/js/vizio-companion-lib.js

One explicit diagnostic launch would fetch only that resource as text with omitted
credentials, redirect:error, ten-second timeout, one-MiB stream ceiling. It would
POST the bytes once to a dedicated /research/sdk-source-once route on existing
4176, allowed only from the TV socket and exact diagnostic Origin/Host. No caller-
supplied URL, file path, shell command or arbitrary device export is accepted.
No TV configuration, device store, tokens, identity or account endpoint is read.

The Ally holds the received source in process memory only, expires it after ten
minutes, and permits readback only to its configured Ally peer. Parse in a separate
local process with an existing JS parser; never eval/import/execute the SDK on the
Ally. No raw source is written to files, committed, pushed or included in handoff.
Only sanitized structural findings and hashes may be saved, after review. This also
avoids persisting any unexpected embedded platform credential in the static SDK.
Do not print raw source or unreviewed literals to tool output.

After one capture, close the receive side; remove the temporary route/policy and
raw memory after analysis. Normal summary, firewall, router, Tailscale and startup
settings remain unchanged. No firmware/reset/install request is included.


## Execution and retirement

Owner approved the one memory-only capture. Executed once: 299586 UTF-8 bytes, SHA-256 `9579ff1eeca0af2c9c1ce095480048dace96d509e6814539a390def3d4c88029`. Acorn parsed the source without executing it. Only sanitized structural findings were saved. The raw capture was released with DELETE (HTTP 204); status then reported captured=true, available=false. This is buffer release, not a secure-erasure claim. Capture routes were subsequently removed from the active server. The capture module and launcher are retained as historical implementation evidence, not an active capture facility.
