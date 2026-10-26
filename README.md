# Appliances

Private owner-controlled appliance research, source and original scene assets.

- [TV Workbench](TV-Workbench/README.md): customized, ad-free Vizio Home research.
  Its [plan](TV-Workbench/docs/plan.md) and [status](TV-Workbench/docs/status.md)
  remain authoritative for TV work. Device operations remain paused.
- [Bulb Workbench](Bulb-Workbench/README.md): GE speaker-bulb lighting evidence
  and Last train home audio. Its [plan](Bulb-Workbench/docs/plan.md) and
  [status](Bulb-Workbench/docs/status.md) own subsequent bulb work.
- [Migration checkpoint](CHECKPOINT.md): layout, retained history and limits.

Run existing TV gates from `TV-Workbench`: `npm run check`, `npm test`,
`npm run test:python`, `npm run check:repo`, `npm run format:check`.
Run `python -B scripts/check-bulb-assets.py` from this root to check retained
asset hashes and WAV structure. No gate operates a device.

Keep credentials, raw private captures, local settings and dependencies outside
Git. This repository has no deployment or automatic playback path.
