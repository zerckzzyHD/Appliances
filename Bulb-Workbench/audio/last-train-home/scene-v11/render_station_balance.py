"""Offline station balance candidate; preserve train/mechanics and all timings."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess

import numpy as np

FS = 48000
RAIN_DB = -1.5
WIND = [(18,36),(120,143)]
CANOPY = [(22,35),(124,142)]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(folder, filename):
    receipt=json.loads((folder/'provenance.json').read_bytes());p=folder/filename
    assert digest(p)==receipt['generatorSha256']
    spec=importlib.util.spec_from_file_location(folder.name.replace('-','_'),p)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module,receipt


def rms(data):
    return float(np.sqrt(np.mean(np.square(data.astype(np.float64)))))


def db(ratio):
    return float(20*np.log10(max(ratio,1e-12)))


def original_station(helper, bed):
    airflow_layer=np.zeros_like(bed);canopy_layer=np.zeros_like(bed)
    rng=np.random.default_rng(261030);quiet_rms=rms(bed[50*FS:53*FS])
    for (start,end),(canopy_start,canopy_end) in zip(WIND,CANOPY):
        local=np.arange((end-start)*FS)/FS
        envelope=helper.smooth(local/6)*(1-helper.smooth((local-(end-start-8))/8))
        airflow=helper.band_noise(rng,len(local),130,850)*envelope
        airflow*=0.94+0.06*np.sin(2*np.pi*0.23*local)
        stereo=np.column_stack((airflow*np.sqrt(0.58),airflow*np.sqrt(0.42)))
        stereo*=quiet_rms*10**(-5/20)/rms(stereo[7*FS:9*FS])
        airflow_layer[start*FS:end*FS]+=np.rint(stereo).astype(np.int32)
        c=np.arange((canopy_end-canopy_start)*FS)/FS
        ce=helper.smooth(c/3)*(1-helper.smooth((c-(canopy_end-canopy_start-5))/5))
        phase=2*np.pi*(235*c+0.15*np.sin(2*np.pi*0.12*c))
        resonance=(np.sin(phase)+0.14*np.sin(2.03*phase))*ce
        resonance*=0.92+0.08*np.sin(2*np.pi*0.31*c)
        cs=np.column_stack((resonance*np.sqrt(0.57),resonance*np.sqrt(0.43)))
        cs*=quiet_rms*10**(-8/20)/rms(cs[4*FS:6*FS])
        canopy_layer[canopy_start*FS:canopy_end*FS]+=np.rint(cs).astype(np.int32)
    return airflow_layer,canopy_layer


def calibrate(stem, bed, rain, windows, target):
    slices=[slice(round(a*FS),round(b*FS)) for a,b in windows]
    gain=float(np.median([rms(bed[s])/rms(stem[s]) for s in slices]))*10**(target/20)
    assert db(gain)<12, 'Requested boost exceeds 12 dB bound'
    result=np.rint(stem.astype(np.float64)*gain).astype(np.int32)
    rows=[{'seconds':window,'vsUnderlyingBedDb':db(rms(result[s])/rms(bed[s])),
           'vsRainOnlyDb':db(rms(result[s])/rms(rain[s]))} for window,s in zip(windows,slices)]
    return result,{'gainDbVsV10':db(gain),'targetVsUnderlyingBedDb':target,'coreWindows':rows}


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--ffmpeg',required=True);args=parser.parse_args()
    out=Path(__file__).resolve().parent;root=out.parent
    names=['last-train-home-180s.wav','last-train-home-180s.mp3','station-details-only-180s.wav',
           'station-only-30s.wav','station-only-30s.mp3']
    assert not any((out/name).exists() for name in names+['provenance.json']), 'Refusing overwrite'
    v10,_=load(root/'scene-v10','render_shelter.py')
    helper,_=load(root/'scene-v6','render_details.py')
    v5,p5=load(root/'scene-v5','render_scene.py')
    source_names=['last-train-home-180s.wav','station-details-only-180s.wav','trimmed-mechanics-only-180s.wav']
    p10=json.loads((root/'scene-v10/provenance.json').read_bytes())
    for name in source_names:assert digest(root/'scene-v10'/name)==p10['files'][name]['sha256']
    old,old_station,mechanics=[v10.read(root/'scene-v10'/name) for name in source_names]
    old_bed=old-old_station-mechanics
    original=v5.make_scene()
    premaster=root/'scene-v5/last-train-home-180s-premaster.wav'
    assert digest(premaster)==p5['files'][premaster.name]['sha256']
    assert np.array_equal(np.rint(original*32767).astype('<i2'),v10.read(premaster))
    prior_trim=v5.RAIN_TRIM;v5.RAIN_TRIM=0;zero_rain=v5.make_scene();v5.RAIN_TRIM=prior_trim
    rain=original-zero_rain;assert np.allclose(zero_rain+rain,original,rtol=0,atol=1e-14)
    old_rain=rain*p5['normalization']['fixedGain']*32767*10**(-1.5/20)
    bed=old_bed+np.rint(old_rain*(10**(RAIN_DB/20)-1)).astype(np.int32)
    new_rain=old_rain*10**(RAIN_DB/20)
    composition=[]
    for a,b in [(7,15),(45,53),(100,108),(153,165)]:
        s=slice(a*FS,b*FS)
        composition.append({'seconds':[a,b],'oldRainRms':rms(old_rain[s]),
            'oldNonRainBedRms':rms(old_bed[s]-old_rain[s]),
            'underlyingBedChangeDb':db(rms(bed[s])/rms(old_bed[s]))})
    # Composition is measured before calibration, without new station layers.
    print(json.dumps({'backgroundComposition':composition,'rainLayerChangeDb':RAIN_DB}),flush=True)
    del original,zero_rain,rain,old_rain
    airflow,canopy=original_station(helper,old_bed)
    assert np.array_equal(airflow+canopy,old_station), 'Original station PCM mismatch'
    airflow,air_stats=calibrate(airflow,bed,new_rain,[(a+7,a+9) for a,b in WIND],1.0)
    canopy,canopy_stats=calibrate(canopy,bed,new_rain,[(a+4,a+6) for a,b in CANOPY],-2.0)
    station=airflow+canopy;final=bed+mechanics+station
    overlaps=[]
    for a,b in [(26,28),(128,130)]:
        s=slice(a*FS,b*FS);overlaps.append({'seconds':[a,b],
            'combinedStationVsUnderlyingBedDb':db(rms(station[s])/rms(bed[s]))})
    fades=[]
    for a,b in [(18,21),(33,36),(120,123),(140,143)]:
        s=slice(a*FS,b*FS);fades.append({'seconds':[a,b],
            'combinedStationVsUnderlyingBedDb':db(rms(station[s])/rms(bed[s]))})
    assert not np.any(station[60*FS:90*FS])
    v10.write(out/names[0],final);v10.write(out/names[2],station)
    solo=station[12*FS:42*FS];v10.write(out/names[3],solo)
    assert np.array_equal(v10.read(out/names[0])-v10.read(out/names[2])-mechanics,bed)
    common=[args.ffmpeg,'-hide_banner','-nostdin'];measures={}
    for wav,mp3 in [(names[0],names[1]),(names[3],names[4])]:
        subprocess.run(common+['-i',str(out/wav),'-c:a','libmp3lame','-b:a','128k',str(out/mp3)],capture_output=True,check=True)
        for name in [wav,mp3]:
            run=subprocess.run(common+['-i',str(out/name),'-af','loudnorm=I=-27:TP=-5:LRA=7:print_format=json','-f','null','-'],capture_output=True,check=True)
            text=run.stderr.decode('utf-8',errors='replace');start=text.rfind('{')
            stats=json.loads(text[start:text.index('}',start)+1]);assert float(stats['input_tp']) < -4
            measures[name]={'integratedLufs':float(stats['input_i']),'truePeakDbtp':float(stats['input_tp'])}
    result={'date':'2026-10-26','durationSeconds':180,'sampleRateHz':FS,'channels':2,
        'sources':'Retained procedural v5/v6/v10 components; no downloads or new scene events.',
        'sourceHashes':{name:digest(root/'scene-v10'/name) for name in source_names},
        'rainDbVsV10':RAIN_DB,'backgroundComposition':composition,
        'calibration':{'airflow':air_stats,'canopy':canopy_stats},'overlapMeasurements':overlaps,'fadeMeasurements':fades,
        'normalization':'none; no limiter or preserved non-rain bed/mechanics gain change',
        'cueSeconds':p10['cueSeconds'],
        'newStationEvents':[{'airflowSeconds':list(w),'canopySeconds':list(c)} for w,c in zip(WIND,CANOPY)],
        'diagnostic':{'durationSeconds':30,'sceneSeconds':[12,42],'gainRelativeToMixDb':0},
        'footstepsIncluded':False,'measurements':measures,
        'validation':{'v10StationReconstructedExactly':True,'savedBedExact':True,'preservedMechanicsExact':True,
                       'newStationSilentDuringTrain':True,'pcmNoClipping':True,'silentEdges':True,
                       'allFormatsDecoded':True,'auditionedByAgent':False,'ownerListening':'pending','deviceOperations':0},
        'files':{name:{'bytes':(out/name).stat().st_size,'sha256':digest(out/name)} for name in names},
        'generatorSha256':digest(Path(__file__)),
        'limits':['Rain-family reduction is not the same as total background reduction; constant non-rain bed is retained.',
                  'RMS and phase relationships do not establish perceived loudness, comfort or realism.']}
    (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'calibration':result['calibration'],'overlap':overlaps,'measurements':measures}))


if __name__=='__main__':main()
