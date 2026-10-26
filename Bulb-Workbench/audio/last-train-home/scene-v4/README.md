# Last train home - three-minute scene v4

[Listen/download MP3](last-train-home-180s.mp3) ·
[WAV master](last-train-home-180s.wav) · [Provenance](provenance.json)

Created 2026-10-26 after the owner approved a three-minute version and requested
another small rain reduction. Rain, canopy wash and raindrop source gains are
1.5 dB below v3. Train, brakes, air release, ventilation and master gain are
unchanged. The quieter mix is not normalized upward. This longer synthesis
uses a new noise realization; it does not contain a sample-identical copy of
the preview's train.

One distant train approaches at 1:00, is strongest around 1:15-1:18 and settles
by 1:29. Braking is at 1:13-1:26; air release at 1:23-1:28.5. The scene fades
in over four seconds and out over 2:48-3:00. There is no separate departure,
announcement, horn, automatic loop, playback or lighting command.

The generator uses the retained v2 premaster/master pair to recover the same
fixed master gain used by v3. Run `render_scene.py --ffmpeg <existing executable>`
with an existing NumPy installation; outputs refuse overwrite. No installation
or sample download is part of the renderer.

The exact 180-second stereo PCM master and MP3 both decoded through FFmpeg.
The master measured -30.89 LUFS; encoded MP3 true peak measured -15.00 dBTP.
PCM edges are silent and no clipped samples were detected. These are offline
checks. The agent has not auditioned it; owner listening and sleep comfort
remain unverified. V1-v3 remain unchanged.
