# Last train home - shelter resonance trim v12

[Listen/download](last-train-home-180s.mp3) · [WAV](last-train-home-180s.wav) ·
[Resonance production stem](shelter-resonance-only-180s.wav) · [Provenance](provenance.json)

The owner found v11 shelter resonance a little too loud. V12 reduces that
layer by 2 dB while retaining every other component exactly in PCM. Airflow,
rain, continuous wash, original train and revised mechanics are unchanged.
There is no normalization, limiter, new sound, timing change or footstep layer.

The renderer reproduces v11 station PCM exactly, separates its airflow and
resonance, and changes only resonance. Saved master minus the new resonance
must equal the previous master minus its original resonance exactly.

`LAYER_GAINS_DB_VS_V11` at the top contains actual independent consumers for
airflow and resonance. Broader five-family rain/wash/airflow/train/resonance
controls remain future work; this renderer does not claim that refactor.

## Timeline

| Time        | Layer                                                             |
| ----------- | ----------------------------------------------------------------- |
| 0:00-0:04   | Original fade-in.                                                 |
| Throughout  | Rain, canopy patter/drops and continuous station/ventilation bed. |
| 0:18-0:36   | Airflow swell.                                                    |
| 0:22-0:35   | Shelter resonance, now 2 dB quieter.                              |
| 1:00-1:29   | Original train, strongest around 1:15-1:18.                       |
| 1:02-1:25   | Added rolling rail texture.                                       |
| 1:13-1:26   | Original braking.                                                 |
| 1:13-1:25   | Added rattle.                                                     |
| 1:19-1:25   | Added mechanics fade away.                                        |
| 1:23-1:28.5 | Original air release.                                             |
| 2:00-2:23   | Second airflow swell.                                             |
| 2:04-2:22   | Second shelter resonance, now 2 dB quieter.                       |
| 2:48-3:00   | Ending fade.                                                      |

Exact duration, PCM edges/clipping, saved component equality and decoded
WAV/MP3 peaks are checked. Owner comfort remains unverified; no agent audition
or device operation occurred. Existing NumPy, FFmpeg and retained v6/v10/v11
sources/assets reproduce it with `render_resonance_trim.py --ffmpeg <executable>`.
Output overwrite is refused; older versions stay unchanged.
