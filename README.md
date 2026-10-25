# TV Workbench

TV Workbench is a local project for researching and building an owner-chosen,
customizable Vizio Home without promotional content in the Home surface we
control. Modifying stock Home and replacing it are both candidates. Mist Console
is an optional existing read-only tile, not the project's identity.

The project is still in research and preparation. The [implementation strategy](docs/plan.md)
connects stock-Home and replacement candidates to input, app actions, Home
integration, settings and daily-use acceptance; neither architecture is selected. An input-only Conjure page and
its host integration are prepared behind `researchHomeInput: false`. No live research
option has been enabled. The approved Console module-path cutover and restart
passed local/LAN health checks. The old sender exited locally without a TV STOP;
no TV operation ran during cutover. Owner-present input testing remains held.

## Start here

- [Product scope and acceptance](docs/spec.md)
- [Connected strategy, dependencies and decision gates](docs/plan.md)
- [Current evidence and limits](docs/status.md)
- [Routes that have actually worked](docs/routes.md)
- [Host lifecycle and operation gates](docs/operations.md)
- [Model workflow](docs/models.md)
- [Migration receipt and cleanup limits](docs/migration.md)
- [Input experiment protocol](docs/experiments/home-input.md)
- [Selected API and project references](docs/research/references.md)

Current documents are the only active project authority. The original Forge
documents and imported handoff records under `docs/history/` are dated source
material, not competing plans or current status. [The import receipt](evidence/provenance/import.json)
maps source files to this repository. The local import began at `534557e`;
`2f6ca02` preserves exact original bytes after initial Git line-ending normalization.
No earlier commit was rewritten. The [path map](evidence/provenance/path-map.json)
locates reorganized files and historical citations;
the private GitHub home is [tv-workbench](https://github.com/zerckzzyHD/tv-workbench).
The owner explicitly authorized its creation/upload on2026-10-25; routine future
publication remains owner-controlled.

## Repository map

- `src/console/` — existing read-only Console page and aggregate projection.
- `src/hosting/` — Console-owned Vite lifecycle integration.
- `src/research/` — bounded diagnostics and static parsers.
- `scripts/` — build, launch and offline analysis entry points.
- `test/` — synthetic and fixture tests, grouped by component.
- `evidence/` — sanitized results, analysis and import provenance.
- `docs/` — current authorities, experiments, research and original history.

See [operations](docs/operations.md) for local checks. Local tests establish
software behavior only; they do not establish TV compatibility or authorize a
device action.
