# Software-only Home entry investigation

Current research record, 2026-10-17. Owner wants a native TV Home tile that opens
the existing private Mist Console client. No vendor submissions/contact and no
hardware modification. This document records tested limits, not impossibility.
FIRMWARE-RESEARCH.md owns image provenance and earlier USB/Cast experiments.

## Persistent app replacement

Owner proposed replacing a built-in app such as Viziogram. This is a distinct
candidate from adding an entirely new catalog entry, but still requires a way to
change the TV's stored app mapping or executable/content definition. No such write
mechanism has been established on this firmware. A transient /app/launch MESSAGE
override is not evidence that selecting an existing Home tile will use that URL
later. No app was removed, overwritten, repointed, or tested under another app ID.

The historical ViziOwn research changed sc-config.json / VirtualInputs after
obtaining filesystem/root access. It demonstrates an older implementation's
configurability, not a current authenticated API for persistent replacement. Do
not use that example as authorization or compatibility evidence for this TV.
https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/

## Live public catalogs

Read the following feeds directly from Vizio, without user identifiers:

| Feed                                                         |  Bytes | SHA256                                                           |
| ------------------------------------------------------------ | -----: | ---------------------------------------------------------------- |
| https://scfs.vizio.com/appservice/vizio_apps_prod.json       | 132753 | f866805c4e7d7e22e731139a6b0277ced3b6f58b665bcd9dd858aa63a93cab1b |
| https://scfs.vizio.com/appservice/app_availability_prod.json |  88227 | 93a976b4d6c41a1571030bd6ef355bbb070501a3fcac5e909663448c0dcde920 |

Each feed has 345 entries. Availability rows have id/chipsets, with payload and
firmware-minimum/maximum fields inside platform variants. Selecting explicit
MT5691 entries or their wildcard fallback yields 344 rows/344 payload variants;
all payload strings parsed. This is platform-selection analysis, not proof that
every variant is executable or eligible on installed firmware. Namespace variant
counts: 335 in NS2, four NS3, two NS5, two NS0 and one NS4. No APP_ID=17 variant;
the single NS4 entry is VIZIO Bundles / APP_ID=3016, with null catalog ID.
research/catalog-inspection.json retains the sanitized counts and limitation.

Name inspection found no browser, Conjure, developer, custom-URL or registration
entry. Home-related text matches were ordinary entertainment app names. No
registration endpoint was observed in these feed schemas. These are sender-side
catalog/availability inputs, not an exhaustive census of Home's private services.
Do not infer writable registration from having a catalog URL or launch payload.

## Manufacturer launchers and development access

Read Vizio's published launchers as source, without using their pairing UI:

- https://vizio-pm.s3-us-west-1.amazonaws.com/conjure-launcher.html
  13733 bytes; SHA256 ca92a3074dd9938c8636f4fa2cc15eddc6633cc8731d4a760bc4effcbe6d6b2f.
  getLaunchData(url, debug) fixes APP_ID=17, NAME_SPACE=4, puts URL in MESSAGE
  and optionally adds DEBUG=1. It sends the existing paired /app/launch request.
- https://scfs.vizio.com/html5-app-dev-launcher/cast-launcher-sender.html
  7374 bytes; SHA256 0992d725e2c4810ce7f2a93e2e86bf4377c94fe0993b0a357965f87b33a9b1fd.
  Source uses Cast receiver A60E880D and a media load. Its launch-history storage is
  localStorage in the sender's browser; it is not TV Home-tile persistence.

Independent implementation guides distinguish retail web launch from Vizio-enabled
development debugging. BlackBox QA documents HTTP port 9555 and whitelisting;
trueX explicitly says Vizio enables development mode. Neither reviewed guide gives
a consumer self-enable setting or a native Home registration API.
https://www.blackboxqa.ca/vizio-installation
https://github.com/socialvibe/truex-ctv-web-reference-app/blob/develop/platforms/Vizio/README.md
No serial was submitted and no developer onboarding was attempted.

## Owner-approved DEBUG=1 test

Prepared research/launch-debug-check.ps1 with plan-only default and explicit
-Apply. PowerShell parsed it without errors; ran the plan and inspected its body.
Owner specifically approved one DEBUG=1 Mist launch, read-only port checks and
normal relaunch, acknowledging possible LAN debugging exposure. This is approval
for that experiment, not a permanent developer/security setting change.

Executed -Apply once: API SUCCESS. After three seconds, HTTP /json/list checks on
9555 and 9222 each failed with HttpRequestException. In finally, executed the known
normal bin/launch.ps1 once: API SUCCESS. Subsequent two-second TCP attempts to each
development port timed out. No LAN debugger was observed. This establishes neither
the meaning/persistence of DEBUG on this firmware nor the absence of every possible
debug endpoint. Normal app relaunch was accepted; no new owner display confirmation
was collected during this specific experiment. Earlier Conjure display remains
owner-confirmed. No devtools connection, JavaScript evaluation, app replacement,
firmware write, settings reset, new pairing, firewall or startup change occurred.

## Current decision boundary

The demonstrated software capability remains paired Conjure web launch. A native
Home tile or persistent built-in-app replacement remains blocked by the absence of
a verified writable registration/mapping interface or software access to its files.
Encrypted OTA analysis has not supplied plaintext; DEBUG=1 has not supplied LAN
debugging. Do not repeat these experiments without a new source-backed hypothesis.
Software-only next evidence would be a matching model-specific decryption method,
documented local developer activation, readable software export, or an identified
Home mapping interface. No physical work or vendor submission is an allowed fallback.

## New path: in-renderer interface metadata

Owner requests continued software investigation. A renderer-side probe can inspect
which native interfaces Conjure exposes without requiring a remote debugger. This
is a new measurement path, not another port/USB test. Relevant implementation
reference describes window.VIZIO and the local companion-library script:
https://www.tothenew.com/blog/vizio-smart-tv-a-comprehensive-guide-to-start-initial-app-development/
That article also says app URLs need registration for companion functionality.
No registration, local SDK script load, native method or device-ID call was made.
Do not copy its device-ID/localStorage sample into this project.

