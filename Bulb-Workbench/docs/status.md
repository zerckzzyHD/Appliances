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

### Shelter resonance trim v12: 2026-10-26

The owner found v11 shelter resonance a little too loud. V12 reduces only
resonance by 2 dB, retaining airflow and every other PCM component exactly.
All timings remain unchanged; resonance occurs at 0:22-0:35 and 2:04-2:22.
[Current scene and complete timeline](../audio/last-train-home/scene-v12/README.md)
await owner listening. No footsteps or new scene elements are included.

The generator has a single configuration block with independent, actually
consumed airflow/resonance gains. A broader five-family mix matrix is not yet
implemented. V11 station components must reconstruct exactly before the trim;
saved non-resonance component equality is checked afterward. No normalization,
limiter, agent audition or device action is introduced.

Executed v12 results: resonance trim measured -2.00014 dB in both active cores;
outside its two windows the new master is sample-identical to v11. Saved
non-resonance equality and unchanged airflow checks passed. Main WAV/MP3
decode passed; WAV -31.25 LUFS, MP3 true peak -13.08 dBTP, exact 180-second
PCM, silent edges and no clipping. Retained checks passed 45 audio hashes,
twelve generator hashes and 24 WAV files; syntax/format/whitespace passed.

### Station balance candidate v11: 2026-10-26

The owner found rain still dominant and could barely hear the new ventilation
in v10. V11 lowers rain-family gain another 1.5 dB, raises active airflow toward
+1 dB and frame resonance toward -2 dB RMS versus the revised local underlying
bed, and retains the original train and v10 mechanics unchanged. No events or
timings change. [Full scene and exact-level station-only identification clip](../audio/last-train-home/scene-v11/README.md)
were followed by owner feedback that resonance was too loud, motivating v12.

Composition was measured before calibration in quiet windows at 0:07-0:15,
0:45-0:53, 1:40-1:48 and 2:33-2:45. Existing non-rain continuous station bed is
roughly as strong as rain. The rain-only trim therefore reduces total wash
by just 0.64-0.66 dB there. Existing non-rain bed is preserved; rain gain and
overall background reduction are not interchangeable claims.

Read-only Astra advice required that composition check, separate calibration
against the full bed excluding both new layers, overlap/fade measurement and
combined/encoded headroom checks. Advice and RMS levels do not establish that
masking is resolved. Original v10 station PCM must reconstruct exactly before
level changes. No normalization, limiter, agent audition or device action.

Executed v11 results: airflow +5.68 dB and canopy +5.60 dB versus v10.
Median active-core ratios reach the +1/-2 dB targets within 0.01 dB. Combined
station layers measure about +3.07/+3.18 dB over the underlying bed during
their measured overlap cores; fade measurements are separately retained.
Both full/solo delivery formats decode. Main WAV -31.21 LUFS, main MP3 true
peak -13.08 dBTP. Silent PCM edges, exact durations and no clipping passed;
the solo equals the station layer at its actual mix level. The retained checker
passed 42 audio hashes, eleven generator hashes and 22 WAV files. Syntax,
formatting and whitespace passed. Owner acceptance remains pending.

### Shelter detail and train clarity v10: 2026-10-26

Owner feedback established that v9 mechanics were audible, but could overtake
the original train near the end. The owner requested a small reduction, more
details and timestamps for everything. [V10](../audio/last-train-home/scene-v10/README.md)
trims rail/rattle 1.5 dB and adds a six-second release at 1:19-1:25. It retains
the original train, braking, air release and rain at their existing levels.

New airflow/ventilation swells at 0:18-0:36 and 2:00-2:23 are paired with low
shelter-frame resonance at 0:22-0:35 and 2:04-2:22. All have gradual envelopes;
the new station layers are silent during 1:00-1:30. These are original synthetic
artistic textures, not field recordings or a validated physical simulation.
Footsteps and scattered clicks remain excluded. No speech or loop is added.

The complete timing table is saved with the assets. Subsequent owner listening
found new station detail still masked by rain, motivating v11 above. No agent
audition, playback, IR or device operation occurred.

Executed v10 checks: saved master minus its new stems recovers the unchanged
bed exactly; station detail is confined to 0:18-0:36 and 2:00-2:23 and silent
during the train; mechanics are silent after 1:25. WAV/MP3 decoding passed;
master -31.02 LUFS, MP3 true peak -13.07 dBTP, exact 180-second PCM, silent
edges and no clipping. The retained checker passed 37 audio hashes, ten
generator hashes and 19 WAV files. Syntax, current local links, formatting and
whitespace passed. These checks do not establish perceived comfort or realism.

### Mechanical presence v9: 2026-10-26

The owner was unsure whether they noticed the v8 rails/rattles, describing
hearing mostly train, while allowing that the layers might blend together.
No acceptance or demonstrated masking resolution follows from that feedback.
[V9](../audio/last-train-home/scene-v9/README.md) raises only those two coherent
textures toward -3 dB active-body RMS versus the actual train-window bed.
Original rain/train bed, phase, envelopes, timing and panning stay unchanged;
no footsteps are included.

A 30-second mechanics-only identification clip corresponds to scene 1:00-1:30.
Its PCM level is exactly the level used in the full mix, with no normalization
or demonstration boost. It excludes rain and the original train. Owner
comparison subsequently confirmed audible layers but found them intrusive near
the train ending, motivating v10 above. No agent audition or device operation
is claimed.

Executed v9 results: rail +5.61 dB and rattle +8.84 dB versus v8, each reaching
-3 dB against its active train-window bed within 0.01 dB. The solo WAV exactly
equals the added component in the full scene over 1:00-1:30. Outside 1:02-1:29,
the scene is sample-identical to v8. Main WAV is -30.59 LUFS; main MP3 true
peak is -11.74 dBTP. Both full and solo formats decoded, with exact PCM duration,
silent edges and no clipping. The retained checker passed 33 audio hashes,
nine generator hashes and 16 WAV files. Python syntax/format/whitespace passed.

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
of v8 was inconclusive: the owner could not confidently identify the added
layers. V9 above addresses presence and identification. No playback or device
operation occurred.

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
