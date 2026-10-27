# Appliances checkpoint

Current checkpoint: **2026-10-27**. Physical home: `C:\Dev\!Appliances`.
This page is a resumption pointer; each workbench's plan/status remain its
authoritative project records. The dated consolidation receipt follows below.

## Current bulb delivery

**Last train home v13** is a finite five-minute station story:

- [With two fictional PA announcements](Bulb-Workbench/audio/last-train-home/scene-v13/last-train-home-300s.mp3).
- [Announcement-free alternative](Bulb-Workbench/audio/last-train-home/scene-v13/last-train-home-300s-no-pa.mp3).
- [Complete timeline and reproduction notes](Bulb-Workbench/audio/last-train-home/scene-v13/README.md).
- [Current bulb status](Bulb-Workbench/docs/status.md) and [plan](Bulb-Workbench/docs/plan.md).

It carries forward v12's 2 dB resonance reduction and adds departure at
3:05-3:48, later airflow/weather, roof runoff and a quieter shelter response.
Optional PA occurs at 0:44-0:48.384 and 2:50-2:54.599. All earlier versions,
sources, stems and provenance remain retained. Footsteps, scattered clicks,
horns, automatic looping and device playback are excluded from the current scene.

Owner acceptance of v12/v13 is not recorded. The next step is owner listening
to v13 and feedback on overall balance, departure, weather and optional PA.
Speech clarity, perceived realism, comfort and overnight suitability remain
unverified. No new scene production, device action or installation accompanies
this checkpoint. The full five-family mixer and lighting/audio integration
remain unfinished; follow the existing bulb plan rather than adding a queue.

## Checkpoint checks and Git

At checkpoint start, `main` was clean at source commit
`5618a84dfddd5d86a44eed6c45241fc4e5f5a1f7` (`5618a84`). The checkpoint documentation is a subsequent
local commit. GitHub currently reports `zerckzzyHD/Appliances` PRIVATE.
`git ls-remote` returned remote main
`ebffa9f063dfebcc953ddd70da43e72034e80118`; 11 local commits were ahead before
this checkpoint commit. No push is part of the current checkpoint request.

The saved asset checker was rerun: 51 audio hashes, 13 Python generator hashes,
26 delivery/stem WAV files, the speech script/receipt and the imported plan
passed. These are file integrity/structure checks. Original render-time decode,
level, prefix, PA-difference and transition results retain their recorded dates
and scope; they do not establish listening acceptance.

## TV and hosting boundary

TV research remains paused under its existing
[plan](TV-Workbench/docs/plan.md) and [status](TV-Workbench/docs/status.md).
The G1 physical-input test has not run. No TV, Bluetooth or IR action is
authorized by this checkpoint. Console's 2026-10-26 path cutover and health
checks remain dated evidence, not freshly measured runtime health.
The old `C:\Dev\!TV` path was checked absent again on 2026-10-27.
Private settings, credentials, raw captures and the handoff dock remain outside
this checkpoint's edits and Git staging.

## Retained consolidation receipt: 2026-10-26

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