Added src/capabilities.mjs and an exact opt-in #mist-capabilities branch inside the
existing fixed page. It reflects property descriptors for up to 24 matching global
names, up to 80 member descriptors per root across at most two prototype levels.
Accessor values are not invoked; method bodies and native property contents are
not serialized. Probe results stay on the TV screen: no fetch, storage, report
endpoint, new listener, private data route or CSP relaxation. The normal summary
mode remains unchanged; fragment mode returns before its network refresh starts.
Arrow keys page through metadata, OK rescans. These are diagnostic navigation,
not native system controls. Proxy/native-object reflection may refuse metadata;
refusal is reported without exception details, not treated as API absence.

Tests exercise getter/method non-invocation, value non-disclosure, diagnostic
rendering without requests/polling, and the existing summary integration. All 31
private-client tests passed, syntax and formatting/whitespace checks passed.
Public dev tree was clean before using its canonical manager to stop/start the
existing Console with --no-proxy. No startup/Tailscale/public source setting was
changed. Delivered live page returned HTTP 200 with the existing restrictive CSP
and the new diagnostic branch. research/launch-capability-check.ps1 parsed and
executed once, using a new client URL plus the fragment and no DEBUG flag; API
SUCCESS. Owner actual probe display and metadata observation are pending.


## Owner photos: all eight metadata pages observed

The owner supplied nine photos covering pages 1 through 8. The diagnostic page
rendered and pagination operated. The bounded matched-name list contained External,
external and standard WebKit APIs, with no VIZIO/conjure/bridge root shown. This is
not a complete enumeration of native access or evidence that no bridge exists.
External was a function with constructor metadata; external was an accessor whose
value was intentionally not read. The probe did not inspect External.prototype's
members. Standard webkitRequestFileSystem names do not establish OS/USB/root access.
Some wrapped output exceeded the visible screen; do not request these eight pages
again. Photos remain in the task attachment area, outside the source repository.

A focused revision omits standard WebKit-prefixed globals (retaining the exact
webkit namespace if present), includes data-descriptor constructor prototype
member metadata, wraps text at 72 characters, and uses 12 lines per page. No
constructor, method or accessor invocation, SDK loading, network collection or
CSP change was added. Local tests are recorded in the following progress entry.

Companion-source follow-up: public search did not yield the actual library source.
One inferred CDN candidate, https://scfs.vizio.com/scfs/cl/js/vizio-companion-lib.js,
returned HTTP 403 from the Ally. This inferred public URL is not the documented
TV-local localhost:12345 URL; its failure establishes no TV-local result.
The public integration article remains the source for that local filename:
https://www.tothenew.com/blog/vizio-smart-tv-a-comprehensive-guide-to-start-initial-app-development/
No SDK was loaded or executed. Reading its text inside the renderer would require
review of CORS and the existing self-only connect-src policy. Do not weaken that
policy or execute the unreviewed SDK as a shortcut. Home tile, app replacement,
firmware plaintext and a remedy for app-order resets remain unestablished.


Focused revision execution: npm run check passed; node --check on capabilities.mjs
passed; all 32 tests passed, zero failures. Prettier ran on both changed JS files;
git diff --check passed. Public dev tree was clean before canonical stop/start
with --no-proxy (new PID 9816). HTTP 200 returned the focused revision with the
unchanged restrictive CSP. Executed launch-capability-check.ps1 once: API SUCCESS.
Owner observation of this revised probe is pending. No native methods/accessors
were invoked by the implementation; actual native prototype contents are unknown.


## Focused probe owner result: two pages observed

Two owner photos show pages 1 and 2 of the focused probe. External.prototype
exposes AddSearchProvider and IsSearchProviderInstalled, both typed function.
external remains an accessor (not read); page 2 contains only the continuation
No member metadata read. No additional matching global is displayed.
Chromium's published HTML interface definition contains the same two External
methods. This supports interpreting these names as browser compatibility APIs,
not evidence of a Vizio native app-installation or Home-tile interface. No method
was called and the TV's implementation/body was not obtained. Absence of other
matched own names does not prove absence of every native interface.
Primary source:
https://chromium.googlesource.com/chromium/src/%2B/5de2157f1e7fb9b16f92472fcdf635911f478495/third_party/WebKit/LayoutTests/external/wpt/interfaces/html.idl

Do not request more photos of this metadata probe or repeat it without a new
hypothesis. Next proposed experiment is research/sdk-source-read-plan.md;
it is a proposal, not an active route, CSP exception or executed network request.


## Owner approval and prepared text-only implementation

Owner explicitly replied Yes, I approve to the bounded SDK source-read proposal.
Added the exact temporary /research/sdk-source-read document/policy exception;
normal document CSP remains unchanged. Browser fetch uses redirect:error,
credentials:omit, mode:cors, no-referrer, AbortController ten-second timeout and
bounded streaming of at most one MiB. Missing safety features stop before fetch;
missing stream support aborts without reading. No fallback, retry or SDK execution.
Response stays in renderer memory, then is discarded; only HTTP status, byte count
and up to twelve lexical function-name labels appear. Labels may match comments
or strings; they are not a verified SDK API inventory. Nothing is sent back or
saved. No device identifiers/values/raw source are shown. Launch script uses the
same paired APP_ID17/namespace4 and exact fixed diagnostic route, no DEBUG.
All 37 tests passed, syntax checks passed, Prettier ran, git diff --check passed.
Actual launch and owner result are not yet recorded. After observation, restore
normal summary and remove the temporary route/import/policy before restarting.


SDK-text experiment launch: public dev tree was clean. Canonical manager stop/start
with --no-proxy brought Console up as PID 23704. HTTP 200 observed on normal and
exact diagnostic document; inspected returned policies: normal connect-src self,
diagnostic only the fixed localhost script. Executed launch-sdk-source-read.ps1
once: API RESULT SUCCESS. This is launch acceptance, not proof of file access,
fetch completion or visible output. Awaiting the owner's single screen result.
The temporary route is active pending observation and must then be removed.


## Text-read owner result and expanded software authorization

Owner photo shows TEXT READ: HTTP 200; 299586 bytes. The twelve displayed lexical
function labels were minified (Qe, W, T, E, D, O, at, ot, st, ct, lt, ut), not a
usable API inventory. This establishes a readable TV-local response under the
bounded fetch implementation; raw source was not sent back, saved or executed.
It does not establish Home registration or root access.

