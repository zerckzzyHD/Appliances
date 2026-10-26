# Last train home - station details v6

- [Listen with footsteps](last-train-home-180s.mp3)
- [Listen without footsteps](last-train-home-180s-no-footsteps.mp3)
- [With-footsteps WAV](last-train-home-180s.wav)
- [Without-footsteps WAV](last-train-home-180s-no-footsteps.wav)
- [Isolated footstep layer](footsteps-only-180s.wav)
- [Render provenance](provenance.json)

The owner approved testing footsteps but noted that hearing them in an apartment
could feel unsettling. Both versions retain the approved v5 PCM bed at unity
gain. There is no normalization or further rain/train adjustment. Only the
added step layer differs between the two PCM mixes; this equality is checked
sample by sample during rendering. MP3 compression need not preserve exact
sample differences.

Six quiet rail contacts occur at 0:24, 0:46.5, 0:54.2, 1:32, 2:09 and 2:33.
Faint mechanical rattle windows are 0:35-0:41, 1:37-1:44 and 2:23-2:30.
The original train approaches at 1:00 and settles by 1:29. Seven soft,
receding footstep contacts occur around **1:51-1:57** in the first version.
The alternate omits them entirely. Neither contains speech, horns or a loop.

Textures are original procedural synthesis, not recorded station sounds.
Footsteps use a softened attack, restricted low bass and quiet fixed placement;
whether they sound distant, realistic or comfortable requires owner listening.
No agent audition or device playback is claimed.

Reproduction uses existing NumPy, an existing FFmpeg executable and the retained
v5 master: `render_details.py --ffmpeg <executable>`. Outputs refuse overwrite.
Render provenance records hashes, exact durations, clipping/edge checks and
FFmpeg decoding/loudness measurements. The isolated step WAV is a removable
production layer, not an instruction to play it separately.
