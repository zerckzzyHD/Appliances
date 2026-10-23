# Proposed one-resource API test UI inspection

Status: APPROVED, EXECUTED ONCE AND RETIRED. Original proposed procedure below
is retained as history; execution details follow.

Purpose: extract the test UI's own method groups, public argument examples and
static resource references without navigating every screen through owner photos.
The owner visually confirmed this page runs on the TV.

Exact GET target: http://127.0.0.1:12345/scfs/cl/js/apiTestApp.html
One credential-free fetch, no redirect, timeout10s, 1MiB streamed ceiling. No
recursive fetching, no linked script retrieval, no configuration/store/account/
identity endpoint, no DOM session export or screenshot capture. Upload once from
TV socket and exact diagnostic Origin/Host to existing Ally listener4176. Retain
raw HTML in Ally process RAM only for at most10min; readback only to Ally peer.
Parse HTML and inline JavaScript as data; never render, eval, import or execute
this captured resource on Ally. SDK execution remains on the TV.

No raw HTML/JS output, source files, commits or pushes. Save only reviewed static
method names, parameter names/types, credential-free relative resource paths,
fixed non-sensitive example arguments and hashes. Redact all other literals and
any token/identity/account/private configuration values. Do not copy live state.
Release raw buffer and remove receive/readback/page routes after one inspection.
No new firewall/router/Tailscale/startup change, firmware/reset or store write.

Existing native command permission does not change the earlier raw-source
transfer restriction, which explicitly named one companion JavaScript resource.
This document is a concrete additional proposal, not an authorization itself.


## Execution record

Owner approved this exact capture. TV uploaded374655bytes; SHA-256
2aebe583db96750fa7d1f628f3c597caa8b03dc86116d8f8b25e57ab5e786809.
Existing parse5 and Acorn parsed one323411-character inline script without
execution. No linked asset was fetched. Saved only sanitized metadata in
test-ui-static-registry-20261017.json. Accepted312 named definition records;
AST had314 deeplinkId properties, so do not assert complete314-record extraction.
Raw bytes released through DELETE (HTTP204), statusavailable=false. Receive,
readback, status and capture document routes subsequently removed from active
server code; retained module is historical implementation evidence only.
