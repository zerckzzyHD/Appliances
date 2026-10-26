# Last train home - five-minute station story v13

- [Full scene with fictional PA](last-train-home-300s.mp3)
- [Announcement-free scene](last-train-home-300s-no-pa.mp3)
- [PA WAV](last-train-home-300s.wav) / [no-PA WAV](last-train-home-300s-no-pa.wav)
- [Render provenance](provenance.json) / [local speech provenance](speech-provenance.json)

The owner authorized adding more than a departure before listening. V13 adds
a shared-motion departure, a longer waiting period, evolving late weather,
lagging roof runoff, another quieter shelter response and two optional original
fictional announcements. Footsteps, horns and scattered clicks stay excluded.
This is a finite five-minute scene; no seamless loop or autoplay is claimed.

## Complete timeline

| Time        | Sound or transition                                                           |
| ----------- | ----------------------------------------------------------------------------- |
| 0:00-0:04   | Original opening fade.                                                        |
| Throughout  | Sheltered rain, roof patter, low station/ventilation bed.                     |
| 0:18-0:36   | Existing airflow swell.                                                       |
| 0:22-0:35   | Existing shelter resonance at v12's quieter level.                            |
| 0:44-0:48.4 | Optional fictional PA: late local service approaching platform two.           |
| 1:00-1:29   | Train approaches, brakes and settles; strongest around 1:15-1:18.             |
| 1:02-1:25   | Connected rolling rail texture.                                               |
| 1:13-1:26   | Original braking; added rattle ends at 1:25.                                  |
| 1:19-1:25   | Added mechanics gradually release.                                            |
| 1:23-1:28.5 | Original air release.                                                         |
| 2:00-2:23   | Existing second airflow swell.                                                |
| 2:04-2:22   | Existing second quieter shelter resonance.                                    |
| 2:36-2:48   | Measured join into the extended ambience; no deliberate new foreground event. |
| 2:50-2:54.6 | Optional fictional PA: late local service will depart shortly.                |
| 3:05-3:48   | New departure: motor and wheels accelerate together, then recede.             |
| 3:55-4:25   | New gradual airflow/gust event.                                               |
| 3:55-4:45   | Background weather gently eases and returns.                                  |
| 4:03-4:35   | New continuous roof runoff follows the weather change with a lag.             |
| 4:07-4:25   | New shelter response, calibrated to the quieter v12 resonance core.           |
| 4:45-5:00   | Deliberate final fade to silence.                                             |

## Construction and limits

The no-PA version retains v12 samples exactly through 2:36. A 12-second
equal-power crossfade joins a new procedural bed before the old ending fade.
The tail uses the same rain/ventilation frequency bands and coefficient
proportions, matched to the existing quiet-bed RMS. It is a new noise
realization; measured level/spectrum/width checks do not prove an inaudible join.

Departure motor, rolling texture, acceleration and receding position share one
motion trajectory. Later airflow, frame response and runoff form one timed
weather sequence. The last new event ends before the final fade. These are
artistic procedural approximations, not recordings or validated physical models.

Speech text is original and fictional. Existing installed Windows System.Speech
synthesis renders straight to files; voice culture/name hash and scripts are
retained. There is no installation, speaker output or online fallback. Speech
is filtered, given a quiet fixed reflection field and placed away from the
train events. The two full PCM versions differ only by that PA layer. Actual
line durations are verified to fit their windows; intelligibility is unverified.

Run `render_pa.ps1` once with an existing local en-US voice, then
`render_story.py --ffmpeg <existing executable>` with existing NumPy and
FFmpeg plus retained v5/v6/v12 sources/assets. Both refuse output overwrite.
All active `LEVELS` entries have consumers. This does not claim full independent
control of every inherited layer in the retained prefix.

Exact 300-second PCM, silent edges, clipping, PA support, prefix preservation
and decoded WAV/MP3 peaks are checked. The agent has not auditioned the scene.
Owner listening determines continuity, realism, speech clarity and comfort.
