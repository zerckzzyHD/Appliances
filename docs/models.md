# Model workflow

This page records task roles, not backend configuration. It neither changes nor
verifies the model settings of any Codex or other session. See the imported
[routing intake](history/import-2026-10-23/handoff/CODEX-MODEL-ROUTING-INTAKE.md)
for the original owner request and its historical local readback; do not copy
machine-local configuration into this repository.

| Role                                | Responsibility                                                                    | Boundary                                                                                                                  |
| ----------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Sol — executor and reviewer         | Own integration decisions, test review and the authoritative plan/status updates. | Wait for advice at unresolved planning boundaries; cannot broaden owner approval or authorize live TV work.               |
| Luna — scoped implementation worker | Implement only explicitly assigned files and report checks on those files.        | No recursive delegation, live-device work, config changes, commits or publication unless separately assigned and allowed. |
| Astra — planning advisor            | Provide read-only challenge at planning and evidence boundaries.                  | Advice is not evidence, implementation, approval or authority to expand scope.                                            |

Report a role as requested, configured or actually returned only when that state
was observed. Do not infer the model of an existing session from its task role,
claim a configuration change from this document, or make token-cost/model-quality
claims without direct evidence. Keep advice separate from owner observations,
source evidence, code changes and test outcomes.
