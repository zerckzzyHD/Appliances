# Appliances consolidation checkpoint

Date: 2026-10-26. Owner requested one private Appliances repository containing
TV-Workbench and Bulb-Workbench, superseding the separate bulb repository idea.

## Layout and history

The physical home is `C:\Dev\!Appliances`. Existing TV files moved beneath
`TV-Workbench/`; the existing Git directory moved one level upward. Commit
history is retained without rewriting. Pre-migration TV HEAD was
`66035a4946e7defb6bc86f2499d8feda34092c1b`; last observed remote main was
`973151fc6dfa4d4bce09449f353713a8e05e0d00`. Prior commits retain their old root
paths; current commits use the TV-Workbench prefix.

The initial consolidation retained `C:\Dev\!TV` as a temporary junction.
The owner subsequently authorized the Console module-path rewrite, restart
and retirement of that alias. That cutover ran on 2026-10-26: the ignored
configuration now imports directly from the Appliances workbench, and the
junction was removed after health checks. `C:\Dev\!TV` is absent. See the
[cutover receipt](TV-Workbench/evidence/provenance/appliances-runtime-cutover-2026-10-26.json).

The new bulb workbench retains all three preview versions with original
generators, audio and provenance. Original chat delivery copies remain frozen
snapshots; subsequent editing belongs here. The handoff dock was left unchanged.
Its plan was copied byte for byte into bulb docs/history with SHA-256
`8b679626fedcb5584b47a6b94f64ad838221ea9672c0af726fabb6d5334900e2`.
Current bulb plan/status supersede its dated no-audio statements.

## Evidence and next steps

TV plan/status/evidence remain authoritative inside TV-Workbench. The native
Home controller chain has source evidence but current retail applicability is
unverified; no root, firmware acceptance, recovery or reboot persistence was
established. The prepared living-room remote-input test remains paused.

Bulb v3 balance is owner-accepted. The next production proposal is a finite
three-minute scene; combined IR/audio integration is still untested. No TV,
Bluetooth, IR or installation operation accompanied consolidation or the later
host cutover. Console restarted with unchanged listener options and research
flags. Private captures, credentials and raw supplied archives remain outside Git.

The root `migration-manifest.json` records retained source hashes. Check and
push outcomes must be established by executed commands, not this document.

## Executed local checks and remote rename

The post-move run passed 190 Node tests, 18 Python tests, syntax checks,
repository provenance/import/link checks and the TV formatting gate. The bulb
checker passed nine audio hashes, three generator hashes, three WAV masters
and the imported plan hash. Root/current bulb links and bounded excluded-path
and private-marker checks passed. These checks do not validate a device.

Seven historical TV files had CRLF worktree bytes although the previous Git
blobs used LF. Their retained file bytes pass the existing provenance gate;
the migration manifest records both hashes and labels CRLF equivalence rather
than claiming those Git blobs are identical. No historical text was rewritten.

GitHub rename returned repository ID `1433479050`, canonical name
`zerckzzyHD/Appliances`, private visibility and default branch `main`. This is
the same repository identity as tv-workbench; no separate bulb repository was
created. The canonical remote is [Appliances](https://github.com/zerckzzyHD/Appliances).
Publication of the checkpoint commit is recorded by Git and remote branch
comparison after the local commit, not inferred from the rename response.
