# App actions and Home contracts: evidence and next proposal

Reviewed2026-10-25 from preserved local material. This is the G2/G3 protocol
preparation under [the strategy](../plan.md), not a second roadmap. No destination
has been selected, no live action is approved here and no runner was built.
Astra reviewed the distinction between candidate contracts and executable scope.

## Retained local static contract ledger

| Contract / source                   | What the record supports                                                                                                                                                             | Missing proof / consequence                                                                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modular SDK: registry entries0,1,5  | `window.VIZIO_MODULES.App.getCurrentAppInfo()`; `getAppInfo(APP_ID string, NAME_SPACE number)`; async `launchApp(appInfo object)`.                                                   | Definitions, not calls from our page. The argument object's exact normalized schema is not retained sufficiently to invent it.                                                                       |
| Modular launch implementation       | SDK structural findings identify `ll`, `M.toAppInfo`, `Jr.request`, `app/launch` and `VALUE`. Historical trace records `App.launchApp -> ob -> ll.launchApp -> Jr.request`.          | A plausible native page action path, not proof the custom Conjure page has loaded/initialized SDK or holds the required context. Do not copy the host REST envelope into the SDK call by assumption. |
| Legacy SDK: registry entry147       | `VIZIO.launchApp(NAME_SPACE, APP_ID, MESSAGE, callback)`. Declared namespace type string, static example number4.                                                                    | Separate callback interface with a type/example discrepancy. Do not interchange with the object API or silently coerce. Sample IDs are not approved destinations.                                    |
| Host REST: maintained launch helper | Saved-pairing host call sends `VALUE` with namespace4, app ID17 and a fixed Console URL in MESSAGE; checks/prints `STATUS.RESULT`. Earlier owner observations prove Console display. | This is a Conjure page launcher, not a generic app runner. Host credentials stay in host process. Host REST success cannot establish a page-native tile action.                                      |
| Input getter: registry entry216     | `VIZIO.getInputUIList(callback)` is defined.                                                                                                                                         | A list getter is not a selection command; no input-switch payload or visible switch proved here.                                                                                                     |
| Public catalog / availability       | Dated inspection:345 catalog records and345 availability records;344 inferred-platform/wildcard payload variants; platform MT5691 inferred.                                          | Not installed availability, exact hardware/build confirmation, a Home tile writer or a current vendor-feed refresh. Catalog identity is not launch APP_ID.                                           |
| SDK app store                       | Static `app/store/get` and `app/store/set` routes; getter diagnostic resolved with response type undefined.                                                                          | No favorites key, Home ownership, readable settings or persistent write contract established. Never probe generic setters to discover semantics.                                                     |
| Native Home routing                 | Source trace maps namespace4 via ChromiumHtmlAppUris; SmartCastHome settings project into registry/app routing.                                                                      | Configuration/source mapping is not a supported edit surface or proof of ownership of the visible grid, promotional rows, saved order or Home-key routing.                                           |
| Bounded Home dependency read        | Run8668beae673964819195dce450d79d5e read1092-byte root and first150219-byte script; analysis stopped incomplete, second script unread.                                               | No meaningful negative conclusion about Home methods. Original report cannot distinguish exact AST/worker limit. Newly prepared reason reporting does not retroactively identify it.                 |

Evidence locators:

- [Static UI registry](../../evidence/analysis/test-ui-static-registry-20261017.json):
  zero-based registry entries above.312 accepted named definitions out of314 AST
  deeplinkId properties; do not claim complete definition coverage.
- [SDK structural findings](../../evidence/analysis/sdk-static-findings-20261017.json):
  findings `cl`, `ll`, `tm`, `rm`, `ev` and source hash/byte scope.
- [Historical source trace](../history/import-2026-10-23/forge/SOFTWARE-ENTRY-REVIEW.md):
  approved memory-only capture / structural results section. Raw source retired.
- [Maintained Conjure launcher](../../scripts/launch/launch.ps1), inspected as text;
  not executed during this review.
- [Catalog summary](../../evidence/analysis/catalog-inspection.json) and
  [store diagnostic](../../evidence/analysis/sdk-store-diagnostic-20261017.json).
- [Firmware trace](../history/import-2026-10-23/forge/FIRMWARE-RESEARCH.md),
  concrete source leads: feature-manager/src/main.cpp585–618;
  feature-manager/doc/features.md348–354,373–385;
  platform_orchestrator/src/appsdatabase.cpp949–980,1282–1303,1399–1414.
  These are historical source coordinates, not newly inspected production code.
- [Partial Home report](../../evidence/results/isolated-main-8668beae673964819195dce450d79d5e.json).

## External implementation delta: 2026-10-25

