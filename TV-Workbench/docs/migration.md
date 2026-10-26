# Repository migration: transition record

Checkpoint2026-10-23. [Plan](plan.md) owns product priorities; this document owns
the finite migration receipt and cleanup limits. It is not another TV roadmap.

## Transferred and checked

- New local home: TV Workbench. Initially local-only. On2026-10-25 the owner
  explicitly authorized creation/upload of the
  [GitHub repository](https://github.com/zerckzzyHD/tv-workbench); GitHub returned
  isPrivate:true before upload. Initial main upload included03afda3 and its history.
- [Import receipt](../evidence/provenance/import.json):193 records:186 tracked
  Forge TV files,4 tracked Codex handoff records,1 external tracker,2 session-log
  snapshots. [Path map](../evidence/provenance/path-map.json) accounts for every
  Forge source member and explains historical path resolution.
- Initial import534557e used inherited Git line-ending normalization. The next
  forward commit2f6ca02 preserves the exact193 original file byte sequences.
  No existing commit was amended or rewritten. Historical originals and evidence
  use Git attributes that prevent future normalization.
  Archive/evidence whitespace checks recognize CRLF as a line ending; this
  preserves exact bytes rather than trimming historical records. The original
  organization diff passes that check under the declared attributes.
- Current source/lockfile/scripts/tests live here. No dependency on the old
  Forge source or RobCo node_modules is retained in maintained code. Console
  remains the runtime owner of the optional listener integration.
- The two retired source-capture analyzers are preserved as non-runnable text
  under dated history. Future live sender logs go to ignored .local/runs; copied
  snapshots are immutable, with no final-cleanup inference.
- After byte verification, four owned Codex TV handoff files were removed in
  handoff local commitdaee234. Their source history remains in that repository,
  and their imported originals are retained here. Unrelated dirty work unchanged.
- Forge README now links to this standalone home (local commit61f72d5); no
  current progress is duplicated in that index.

## Approved runtime cutover

The owner separately approved the module-only config change, canonical Console
restart, and ending the old local sender without a TV STOP. These actions ran on
2026-10-23. The ignored host config now uses:

```text
C:/Dev/!TV/TV-Workbench/src/hosting/vite-plugin.mjs
```

The original non-secret bytes are retained privately in ignored .local/migration.
The edit rejected concurrent changes and verified JSON equality except module.
All other options were preserved. Canonical stop and start --no-proxy succeeded;
no Tailscale configuration change was requested. Vite, LAN summary and main
research health returned HTTP200. Research health reported document24,
dependencies25, dashcastMarker and homeInput all false. Research loopback refused
connection because the listener is bound to LAN. These checks establish hosting,
not TV rendering or device compatibility.

Old tool session73923 exited through Ctrl+C with KeyboardInterrupt, exit1. No
stop command or TV STOP was sent. Its earlier session_lost_before_stop event
remains the final log event; the local exit does not establish current TV state
or restoration. Both original sender logs have separately named immutable closure
snapshots with hashes in [the receipt](../evidence/provenance/migration.json).
Original imported snapshots were not changed.

## Source retirement and remaining limits

All186 tracked Forge TV members matched their original receipt hashes immediately
before removal. Local Forge commitd3d649d removes those members. Original Git
history remains available; the README location-only link remains. The four owned
Codex handoff files were already removed in local commitdaee234; their byte-exact
history is retained here. The external tracker is location-only.

The command tool initially rejected recursive deletion with "blocked by policy."
The owner then deleted the remaining folder directly in PowerShell and reported
Test-Path returned false. A subsequent local filesystem check independently
returned false for the exact old Forge console-tv path on2026-10-23. The old
folder is absent; this cleanup is no longer pending. Original source and the
separate final log snapshots remain preserved in this repository and Git history.

The two untracked Claude TV brief/review files were neither imported nor removed.
Their ownership/content needs individual resolution. Unrelated handoff work is
untouched. This was local-only at migration; the later owner-authorized private
publication is recorded above. No historical import receipt was rewritten.

## Validation ceiling

Post-reorganization Node190, Python18, syntax, formatting,29 PowerShell parses
and193-record provenance checks passed before this runtime-only cutover. Current
document/link/provenance, syntax, formatting and whitespace checks passed;
post-removal research health remained HTTP200 with all four flags false. No live Phase A
input test, TV query, launch, credential read or TV setting change occurred.
Further device tests remain held for owner presence and exact authorization.
