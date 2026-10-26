# Last train home — 60-second preview v1

This is the first original, procedurally synthesized audio preview for the bulb
scene. It is not a field recording. It contains sheltered rain, canopy/glass
patter, quiet station ventilation, and one distant train approach, braking and
air release. There is no speech, music, horn, automatic loop or lighting command.

## Files

- [Phone playback copy](last-train-home-60s.mp3): stereo MP3, 128 kbit/s.
- [PCM master](last-train-home-60s.wav): exactly 60 seconds, 48 kHz, stereo, 16 bit.
- [Provenance and measurements](provenance.json): source, seed, cue times, hashes
  and actual offline validation results.
- [Reproduction source](render_preview.py): original NumPy synthesis and two-pass
  FFmpeg normalization using tools already present. It never opens a player or
  contacts a device. The premaster is retained beside the delivery files.

## Listening review

The agent has not auditioned this file or tested phone/Bluetooth/bulb playback.
Offline checks establish the file's format, duration, decode, levels and sample
boundaries; they do not establish realism, comfort or room volume.

For a separately agreed owner-controlled playback, start at a low comfortable
volume and know the player's pause/mute control. Static Pink is the proposed
lighting baseline, not something this file sends or changes. No pairing reset,
speaker switching, macro, IR send, settings change or automatic restoration is
part of generating this preview.

Review the rain texture, whether the train feels distant, and overall comfort.
The first four seconds fade in; the train occupies roughly 16–45 seconds; the
last seven seconds fade to silence. Announcements and the three-minute timed
lighting scene remain future work after listening feedback.

## Saved planning context

The existing GE speaker-bulb plan remains in the handoff dock at
`C:\Dev\!RobCo\_RobCo-Agent-Handoff\codex\GE-SPEAKER-BULB-IR-PLAN-2026-10-22.md`.
It was read but not changed during this render. This folder contains the preview
assets and production receipt, not a second editable plan or queue. No Git or
public hosting operation was performed.
