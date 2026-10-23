# Demonstrated routes and evidence limits

This is an evidence index, not a roadmap or a live device-health report. It
separates owner-observed display, protocol response, static source and untested
behavior. The imported originals in `history/import-2026-10-23/forge/` retain
dated observations; the import receipt maps their source paths.

| Route                                        | Demonstrated evidence                                                                                                                                                                                                                                                                     | What it does not establish                                                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Conjure Console page                         | Owner saw the existing Console summary render and refresh on the primary TV; a later saved-pairing relaunch after standby was observed.                                                                                                                                                   | A persistent Home tile, default Home, app-launch privileges or guaranteed restoration of the previous app.                                                                      |
| Earlier four-tile page                       | Owner confirmed arrows and OK open/return in the earlier menu.                                                                                                                                                                                                                            | Input reception in the new Phase A page, all remote keys, or Home-button interception.                                                                                          |
| Default Cast media receiver                  | A fixed title was accepted and owner saw it take over the full screen; the TV returned to Home rather than the previous YouTube view. [Result](../evidence/results/cast-metadata-main-20261021.json).                                                                                     | A quiet toast, background overlay, media decoding, previous-app restoration or safe TV-idle detection.                                                                          |
| DashCast inline HTML                         | A fixed inert `data:text/html` document visibly rendered through its iframe branch. [Sanitized observation](../evidence/results/dashcast-inline-main-242785f7e23d4106b19d54598697ce97-observation.json) · [historical protocol record](history/import-2026-10-23/forge/HANDOFF-NOTES.md). | Arbitrary LAN delivery, scripts, SDK access, a Console embed exception, app launch or Home integration. DashCast still uses its own receiver intermediary.                      |
| DashCast LAN iframe                          | URL echo and receiver loading UI were observed; the bounded marker recorded zero admitted marker responses. [Result](../evidence/results/dashcast-iframe-main-7dc1f5521164637549f7604fa7cf9a02.json).                                                                                     | Target document retrieval/rendering or proof of zero network traffic. The cause remains unresolved.                                                                             |
| TV-local SDK test UI and bounded diagnostics | The TV-local test interface rendered; selected SDK version and fixed research calls returned bounded results. Static registry entries are definitions, not successful method calls. [Sanitized registry](../evidence/analysis/test-ui-static-registry-20261017.json).                     | An installer, Home writer, arbitrary execution, or support for every listed method.                                                                                             |
| Bounded Home document/dependency read        | Historical run `8668beae673964819195dce450d79d5e` parsed the root and read one direct script; parser analysis was incomplete and the second script was unread. [Saved report](../evidence/results/isolated-main-8668beae673964819195dce450d79d5e.json).                                   | Complete Home source coverage, Home identity, catalog membership/order writer, launch routing, persistence or signed-delivery acceptance. `methods=[]` is not a negative proof. |

The current Phase A input-only page has not been launched on a TV; its hosting
flag remains off. The prepared local code and synthetic tests are not a
demonstrated TV route.

## Explicitly unestablished

- Genuine stock-Home customization or ownership by a replacement Home.
- Persistent tile/app membership, favorites order and save/reload behavior.
- Verified app/input destinations and launch/return contracts for the new Home.
- A Home surface that is actually free of promotions across reload, standby and
  delayed vendor refresh.
- A native arbitrary-text notice that does not interrupt viewing.
- Reliable playback/idle detection, root access, modified-package acceptance or
  model-compatible firmware recovery.

For original dated context see [the imported route index](history/import-2026-10-23/forge/ROUTES.md),
[the original entry record](history/import-2026-10-23/forge/TV-ENTRY.md) and
[the run notes](history/import-2026-10-23/forge/HANDOFF-NOTES.md). They are
historical evidence sources, not additional current authorities.