Owner then explicitly authorized native method calls and continued investigation.
This expands the earlier metadata/text-only testing scope to SDK initialization
and software interface investigation. Hardware, firmware/reset/write gates,
no publishing/vendor submission and private-data restrictions remain in force.

Replaced the active text-read route with /research/sdk-interfaces. The former
route now returns 404. New document loads the exact TV-local companion script,
registers readiness handling before loading, then inspects descriptor metadata.
VIZIO roots and relevant app/Home/launch/install/input/configuration method names
are ordered first. Script initialization executes; no additional unknown method
is explicitly invoked by our probe. The SDK's internal initialization is not
claimed side-effect-free. Values, identifiers and native return data are omitted.
Diagnostic CSP permits inline script and that one local script path; connect-src
none blocks document connections. This may prevent SDK initialization/handshake,
so a missing ready event/root would not establish absence of those interfaces.
Normal summary CSP remains self-only. No report collector, raw SDK storage,
telemetry upload, new listener or pairing. Old text-reader code is retained as
inert historical research, not imported by the server. Temporary diagnostic route
must be retired after recording the result. Final Claude handoff remains deferred.


SDK interface launch execution: full 38-test suite passed; after changing only
metadata ordering, the SDK-probe test passed again and PowerShell launcher parsed.
Public tree clean. Canonical restart --no-proxy yielded PID 18964. HTTP checks:
normal page 200 with original self-only policy; SDK-interface page 200 with exact
script-src exception and connect-src none; retired text-read route 404.
Executed launch-sdk-interfaces.ps1 once: API RESULT SUCCESS. Owner actual SDK
load/readiness/interface results pending. No Tailscale/startup setting changed.


## Owner SDK photographs: all nine pages observed

Owner supplied pages 1-9. SDK script loaded true, load error false, ready event
false. VIZIO and VIZIO_MODULES objects are present. Displayed VIZIO members include
getConfigVersion, getCurrentApp/Async, getInputUIList, getConfigProperty/Async,
activeAppObject accessor and Mojo/_debug objects. VIZIO_MODULES exposes App,
System, Device, User, Account, Bluetooth, Captions, TextToSpeech, Tuner and _debug.
Auth-token/device-identity method names also appear, but none was invoked or its
value read. The mere presence of wrappers does not prove a native binding works.
The blocked connect-src policy could affect readiness. No mutation API tested.

Found a measurement ceiling: initial describeNativeInterfaces caps each root at
80 members before relevant-name ordering. Later alphabetical names can be absent.
Do not infer no register/set/launch method from the nine-page report. Implemented
fixed direct module inspection: VIZIO (relevant app/Home/config/input names),
VIZIO.Mojo, VIZIO._debug, VIZIO_MODULES.App/System/_debug. Data descriptors only,
no getters or bodies; emits own/selected/shown counts and caps 120 selected names
per target. No prototype/inherited-member completeness is claimed.

Under the owner's expanded native-testing approval, revised probe calls only
getConfigVersion once after script load, with a callback. A strict numeric-version
format may be displayed; other replies expose type only, values withheld. Throws
omit details; undefined return leaves callback pending. Metadata rescans do not
repeat the getter. No auth token, identity, input mutation, install, settings write,
factory reset or firmware update method is called. Diagnostic connections remain
blocked; normal summary policy unchanged. Tests cover >80-name filtering,
getter/privacy non-invocation, one-call behavior and withheld arbitrary values.
All 40 tests passed; syntax, Prettier and git whitespace checks passed.


Targeted-module execution: public dev tree clean; canonical restart --no-proxy
new PID 26460. HTTP 200 confirmed revised diagnostic contains the one-call getter.
One launch-sdk-interfaces.ps1 invocation returned API SUCCESS. Its console message
still described the prior no-additional-method revision; corrected that text after
launch without repeating the launch. Owner actual getter/module result pending.
Temporary diagnostic route/policy remains active for observation; no native reply
is yet observed. No additional network collection was introduced.


## Owner photos reveal old document retained

Four new photos show the previous nine-page UI: original SDK initialization
caption, no version-getter line and no module counts. Ready event now reads true
on page 1. This updates the readiness observation for that older document, not
proof of a successful native version getter or targeted-module scan. Actual getter
execution remains UNCONFIRMED despite the accepted previous launch.

Launcher reused /research/sdk-interfaces. Suspected same-URL retention/cache is
not proven; corrected the avoidable URL reuse using a fresh 32-hex document path
under that diagnostic route, still serving only the fixed page and same policy.
Added visible MIST SDK MODULES / 2 title so owner evidence can identify revision.
Tests check fixed fresh-ID content equality, malformed path refusal and unchanged
normal policy. All 40 tests passed, syntax/format/whitespace checks passed. No
native method repeated merely by metadata rescan; a new document attempts the one
version getter. No Home/firmware/system setting changed.


## Revision 2 owner screen and timing correction

Owner photo confirms MIST SDK MODULES / 2, page 1 of 14. SDK loaded true, ready
false, load error false; getConfigVersion called once, awaiting callback. Root
VIZIO own-name count 207; filtered/selected/shown count 45. This establishes
execution reached the method call without a synchronous exception; no callback
reply, config version value or complete native connection is established.

The implementation invoked the version getter on script.onload, before the
separate SDK-ready event. Early invocation is a possible reason for the pending
callback, not a proven diagnosis. Revision 3 invokes the getter only upon the
ready event, still at most once per document; repeated ready events and OK do not
repeat it. No fallback call if readiness never arrives. No network policy change.

Reduced owner capture burden: compact comma-separated names, () denotes function
metadata rather than a call; module order App, Mojo, debug, System, relevant root.
System selection now focuses on app/Home/input/config/debug/version/connection
names; auth/token/HomeKit names excluded from this scoped report. This is a filter,
not a complete SDK audit. Counts still disclose total/selected/shown. Data values
and function bodies remain omitted. Header MIST SDK MODULES / 3, fresh URL ID.
All 40 tests passed, including zero getter calls before readiness and one after
repeated readiness; syntax, formatting and whitespace checks passed.


## Revision 3 owner result: pages 1 and 2 of 4

