# Last train home - three-minute scene v5

[Listen/download MP3](last-train-home-180s.mp3) ·
[WAV master](last-train-home-180s.wav) · [Provenance](provenance.json)

The owner described v4 as much better mixing, requested rain a little quieter
again and noted the scene still needs more sonic detail. This revision trims
rain, canopy and drops by 0.75 dB relative to v4. It retains the same seed,
duration, train event, station bed and fixed master gain. No loudness
normalization raises the quieter rain afterward. No new sounds are added yet.

The train approaches at 1:00, is strongest around 1:15-1:18 and settles by
1:29. The ending fades over 2:48-3:00. No announcement, separate departure,
horn, automatic loop, device playback or lighting command is included.

Run `render_scene.py --ffmpeg <existing executable>` with existing NumPy;
the renderer also uses the retained v2 premaster/master gain reference. It
refuses to overwrite outputs. Render-time measurements and hashes are in the
provenance file. The agent has not auditioned the scene; owner listening is
pending. Earlier versions remain unchanged.
