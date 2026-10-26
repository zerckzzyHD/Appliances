# Last train home - station balance candidate v11

- [Full three-minute scene](last-train-home-180s.mp3)
- [First station event alone, 30 seconds](station-only-30s.mp3)
- [Full WAV](last-train-home-180s.wav)
- [Station-only WAV](station-details-only-180s.wav)
- [Provenance and active-window measurements](provenance.json)

The owner still found rain dominant and ventilation barely audible in v10.
V11 lowers rain-family gain another 1.5 dB and raises the two new station
families toward +1 dB active-core RMS for airflow and -2 dB for canopy resonance,
each relative to the local revised underlying bed. The original train and
v10's reduced/earlier-fading mechanics remain unchanged. No new events are added.

The background composition check found the existing continuous non-rain station
bed about as strong as the rain. Consequently, the 1.5 dB rain-family trim
reduces the combined wash by only about 0.64-0.66 dB in the measured quiet
windows. Existing non-rain bed remains unchanged; do not equate the two figures.

The renderer first reproduces the original v10 station PCM exactly, then
calibrates airflow and resonance separately against the revised bed excluding
both new station layers. The receipt records their gains, rain-only comparisons,
combined overlap levels and fade levels. Those measurements do not establish
perceived audibility, realism or comfortable sleep playback.

Timings are unchanged:

| Time        | Layer                                                              |
| ----------- | ------------------------------------------------------------------ |
| 0:00-0:04   | Original scene fade-in.                                            |
| Throughout  | Rain, canopy patter/drops, continuous low station/ventilation bed. |
| 0:18-0:36   | First stronger airflow/ventilation swell.                          |
| 0:22-0:35   | Stronger frame resonance following it.                             |
| 1:00-1:29   | Original train, strongest around 1:15-1:18.                        |
| 1:02-1:25   | Added rolling rail texture.                                        |
| 1:13-1:26   | Original braking.                                                  |
| 1:13-1:25   | Added mechanical rattle.                                           |
| 1:19-1:25   | Added mechanics fade away.                                         |
| 1:23-1:28.5 | Original air release.                                              |
| 2:00-2:23   | Second stronger airflow swell.                                     |
| 2:04-2:22   | Stronger frame resonance following it.                             |
| 2:48-3:00   | Original scene fade-out.                                           |

The 30-second identification clip covers scene 0:12-0:42 with only the two
new station layers at their exact mix PCM level. Airflow starts at clip 0:06,
frame resonance at 0:10. It is not normalized or boosted separately.
Footsteps, scattered clicks, speech, horns and automatic looping remain absent.

Reproduction requires existing NumPy/FFmpeg and retained v5/v6/v10 sources and
assets: `render_station_balance.py --ffmpeg <existing executable>`.
Outputs refuse overwrite. Earlier versions remain unchanged. No audition or
device playback by the agent is claimed; owner listening is pending.
