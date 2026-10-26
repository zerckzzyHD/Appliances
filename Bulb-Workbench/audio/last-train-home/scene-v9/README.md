# Last train home - mechanical presence v9

- [Full three-minute scene](last-train-home-180s.mp3)
- [Only the added mechanics, 30 seconds](mechanics-only-30s.mp3)
- [Full WAV](last-train-home-180s.wav)
- [Mechanics-only WAV](mechanics-only-30s.wav)
- [Provenance](provenance.json)

The owner could not confidently distinguish v8 rail/rattle detail from the
train, while allowing that it might simply blend well. That is not confirmation
of audibility or realism. V9 raises the same coherent textures toward -3 dB
active-body RMS versus the underlying train-window bed. No envelope, phase,
pan, timing or original rain/train level changes. No footsteps are included.

The solo clip is exactly scene 1:00-1:30 with only the two added layers, at
the same PCM level used in the full mix. It is not normalized or boosted for
demonstration. Rail texture starts two seconds into this clip, and braking
rattle starts at 13 seconds. The full mix retains rail at 1:02-1:29 and rattle
at 1:13-1:26. Both remain tied to the original train's movement.

The bed is recovered exactly from the saved v8 master and its two isolated
stems. The new master adds only the rescaled stems. Saved sample equality,
duration, silent edges, clipping and decoded WAV/MP3 peaks are checked. RMS
targets do not prove that a listener can identify or prefers the textures.
No agent audition, owner acceptance or playback/device operation is claimed.

Use existing NumPy, FFmpeg and retained v8 assets to reproduce:
`render_presence.py --ffmpeg <existing executable>`. Output overwrite is refused.
Earlier versions remain unchanged.
