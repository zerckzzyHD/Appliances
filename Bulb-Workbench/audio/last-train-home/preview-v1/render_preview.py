"""Render an original, finite rain/station/train soundscape without sample assets.

Requires existing NumPy and an existing FFmpeg executable; installs nothing.
This program writes audio files only. It never opens a player or a device.
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
SECONDS = 60
SEED = 251025
N = FS * SECONDS


def smooth(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3.0 - 2.0 * x)


def noise(rng, seconds, low, high, slope=0.0):
    """Continuous random-phase noise, gently band limited in the spectrum."""
    count = int(seconds * FS)
    f = np.fft.rfftfreq(count, 1.0 / FS)
    safe = np.maximum(f, 1.0)
    shape = (safe / 1000.0) ** (slope / 2.0)
    shape *= 1.0 / np.sqrt(1.0 + (low / safe) ** 8)
    shape *= 1.0 / np.sqrt(1.0 + (safe / high) ** 8)
    shape[0] = 0.0
    spectrum = (rng.normal(size=len(f)) + 1j * rng.normal(size=len(f))) * shape
    result = np.fft.irfft(spectrum, n=count)
    return result / max(float(np.sqrt(np.mean(result * result))), 1e-12)


def room(signal):
    """A quiet, fixed early-reflection field; not a convolution-room recording."""
    result = signal.copy()
    for delay_s, gain in [(0.031, 0.10), (0.067, 0.065), (0.109, 0.035)]:
        d = round(delay_s * FS)
        result[d:] += gain * signal[:-d]
    return result


def add_center(mix, signal, gain):
    mix[:, 0] += signal * gain
    mix[:, 1] += signal * gain


def make_scene():
    rng = np.random.default_rng(SEED)
    t = np.arange(N, dtype=np.float64) / FS
    mix = np.zeros((N, 2), dtype=np.float64)

    # Constant rain outside a canopy: a shared field plus independent side detail.
    rain_common = noise(rng, SECONDS, 280, 9500, -0.35)
    weather = (0.92 + 0.055 * np.sin(2 * np.pi * 0.037 * t + 0.7)
               + 0.035 * np.sin(2 * np.pi * 0.083 * t + 1.6))
    for ch in range(2):
        rain_side = noise(rng, SECONDS, 550, 8200, -0.45)
        mix[:, ch] += (0.048 * rain_common + 0.034 * rain_side) * weather

    # A softer canopy wash gives the rain weight without exaggerated thunder.
    canopy = noise(rng, SECONDS, 110, 2400, -1.1)
    add_center(mix, canopy * (0.9 + 0.1 * np.sin(2 * np.pi * 0.051 * t)), 0.020)

    # Small irregular rain contacts on glass/roof, all with softened attacks.
    drops = np.zeros_like(mix)
    for _ in range(5700):
        start = int(rng.integers(0, N - int(0.07 * FS)))
        duration = float(rng.uniform(0.008, 0.042))
        count = int(duration * FS)
        dt = np.arange(count) / FS
        attack = smooth(dt / 0.0015)
        env = attack * np.exp(-dt / (duration * 0.19))
        center = float(rng.uniform(1700, 6000))
        grain = (0.75 * rng.normal(size=count)
                 + 0.25 * np.sin(2 * np.pi * center * dt)) * env
        amp = min(float(rng.exponential(0.010)), 0.034)
        pan = float(rng.uniform(0.15, 0.85))
        drops[start:start + count, 0] += amp * math.sqrt(1 - pan) * grain
        drops[start:start + count, 1] += amp * math.sqrt(pan) * grain
    mix += drops

    # Low, steady ventilation and a faint electrical/mechanical station bed.
    vent = noise(rng, SECONDS, 95, 720, -1.05)
    vent *= 0.97 + 0.03 * np.sin(2 * np.pi * 0.11 * t)
    add_center(mix, vent, 0.014)
    hum = (np.sin(2 * np.pi * 110 * t + 0.018 * np.sin(2 * np.pi * 0.19 * t))
           + 0.22 * np.sin(2 * np.pi * 220 * t + 0.6))
    add_center(mix, hum, 0.0018)

    # One distant arrival: approach, decelerating rolling texture, gentle braking.
    train_env = smooth((t - 16) / 15) * (1.0 - smooth((t - 34) / 11))
    rumble = noise(rng, SECONDS, 65, 1150, -0.8)
    wheel_phase = 2 * np.pi * (8.0 * t - 0.07 * t * t)
    wheel_texture = 0.83 + 0.12 * np.sin(wheel_phase) + 0.05 * np.sin(1.93 * wheel_phase)
    train = rumble * train_env * wheel_texture * 0.036
    traction_phase = np.cumsum(2 * np.pi * (210 - 100 * smooth((t - 23) / 17)) / FS)
    train += 0.0021 * train_env * np.sin(traction_phase)
    train = room(train)
    pan = 0.42 + 0.12 * smooth((t - 18) / 20)
    mix[:, 0] += train * np.sqrt(1.0 - pan)
    mix[:, 1] += train * np.sqrt(pan)

    brake_env = smooth((t - 29) / 6) * (1.0 - smooth((t - 36) / 6))
    brake_noise = noise(rng, SECONDS, 800, 3100, -0.3)
    brake_frequency = 1500 - 330 * smooth((t - 30) / 10)
    brake_phase = np.cumsum(2 * np.pi * brake_frequency / FS)
    brake = (0.0065 * brake_noise
             + 0.0011 * np.sin(brake_phase + 0.6 * np.sin(2 * np.pi * 3.7 * t))
             + 0.00045 * np.sin(1.47 * brake_phase)) * brake_env
    add_center(mix, room(brake), 1.0)

    # Air release is distant and gradual, without a horn or abrupt impact.
    release_env = smooth((t - 39) / 1.4) * (1.0 - smooth((t - 41) / 3.5))
    add_center(mix, noise(rng, SECONDS, 350, 3200, -0.6) * release_env, 0.009)

    # Master fade and DC removal; no automatic loop is included.
    mix -= np.mean(mix, axis=0)
    fade = smooth(t / 4) * (1.0 - smooth((t - 53) / 7))
    mix *= fade[:, None]
    mix[0] = 0
    mix[-1] = 0
    return mix


def write_wav(path, samples):
    pcm = np.rint(np.clip(samples, -1, 1) * 32767).astype('<i2')
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(FS)
        wav.writeframes(pcm.tobytes())


def command(args):
    r = subprocess.run(args, capture_output=True, text=True, check=True)
    return r.stderr


def loudness_json(stderr):
    start = stderr.rfind('{')
    return json.loads(stderr[start:stderr.index('}', start) + 1])


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--ffmpeg', required=True)
    p.add_argument('--out', type=Path, default=Path(__file__).resolve().parent)
    args = p.parse_args()
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    raw = out / 'last-train-home-60s-premaster.wav'
    final = out / 'last-train-home-60s.wav'
    mp3 = out / 'last-train-home-60s.mp3'
    if any(x.exists() for x in [raw, final, mp3, out / 'provenance.json']):
        raise SystemExit('Output already exists; choose a new version directory.')
    scene = make_scene()
    pre_rms = float(np.sqrt(np.mean(scene * scene)))
    pre_peak = float(np.max(np.abs(scene)))
    if not np.isfinite(scene).all() or pre_peak >= 0.95 or pre_rms <= 0:
        raise RuntimeError('Invalid premaster or excessive amplitude')
    write_wav(raw, scene)
    del scene

    common = [args.ffmpeg, '-hide_banner', '-nostdin']
    first = command(common + ['-i', str(raw), '-af',
                    'loudnorm=I=-24:TP=-5:LRA=7:print_format=json', '-f', 'null', '-'])
    measurement = loudness_json(first)
    measured = ':'.join(f'measured_{key}={measurement[value]}' for key, value in [
        ('I', 'input_i'), ('TP', 'input_tp'), ('LRA', 'input_lra'), ('thresh', 'input_thresh')])
    filt = ('loudnorm=I=-24:TP=-5:LRA=7:' + measured
            + ':offset=' + measurement['target_offset'] + ':linear=true:print_format=json')
    second = command(common + ['-i', str(raw), '-af', filt, '-ar', str(FS),
                     '-c:a', 'pcm_s16le', '-metadata', 'title=Last train home - 60 second preview',
                     str(final)])
    command(common + ['-i', str(final), '-c:a', 'libmp3lame', '-b:a', '128k',
            '-metadata', 'title=Last train home - 60 second preview', str(mp3)])

    checks = {}
    for file in [final, mp3]:
        stats = command(common + ['-i', str(file), '-af',
                        'loudnorm=I=-24:TP=-5:LRA=7:print_format=json', '-f', 'null', '-'])
        checks[file.name] = loudness_json(stats)
    with wave.open(str(final), 'rb') as wav:
        channels, fs, frames = wav.getnchannels(), wav.getframerate(), wav.getnframes()
        data = np.frombuffer(wav.readframes(frames), dtype='<i2').reshape(-1, channels)
    if fs != FS or channels != 2 or frames != N:
        raise RuntimeError('Final WAV does not have the requested exact duration/format')
    if int(np.max(np.abs(data.astype(np.int32)))) >= 32767:
        raise RuntimeError('Clipping detected')
    if not np.all(data[0] == 0) or not np.all(data[-1] == 0):
        raise RuntimeError('Audio edges are not silent')
    for stats in checks.values():
        if float(stats['input_tp']) > -4.0 or abs(float(stats['input_i']) + 24) > 1.0:
            raise RuntimeError('Encoded audio exceeds selected offline level limits')

    receipt = {
        'title': 'Last train home - 60-second atmosphere preview v1',
        'kind': 'original procedural audio, not a field recording',
        'date': '2026-10-25', 'seed': SEED,
        'durationSeconds': frames / fs, 'sampleRateHz': fs, 'channels': channels,
        'sources': 'Original NumPy synthesis in render_preview.py; no downloaded samples, voices or music.',
        'content': ['sheltered rain', 'canopy/glass patter', 'low station ventilation',
                    'one distant train approach, braking and air release'],
        'cueSeconds': {'fadeIn': [0, 4], 'train': [16, 45], 'brakes': [29, 42],
                       'airRelease': [39, 44.5], 'fadeOut': [53, 60]},
        'announcements': False, 'automaticLoop': False,
        'normalization': {'targetIntegratedLufs': -24, 'targetTruePeakDbtp': -5,
                          'method': 'FFmpeg loudnorm two-pass'},
        'premaster': {'rms': pre_rms, 'samplePeak': pre_peak},
        'measurements': checks,
        'validation': {'exactWavFrames': frames, 'clippedSamples': 0,
                       'firstAndLastFrameSilent': True,
                       'bothFormatsDecodedByFfmpeg': True,
                       'auditionedByAgent': False, 'testedOnPhoneOrBulbs': False},
        'files': {x.name: {'bytes': x.stat().st_size, 'sha256': digest(x)}
                  for x in [raw, final, mp3]},
        'generatorSha256': digest(Path(__file__)),
        'limitations': ['Offline measurements do not establish audible comfort or realism.',
                        'No Bluetooth pairing, playback, IR send, installation or public upload performed.'],
    }
    (out / 'provenance.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'durationSeconds': frames / fs, 'sampleRateHz': fs,
                      'files': list(receipt['files']),
                      'wavLufs': checks[final.name]['input_i'],
                      'mp3TruePeakDbtp': checks[mp3.name]['input_tp'],
                      'devicePlayback': False}))


if __name__ == '__main__':
    main()