Owner photos confirm MIST SDK MODULES / 3; SDK loaded true, ready true, load error
false. Version callback handler ran with its first argument undefined. No actual
version value was observed. The handler currently captures only its first
argument: additional callback arguments were neither inspected nor recorded.
An error-first callback convention is a hypothesis, not established behavior.
Do not call this a failed native read or a verified native-version response.
Do not repeat the getter until callback shape/signature is handled deliberately.

App module own/selected/shown counts 14/14/14. Listed functions:
exitApplication, getAppInfo, getAppVisibilityState, getCurrentAppInfo,
getIsAppInBackground, getIsAppVisible, getIsCurrentVizioAppByCname,
getVizioAppInfoByCname, launchAmbient, launchApp, subscribeToAppOverlayDisplayed,
subscribeToAppVisibilityChange, subscribeToAppVisibilityStateChange,
subscribeToCurrentAppChange. These names identify lifecycle/lookup entry points;
no persistent Home registration was demonstrated. They were not invoked here.

VIZIO.Mojo own/selected/shown counts 3/3/3: mojoStream$ object, send function,
sendMojoCommand function. No command/message sent. Both _debug objects show
8/8/8: launchApiTestApp, account object, getPartnerReport, getReport,
getStartupReport, getSummary, setVerboseLogging, telemetry object. No report,
identity/account, telemetry, logging setter or test-app launch invoked.
The existence of launchApiTestApp is a new source/argument-inspection lead, not
permission to assume a debugger, registration tool or firmware mechanism exists.

System module own count 72, selected/shown 25/25. Page 2 ends partway through its
list (getConfigProperty, getInputLists, getIsNetworkConfigured, getScCon... clipped
by pagination). Pages 3-4 are still needed for the remaining method-name evidence.
Preserve current document; no restart/relaunch/new native call while owner captures
remaining two pages. The temporary diagnostic route/policy remains active; normal
summary route remains unchanged. Current private commit before this note e0efade;
40 tests previously passed on that code. This update changes documentation only.


## Revision 3 pages 3 and 4 received

Owner supplied remaining pages. System selected methods include getScConfigVersion,
setPartnerAppFailed/Ready, subscribeToAppConfigChange, input context/enabled/list/
name/visibility subscriptions, version/network getters and setBinaryVersion.
Root relevant names include launchApp, launchApplication, launchLink, launchCastApp,
launchCastAppWithChannel, launchAmbient, gotoPreviousApp, registerEvents,
registerKeyEvents, app/input listeners and partner-ready/failed methods. All are
method-name observations only. No Home tile installer, writable catalog API,
settings mutation or input mapping write is established. Do not invoke a setter
or launch primitive by guessing its argument meaning.

Revision 4 inspects four fixed functions: VIZIO.getConfigVersion,
System.getScConfigVersion, debug.launchApiTestApp, Mojo.sendMojoCommand. Reflection
uses data descriptors and Function.prototype.toString; full bodies are never
shown/saved/uploaded. Strings/templates/comments removed before bounded lexical
property-call references are extracted. Reports declared arity and at most eight
references per function. Lexical references are hints, not verified API call paths;
no inspected function is executed by that inspector. Native-code wrappers may
provide no useful references. No raw SDK copy, commands, URLs or device data logged.

Version callback now records total argument count and types of at most first three
arguments; accepts only strict version-shaped primitive text. Arbitrary values and
object properties remain unread/withheld. Handles potential additional argument
positions without assuming an error-first convention; synchronous returns labeled
separately and do not overwrite a synchronous callback result. Once-after-ready
version invocation retained. No test-app launch, Mojo command, auth/identity call,
setter or firmware action added. No policy/listener/Tailscale/startup change.
New visible revision MIST SDK CALL SHAPES / 4, fresh document ID. All 42 tests
passed; syntax, formatting and whitespace checks passed. Actual launch pending.


## Revision 4 observed; direct native test-app command authorized

Owner photo confirms revision 4, ready true, load error false; version callback
exactly one argument of type undefined. This rules out an unrecorded second
argument for that specific observed callback. It does not identify the backend
reason or prove native binding success. Declared arities: root getConfigVersion 1,
System getScConfigVersion 0, debug launchApiTestApp 0, Mojo sendMojoCommand 0.
Observed lexical references: root j._tlm, _.nil, a.then; System j._tmm; Mojo j._tlm;
no references extracted from launchApiTestApp. These may be wrapper/telemetry or
stub behavior; no-body/static reference analysis cannot distinguish conclusively.

Owner again explicitly authorized commands, then asked whether further permission
was needed. Explained no additional authorization needed for current reversible
SDK/native tests; destructive/broader-exposure steps remain separate. Prepared
revision 5, MIST SDK TEST APP / 5, to call only VIZIO._debug.launchApiTestApp with
zero arguments once after readiness. Repeated ready events do not repeat it.
No version getter, arbitrary Mojo send, settings/firmware/reset/install request,
private value collection, new network-policy exception or additional listener.
SDK initialization remains executed. Return type alone cannot prove effective
launch; throws have no exception detail and no retry. If a new interface opens,
record owner observation before further interaction; do not submit forms.
Normal summary restoration remains available through bin/launch.ps1.

All 44 tests passed, including readiness gating, correct receiver/zero args,
one-call guard, return-value non-disclosure, missing method and throw/no retry;
syntax/format/whitespace checks passed. Actual native call/screen result pending.


## Revision 5 owner result: object returned, diagnostic stayed visible

Owner photo confirms SDK loaded/ready true, launchApiTestApp called once, return
type object; our diagnostic remains on screen. The implementation did not observe
that returned operation. Do not infer the command completed, failed or was a no-op.
No destructive command or settings mutation was requested by the probe.

New hypothesis: returned value may be a Promise or cold Observable. RxJS primary
reference describes deferred execution beginning on subscription:
https://rxjs.dev/guide/observable
This is not proof Vizio returned an RxJS Observable. Revision 6 detects data-method
subscribe/then descriptors across at most four object/prototype levels, never
invoking accessor getters. If subscribe exists, invokes it once with next/error/
complete callbacks, which can start the authorized test-app operation. Otherwise,
if then exists, attaches fulfillment/rejection handling once. No fallback from a
failed subscribe to then, no automatic retry and no arbitrary command send.
Opaque objects remain opaque. Values are not serialized/shown/saved/uploaded.
Emissions expose type only; errors map to fixed broad categories from message
text in memory, never raw contents. Bounded four-message display history.

