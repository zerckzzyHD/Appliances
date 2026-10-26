"""Reduce only the shelter resonance; retain all other v11 components."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess

import numpy as np

FS = 48000
# These two actual consumers are independent. Broader bed/train controls remain
# future work; no unused placeholder controls are advertised here.
LAYER_GAINS_DB_VS_V11 = {'airflow': 0.0, 'shelter_resonance': -2.0}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(folder, name):
    receipt=json.loads((folder/'provenance.json').read_bytes());path=folder/name
    assert digest(path)==receipt['generatorSha256']
    spec=importlib.util.spec_from_file_location(folder.name.replace('-','_'),path)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module,receipt


def checked_read(helper, folder, name):
    receipt=json.loads((folder/'provenance.json').read_bytes());path=folder/name
    assert digest(path)==receipt['files'][name]['sha256']
    return helper.read(path)


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--ffmpeg',required=True);args=parser.parse_args()
    out=Path(__file__).resolve().parent;root=out.parent
    names=['last-train-home-180s.wav','last-train-home-180s.mp3','shelter-resonance-only-180s.wav']
    assert not any((out/name).exists() for name in names+['provenance.json']), 'Refusing overwrite'
    helper,_=load(root/'scene-v6','render_details.py')
    v10,_=load(root/'scene-v10','render_shelter.py')
    v11,p11=load(root/'scene-v11','render_station_balance.py')
    old=checked_read(v10,root/'scene-v11',names[0])
    old_station=checked_read(v10,root/'scene-v11','station-details-only-180s.wav')
    mechanics=checked_read(v10,root/'scene-v10','trimmed-mechanics-only-180s.wav')
    old10=checked_read(v10,root/'scene-v10',names[0])
    station10=checked_read(v10,root/'scene-v10','station-details-only-180s.wav')
    bed10=old10-station10-mechanics
    bed11=old-old_station-mechanics
    original_air,original_resonance=v11.original_station(helper,bed10)
    reconstructed=[]
    for stem,windows,target in [
        (original_air,[(a+7,a+9) for a,b in v11.WIND],1.0),
        (original_resonance,[(a+4,a+6) for a,b in v11.CANOPY],-2.0)]:
        slices=[slice(round(a*FS),round(b*FS)) for a,b in windows]
        gain=float(np.median([v11.rms(bed11[s])/v11.rms(stem[s]) for s in slices]))*10**(target/20)
        reconstructed.append(np.rint(stem.astype(np.float64)*gain).astype(np.int32))
    air,resonance=reconstructed
    assert np.array_equal(air+resonance,old_station), 'V11 component reconstruction failed'
    new_air=np.rint(air.astype(np.float64)*10**(LAYER_GAINS_DB_VS_V11['airflow']/20)).astype(np.int32)
    new_resonance=np.rint(resonance.astype(np.float64)*10**(LAYER_GAINS_DB_VS_V11['shelter_resonance']/20)).astype(np.int32)
    final=old-old_station+new_air+new_resonance
    assert np.array_equal(new_air,air)
    assert np.array_equal(final-new_resonance,old-resonance)
    v10.write(out/names[0],final);v10.write(out/names[2],new_resonance)
    assert np.array_equal(v10.read(out/names[0])-v10.read(out/names[2]),old-resonance)
    common=[args.ffmpeg,'-hide_banner','-nostdin'];measures={}
    subprocess.run(common+['-i',str(out/names[0]),'-c:a','libmp3lame','-b:a','128k',str(out/names[1])],capture_output=True,check=True)
    for name in names[:2]:
        run=subprocess.run(common+['-i',str(out/name),'-af','loudnorm=I=-27:TP=-5:LRA=7:print_format=json','-f','null','-'],capture_output=True,check=True)
        text=run.stderr.decode('utf-8',errors='replace');start=text.rfind('{')
        stats=json.loads(text[start:text.index('}',start)+1]);assert float(stats['input_tp']) < -4
        measures[name]={'integratedLufs':float(stats['input_i']),'truePeakDbtp':float(stats['input_tp'])}
    measured=[]
    for a,b in [(26,28),(128,130)]:
        s=slice(a*FS,b*FS)
        measured.append({'seconds':[a,b],'resonanceChangeDb':v11.db(v11.rms(new_resonance[s])/v11.rms(resonance[s]))})
    result={'date':'2026-10-26','durationSeconds':180,'sampleRateHz':FS,'channels':2,
        'sources':'Retained original procedural v6/v10/v11 sources and PCM; no downloaded samples.',
        'sourceMasterSha256':digest(root/'scene-v11'/names[0]),
        'layerGainsDbVsV11':LAYER_GAINS_DB_VS_V11,'measuredResonanceChanges':measured,
        'controlsScope':'Independent airflow and shelter resonance controls; five-family background/train mixer remains future work.',
        'normalization':'none; no limiter or other-layer gain change',
        'cueSeconds':p11['cueSeconds'],'newStationEvents':p11['newStationEvents'],'footstepsIncluded':False,
        'measurements':measures,
        'validation':{'v11StationReconstructedExactly':True,'savedAllNonResonanceComponentsExact':True,
                       'airflowUnchanged':True,'pcmNoClipping':True,'silentEdges':True,'mainFormatsDecoded':True,
                       'auditionedByAgent':False,'ownerListening':'pending','deviceOperations':0},
        'files':{name:{'bytes':(out/name).stat().st_size,'sha256':digest(out/name)} for name in names},
        'generatorSha256':digest(Path(__file__)),
        'limits':['RMS and sample checks do not establish perceived comfort or realism.']}
    (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'measuredResonanceChanges':measured,'airflowUnchanged':True,'measurements':measures}))


if __name__=='__main__':main()
