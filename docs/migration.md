# Repository migration: transition record

Checkpoint2026-10-23. [Plan](plan.md) owns product priorities; this document owns
the finite migration receipt and pending cutover. It is not another TV roadmap.

## Transferred and checked

- New local home: TV Workbench. No remote configured; PRIVATE is the required
  future remote setting, not a verified remote property.
- [Import receipt](../evidence/provenance/import.json):193 records:186 tracked
  Forge TV files,4 tracked Codex handoff records,1 external tracker,2 session-log
  snapshots. [Path map](../evidence/provenance/path-map.json) accounts for every
  Forge source member and explains historical path resolution.
- Initial import534557e used inherited Git line-ending normalization. The next
  forward commit2f6ca02 preserves the exact193 original file byte sequences.
  No existing commit was amended or rewritten. Historical originals and evidence
  use Git attributes that prevent future normalization.
- Current source/lockfile/scripts/tests live here. No dependency on the old
  Forge source or RobCo node_modules is retained in maintained code. Console
  remains the runtime owner of the optional listener integration.
- The two retired source-capture analyzers are preserved as non-runnable text
  under dated history. Future live sender logs go to ignored .local/runs; copied
  snapshots are immutable, with no final-cleanup inference.
- After byte verification, four owned Codex TV handoff files were removed in
  handoff local commitdaee234. Their source history remains in that repository,
  and their imported originals are retained here. Unrelated dirty work unchanged.

## Pending: approved cutover and final cleanup

No owner-local config, Console restart or TV operation has been performed.
Source path removal is intentionally incomplete until these dependencies are
resolved. Current documents here are authoritative; old Forge docs are transition
sources, not another editable plan.

Exact proposed host delta, in the existing ignored RobCo extension options:

```text
module:
  from C:/Dev/!Mist/_Mist-Forge/console-tv/vite-plugin.mjs
  to   C:/Dev/!TV/TV-Workbench/src/hosting/vite-plugin.mjs
```

Preserve every other option, including all research flags. Snapshot non-secret
config bytes privately, validate the original module, reject races and change
only this field. Canonical lifecycle is the existing host's dev-server manager:
stop, then start --no-proxy. Verify local/LAN health and expected disabled research
flags. No TV launch, pairing, settings, task or Tailscale change. Rollback restores
exact old options and canonically restarts while old source is still available.
This config/restart requires the separate approval specified in the repo proposal.

The old inline sender (tool session73923) was still running when its buffered
output was inspected. It reports session_lost_before_stop, stopSent false. This
is local process/log evidence, not a fresh TV query or current screen observation.
Do not send STOP or terminate it under migration permission alone: obtain explicit
release of the earlier no-stop instruction, then capture final local closure/log
evidence and preserve any final snapshot separately. Avoid deleting a live log's
parent folder. No sender interaction beyond buffered output read occurred here.

Once new hosting and sender closure are verified, remove exactly the original
Forge console-tv subtree (tracked source plus checked ignored generated/dependency
leftovers); update its README index to location-only. Resolve absolute removal
paths first. Preserve original Git history. Archive the external tracker bytes
already in the receipt; that tracker was subsequently hash-checked and replaced
with a location-only link. No current progress is duplicated there.

Untracked Claude TV brief/review files in the handoff repository were not imported
or removed. They require individual ownership/content resolution; do not sweep
their containing folder. All other dirty handoff files remain outside scope.

## Validation ceiling

Migrated Node190 (original189 plus1 regression) and Python18 tests passed locally;
syntax/formatting and29 PowerShell files
parsed. Repository checker verifies193 original blobs, immutable hashes, portable
current links and relative module imports; excluded-file/private-key-marker checks
are bounded checks, not a comprehensive secret audit. No live cutover or device
compatibility claim follows from those results. Final recorded gate outcomes and
pending approvals belong in [status](status.md) and the migration evidence receipt.