This new handling justifies one fresh test-app invocation: prior call's result
could not be recovered from the existing document without another script entry.
Once-after-readiness and repeated-ready guards retain one invocation/subscription
per explicitly launched document. No firmware/reset/install or system setting
request added. CSP and listener remain unchanged. Revision label
MIST SDK COMMAND OUTCOME / 6. All 48 tests passed, including cold subscription,
promise rejection privacy, non-invoked accessors and integrated one-call/one-
subscription handling. Syntax, formatting and git whitespace checks passed.
Actual return interface/settlement and test-app display remain pending.


Revision 6 owner photo: SDK loaded/ready true, launchApiTestApp invoked once,
Promise-like result, rejection category other. Diagnostic remains visible.
Native launch not established. Next diagnostic must identify error shape and
security-policy blockage without serializing private payloads.


## Error diagnostic prepared after observed Promise rejection

Revision 7 adds inspected error-field types (fixed message/code/status/error/reason/
name descriptors only, no getters), bounded integer code/status values and fixed
classification categories. It normalizes underscore/hyphen/camel-case wording in
memory and inspects one nested error field. Raw text, arbitrary object values,
identifiers, tokens and unknown payload fields remain withheld. These categories
are keyword matches, not a verified manufacturer error-code map.

Browser securitypolicyviolation events recorded on the diagnostic page, limited
three messages, showing directive plus loopback origin only; paths, queries,
credentials and non-loopback origins withheld. This can identify an observed CSP
block instead of guessing more ports/relaxing the policy. No CSP relaxation added;
connect-src remains none. Absence of an observed event is not proof no transport
failure/security restriction exists. The command still runs once after readiness,
with one then/subscribe attachment and no automatic retries. This instrumented
retest is for new error/policy evidence, not repeated blind command attempts.

MIST SDK ERROR DIAGNOSTIC / 7. All 50 tests passed, including structured error
privacy/accessor avoidance and loopback-origin-only policy reporting; syntax,
formatting and whitespace checks passed. Launch and observed error details pending.
Owner planning additions are recorded in the preceding HANDOFF-NOTES block; do not
lose LAN extraction scope or Mist Tailscale configuration while pursuing TV SDK.


## Revision 7 owner result: observed TV-loopback CSP block

Photo confirms SDK loaded/ready true, one launchApiTestApp call, Promise-like
rejection. Error is object with own message[string]; no other inspected fields
or numeric codes shown. Three connect-src violations target http://127.0.0.1:7346.
This establishes our diagnostic blocked a transport used by the SDK. It does not
prove that transport is the sole cause of rejection, that the service is reachable,
or that this TV authorizes the test app. Earlier undefined getter/rejection
results cannot be used as proof of a TV-native lockout; SDK ready does not imply
its backend bridge is connected.

Owner repeatedly authorized software/native commands and reversible tests. Under
that scope, revision 8 permits only the observed TV-loopback HTTP origin on the
temporary diagnostic document: connect-src http://127.0.0.1:7346. No wildcard,
other port, WebSocket, unsafe-eval or same-origin data read added. Normal summary
retains connect-src self. Script-src still only inline and the exact TV-local SDK
script. This changes browser egress policy for the diagnostic, not a socket bind,
firewall, router, Tailscale or TV LAN exposure rule. SDK internal initialization
can now reach that origin; no additional arbitrary/native command is introduced.

Run the same identified zero-argument test-app command once after readiness with
Promise/Observable outcome handling and policy diagnostics. This is a retest after
a measured policy correction, not a blind retry. Visible MIST SDK LOCAL BRIDGE / 8,
fresh document ID. Temporary route/exception must be removed after research.
All 50 tests passed; server tests assert exact new diagnostic connection origin
and absence of that origin on normal documents. Syntax, formatting/whitespace
checks passed. Actual native outcome with the permitted transport is pending.


## Resume after usage limit; revision 9 read-only bridge check

Owner requested sustained software investigation of SDKs/Conjure/DashCast and a
real Home tile. No new hardware/submission/publication scope. Interruption save
149c862 contains the partially written revision-9 module and server import; both
repos were clean before resuming. Preserve this history, no reset/rewrite.

Latest revision-8 owner photo is Vizio Home. Read-only /app/current subsequently
reported namespace 4/app 1. This establishes Home became current after the observed
launch sequence, not a successful native test-app interface. No test-app response
was captured after page navigation. Stop repeating that launch without new evidence.

Finished revision 9: one System.getScConfigVersion call after SDK readiness,
handling Promise-like or Observable-like operation with descriptor-only method
lookup. Only strict primitive version text or four named version data fields are
eligible for display; accessors, arbitrary response values and errors stay withheld
or use prior bounded error metadata. No app launch, setter, auth/identity call.
Also inspects the test-app wrapper shape without invoking it: literals/comments
and numeric literals removed, max 240 characters, no raw SDK storage/transfer.
This may clarify its implementation but is not a complete source audit.
TV-loopback policy from revision 8 retained; normal summary unchanged.

All 52 tests passed, including once-after-ready version read, no debug launch,
accessor non-invocation/private value non-disclosure and serialized script parse.
Syntax, Prettier and git whitespace checks passed. Actual revision-9 launch and
native version result pending. Extraction/Tailscale planning requests remain in
HANDOFF-NOTES; final Claude handoff remains deferred.


## Review branches and restricted return channel explicitly authorized

Owner created review branches and explicitly authorized commits and pushes there,
then explicitly included existing uncommitted handoff edits. This narrowly
supersedes the earlier no-push instruction for these two named review branches;
normal branches/public paths remain untouched. Forge origin verified PRIVATE by
GitHub; remote review/mist-console-tv-20261017 was 149c862, an ancestor of the
current work by two commits. Created local tracking branch at existing current
HEAD, preserving history, no merge/rebase/cherry-pick/reset/force operation.

