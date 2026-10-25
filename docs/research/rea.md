# REA applicability: release6.8.0

Assessed2026-10-25 against official release tag rea-agents-6.8.0, commit
160d821ac9a0310afcb8d1fc427862dd6508add5. This is a tool assessment for G2/G3
under [the strategy](../plan.md), not installed capability or new TV evidence.
The previous6.5.0 assessment remains preserved in
[firmware history](../history/import-2026-10-23/forge/FIRMWARE-RESEARCH.md).

## What changes our recommendation

The earlier assessment concentrated on the firmware lane. JavaScript application
workflows/recovery and web-capture documentation already existed at the pinned
6.5.0 checkout; do not describe all of them as new in6.8.0. The6.8.0 release adds
agent-environment workflows and improves retained summaries, selected queries
and recovery/coverage diagnostics. Potential benefit is better bounded static
investigation, not a newly discovered TV installation or Home-writing route.

| Lane                                          | Potential use here                                                                                                  | Evidence ceiling                                                                                                                                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JavaScript graph and semantic feature tracing | Follow a retained SDK normalizer into launch routing, or identify candidate Home consumers in suitably acquired JS. | Needs actual suitable source artifacts and compatible analysis output; our sanitized findings are not the original program. No proof of runtime privileges or native app launch.                                                    |
| Retained summaries / selected fact queries    | Reduce repeated large outputs while retaining source-bound evidence and unknowns.                                   | Tool-reported coverage still needs review. A summary is not full analysis or proof of absence.                                                                                                                                      |
| Offline agent environments                    | Build repeatable host tests from compatible recorded captures without fetching the recorded service.                | Current metadata JSONL is not a HAR/replayable application. Simulated reads/writes are not actual TV behavior or proof of Home persistence.                                                                                         |
| Source recovery                               | Readable modules from selected JS files without executing the selected app.                                         | Wakaru adapter is Linux x64 with caller-supplied engine/prlimit; distinct from provider-free static JS analysis. No recycled permission for raw TV capture.                                                                         |
| Firmware extraction / native analysis         | Later, inspect a suitable acquired binary tied to a measured blocker.                                               | Firmware lane remains Linux-x64 verified, caller Binwalk/Unblob/prlimit,128MiB input ceiling. Windows Ghidra P0 admits PE and selected raw6502, not TV ELF. No decryption/signing/recovery capability established for our packages. |

## Narrow machine check

Node on PATH reported v24.22.1, satisfying the pinned package's declared runtime
range (^22.23.4 or ^24.22.1 or >=26.12.1). No rea, Ghidra headless launcher or
Hopper command was found on PATH; Java was found. This is PATH discovery only,
not a whole-disk installation census. No REA MCP tools were identified in this
session's exposed tool inventory. No setup, package installation, doctor,
analysis-provider launch, target analysis or agent configuration change ran.

## Optional next evaluation, not a dependency of G1

Propose a pinned6.8.0 CLI-only trial in an isolated local scratch area, after
reviewing package acquisition/dependencies and exact local-write scope. Do not
run setup or register MCP globally as part of a trial. No TV data, configuration,
pairing material, browser attachment or new source capture is required.

Use one small synthetic SDK-like fixture whose ground truth is known: a
normalizer -> launch function -> request chain plus a disconnected app/launch
string. Require source-located evidence for the real chain and reject false
attribution to the decoy. Compare with direct inspection; record omissions and
unknowns. Set a finite analysis budget before execution and stop on missing
platform support, extra setup, unexpected acquisition or unresolved cleanup.
The fixture has not been built or run and REA's Windows execution is unverified.

Pass would justify considering REA for a suitably scoped real source artifact.
It would not recover the real missing appInfo schema, prove the Conjure page's
SDK context, identify stock Home or discharge any TV acceptance criterion.
Retired memory-only SDK/test-UI permissions remain retired. Do not change those
boundaries merely to feed a new tool.

Astra supplied read-only applicability advice, based on this pass's source
findings, including the positive/decoy trial control. No firmware/device action
or installation follows from that advice. The remote-input test remains paused;
its preparation changed no flags and sent no TV launch.

## Official sources, pinned for this review

- [6.8.0 release](https://github.com/morluto/rea/releases/tag/rea-agents-6.8.0)
- [Package runtime](https://github.com/morluto/rea/blob/rea-agents-6.8.0/package.json)
- [Application workflows](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/javascript-application-workflows.md)
- [Offline agent environments](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/agent-environments.md)
- [Historical capture inspection](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/web-network-captures.md)
- [Source recovery](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/javascript-recovery.md)
- [Installation and Windows boundaries](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/installation.md)
- [Firmware analysis](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/firmware-analysis.md)
