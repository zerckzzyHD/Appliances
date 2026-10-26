# Last train home - shelter detail and clearer train ending v10

[Listen/download full scene](last-train-home-180s.mp3) ·
[WAV master](last-train-home-180s.wav) · [Provenance](provenance.json)

Owner feedback: v9 details are audible, but can overtake the train toward the
end. V10 lowers the added rail/rattle by 1.5 dB throughout and adds a gradual
release over 1:19-1:25. The original train, brakes, air release and rain remain
unchanged. New ventilation/airflow swells and low shelter-frame resonances
occur away from the train so they do not add masking during its arrival.

Both new event pairs represent a slow wind/airflow swell gently exciting the
shelter frame. Resonance has a three-second onset and five-second release;
there are no knocks, steps or sudden creaks. Their connection is an artistic
approximation, not a measured physical simulation. Quiet-bed reference targets
are -5 dB for airflow and -8 dB for frame resonance.

## Complete timeline

| Time        | Layer or transition                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| 0:00-0:04   | Original scene fades in.                                                                              |
| 0:00-3:00   | Rain wash, canopy patter/drops, low ventilation and station hum, subject to the opening/ending fades. |
| 0:18-0:36   | First new slow ventilation/airflow swell.                                                             |
| 0:22-0:35   | Low shelter-frame resonance follows that swell.                                                       |
| 1:00-1:29   | Original train approach, braking and settling; strongest around 1:15-1:18.                            |
| 1:02-1:25   | Added continuous rolling rail texture, following the train.                                           |
| 1:13-1:26   | Original train braking layer.                                                                         |
| 1:13-1:25   | Added mechanical rattle, following braking.                                                           |
| 1:19-1:25   | Added rail/rattle fade away earlier to leave the train ending clearer.                                |
| 1:23-1:28.5 | Original gradual air release.                                                                         |
| 2:00-2:23   | Second new airflow/ventilation swell.                                                                 |
| 2:04-2:22   | Low shelter-frame resonance follows that swell.                                                       |
| 2:48-3:00   | Original scene fades to silence.                                                                      |

No footsteps, scattered clicks, speech, horns, automatic loop or playback action.
No separate train departure is present. The full scene is 180 seconds.

Production stems: [new station details](station-details-only-180s.wav) and
[trimmed train mechanics](trimmed-mechanics-only-180s.wav). Saved master minus
those stems must recover the unchanged underlying bed exactly. The renderer
checks source hashes, nonoverlap with the train for the new station layers,
PCM edges/clipping and WAV/MP3 decoding/peaks. Audibility and comfort still
require owner listening; the agent has not auditioned it.

Reproduce using existing NumPy, FFmpeg and retained v8/v9 PCM plus the hashed
v6 noise helpers: `render_shelter.py --ffmpeg <existing executable>`.
Outputs refuse overwrite; earlier versions remain unchanged.
