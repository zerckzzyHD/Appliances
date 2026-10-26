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

### Three-minute scene v4: 2026-10-26

The owner approved the extension and asked to lower rain slightly again.
[Scene v4](../audio/last-train-home/scene-v4/README.md) is rendered: 180 seconds,
rain/canopy/drops 1.5 dB below v3, unchanged train/brake/air/ventilation gains and
the same fixed master gain. It was not normalized back upward. Longer noise
synthesis changes sample waveforms; unchanged gains are not identical audio.

The single arrival runs from 1:00 to 1:29, with the strongest train around
1:15-1:18. Fade-out is 2:48-3:00. There is no PA, separate departure, automatic
loop or lighting sequence. Owner listening to v4 is pending.

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
