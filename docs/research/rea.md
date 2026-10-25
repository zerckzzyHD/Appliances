# Analysis tool strategy: direct tools, REA and LeanREA

Checkpoint2026-10-25. [Plan](../plan.md) owns priority and decisions. This page
owns tool applicability and source findings; [the evaluation protocol](../experiments/tool-evaluation.md)
owns a possible future trial. Neither installs a tool or authorizes a TV run.

## Selection decision

Use existing direct inspection first. Escalate to pinned REA6.8.0 CLI when a
named G2/G3 question needs graph/semantic/cross-artifact evidence that the baseline
cannot provide efficiently. Consider MCP only after demonstrated utility and a
separately reviewed client-config delta. This is conditional adoption, not a
mandatory benchmark project before Home testing. No LeanREA skill is installed.

Ordinary complete C++/JS source repositories remain normal source-reading work.
Do not use an analysis framework just to repeat rg. Conversely, a string hit does
not establish the call/data relationship required to answer a contract question.

## LeanREA review and benchmark ceiling

Pinned review: aicodeking/leanrea commit09ba4aa0217f82cd880f855a60b877f59f39b22b.
Read README, the whole skill, task keys, runner/setup scripts, benchmark account
and36 published result rows as data. None of the scripts ran.

Useful practices: identify format before deeper inspection; narrow source slices;
include hidden files only inside the approved extracted artifact; distinguish
observed, inferred and unknown facts. Preserve input hashes, source locations
and a finite search boundary. Prefer the cheapest method that answers the actual
question. This adapts practices, not the upstream shell commands or skill rules.

Do not adopt unchanged: shared-temp recursive deletion; unpinned package runners;
macOS/Bash recipes on Windows; reuse based only on folder existence; blanket
avoidance of re-verification; or copying a live database/WAL as if atomic.
Source-map filenames are not recovered source contents. Current project gates,
privacy and fresh checks of mutable state take precedence over turn-count goals.

The published benchmark used REA6.5.0, macOS arm64, one model and four tasks with
three repetitions per arm, graded by answer-key regex. Recomputed raw rows:

| Arm      | Runs | Sum of reported wall seconds | Sum of reported cost USD | Raw score |
| -------- | ---- | ---------------------------- | ------------------------ | --------- |
| LeanREA  | 12   | 387.7                        | 2.16818                  | 74/75     |
| No skill | 12   | 478.8                        | 2.20728                  | 66/75     |
| REA      | 12   | 627.4                        | 3.35665                  | 75/75     |

The author's account corrects the no-skill score to67/75 for a version-spelling
regex false negative. These are the author's runs, not our measurements. Regex
hits do not establish semantic equivalence. Deferred versus eager MCP exposure
also changes context overhead substantially. No speed, cost or accuracy advantage
is established for REA6.8.0 versus direct tools on this Ally.

## Broader REA coverage and actual opportunity

Pinned REA release: rea-agents-6.8.0, commit160d821ac9a0310afcb8d1fc427862dd6508add5.
The breadth pass fetched87 top-level guides and47 tool-contract modules with no
fetch failures. That is a documentation/source-contract map, not a complete code
audit, complete tool count, executed verification or platform compatibility test.
JavaScript workflows already existed in the earlier6.5.0 checkout; the old
firmware-focused assessment was too narrow. Do not label every JS capability new.

