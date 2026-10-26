# Last train home - coherent train texture v8

[Listen/download](last-train-home-180s.mp3) · [WAV master](last-train-home-180s.wav) ·
[Provenance](provenance.json)

The owner found v7 clicks and footsteps too similar, sudden and random, removed
footsteps from the intended scene, and requested all mechanical layers work
together. This version removes both scattered click/rattle families and adds
a continuous rolling rail texture and braking-linked rattle during the arrival.
It contains no footsteps and has no footsteps comparison variant.

The train approaches at 1:00. Rail texture builds from 1:02 over six seconds,
follows the original train's slowing wheel phase and stereo trajectory, and
eases out by 1:29. Rattle builds with braking from 1:13 and ends by 1:26.
Both share a component of filtered noise and the same wheel modulation,
replacing unrelated timed impacts. No scattered clicks remain outside the
train event. Rain and the original train retain their v7 mix.

The v7 no-footstep master must reconstruct exactly from the retained original
components before its old details are omitted. The saved new master minus
the two new isolated stems must equal the retained v7 underlying bed exactly.
Filtering precedes envelopes; added texture is silent outside 1:02-1:29.

Rail and rattle active-body targets are 0 dB and -3 dB versus the quiet bed
at 0:50-0:53. The receipt also reports their achieved levels against the louder
train-window bed. Those measurements and shared modulation describe intended
coherence, not verified perceived realism. Owner listening remains pending;
the agent has not auditioned the scene.

Separate production stems are [rail texture](rail-texture-only-180s.wav) and
[mechanical rattle](mechanical-rattle-only-180s.wav). The full scene remains
180 seconds, with no speech, horn, automatic loop or playback/device action.
Existing NumPy, FFmpeg and retained v5/v6/v7 sources/assets reproduce it using
`render_coherent.py --ffmpeg <existing executable>`. Outputs refuse overwrite.
Earlier versions remain historical snapshots.
