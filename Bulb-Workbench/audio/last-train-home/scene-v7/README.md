# Last train home - clearer station balance v7

- [Main mix without footsteps](last-train-home-180s-no-footsteps.mp3)
- [Optional footsteps comparison](last-train-home-180s.mp3)
- [Main WAV](last-train-home-180s-no-footsteps.wav)
- [Comparison WAV](last-train-home-180s.wav)
- [Isolated footsteps](footsteps-only-180s.wav)
- [Provenance and measured event levels](provenance.json)

Owner feedback: rain still overshadows the scene and v6 clicks/rattles were
inaudible to them; other sounds should be near or slightly above rain.
This candidate reduces the rain family another 1.5 dB versus v5/v6. It keeps
the original train and non-rain station bed at their existing gains.

Clicks and rattles are calibrated separately to a median 0 dB active-body RMS
relative to the local revised background. Optional footsteps target -3 dB
relative to that background. Each family has a maximum 30 dB boost versus v6;
the receipt records applied gains, whether capped, and achieved per-event
ratios against both rain-only and the full underlying bed. This is a measured
starting point, not proof of equal perceived loudness or comfort.

Achieved median active-body ratios: clicks/rattles approximately 3.3/3.1 dB
above isolated rain and 0 dB versus the full bed. Optional steps are about
0.1 dB above rain and -3 dB versus the full bed. Boosts versus v6 are 18.71,
17.35 and 17.75 dB respectively; no family hit its cap. These narrow-window
ratios do not mean the whole three-minute scene became that much louder.

No master normalization or limiter raises the rain again. The rain component
is isolated using the identical seeded v5 synthesis with and without its linear
rain amplitude. The original render must reproduce the saved premaster PCM;
the rain/zero-rain decomposition must reconstruct it within numerical tolerance.
Only the scaled rain delta is added to the retained v5 master, allowing 16-bit
rounding. Source generator hashes are checked before import.

Timings remain: rail clicks at 0:24, 0:46.5, 0:54.2, 1:32, 2:09 and 2:33;
rattles at 0:35-0:41, 1:37-1:44 and 2:23-2:30. Train 1:00-1:29, optional
steps around 1:51-1:57, ending fade 2:48-3:00. No speech, horn or loop.

Both delivery mixes are finite 180-second files. The renderer checks PCM
clipping/edges, exact saved footstep isolation and decoded WAV/MP3 loudness
and true peaks. These checks do not replace owner listening. The agent has
not auditioned the candidate or operated a playback device.

Reproduce with existing NumPy and FFmpeg:
`render_balance.py --ffmpeg <existing executable>`. Requires the retained v5/v6
sources and v5 audio; refuses output overwrite. All earlier versions remain.