Handoff origin verified PRIVATE; on review/agent-handoff-20261017, owner-authorized
three existing Claude Markdown updates committed 2b819e6 and pushed. ls-remote
confirmed 2b819e6a3e7dec0c4d32b523b3240655c8b96d11 equals local HEAD. An oddly named
untracked file is a 34364-byte/670-line captured less help screen. Preserved on
disk, excluded as accidental terminal output; no deletion/stash/blanket staging.
These supplied document claims were archived for review, not independently certified.

Owner expressly approved a temporary TV-to-Ally diagnostic channel limited to SDK
method names, fixed error categories, response types and version strings, with no
raw SDK, tokens, IDs, accounts or private Console payload. This extends the earlier
aggregate-only LAN exception for temporary research. Implementation /research/report:
POST only from configured TV socket and exact existing document Origin/Host;
application/json, explicit bounded Content-Length <=32768, no chunked upload.
Schema rejects unknown keys, arbitrary strings/type coercions and disallowed
scopes. Own descriptor metadata only; accessor values never invoked. Version
format now permits known PROD/DEV/TEST prefixes plus bounded numeric segments.
The run ID is the existing 32-hex document cache identity, not an auth token.
Sequence values prevent older snapshots replacing newer ones. Latest validated
report stays in process memory; GET under the existing peer/Host guard returns
only validated metadata and a server timestamp. No file write, generic command
executor, raw source collection, new listener or CORS relaxation. Diagnostic CSP
adds self for this one report route; original summary CSP remains unchanged.

Revision-9 owner photo: System getter returned string, value withheld by previous
strict format. SDK ready true. Debug wrapper shape ()=>hw() observed without
invocation. No verified version value from that photo. Revision 10 sends typed
method inventory plus the same one read-only version operation to Ally. No app
launch, setter or identity/auth getter. All 58 tests passed (real delivered script
executed in test VM), syntax/format/whitespace checks passed. Actual TV report is
pending. Temporary diagnostic route/channel/policy must be removed after research.
Final Claude handoff remains deferred; ongoing notes stay here as source record.


## Live restricted return channel verified (revision 10)

Full 58-test suite passed. Forge review push 1f935543c7960bec0ce18f90dc457d8ee5470ee1
was verified via ls-remote after ordinary non-force push. Public dev tree clean;
canonical restart --no-proxy PID 21508. Diagnostic HTTP 200; report initially
available false. One launch API SUCCESS, run 5b323317324e4581aaddbed4d41f7595.
GET /research/report then returned matching run, sequence 3, loaded/ready true,
state resolved, responseType string, version prod 64.37. This is actual backend
version response + TV-to-Ally channel evidence, not only API acceptance or a unit
fixture. SDK method snapshot saved as research/sdk-diagnostic-20261017.json,
validated metadata only; no raw SDK/device payload or credentials.

Inventory cap 256 reached: App 14, System 72, Mojo 3, debug 8, VIZIO 159. The
module inventories shown precede the capped root inventory; do not claim all root
methods captured. System exposes getTvStoreProperties/getTvStoreProperty/
setTvStoreProperty as further source-inspection leads; none was invoked. A generic
store setter is not established as a Home registration interface. No arbitrary
store values, account data, network names or device IDs have been read/returned.

Primary lab-service documentation found:
https://docs.tvlabs.ai/platform/platforms/smartcast
It describes ZIP Conjure sideloading and CDP9555 in TV Labs managed sessions.
It does not give a verified ZIP install endpoint/body or establish that the same
capability/native Home persistence exists on this retail TV. No lab account,
submission, CLI installation or new ZIP/install command performed. Read-only DIAL
service-description request /ssdp/device-desc.xml on existing8008 returned HTTP
error; not proof no DIAL transport exists. No discovery scan/app-ID fuzzing.

Next useful step requires static SDK source-level analysis, because inspected
wrapper ()=>hw() and native store/RPC methods do not expose implementation through
name metadata. Prepared research/sdk-source-capture-plan.md: one fixed SDK fetch,
one TV-origin upload to same listener, memory-only on Ally, no raw source files/
Git publication or execution on Ally, ten-minute expiry. Current approved return
channel explicitly excludes raw SDK, so this separate request is pending; no
source capture route has been activated. Final Claude handoff remains deferred.


## Approved memory-only SDK capture and structural results

Owner approved the exact one-resource memory-only capture. Revision 11 launch API
returned SUCCESS; the TV uploaded 299586 UTF-8 bytes (299500 JS characters), SHA-256
9579ff1eeca0af2c9c1ce095480048dace96d509e6814539a390def3d4c88029.
Acorn parsed it in a separate local process without executing/evaluating/importing
SDK code. No raw source file or raw source output was produced. Sanitized output:
research/sdk-static-findings-20261017.json. The analyzer saves no source itself;
its dependency is the already-installed public app Acorn parser, not a new install.

Observed mapping in this exact SDK:
- System.getScConfigVersion -> pv -> ta.get (the version store derived from SC_INFO).
- getConfigProperty -> R_ -> ba.getProperty; configuration reads use
  app/config/get_property or app/config/get_properties.
- getTvStoreProperty -> Q_ -> rm.getProperty; plural getter uses the same helper.
  Store reads/writes map to app/store/get and app/store/set. Setter receives key
  and value. No store method was invoked and its scope/ownership is not proven
  to be the Home catalog. Do not treat the generic setter as an installer.
- App.launchApp -> ob -> ll.launchApp -> Jr.request with app/launch and VALUE.
- launchApiTestApp -> hw: gathers debug/config/version/current-app inputs,
  constructs URLSearchParams, has optional conditional early return, then calls
  window.location.replace. apiTestApp.html and a TV-local loopback resource prefix
  appear. This is browser navigation, not observed persistent app registration.
- Full captured-text case-insensitive substring counts: install 0, tile 0,
  favorite 0, VirtualInputs 0, HtmlAppURI 0, DashCast 0; register 20. Identifier
  matches include key-event and identity/session/display registration names;
  those names do not establish Home tile registration. Counts are lexical bounds,
  not proof that these capabilities are absent from firmware or other resources.

Raw bytes were released through DELETE (HTTP 204); metadata immediately showed
captured=true, available=false. Buffer cleanup is not a secure-erasure claim.
Capture routes were then removed from active server code; historical capture
module/launcher retained as evidence. No raw SDK Git upload, configuration values,
identity/account/token data, store writes, test-app repeat, or firmware work.

