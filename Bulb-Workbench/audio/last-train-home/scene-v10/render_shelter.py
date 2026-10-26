"""Offline v10: ease mechanics earlier; add wind-linked sheltered-station detail."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import wave

import numpy as np

FS = 48000
FRAMES = 180 * FS
MECHANICS_TRIM_DB = -1.5
WIND_WINDOWS = [(18, 36), (120, 143)]
CANOPY_WINDOWS = [(22, 35), (124, 142)]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    with wave.open(str(path), 'rb') as wav:
        assert (wav.getframerate(), wav.getnchannels(), wav.getsampwidth(), wav.getnframes()) == (FS, 2, 2, FRAMES)
        return np.frombuffer(wav.readframes(FRAMES), dtype='<i2').reshape(-1, 2).astype(np.int32)


def write(path, data):
    assert np.max(data) < 32767 and np.min(data) > -32768
    assert not np.any(data[0]) and not np.any(data[-1])
    with wave.open(str(path), 'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(FS)
        wav.writeframes(data.astype('<i2').tobytes())


def rms(x):
    return float(np.sqrt(np.mean(np.square(x.astype(np.float64)))))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', required=True)
    args = parser.parse_args()
    out = Path(__file__).resolve().parent
    root = out.parent
    names = ['last-train-home-180s.wav', 'last-train-home-180s.mp3',
             'station-details-only-180s.wav', 'trimmed-mechanics-only-180s.wav']
    assert not any((out/name).exists() for name in names+['provenance.json']), 'Refusing overwrite'
    sources = ['scene-v8/last-train-home-180s.wav', 'scene-v8/rail-texture-only-180s.wav',
               'scene-v8/mechanical-rattle-only-180s.wav', 'scene-v9/last-train-home-180s.wav']
    for name in sources:
        path = root/name
        receipt = json.loads((path.parent/'provenance.json').read_bytes())
        assert digest(path) == receipt['files'][path.name]['sha256']
    old, rail, rattle, previous = [read(root/name) for name in sources]
    bed = old-rail-rattle
    previous_mechanics = previous-bed
    module_path = root/'scene-v6/render_details.py'
    assert digest(module_path) == json.loads((module_path.parent/'provenance.json').read_bytes())['generatorSha256']
    spec = importlib.util.spec_from_file_location('owned_v6_noise',module_path)
    helper = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(helper)
    t = np.arange(FRAMES)/FS
    release = 1-helper.smooth((t-79)/6)
    mechanics = np.rint(previous_mechanics.astype(np.float64)
                        * 10**(MECHANICS_TRIM_DB/20) * release[:,None]).astype(np.int32)
    assert not np.any(mechanics[85*FS:])
    del t,release
    station = np.zeros_like(bed)
    rng = np.random.default_rng(261030)
    quiet_rms = rms(bed[50*FS:53*FS])
    events = []
    for (start,end),(canopy_start,canopy_end) in zip(WIND_WINDOWS,CANOPY_WINDOWS):
        local = np.arange((end-start)*FS)/FS
        envelope = helper.smooth(local/6)*(1-helper.smooth((local-(end-start-8))/8))
        # A slow airflow swell, not a whoosh/impact at the event boundary.
        airflow = helper.band_noise(rng,len(local),130,850) * envelope
        airflow *= 0.94+0.06*np.sin(2*np.pi*0.23*local)
        stereo = np.column_stack((airflow*np.sqrt(0.58),airflow*np.sqrt(0.42)))
        core = slice(7*FS,9*FS)
        stereo *= quiet_rms*10**(-5/20)/rms(stereo[core])
        station[start*FS:end*FS] += np.rint(stereo).astype(np.int32)
        c = np.arange((canopy_end-canopy_start)*FS)/FS
        ce = helper.smooth(c/3)*(1-helper.smooth((c-(canopy_end-canopy_start-5))/5))
        # Shelter-frame resonance follows each airflow swell with a slow onset.
        phase = 2*np.pi*(235*c+0.15*np.sin(2*np.pi*0.12*c))
        resonance = (np.sin(phase)+0.14*np.sin(2.03*phase))*ce
        resonance *= 0.92+0.08*np.sin(2*np.pi*0.31*c)
        cs = np.column_stack((resonance*np.sqrt(0.57),resonance*np.sqrt(0.43)))
        cs *= quiet_rms*10**(-8/20)/rms(cs[4*FS:6*FS])
        station[canopy_start*FS:canopy_end*FS] += np.rint(cs).astype(np.int32)
        events.append({'airflowSeconds':[start,end], 'airflowTargetVsQuietBedDb':-5,
                       'canopySeconds':[canopy_start,canopy_end], 'canopyTargetVsQuietBedDb':-8})
    assert not np.any(station[60*FS:90*FS]), 'New station layers must leave train window clear'
    final = bed+mechanics+station
    write(out/names[0],final)
    write(out/names[2],station)
    write(out/names[3],mechanics)
    assert np.array_equal(read(out/names[0])-read(out/names[2])-read(out/names[3]),bed)
    common = [args.ffmpeg,'-hide_banner','-nostdin']
    subprocess.run(common+['-i',str(out/names[0]),'-c:a','libmp3lame','-b:a','128k',str(out/names[1])],
                   capture_output=True,check=True)
    measures = {}
    for name in names[:2]:
        run = subprocess.run(common+['-i',str(out/name),'-af',
            'loudnorm=I=-27:TP=-5:LRA=7:print_format=json','-f','null','-'],capture_output=True,check=True)
        text=run.stderr.decode('utf-8',errors='replace');start=text.rfind('{')
        stats=json.loads(text[start:text.index('}',start)+1]);assert float(stats['input_tp']) < -4
        measures[name]={'integratedLufs':float(stats['input_i']),'truePeakDbtp':float(stats['input_tp'])}
    result={
        'date':'2026-10-26','durationSeconds':180,'sampleRateHz':FS,'channels':2,
        'sources':'Retained original PCM components plus original procedural airflow and shelter-frame resonance; no downloaded samples.',
        'sourceHashes':{name:digest(root/name) for name in sources},
        'helperGeneratorSha256':digest(module_path),'seed':261030,
        'mechanicsTrimDbVsV9':MECHANICS_TRIM_DB,'additionalMechanicsReleaseSeconds':[79,85],
        'normalization':'none; no limiter or original rain/train gain change',
        'newStationEvents':events,'quietBedReferenceSeconds':[50,53],
        'cueSeconds':{'masterFadeIn':[0,4],'continuousRainAndStationBed':[0,180],
                      'train':[60,89],'trainStrongest':[75,78],'railTexture':[62,85],
                      'braking':[73,86],'rattle':[73,85],'airRelease':[83,88.5],
                      'mechanicsExtraFade':[79,85],'masterFadeOut':[168,180]},
        'footstepsIncluded':False,'scatteredClicksIncluded':False,
        'measurements':measures,
        'validation':{'savedBedExact':True,'newStationLayersSilentDuringTrain':True,
                       'addedMechanicsSilentAfter85Seconds':True,'allWavFrames':FRAMES,
                       'pcmNoClipping':True,'silentEdges':True,'mainFormatsDecoded':True,
                       'auditionedByAgent':False,'ownerListening':'pending','deviceOperations':0},
        'files':{name:{'bytes':(out/name).stat().st_size,'sha256':digest(out/name)} for name in names},
        'generatorSha256':digest(Path(__file__)),
        'limits':['Original synthesis is not a field recording. Comfort, realism and train clarity await owner listening.',
                  'Wind-linked frame resonance is an artistic approximation, not a verified physical model.']
    }
    (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'mechanicsTrimDb':MECHANICS_TRIM_DB,'mechanicsExtraFade':[79,85],
                      'newEvents':events,'measurements':measures,'bedExact':True}))


if __name__ == '__main__':
    main()
