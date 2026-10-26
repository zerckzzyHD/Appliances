# Bulb status

Checkpoint: 2026-10-26. This is the current bulb authority. The imported
[Revision 3 reconciliation](history/GE-SPEAKER-BULB-IR-PLAN-2026-10-22.md)
preserves the earlier specification and evidence; its planning-only/no-audio
statements are historical and superseded here.

## Owner observations

On 2026-10-25 the owner reported the phone IR app changed both lamps to Red.
The imported GE lighting profile reportedly worked for 15 of 16 buttons; Green
did nothing, including a manual candidate. The physical remote selects green.
Those are owner reports, not independently repeated response measurements.
Green is parked because the intended scene does not require it.

After listening to successive audio previews, the owner requested quieter rain
twice, then accepted v3: "That's really good." This establishes subjective
balance acceptance for the preview. Playback destination, Bluetooth grouping,
overnight comfort and combined lighting/audio behavior remain unverified.

## Saved assets and limits

### Station details v6: 2026-10-26

The owner authorized rail/mechanical detail and a trial of footsteps, while
noting that footsteps could feel scary in their apartment. V6 supplies both
[with-footsteps](../audio/last-train-home/scene-v6/last-train-home-180s.mp3) and
[without-footsteps](../audio/last-train-home/scene-v6/last-train-home-180s-no-footsteps.mp3)
mixes and an isolated step layer. The approved v5 PCM bed is retained at unity
gain with no normalization, preserving its rain/train mix.

Rail contacts: 0:24, 0:46.5, 0:54.2, 1:32, 2:09, 2:33. Rattle windows:
0:35-0:41, 1:37-1:44 and 2:23-2:30. Seven receding steps are around 1:51-1:57;
their layer can be omitted without changing the other details. These are
synthetic textures, not field recordings. Owner realism/comfort comparison is
pending. No playback, IR or other device operation is performed.

Executed checks: both mixes and their MP3s decoded through FFmpeg; both PCM
masters are exactly 180 seconds with silent edges and no clipped samples.
Both measured -31.33 LUFS PCM / -31.68 LUFS MP3; MP3 true peak -15.17 dBTP.
Saved WAV comparison confirms the mix difference equals the isolated step
stem exactly, and the alternate equals the v5 PCM plus the regenerated detail
stem. Both added layers contain nonzero samples. The retained checker passes
20 audio hashes, six generator hashes and eight WAV files. No agent audition
or owner acceptance of v6 is claimed.

### Three-minute scene v5: 2026-10-26

Owner feedback on v4: much better mixing; rain could be a little quieter again,
and the scene needs more sonic detail. V5 reduces rain/canopy/drops another
0.75 dB, with the same seed, duration, non-rain synthesis and fixed master gain.
[V5 assets](../audio/last-train-home/scene-v5/README.md) preserve the train timing
and add no new sounds. The owner subsequently accepted v5: "YES that's good."
This is the approved rain/train balance reference for further production.
More ambient detail is next; sleep comfort over a full night and combined
lighting/audio behavior remain unverified.

Executed v5 checks: 180-second stereo PCM, silent edges, no clipping, WAV/MP3
FFmpeg decode, master -31.33 LUFS and MP3 true peak -15.17 dBTP. The retained
asset checker passes 15 audio hashes, five generator hashes and five masters.
Source comparison confirms identical synthesis functions and master gain to
v4; rain-family gain ratios are lower by exactly 0.75 dB. No device operation.

Static inspection also found a historical v4 receipt metadata error: its vs-v2
canopy/drop entries said -3 dB, while the shared synthesis gain was -4.5 dB.
Actual audio and the documented v4-v3 reduction were correct. V5 records the
correction; the v4 generator, receipt and audio remain unchanged.

### Three-minute scene v4: 2026-10-26

The owner approved the extension and asked to lower rain slightly again.
[Scene v4](../audio/last-train-home/scene-v4/README.md) is rendered: 180 seconds,
rain/canopy/drops 1.5 dB below v3, unchanged train/brake/air/ventilation gains and
the same fixed master gain. It was not normalized back upward. Longer noise
synthesis changes sample waveforms; unchanged gains are not identical audio.

The single arrival runs from 1:00 to 1:29, with the strongest train around
1:15-1:18. Fade-out is 2:48-3:00. There is no PA, separate departure, automatic
loop or lighting sequence. Subsequent owner listening feedback is recorded above.

Executed checks: exact 8,640,000-frame 48 kHz stereo PCM master, silent first
and last frames, no clipped samples, both formats decoded through FFmpeg,
master -30.89 LUFS and MP3 true peak -15.00 dBTP. The root checker passes all
12 audio hashes, four generator hashes and four WAV masters. Earlier previews
and the imported plan retain their saved hashes. No device operation occurred.

### Retained 60-second previews

V1, v2 and v3 are original procedural NumPy synthesis. V3 reduces the rain
layers another 3 dB relative to v2, retains train source gains and the same
effective master gain. The PCM master measured -28.80 LUFS in its retained
render receipt. No samples, music or voices were downloaded.

The train enters around 16 seconds, peaks around 31-34 seconds and settles by
45 seconds. Braking occupies 29-42 seconds, air release 39-44.5 seconds, and
the file fades out over 53-60 seconds. No separate departure is present.

The root checker validates saved hashes, exact 60-second stereo WAV structure,
silent master edges and absence of clipped PCM samples. Historical FFmpeg
decode and loudness results remain in each provenance file. The agent has not
auditioned the files or operated the phone/bulbs. No macro, announcement,
automatic loop or synchronized playback has been implemented.