The [pinned compatibility matrix](../research/firmware.md#pinned-implementation-compatibility-audit-2026-10-25)
narrows the ledger's earlier uncertainty. In that external SDK, modular launch
normalizes an object/JSON object string to numeric `NAME_SPACE`, nonempty string
`APP_ID`, retaining other fields, before PUT `app/launch` with `VALUE`. Legacy
positional launch constructs this object. This is not verified equivalence with
our retained local artifact, nor evidence our page can initialize/use it. Local
normalization parity, permitted context and destination selection remain open.

The external SDK store reader expects `ITEM.VALUE`; the report's REST example
shows `ITEMS` key/value entries. Our retained resolved `undefined` cannot settle
missing-key versus envelope/failure behavior. Config and KV-store readers are
separate clients. Manual URL, D-pad and test-UI consumers do not establish Home
grid or entry ownership. No generic store-write probe follows from this delta.

At that checkpoint the next source-only experiment was the Home-consumer trace in
that matrix. It needs an eligible implementation of the native default-Home
registry consumer or actual Home loader/grid; the inspected toolkit does not
supply it. Existing historical coordinates are leads, not a substitute program.
This source lane is independent of G1. Its result may support stock customization
or replacement entry separately; neither is selected by a modal launch.

## Native consumer trace delta: 2026-10-25 follow-up

The [direct OSS trace](../research/firmware.md#native-home-consumer-trace-2026-10-25-follow-up)
now locates and hashes the existing implementation. Top-level `Orchestrator.HomePage`
projects to a native registry setting; the Home alias is updated and selected by
conditional app-return code. This is separate from generic store and stock-grid
editing. The default Loki controller discards `uri`; fallback swaps can change
the alias owner after the URI update. A string value alone cannot select an
arbitrary browser Home. Subscriptions update the database, not directly navigate.

Before any mutation proposal, establish exact retail provider/controller and the
allowed read surface for this config. Prefer eligible build-identified config or
factory-selection source first; the historical defaults are insufficient. If
that evidence is unavailable, a future metadata-only compatibility scope
would record build, effective Home owner/controller and fixed shape/availability
categories without credentials or raw config export. No such live run is approved
here. Retired capture permissions stay retired; physical Home-key routing, grid
control, durability and reversal remain separate. G1 remains paused and unchanged.

## G2: minimum future replacement-page action experiment

Not runnable yet. Close these prerequisites before preparing a runner:

1. Pass G0/G1 on the exact target. Agree one installed destination with the owner;
   do not assume YouTube merely because it appeared in earlier observations.
2. Establish exact model/build and provenance-labelled launch identity/payload.
   Decide SDK interface and its normalization using retained evidence or a newly
   approved narrowly scoped read. Do not reuse retired source-capture permission.
3. Specify how this exact page loads/initializes its SDK, how readiness is known
   and which native context permits the call. Existing Phase A has no SDK and
   must remain input-only; prepare a distinct action page/protocol later.
4. Define outputs and transport separately: method availability, one invocation,
   fixed result category, owner-visible destination and chosen return. No raw
   config/identity/source, credentials, general LAN write endpoint or implicit
   new telemetry upload. If navigation destroys the result display, outcome is
   unknown unless an approved bounded observation route already exists.
5. Agree interruption, one physical OK action and one Back OR Home transition.
   No retry, API fallback, automatic STOP, relaunch or previous-app restoration.
   Option rollback/lease release happens only within the agreed exit scope.

Proposed run: show readiness and the single agreed destination; owner presses OK
once; invoke only the selected native launch method once; observe result category
if available and the actual screen; owner chooses the agreed exit and reports its
destination. Record page launch, SDK readiness, action request, API result,
visible destination and return as separate facts. An Ally-issued app command is
not a substitute for physical tile activation plus page-native action.

Stop dependent actions on missing SDK, unclear normalization/type, target/build
mismatch, unavailable destination, unexpected modal/playback or ambiguous result.
Success advances replacement G2 for that destination only. Input switching needs
its own verified command/case. Home integration and persistence remain open.
For the stock candidate, G2 means verifying retained stock actions rather than
requiring Conjure's page-native launch mechanism.

## G3: minimum next Home investigation

The current evidence does not bridge **Home setting -> actual grid consumer ->
read/save/promotional contract -> durable effect -> reversal**. Keep that chain
separate from app launch and signed asset delivery. No store write or package
experiment follows from the existing routing trace.

The next source-read proposal must choose one exact gap in that chain. For the
known dependency branch, first distinguish parser failure on the first script
before extending traversal or budgets. The prepared collector already has fixed
AST/depth/syntax/worker/deadline/malformed-result reasons; nine targeted synthetic
reason tests passed on2026-10-25. This verifies local diagnostics, not the cause
of the historical report or the location of production Home.

Before a new live Home read, specify exact resource selection and controls,
unchanged count/byte/time budgets, bounded metadata outputs, route identity and
stop branches. An initial reason-only repeat would diagnose analysis coverage;
it would not prove Home ownership, and it is not implicitly approved. Do not
raise limits and fetch the second script merely to escape an uninformative result.
If a future app-info lookup is selected, include a separately scoped absent-app
control; a returned object alone is not proof of installed registration.

## Tool choice for these questions

The [tool evaluation](tool-evaluation.md) is conditional on a named question and
eligible artifact. Existing direct inspection comes first; REA must add useful
relationship/coverage evidence before adoption. Neither LeanREA nor an agent
framework supplies the missing appInfo schema, artifact access or Home writer.
No new raw-source capture or replay follows from this proposal.

## Decision at this checkpoint

The next live experiment is still the prepared [G1 input test](home-input.md).
There is enough static evidence to propose a native page launch path, but not to
choose an installed destination or manufacture its argument schema. For exact local
normalization parity, the inspected retained artifacts are insufficient; the
external artifact now supplies its own contract as recorded above. Do not
repeat an identical metadata search or infer that all external sources lack it;
name the additional evidence needed and its eligible acquisition/processing scope. No extra SDK
capture, Home read, app launch or settings write is requested by this document.
After G1, resolve the named G2 prerequisites and present one concrete action test.
A G3 read can be proposed independently when it answers an exact coverage or
consumer question. Do not broaden the test solely because the owner is present.
