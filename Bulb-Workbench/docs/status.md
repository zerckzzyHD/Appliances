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

### Coherent train textures v8: 2026-10-26

The owner found v7 clicks similar to footsteps and too sudden/random. They
explicitly removed footsteps and requested that all mechanical tracks work
off one another. [V8](../audio/last-train-home/scene-v8/README.md) removes both
scattered click/rattle families and uses continuous rail texture plus a
braking-linked rattle. No footstep layer is included in this production version;
earlier comparisons are retained as history.

Both additions follow the original train's wheel phase and stereo progression,
with a shared filtered-noise component. Rail texture builds at 1:02-1:08 and
settles by 1:29; rattle follows braking at 1:13-1:26. The v7 underlying rain/train
bed is retained. Quiet-bed reference levels and actual train-window ratios
are recorded separately. No normalization or limiter is introduced.

Astra advice required checking exact component reconstruction before claiming
the old details were removed without changing the bed. The renderer checks
the original v7 no-footstep master against its deterministic integer components
before replacing them; new saved stem decomposition is also checked. These
are source/sample checks, not agent audition. Owner comfort/realism acceptance
of v8 remains pending. No playback or device operation occurred.

Executed results: the v7 no-footstep reconstruction and saved new master/stem
decomposition passed exactly. Outside the removed/added detail windows, v8 is
sample-identical to v7. Added rail/rattle samples are confined to 1:02-1:29
and 1:13-1:26 respectively. Rail/rattle active-body RMS is 0/-3 dB versus the
quiet-bed reference, and -8.61/-11.84 dB versus the actual train-window bed.
The master/MP3 decoded successfully; PCM -31.75 LUFS, MP3 true peak -14.35
dBTP, silent edges and no clipping. The retained checker passed 29 audio
hashes, eight generator hashes and 14 WAV files; syntax/formatting passed.

### Masking adjustment v7: 2026-10-26

The owner reported hearing only rain/train in v6 and said rain still overshadows
everything. They requested quieter rain and other sounds near or slightly
above its level. This supersedes retaining v5 rain unchanged as a requirement;
v5's earlier acceptance remains historical evidence.

[V7 main mix](../audio/last-train-home/scene-v7/last-train-home-180s-no-footsteps.mp3)
omits footsteps; an [optional comparison](../audio/last-train-home/scene-v7/last-train-home-180s.mp3)
retains the separate step layer. Rain-family gain drops 1.5 dB versus v5/v6;
train and other original bed gains stay unchanged. Clicks/rattles are calibrated
separately toward 0 dB median active-body RMS versus the revised local bed,
excluding the added sound; optional footsteps target -3 dB. The receipt records
per-event ratios versus both the isolated rain and the full bed, plus a 30 dB
maximum family boost. No master normalization or limiter is used.

Read-only Astra advice challenged rain-stem isolation, active-window selection
and summed/encoded headroom. The renderer checks original premaster reproduction,
linear rain decomposition, saved footstep isolation and WAV/MP3 peaks. Advice
and measured RMS do not establish perceived audibility. Subsequent owner
listening found the clicks/steps too similar and clicks jarring, motivating
v8 above. No agent audition or device operation is claimed.

Executed results: rain -1.5 dB, clicks +18.71 dB and rattles +17.35 dB versus
v6. Median active-body levels are 0 dB relative to the local bed and about
3.31/3.12 dB above rain-only for clicks/rattles. Optional footsteps are -3 dB
relative to the bed, about 0.08 dB above rain-only. No family hit the gain cap.
Both PCM mixes are 180 seconds, with silent edges and no clipping. Both decoded
MP3 true peaks measured -15.30 dBTP. Saved PCM footstep isolation passed;
the retained checker passed 25 audio hashes, seven generator hashes and 11
WAV files. Source syntax, formatting and whitespace checks passed.

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
synthetic textures, not field recordings. The subsequent owner comparison found
the added details masked by rain, motivating v7 above. No playback, IR or other
device operation was performed by the agent.

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