TV Labs docs were refreshed: ZIP sideloading remains described only for managed
TV Labs sessions without a concrete retail install endpoint/body. Its SmartCast
WebDriver GET/PUT escape hatch is an existing Conjure proxy, not a new persistence
mechanism. Sources: https://docs.tvlabs.ai/platform/platforms/smartcast and
https://docs.tvlabs.ai/platform/integrations/appium/smartcast-webdriver .
No vendor/lab contact or account, build submission or guessed install write.

Native Home tile remains unresolved. Useful next scope is a concrete Home/catalog
consumer or a documented installer contract; avoid repeating debug launches or
blind store writes. Running Claude progress pointer retains LAN extraction,
in-Mist Tailscale configuration request, startup inventory and evidence ceilings.

Cleanup verification: canonical no-proxy restart PID18496; both sdk-source-status
and sdk-source-once returned HTTP404 from the live listener. Normal client launch
API SUCCESS, health HTTP200 with tvLocalTimeUISeen=true after launch. This is
script activity, not a new visual confirmation. All61 tests, syntax and whitespace
checks passed. One combined restart/launch command was automatically blocked
without a stated reason; individual lifecycle and launch operations succeeded.
Owner additionally authorized hands-on reversible TV commands; no-brick boundary
continues to exclude unvalidated firmware/reset/storage writes.


## Store getter and direct local test UI (revision 12)

Owner reiterated hands-on TV function/command permission with a no-brick boundary.
The new fixed-key probe invokes System.getTvStoreProperty exactly once for
com.mist.console.tv.research.absent, never the setter. Result values and rejection
text are withheld; only the approved response type/fixed categories return to Ally.
The report schema adds only fixed probe label sdk-store-12, no new data fields.
Delivered-page tests check one call despite repeated ready events, no writes, no
result/rejection text disclosure and preserved final state after script.onload.
All63 tests plus syntax, formatting and whitespace checks passed. PowerShell
launcher parsed without errors. Public dev tree clean before canonical no-proxy
restart PID17452; launch API SUCCESS. Matching run7b9d84100d3b487794a418efe66cff67
returned loaded/ready=true, resolved, responseType=undefined. Saved only validated
metadata in research/sdk-store-diagnostic-20261017.json. This is a usable getter
response for the unused key, not evidence of writable Home catalog ownership.
No store write/cleanup contract is established; no test setter was called.

The captured helper referenced apiTestApp.html and TV-loopback resource prefix
http://127.0.0.1:12345/scfs/cl/js/. A direct Conjure navigation to their combination
was requested once with the existing durable token; API SUCCESS. The path is an
inference from those static pieces, not a verified file listing. No source capture,
settings command, firmware request or developer-mode toggle accompanies it.
Owner UI observation is pending; do not claim the test interface rendered.

Primary-source refresh bounded to local Conjure/SDK/Home entry points returned
sender APIs and managed TV Labs sideloading again; no retail persistent installer
contract was found. Sources: https://github.com/get-air/vizio and
https://docs.tvlabs.ai/platform/platforms/smartcast . This is a search ceiling,
not proof an undocumented path cannot exist. Genuine Home tile still unresolved.


## Owner visually confirms native SDK test UI

Owner photo codex-clipboard-d4edff5f-d58c-4e3a-a378-3494087e00d2.jpg shows
VIZIO BROWSER COMPANION / API TEST APP, with VIZIO Legacy API and VIZIO_MODULES
New Modular API cards, plus SUMMARY, KEYS, GAMEPADS, TUNER, TTS, CAPTIONS, CODECS,
STREAMS. This supersedes the preceding pending visual observation: direct local
navigation rendered the SDK test UI. It is not a native Home tile/install proof.
Right then OK navigation was accepted (two API SUCCESS results) toward modular
APIs; next UI observation pending. Bounded navigation script supports only
Right/OK/Back/Up/Down/Left. Key codes verified from primary implementation:
https://raw.githubusercontent.com/heathbar/vizio-smart-cast/master/index.js .
No source transfer, configuration value export, setter or firmware command.


## Modular test UI navigation observed

Owner photo6756.jpg confirms VIZIO_MODULES App section and editable argument
examples (getAppInfo APP_ID string3, NAME_SPACE number4). Owner's next photo
image-1792291363144.jpg confirms System selected and subgroups Dynamic Capability,
Environment, Identifier, Menu, Network, Power, Support, Time, Version. The displayed
capability example key is BT_GAMEPADS. No Run All/Run Page/method Run was pressed.
Down, Right, OK toward Environment were accepted; next screen observation pending.
The test UI is a real new entry point for API contracts, not an installer finding.
Raw-source follow-up is a separate prepared proposal in
research/test-ui-source-capture-plan.md. No additional capture is active pending
its exact one-resource approval. Existing TV native-command permission retained.


## Test UI capture completed; native catalog controls distinguish missing keys

Owner approved the exact one-resource HTML capture. Revision13 upload confirmed
both in owner photo and listener:374655 bytes, SHA-256
2aebe583db96750fa7d1f628f3c597caa8b03dc86116d8f8b25e57ab5e786809.
Existing parse5+Acorn parsed one323411-character inline script, no execution and
no linked fetch. Sanitized registry has312 accepted named records; AST counted314
deeplinkId properties (two entries failed the name filter). Earlier commentary
said314 definitions; corrected to312 extracted records, no full coverage claim.
Saved only static namespaces, method/parameter names/types and reviewed example
keys/IDs; no raw HTML/JS. App14, System52, legacy VIZIO123 records among16 namespaces.
Registry is test-definition metadata, not proof all listed APIs work on this TV.

TV Store sample keys ToadName/FrogName/NewtName/SalamanderName reinforce that this
is a generic demo store API; no Home registration contract. Config example keys
use colon delimiters, e.g. AppConfigs:CL:Logging:verbose. Modular Environment
contains country/Cast-state methods, not a catalog editor. TextToSpeech documents
speak(text) and stopSpeech(), not executed. No Run All/Run Page or setter invoked.

Raw HTML released (DELETE204, available=false). Removed active capture wiring;
live sdk-source-once and sdk-source-status each404 after canonical no-proxy restart.
Historical capture module/launcher remain as evidence, not an active source route.
All67 tests pass; syntax, format, whitespace and launcher parse checks passed.