| Family                                                                             | TV decision it might inform                                                                                  | Eligibility and current disposition                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JS application graph, semantic/feature traces, static routes                       | G2 normalization-to-launch; G3 actual consumer/candidate route.                                              | Highest-priority possible REA use. Needs suitable code; our metadata summaries are not the program. Analysis does not establish live SDK context or route reachability.                                              |
| Source maps and source recovery                                                    | Make acquired bundles traceable/readable.                                                                    | Source-map identity/content must match. Wakaru recovery is a separate Linux/caller-tool lane, not a prerequisite to provider-free JS analysis.                                                                       |
| Source/bundle, export and version/function comparison                              | Distinguish contract/build drift from a parser limitation.                                                   | Useful with two eligible identified artifacts. No fabricated second build or inference of runtime parity.                                                                                                            |
| Android APK/JADX/Apktool/JEB                                                       | Vizio mobile pairing and launch/control contracts.                                                           | Promising secondary source after exact APK provenance and acquisition scope. Mobile privileges are not TV-page privileges. Inspect the APK without launching it.                                                     |
| Passive browser/Electron/V8 observation and reconciliation                         | Connect source candidates to actual loaded/executed behavior.                                                | Needs known authorized endpoint/context. No TV debug endpoint established; no implicit debug-port activation, source export or runtime capture.                                                                      |
| HAR/SAZ/mitmproxy recordings and offline agent environments                        | Explain protocol exchanges and repeat host tests.                                                            | Needs compatible privacy-scoped captures, not existing metadata JSONL. Replay/state writes are simulation, not TV effects or Home persistence.                                                                       |
| PCAP, packet fields, USB/Bluetooth recordings                                      | Protocol/address observations from saved captures.                                                           | High-level PCAP summaries support Windows with required native controls/tools; detailed packet-field workflow is Linux-only. Neither acquires traffic or guarantees TLS plaintext.                                   |
| SQLite snapshots                                                                   | Identify actual settings structure, if a relevant store is found.                                            | No Home database identified. Require consistent authorized snapshot; schema ownership and runtime use remain separate questions. No live-state scan or generic write.                                                |
| Artifact inventory, headers, signatures, ELF notes, devicetree and format metadata | Identify a shipped component/build before selecting a deep tool.                                             | Cheap triage can be useful. Header/build-id facts do not establish authenticity, execution, supported installation or recovery.                                                                                      |
| Native functions/types/xrefs, objdump, Ghidra/Hopper/IDA/Rizin/Cutter              | Home/browser/notification implementation where an exact shipped binary answers a blocker.                    | Relevant artifact and host/provider first. Windows Ghidra P0 does not admit TV ELF; separate metadata readers are not full decompilation. No speculative Linux/engine install. Existing C++ source is read directly. |
| Reconstruction obligations, evidence bundles, comparisons and coverage             | Prevent inferred behavior from becoming a completed acceptance claim.                                        | Derived evidence linked from our plan, not a second queue. Real records must satisfy actual schemas/provenance; do not relabel our JSON as authenticated REA Evidence.                                               |
| ADB, active Frida/debuggers, process capture and scenario execution                | Later runtime questions only if static evidence cannot answer them.                                          | Separate exact authorization and access needed. No target agent/server, root access, or safe automatic execution is supplied by tool availability. Outside initial trial.                                            |
| Signal/UART/IR decoding                                                            | A measured hardware/protocol blocker with an acquired recording.                                             | Linux/caller decoder and known capture setup required. No hardware acquisition, transmission or TV control implied.                                                                                                  |
| Other packaged/language formats                                                    | Electron, .NET, Apple/Harmony, Go/Rust/Python, WASM, Flutter/Unity/Godot, BEAM, GPU/model and EVM artifacts. | Route only when an identified artifact requires it. No current reason to install every engine or treat these as new TV milestones.                                                                                   |

## Learning/resource lead supplied before checkpoint

The owner-supplied X post's text was retrieved through public X embed/syndication
responses after the page returned403. It describes learning resources. The
attached infographic was not readable through the available image tool. One
shortened link labelled as a website resolved to a second X post about four
subagents and a reconstruction article; the article also returned403. No claim
of reviewing the infographic/article or reproducing its result is made.

The primary awesome-reverse-engineering index was checked at
63d23e3197245a28028b21c8f342df18a9ac7859: task router, learning and specialist-tool
sections. It is a discovery/reference shelf, not proof of Vizio compatibility.
Use it when a named gap needs a specialist. Do not turn courses, all linked tools
or four-agent orchestration into prerequisites. Keep the existing Sol executor,
scoped Luna worker and independent Astra advice roles; no new configuration.

## Machine observations, not a new readiness run

Earlier2026-10-25 checks reported Node v24.22.1, compatible with the pinned REA
package declaration. No rea/Ghidra-headless/Hopper command was found on PATH;
Java was found. PATH discovery is not a whole-disk inventory. No installed REA,
provider, MCP registration, firmware extractor, fixture or live target was tested.
All feature/host claims above are source-derived until the relevant local trial.

## Sources and history

- [LeanREA skill](https://github.com/aicodeking/leanrea/blob/09ba4aa0217f82cd880f855a60b877f59f39b22b/leanrea/SKILL.md), [benchmark](https://github.com/aicodeking/leanrea/blob/09ba4aa0217f82cd880f855a60b877f59f39b22b/bench/BENCHMARK.md), [raw rows](https://github.com/aicodeking/leanrea/blob/09ba4aa0217f82cd880f855a60b877f59f39b22b/bench/results/final.jsonl).
- [REA6.8 release](https://github.com/morluto/rea/releases/tag/rea-agents-6.8.0), [guide map](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/index.md), [installation](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/installation.md).
- [JavaScript workflow](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/javascript-application-workflows.md), [APK](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/android-analysis.md), [SQLite](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/sqlite-databases.md).
- [PCAP summaries](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/pcap-analysis.md), [detailed packets](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/packet-captures.md), [firmware](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/firmware-analysis.md).
- [Offline environments](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/agent-environments.md), [reconstruction coverage](https://github.com/morluto/rea/blob/rea-agents-6.8.0/docs/reconstruction-coverage.md).
- [Owner-supplied post](https://x.com/sammy_capital/status/2113733817596834151); [resource index](https://github.com/morluto/awesome-reverse-engineering/blob/63d23e3197245a28028b21c8f342df18a9ac7859/README.md). Post images/article are unreviewed as described above.
- [Checkpoint receipt](../../evidence/provenance/tooling-checkpoint-2026-10-25.json) preserves input hashes, raw benchmark calculations and unresolved scope. Prior6.5 findings remain in [firmware history](../history/import-2026-10-23/forge/FIRMWARE-RESEARCH.md); previous6.8 assessment remains in Git590f83f.
