"""Offline v8: coherent train-linked rail texture and braking rattle, no footsteps."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess

import numpy as np

FS = 48000
RAIN_DB = -1.5
MAX_BOOST_DB = 30.0


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def owned_module(folder, filename):
    receipt = json.loads((folder / 'provenance.json').read_bytes())
    path = folder / filename
    assert digest(path) == receipt['generatorSha256']
    spec = importlib.util.spec_from_file_location(folder.name.replace('-', '_'), path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module, receipt


def rms(data):
    return float(np.sqrt(np.mean(np.square(data.astype(np.float64)))))


def db(value):
    return float(20 * np.log10(max(value, 1e-12)))


def calibrate(stem, bed, rain, windows, target_db):
    slices = [slice(round(a * FS), round(b * FS)) for a, b in windows]
    ratios = [rms(bed[s]) / rms(stem[s]) for s in slices]
    requested = float(np.median(ratios)) * 10 ** (target_db / 20)
    gain = min(requested, 10 ** (MAX_BOOST_DB / 20))
    adjusted = np.rint(stem.astype(np.float64) * gain).astype(np.int32)
    rows = []
    for window, s in zip(windows, slices):
        rows.append({'windowSeconds': window,
                     'detailVsBedDb': db(rms(adjusted[s]) / rms(bed[s])),
                     'detailVsRainDb': db(rms(adjusted[s]) / rms(rain[s]))})
    return adjusted, {'gainDbVsV6': db(gain), 'targetVsBedDb': target_db,
                      'maximumBoostDb': MAX_BOOST_DB, 'capped': gain < requested,
                      'activeWindows': rows}


def linked_textures(v6, bed):
    begin, end = 62.0, 89.0
    local = np.arange(round((end - begin) * FS)) / FS
    t = local + begin
    event_t = t - 44.0
    rng = np.random.default_rng(261028)
    # Exactly the wheel phase used by the original v5 train rumble.
    phase = 2 * np.pi * (8.0 * event_t - 0.07 * event_t * event_t)
    wheel = 0.86 + 0.09 * np.sin(phase) + 0.05 * np.sin(1.93 * phase)
    rolling_envelope = v6.smooth((t - 62) / 6) * (1 - v6.smooth((t - 79) / 10))
    braking_envelope = v6.smooth((t - 73) / 6) * (1 - v6.smooth((t - 80) / 6))
    # Filter first; apply all envelopes afterward so there are no filter tails.
    shared = v6.band_noise(rng, len(t), 160, 1550)
    mechanical = 0.6 * shared + 0.4 * v6.band_noise(rng, len(t), 450, 1800)
    rail = shared * wheel * rolling_envelope
    rattle = mechanical * wheel * rolling_envelope * braking_envelope
    pan = 0.42 + 0.12 * v6.smooth((event_t - 18) / 20)
    quiet = bed[50 * FS:53 * FS]
    stats = {}
    results = []
    for name, mono, body, target in [
        ('rail', rail, (70, 78), 0.0), ('rattle', rattle, (78, 81), -3.0)]:
        stereo = np.column_stack((mono * np.sqrt(1-pan), mono * np.sqrt(pan)))
        a, b = [round((x-begin)*FS) for x in body]
        gain = rms(quiet) * 10 ** (target / 20) / rms(stereo[a:b])
        stereo *= gain
        stem = np.zeros_like(bed)
        stem[round(begin*FS):round(end*FS)] = np.rint(stereo).astype(np.int32)
        assert not np.any(stem[:round(begin*FS)]) and not np.any(stem[round(end*FS):])
        active = slice(round(body[0]*FS), round(body[1]*FS))
        stats[name] = {'bodySeconds': body, 'targetVsQuietBedDb': target,
                       'achievedVsQuietBedDb': db(rms(stem[active])/rms(quiet)),
                       'achievedVsTrainWindowBedDb': db(rms(stem[active])/rms(bed[active])),
                       'onsetSeconds': 6.0 if name == 'rail' else 6.0,
                       'phase': 'same decelerating wheel phase as original v5 train',
                       'supportSeconds': [62,89]}
        results.append(stem)
    return results[0], results[1], stats


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    out = Path(__file__).resolve().parent
    root = out.parent
    filenames = ['last-train-home-180s.wav', 'last-train-home-180s.mp3',
                 'rail-texture-only-180s.wav', 'mechanical-rattle-only-180s.wav', 'provenance.json']
    outputs = [out / name for name in filenames]
    assert not any(path.exists() for path in outputs), 'Refusing overwrite'
    v5, prior = owned_module(root / 'scene-v5', 'render_scene.py')
    v6, _ = owned_module(root / 'scene-v6', 'render_details.py')
    base_path = root / 'scene-v5/last-train-home-180s.wav'
    assert digest(base_path) == prior['files'][base_path.name]['sha256']
    original = v5.make_scene()
    premaster_path = root / 'scene-v5/last-train-home-180s-premaster.wav'
    assert digest(premaster_path) == prior['files'][premaster_path.name]['sha256']
    assert np.array_equal(np.rint(original * 32767).astype('<i2'), v6.read_pcm(premaster_path))
    original_trim = v5.RAIN_TRIM
    v5.RAIN_TRIM = 0.0
    zero_rain = v5.make_scene()
    v5.RAIN_TRIM = original_trim
    rain = original - zero_rain
    assert np.allclose(zero_rain + rain, original, rtol=0, atol=1e-14)
    master_gain = prior['normalization']['fixedGain']
    rain_pcm = rain * master_gain * 32767
    trim = 10 ** (RAIN_DB / 20)
    base = v6.read_pcm(base_path).astype(np.int32)
    bed = base + np.rint((trim - 1) * rain_pcm).astype(np.int32)
    revised_rain = rain_pcm * trim
    del original, zero_rain, rain, rain_pcm
    detail, unused_steps = v6.stems()
    del unused_steps
    clicks = np.zeros_like(detail)
    rattles = np.zeros_like(detail)
    for when in v6.RAIL_TIMES:
        s = slice(round(when * FS), round((when + 0.882) * FS))
        clicks[s] = detail[s]
    for begin, end in v6.RATTLE_WINDOWS:
        s = slice(round(begin * FS), round((end + 0.232) * FS))
        rattles[s] = detail[s]
    assert np.array_equal(clicks.astype(np.int32) + rattles.astype(np.int32), detail)
    clicks, click_stats = calibrate(clicks, bed, revised_rain,
        [(t + 0.035, t + 0.135) for t in v6.RAIL_TIMES], 0.0)
    rattles, rattle_stats = calibrate(rattles, bed, revised_rain,
        [(a + (b-a)*0.35, a + (b-a)*0.65) for a, b in v6.RATTLE_WINDOWS], 0.0)
    v7_path = root / 'scene-v7/last-train-home-180s-no-footsteps.wav'
    prior_v7 = json.loads((root/'scene-v7/provenance.json').read_bytes())
    assert digest(v7_path) == prior_v7['files'][v7_path.name]['sha256']
    assert np.array_equal(bed + clicks + rattles, v6.read_pcm(v7_path)), 'V7 reconstruction mismatch'
    # Both scattered families are now omitted, along with all footsteps.
    rail, rattle, texture_stats = linked_textures(v6, bed)
    final_mix = bed + rail + rattle
    v6.write_pcm(outputs[0], final_mix)
    v6.write_pcm(outputs[2], rail)
    v6.write_pcm(outputs[3], rattle)
    assert np.array_equal(v6.read_pcm(outputs[0]).astype(np.int32)
                          - v6.read_pcm(outputs[2]).astype(np.int32)
                          - v6.read_pcm(outputs[3]).astype(np.int32), bed)
    measurements = {}
    common = [args.ffmpeg, '-hide_banner', '-nostdin']
    for wav, mp3 in [(outputs[0], outputs[1])]:
        subprocess.run(common + ['-i', str(wav), '-c:a', 'libmp3lame', '-b:a', '128k', str(mp3)],
                       capture_output=True, check=True)
        for path in [wav, mp3]:
            run = subprocess.run(common + ['-i', str(path), '-af',
                    'loudnorm=I=-27:TP=-5:LRA=7:print_format=json', '-f', 'null', '-'],
                    capture_output=True, check=True)
            text = run.stderr.decode('utf-8', errors='replace'); start = text.rfind('{')
            stats = json.loads(text[start:text.index('}', start) + 1])
            assert float(stats['input_tp']) < -4 and float(stats['input_i']) < -26.5
            measurements[path.name] = {'integratedLufs': float(stats['input_i']),
                                       'truePeakDbtp': float(stats['input_tp'])}
    receipt = {
        'date': '2026-10-26', 'durationSeconds': 180, 'sampleRateHz': FS, 'channels': 2,
        'sources': 'Retained original v5 and v6 procedural synthesis; no downloaded samples.',
        'sourceGeneratorHashes': {'v5': digest(root/'scene-v5/render_scene.py'),
                                  'v6': digest(root/'scene-v6/render_details.py')},
        'baseMasterSha256': digest(base_path), 'rainDbVsV5AndV6': RAIN_DB,
        'rainIsolation': 'Identical seeded premaster renders differing only in linear rain amplitude; original reproduces saved premaster PCM, reconstruction tolerance 1e-14.',
        'nonRainChange': 'None; add only quantized rain delta to original master. No train gain change.',
        'normalization': 'none; no limiter or automatic gain',
        'linkedTextureCalibration': texture_stats,
        'quietBedReferenceSeconds': [50,53],
        'v7NoFootstepMasterReconstructedExactly': True,
        'calibrationCeiling': 'Active-body RMS targets use a quiet-bed reference; actual train-window ratios are also reported. Shared phase/envelopes express intended physical coherence, not verified realism.',
        'cueSeconds': {'train': [60,89], 'railTexture': [62,89], 'brakingRattle': [73,86], 'fadeOut': [168,180]},
        'footstepsIncluded': False, 'scatteredClickAndRattleFamiliesIncluded': False,
        'measurements': measurements,
        'validation': {'exactWavFrames': 8640000, 'clippedSamples': 0, 'silentEdges': True,
                       'masterAndMp3Decoded': True, 'savedMasterMinusNewStemsExactlyV7Bed': True,
                       'auditionedByAgent': False, 'ownerListening': 'pending', 'deviceOperations': 0},
        'files': {p.name: {'bytes': p.stat().st_size, 'sha256': digest(p)} for p in outputs[:-1]},
        'generatorSha256': digest(Path(__file__)),
        'limits': ['Synthetic sounds, not field recordings. Owner listening is the acceptance test.',
                   'No speech, horn, automatic loop, playback, pairing or IR operation.']
    }
    outputs[-1].write_text(json.dumps(receipt, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({'linkedTextureCalibration': texture_stats, 'measurements': measurements, 'footstepsIncluded': False}))


if __name__ == '__main__':
    main()