Revision14 uses five fixed read-only calls; no result payloads transferred:
System.getConfigProperty('VIZIOApps'), ('VirtualInputs'), ('AppMigration'),
('MistResearchAbsentControl20261017'), App.getVizioAppInfoByCname('sctv').
Added only finite probe labels to the existing metadata schema, and bounded
per-probe RAM snapshots at GET/research/reports (same socket/Host restrictions).
The normal aggregate page remains separate; no summary upstream read by this route.
First four-call run resolved object types; one readback was interrupted while the
listener remained healthy. Later metadata read succeeded; cause of the transient
transport abort was not established. No dropped SDK response was claimed.

Negative-control run aa082a85b0854a6ca3a2d396de697581 (PID6224, API SUCCESS):
absent control resolved null; VIZIOApps, VirtualInputs, AppMigration and sctv each
resolved object, all loaded/ready=true. This distinguishes the named sections from
the missing control in this run. Their schema, contents, writability and role in
Home persistence remain unverified. Validated types-only snapshot:
research/catalog-type-diagnostic-20261017.json. No URLs, IDs, account values,
configuration scalars, raw source or credentials were exported by the live probes.
No configuration/store writes or installation requests. Home tile remains open.


## Approved automated catalog structure (revision15)

Owner approved the bounded catalog-structure proposal and reiterated automated
hands-on testing rather than repeated photos. No further photo needed for these
routine results. Four sequential SDK reads produce a descriptor-only projection
on TV: at most3 levels/128 objects/4096 properties; no accessors invoked; no scalar
values or arbitrary keys returned. Backend validates exact schema, fixed targets,
field/type enums, bounded counts and rejects added data. Same socket/Host/Origin
restrictions; no generic command or configuration proxy. Source capture remains
retired. All72 tests plus syntax/format/whitespace/PowerShell parse checks passed.

Run c9519d6a14ee4e38919702fea5bcdceb, VitePID7708, API SUCCESS, four validated
structural projections received automatically:
- VIZIOApps: array18 root entries;37 visited objects, no truncation within bounds.
  Observed18 CNAME string occurrences and18 occurrences each of nested route-shaped
  NAME_SPACE number, APP_ID string, MESSAGE string/null. No actual names, IDs, namespaces or messages exported.
- VirtualInputs: array2 root entries;8 visited objects, depth-bound truncation.
  APP_ID is an object at entry level; NAME_SPACE/APP_ID/MESSAGE fields occur
  at the next level. Parent-child edges were not exported.
- AppMigration: object654 root children;128 visited objects, truncated. Observed
  children contain route-shaped NAME_SPACE/APP_ID/MESSAGE fields. Do not claim
  full traversal, current Home app count, or that every entry is launchable.
- sctv lookup: one object with CNAME, NAME_SPACE, APP_ID, MESSAGE typed fields.

Saved only validated projection in research/catalog-shape-diagnostic-20261017.json.
This shows routing/catalog structure and separates it from the generic TV store;
no persistent Home tile writer/registration contract was discovered or exercised.
Do not equate18 internal routes or654 migration children with installed Home apps.
No app/order/config/firmware write and no actual catalog values exported. The LAN
scope and in-Mist Tailscale configuration request remain in the running handoff;
no live Tailscale change. Final Claude handoff remains deferred.


## Hidden SDK factory guarded inspection (revision16)

No new raw source transfer. Inspect _docker locally on TV; invoke only if its
Function.toString is exactly a zero-argument arrow/function returning one bare
identifier (no calls, construction, property access or expressions). Otherwise
collect descriptor metadata without invocation. Only SDK method names/result type
returned under the existing approved channel; no source text, literals or values.
Delivered-page tests reject a call-containing function before invocation, never
call returned methods/read getters, and withhold data. All74 tests and syntax/
format/whitespace checks passed. Normal public dev checkout clean; canonical
no-proxy restartPID24964. One launch API SUCCESS, fresh run
93ff94d80ae346cd8c416e475319b9eb. Native result: loaded/ready=true, resolved,
responseType=undefined, method metadata only _docker. Thus this exposed pure
getter does not yield a useful internal container in this observed retail context.
Not a Docker daemon, RPC service or root-access discovery. Saved validated record
research/sdk-internal-diagnostic-20261017.json. No settings/storage/firmware write.


## Native speech and historical SCPL header controls

Revision17 used documented TextToSpeech.speak(text) with fixed phrase 'Mist is
connected to this TV.', then stopSpeech() after5000ms. No volume/TTS/Voice Guide
setting setter. Separate finite start/stop probe labels keep cleanup success from
masking speak rejection. All76 tests passed, including one utterance/one cleanup,
no setting call, and no raw error values. Syntax/format/whitespace checks passed.
Normal public dev clean; canonical no-proxy restartPID20388. First run
63849a57c75543549e0edf3818839270: both operations resolved undefined; owner missed
it. One announced retry after10s, run eb246bef4e144cb1b639e24bb54bdf09: both resolved
undefined, owner reported NO SOUND. Thus native operation settlement verified,
audible playback NOT verified. No further retry/toggle. Saved validated metadata
and owner observation in research/sdk-speech-diagnostic-20261017.json.

Primary ViziOwn source documents historical /install and /scpl/ on7345:
https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/ .
Performed HEAD ONLY with existing durable token, no redirects/body/source read,
POST/upload/package/script/injection or setting command. /install500 text/html;
/scpl/500 text/html; /app/current control200 application/json; fixed nonexistent
/mist-research-absent-check500 text/html. Installer paths are indistinguishable
from the missing-path control by this check. No exposed installer/vulnerability
or root discovery is claimed. Historical install.sh/command injection was NOT
attempted, and no staging directory/firmware filesystem was touched. Script
research/probe-scpl-head.ps1 retains the exact bounded header-only checks.

Next related read-only question: whether Conjure17 is an actual named VIZIOApp
route vs a generic launch facility. Existing static UI documents App.getAppInfo
(APP_ID string, NAME_SPACE number) and getVizioAppInfoByCname(cname string).
Use an absent-app control before interpreting a returned object as registration.
Home tile remains unresolved; no persistent catalog write contract established.
