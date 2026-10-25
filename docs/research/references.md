# Reference projects and what they change

Selected source inspections, recorded2026-10-23. No third-party tools were run or
installed and no TV calls were made during those reviews. Sources track moving
branches; pin/review before reuse. These are design leads, not model compatibility.

| Project                                                                 | Useful lesson                                                                        | Limit                                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| [Free My TV](https://github.com/simbasjungles/free-my-tv)               | Distinguish installed app/shortcut from default Home; preserve inputs/core operation | Android/LG/Samsung paths do not establish Vizio installation                                                            |
| [CleanMyTV](https://github.com/wingedpanther/cleanmytv)                 | Verify Home owner and rollback; read preferences; fake-device tests                  | Incompatible-upgrade branch does not gate removal on rollback boolean; don't copy blindly                               |
| [CleanYourTV](https://github.com/Gathin23/cleanyourtv)                  | Preserve original per-device baseline across reruns; inspect post-update drift       | No adoption of package lists, update suppression or silent reapply                                                      |
| [pyvizio](https://github.com/raman325/pyvizio)                          | App/input/key protocol reference                                                     | Maintenance mode; successor is vizaio; no new pairing needed                                                            |
| [Vizio API documentation](https://github.com/exiva/Vizio_SmartCast_API) | Check STATUS.RESULT; current-input hash differs from list hash                       | Older community mappings are candidates, not current installed catalog                                                  |
| [vizio-smart-cast](https://github.com/heathbar/vizio-smart-cast)        | Corroborates namespace4/app17 Conjure launch                                         | Same access route, not Home replacement                                                                                 |
| [vizaio](https://github.com/raman325/vizaio)                            | Chipset/firmware-specific app payloads, protocol errors, bounded concurrency         | Catalog injection updates Python lookup data, not TV membership; generic retries/settings unsafe to adopt without scope |
| [VizioApps](https://github.com/kbrown01/VizioApps)                      | Separate catalog id/name/artwork from launch namespace/APP_ID/MESSAGE                | Own copies deprecated in favor of vendor JSON; no installer                                                             |
| [vizaio-conjure](https://github.com/joebeeson/vizaio-conjure)           | Validated targets, testable transport and OS-separated credentials                   | Same Conjure route; directory server/all-interface bind does not meet our restrictions                                  |

## Consequential leads

1. App phase: resolve one owner-selected destination using a provenance-labelled
   catalog/availability pair and verified target chipset/firmware. Catalog id is
   not launch APP_ID. No silent assumption of namespace equivalence. Vendor JSON
   web retrieval failed on content type; it was not parsed as current data.
2. Attention measurement: vizaio documents GET /state_extended containing power,
   input, app and media fields with capability gating. Not tested on our TVs;
   freshness/HDMI/native-app semantics require bounded owner-correlated reads.
   No raw identity output or background polling authorized.
3. Launcher maintenance: immutable validated targets and injected transport fakes
   could consolidate repeated helpers later. No speed improvement was measured.
4. Handover: preserve first baseline; confirm usable fallback before replacing
   active Home; verify ownership, actual display/input and exact reversal.

Keep credentials out of pages/config commits. Do not copy weakened SSH host-key
checking or root-free safety claims as assurance. No foreign package install,
firmware write or broad server is part of these lessons.

[Full dated source-review record](../history/import-2026-10-23/forge/research/home-reference-projects.md)
contains inspected file links, examples and evidence ceilings.

## Analysis tools and learning references

[The current tool assessment](rea.md) owns the pinned REA/LeanREA capability and
benchmark findings; [the plan](../plan.md) owns adoption priority. LeanREA informs
selective direct inspection; its scripts/skill are not installed or approved.
The primary awesome-reverse-engineering index is a task-driven discovery shelf,
not proof of a TV route. The owner-supplied X post's image/article access limits
are retained in the assessment. Do not duplicate a tool backlog here.
