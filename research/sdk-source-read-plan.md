# Proposed one-resource companion-source read

Status: PREPARED, NOT AUTHORIZED/APPLIED. No new listener or route is installed.
Purpose: determine whether the documented TV-local companion library can be read
as text, before deciding whether it contains a relevant Home registration API.
This test cannot itself install a tile, replace an app or enable a developer mode.

## Exact scope for approval

One explicit diagnostic launch, using the existing paired Conjure APP_ID 17,
NAME_SPACE 4, no DEBUG. Serve a dedicated fixed diagnostic document through the
existing peer/Host-restricted server on 4176, at /research/sdk-source-read.
Normal summary documents and their CSP remain unchanged.

Diagnostic document CSP would be:

default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src http://localhost:12345/scfs/cl/js/vizio-companion-lib.js; base-uri 'none'; form-action 'none'; frame-ancestors 'none'

Make one GET from the TV browser to exactly:
http://localhost:12345/scfs/cl/js/vizio-companion-lib.js

Read as text with credentials omitted, no authorization header, no eval, script
element, dynamic import, native method, storage access or execution of the reply.
Use a ten-second timeout and one-MiB response ceiling; abort on excess. Display
only the status and a bounded list of function/interface names parsed from text.
Do not display raw source, returned values, identifiers or exception details.
Do not send the response or extracted names back over the LAN or store them.
Owner may supply a photo of the bounded metadata. No summary/data request occurs
in this diagnostic document. No automatic retries, URL variants or fallback.

## Expected limits and rollback

The browser still enforces CORS. A blocked or status-zero response does not tell
us whether the local server or file exists. Do not disable browser protections,
use JSONP or execute the library to bypass a text-read failure. Any redirect is
unwanted: use fetch redirect:error if supported; otherwise stop the experiment
rather than silently substituting an XHR implementation with redirect following.
Feature absence is a test limitation, not permission to weaken protections.

After the single observation, restore the normal paired summary launch. Remove
the temporary diagnostic route/policy after recording the outcome and restart
through the existing manager with --no-proxy. No firmware/reset, startup tasks,
Tailscale, firewall/router, vendor submission, private summary fields or new
pairing changes are authorized by this proposal. Security/configuration approval
is required under the owner's AGENTS rule before activating the exception.

Source for the local script path (implementation guide, not a TV measurement):
https://www.tothenew.com/blog/vizio-smart-tv-a-comprehensive-guide-to-start-initial-app-development/
