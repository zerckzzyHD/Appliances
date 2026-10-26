"""Add removable original station details to the approved v5 PCM master.

Uses existing NumPy and FFmpeg. No downloads, playback or device commands.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import wave

import numpy as np

FS = 48000
SECONDS = 180
FRAMES = FS * SECONDS
SEED = 261026
RAIL_TIMES = [24.0, 46.5, 54.2, 92.0, 129.0, 153.0]
RATTLE_WINDOWS = [(35.0, 41.0), (97.0, 104.0), (143.0, 150.0)]
STEP_TIMES = [110.8, 111.65, 112.5, 113.4, 114.3, 115.2, 116.1]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def smooth(value):
    value = np.clip(value, 0, 1)
    return value * value * (3 - 2 * value)


def band_noise(rng, count, low, high):
    freq = np.fft.rfftfreq(count, 1 / FS)
    safe = np.maximum(freq, 1)
    shape = 1 / np.sqrt(1 + (low / safe) ** 8)
    shape *= 1 / np.sqrt(1 + (safe / high) ** 8)
    shape[0] = 0
    spectrum = (rng.normal(size=len(freq)) + 1j * rng.normal(size=len(freq))) * shape
    data = np.fft.irfft(spectrum, n=count)
    return data / max(float(np.sqrt(np.mean(data * data))), 1e-12)


def place(stem, signal, seconds, amplitude, pan):
    signal = signal - np.mean(signal)
    start = round(seconds * FS)
    for delay, gain in [(0, 1), (0.071, 0.20), (0.137, 0.10), (0.231, 0.045)]:
        begin = start + round(delay * FS)
        end = begin + len(signal)
        assert end < FRAMES
        stem[begin:end, 0] += signal * amplitude * gain * math.sqrt(1 - pan)
        stem[begin:end, 1] += signal * amplitude * gain * math.sqrt(pan)


def stems():
    rng = np.random.default_rng(SEED)
    details = np.zeros((FRAMES, 2), dtype=np.float32)
    steps = np.zeros_like(details)
    for index, when in enumerate(RAIL_TIMES):
        t = np.arange(round(0.65 * FS)) / FS
        envelope = smooth(t / 0.025) * np.exp(-t / 0.115) * (1 - smooth((t - 0.42) / 0.23))
        signal = (0.8 * band_noise(rng, len(t), 450, 2200)
                  + 0.18 * np.sin(2 * np.pi * 920 * t)) * envelope
        place(details, signal, when, 0.0055, 0.62 if index % 2 else 0.35)
    for begin, end in RATTLE_WINDOWS:
        t = np.arange(round((end - begin) * FS)) / FS
        envelope = smooth(t / 1.2) * (1 - smooth((t - (end - begin - 1.4)) / 1.4))
        modulation = 0.65 + 0.20 * np.sin(2 * np.pi * 6.4 * t) + 0.15 * np.sin(2 * np.pi * 9.1 * t)
        signal = band_noise(rng, len(t), 220, 1500) * envelope * modulation
        place(details, signal, begin, 0.0038, 0.58)
    for index, when in enumerate(STEP_TIMES):
        t = np.arange(round(0.48 * FS)) / FS
        envelope = smooth(t / 0.035) * np.exp(-t / 0.07) * (1 - smooth((t - 0.28) / 0.20))
        signal = band_noise(rng, len(t), 260, 1250) * envelope
        # Receding and nearly centered: no close, bass-heavy heel impact.
        place(steps, signal, when, 0.0060 * (1 - 0.075 * index), 0.53)
    return [np.rint(stem * 32767).astype('<i2') for stem in (details, steps)]


def read_pcm(path):
    with wave.open(str(path), 'rb') as wav:
        assert (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getnframes()) == (2, 2, FS, FRAMES)
        return np.frombuffer(wav.readframes(FRAMES), dtype='<i2').reshape(-1, 2).copy()


def write_pcm(path, samples):
    assert np.max(samples) < 32767 and np.min(samples) > -32768
    assert np.all(samples[0] == 0) and np.all(samples[-1] == 0)
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(FS)
        wav.writeframes(samples.astype('<i2').tobytes())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    out = Path(__file__).resolve().parent
    reference = out.parent / 'scene-v5'
    source = reference / 'last-train-home-180s.wav'
    prior = json.loads((reference / 'provenance.json').read_bytes())
    assert digest(source) == prior['files'][source.name]['sha256']
    outputs = [out / name for name in ['last-train-home-180s.wav', 'last-train-home-180s.mp3',
               'last-train-home-180s-no-footsteps.wav', 'last-train-home-180s-no-footsteps.mp3',
               'footsteps-only-180s.wav', 'provenance.json']]
    assert not any(path.exists() for path in outputs), 'Refusing to overwrite outputs'
    details, steps = stems()
    base = read_pcm(source).astype(np.int32)
    without = base + details.astype(np.int32)
    with_steps = without + steps.astype(np.int32)
    assert np.array_equal(with_steps - without, steps), 'Footstep isolation failed'
    write_pcm(outputs[0], with_steps)
    write_pcm(outputs[2], without)
    write_pcm(outputs[4], steps)
    measurements = {}
    common = [args.ffmpeg, '-hide_banner', '-nostdin']
    for wav, mp3 in [(outputs[0], outputs[1]), (outputs[2], outputs[3])]:
        subprocess.run(common + ['-i', str(wav), '-c:a', 'libmp3lame', '-b:a', '128k', str(mp3)],
                       capture_output=True, check=True)
        for path in [wav, mp3]:
            run = subprocess.run(common + ['-i', str(path), '-af',
                    'loudnorm=I=-27:TP=-5:LRA=7:print_format=json', '-f', 'null', '-'],
                    capture_output=True, check=True)
            text = run.stderr.decode('utf-8', errors='replace')
            start = text.rfind('{')
            stats = json.loads(text[start:text.index('}', start) + 1])
            assert float(stats['input_tp']) < -4 and float(stats['input_i']) < -26.5
            measurements[path.name] = {'integratedLufs': float(stats['input_i']),
                                       'truePeakDbtp': float(stats['input_tp'])}
    receipt = {
        'date': '2026-10-26', 'durationSeconds': SECONDS, 'sampleRateHz': FS, 'channels': 2,
        'sources': 'Approved v5 PCM master plus original procedural NumPy detail stems; no downloaded samples.',
        'baseMasterSha256': digest(source), 'seed': SEED,
        'baseGain': 1.0, 'normalization': 'none; original PCM bed retained at unity gain',
        'cueSeconds': {'train': [60, 89], 'railClicks': RAIL_TIMES,
                       'rattleWindows': RATTLE_WINDOWS, 'footsteps': STEP_TIMES, 'fadeOut': [168, 180]},
        'footsteps': 'Seven soft receding contacts; isolated stem and alternate mix supplied for owner comparison.',
        'measurements': measurements,
        'validation': {'exactWavFrames': FRAMES, 'clippedSamples': 0,
                       'silentEdges': True, 'bothMixesAndMp3sDecoded': True,
                       'pcmMixDifferenceExactlyFootstepStem': True,
                       'auditionedByAgent': False, 'ownerListening': 'pending', 'deviceOperations': 0},
        'files': {path.name: {'bytes': path.stat().st_size, 'sha256': digest(path)} for path in outputs[:-1]},
        'generatorSha256': digest(Path(__file__)),
        'limits': ['Synthetic textures are not field recordings; perceived realism and comfort unverified.',
                   'No announcement, horn, automatic loop, playback or lighting operation.']
    }
    outputs[-1].write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'durationSeconds': SECONDS, 'footstepWindow': [110.8, 116.6],
                      'measurements': measurements, 'pcmFootstepIsolation': True}))


if __name__ == '__main__':
    main()
