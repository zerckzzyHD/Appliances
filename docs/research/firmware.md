# Firmware and deeper access: evidence ceiling

The supplied7.927GB archive is an OSS/source bundle, not a proven flashable retail
image. Static inspection traced signed SC-ASSETS delivery and app routing; it did
not establish a compatible custom package, signing authority or recovery route.
No archive code executed and no TV firmware was written. Archive bytes stay out
of Git; historical records identify their external hashes.

The production native-notification dispatcher/transport and writable Home
membership/persistence remain unresolved. Bounded absence in source is not proof
that production implementations do not exist. Fixed internal demo/update alerts
are not appropriate substitutes for a custom notification test.

The externally supplied Vizio renderer-execution claim lacks a reproduced CVE,
model/build match and completed sandbox boundary. Samsung screenshots do not
establish a Vizio route. No update/security settings were changed from those posts.
Keep renderer execution, privilege, persistence, default Home and recovery distinct.

Research next only against a measured integration blocker. Before disruptive
device work: exact target/build, bounded experiment, reversal/recovery, explicit
owner approval. Do not flash the source-family archive onto the bedroom TV.

## Vizio prior-art leads: source-only review2026-10-25

The absence of a ready-made Vizio customization project in our earlier reference
set was not proof that nobody had investigated it. New source leads:

| Source                                                                                                                                         | Reported result and ceiling                                                                                                                                                                                                                                                     | Applicability                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [ViziOwn2021](https://bh2017.exploitee.rs/2021/viziown-exploiting-vizio-smartcast/)                                                            | Historical persistent root research on older SmartCast builds.                                                                                                                                                                                                                  | Not current-model compatibility proof; earlier local header checks did not reproduce it.                                               |
| [smartcast-backdoor](https://github.com/vindeckyy/smartcast-backdoor/tree/aea6dec77bf3c6613c46b2ef45de5444e5f3dccc)                            | Author reports webview/internal-API access and store writes on MT5586 onn65S4V4. Requires paired launch. Store persistence was checked across webview lifecycle, not reboot. No root console, OTA decryption, flash dump or UART result. Modal launch is not Home registration. | Different target from both local TV baselines. The report's untested physical-access assertions are not recovery evidence.             |
| [VizioRemote firmware setup](https://github.com/noktirnal42/VizioRemote/blob/58f3b31cc45694ac8734e0f3aaf0b75173349f3e/FIRMWARE_RE_COMPLETE.md) | MT5586 WHD32M-1030 research setup; explicitly blocked on encrypted image, missing root/ADB and hardware access.                                                                                                                                                                 | Title says complete setup, not completed decryption/custom flash. Hypothetical Android partition examples do not identify our layouts. |

These are author reports and inspected documentation, not independently
reproduced device results. No toolkit, payload or extracted third-party SDK was
executed or saved in this review. No TV call, setting, installer, image write or
new REA setup occurred. Do not promote config access into root, boot persistence,
a Home writer or firmware acceptance.

Next source-only batch: compare exact target/build, SDK/API shapes and claimed
Home/store/notification ownership against our retained evidence. Read relevant
implementation and evidence controls before selecting a minimal compatibility
experiment. Do not run the supplied all-in-one tools. Identify what is common,
unknown or contradicted, including automatic writes, stop/restore and capture
behavior. If a reversible Home-layer route is supported, it may avoid a whole
firmware rewrite. Firmware analysis, privilege, persistence, modified-image
acceptance and model-specific recovery remain separate milestones. No concrete
flash is approved or proposed without those dependencies.

Evidence homes:

- [Firmware source trace](../history/import-2026-10-23/forge/FIRMWARE-RESEARCH.md).
- [Software entry history](../history/import-2026-10-23/forge/SOFTWARE-ENTRY-REVIEW.md).
- [Route audit](../history/import-2026-10-23/handoff/ROUTE-AUDIT-2026-10-21.md).
- [Sanitized analysis artifacts](../../evidence/analysis/).

Original paths in historical citations are preserved; use the [path map](../../evidence/provenance/path-map.json)
and [import receipt](../../evidence/provenance/import.json) to resolve their origin.

The [REA6.8.0 review](rea.md) separates JavaScript/offline-evidence opportunities
from firmware constraints. The previous firmware-focused tool assessment does
not rule out a static JS trial; no real artifact, recovery or TV privilege was
established by the release review.
