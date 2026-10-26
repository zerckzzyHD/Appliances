"""Raise only the coherent v8 mechanical layers; export an unnormalized solo."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import wave

import numpy as np

FS = 48000
TARGET_DB = -3.0


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    with wave.open(str(path), 'rb') as wav:
        assert (wav.getframerate(), wav.getnchannels(), wav.getsampwidth(), wav.getnframes()) == (FS, 2, 2, 180*FS)
        return np.frombuffer(wav.readframes(wav.getnframes()), dtype='<i2').reshape(-1, 2).astype(np.int32)


def write(path, data):
    assert np.max(data) < 32767 and np.min(data) > -32768
    assert not np.any(data[0]) and not np.any(data[-1])
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(FS)
        wav.writeframes(data.astype('<i2').tobytes())


def rms(data):
    return float(np.sqrt(np.mean(np.square(data.astype(np.float64)))))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    out = Path(__file__).resolve().parent
    source = out.parent/'scene-v8'
    receipt = json.loads((source/'provenance.json').read_bytes())
    names = ['last-train-home-180s.wav', 'last-train-home-180s.mp3',
             'mechanics-only-30s.wav', 'mechanics-only-30s.mp3']
    assert not any((out/name).exists() for name in names + ['provenance.json']), 'Refusing overwrite'
    sources = ['last-train-home-180s.wav', 'rail-texture-only-180s.wav', 'mechanical-rattle-only-180s.wav']
    for name in sources:
        assert digest(source/name) == receipt['files'][name]['sha256']
    old, rail, rattle = [read(source/name) for name in sources]
    bed = old-rail-rattle
    new_stems = []
    calibration = {}
    for name, stem in [('rail', rail), ('rattle', rattle)]:
        body = receipt['linkedTextureCalibration'][name]['bodySeconds']
        active = slice(round(body[0]*FS), round(body[1]*FS))
        gain = rms(bed[active])*10**(TARGET_DB/20)/rms(stem[active])
        assert gain < 10**(12/20), 'Required boost exceeds selected 12 dB bound'
        adjusted = np.rint(stem.astype(np.float64)*gain).astype(np.int32)
        new_stems.append(adjusted)
        calibration[name] = {'bodySeconds': body, 'gainDbVsV8': float(20*np.log10(gain)),
                             'achievedVsTrainWindowBedDb': float(20*np.log10(rms(adjusted[active])/rms(bed[active])))}
    mechanics = new_stems[0]+new_stems[1]
    final = bed+mechanics
    assert np.array_equal(final-mechanics, bed)
    assert np.array_equal(final[:62*FS], old[:62*FS]) and np.array_equal(final[89*FS:], old[89*FS:])
    write(out/names[0], final)
    solo = mechanics[60*FS:90*FS]
    write(out/names[2], solo)
    assert np.array_equal(read(out/names[0])-bed, mechanics)
    measurements = {}
    common = [args.ffmpeg, '-hide_banner', '-nostdin']
    for wav, mp3 in [(names[0], names[1]), (names[2], names[3])]:
        subprocess.run(common+['-i', str(out/wav), '-c:a', 'libmp3lame', '-b:a', '128k', str(out/mp3)],
                       capture_output=True, check=True)
        for name in [wav,mp3]:
            run = subprocess.run(common+['-i', str(out/name), '-af',
                'loudnorm=I=-27:TP=-5:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, check=True)
            text = run.stderr.decode('utf-8', errors='replace'); start = text.rfind('{')
            stats = json.loads(text[start:text.index('}',start)+1])
            assert float(stats['input_tp']) < -4
            measurements[name] = {'integratedLufs': float(stats['input_i']), 'truePeakDbtp': float(stats['input_tp'])}
    result = {
        'date': '2026-10-26', 'durationSeconds': 180, 'sampleRateHz': FS, 'channels': 2,
        'sources': 'Retained v8 procedural PCM components; no downloaded samples.',
        'sourceHashes': {name:digest(source/name) for name in sources},
        'calibration': calibration, 'targetVsTrainWindowBedDb': TARGET_DB,
        'bedChange': 'None; saved master minus original detail stems retained exactly.',
        'normalization': 'none; no limiter, rain/train gain change or solo gain boost',
        'cueSeconds': {'train':[60,89], 'rail':[62,89], 'rattle':[73,86], 'fadeOut':[168,180]},
        'diagnostic': {'file':'mechanics-only-30s.mp3', 'durationSeconds':30,
                       'sourceSceneSeconds':[60,90], 'gainDbRelativeToMix':0,
                       'excludes':['rain','original train','station bed','footsteps']},
        'footstepsIncluded':False, 'measurements':measurements,
        'validation': {'unchangedOutsideDetailWindow':True, 'savedBedExact':True,
                       'pcmNoClipping':True, 'silentEdges':True, 'allFormatsDecoded':True,
                       'auditionedByAgent':False, 'ownerListening':'pending', 'deviceOperations':0},
        'files':{name:{'bytes':(out/name).stat().st_size, 'sha256':digest(out/name)} for name in names},
        'generatorSha256':digest(Path(__file__)),
        'limits':['RMS ratio is not proof of perceived audibility or realism.',
                  'Solo is an identification aid, not a normalized comparison or separate scene.']
    }
    (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'calibration':calibration,'measurements':measurements,'bedUnchanged':True}))


if __name__ == '__main__':
    main()
