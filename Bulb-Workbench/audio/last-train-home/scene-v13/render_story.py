"""Five-minute original station story; finite PA and no-PA alternatives."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import wave

import numpy as np

FS = 48000
SECONDS = 300
FRAMES = FS * SECONDS
# All entries have real consumers below; no automatic peak normalization.
LEVELS = {'tail_bed_db': 0.0, 'departure_db_vs_quiet': 7.0,
          'late_airflow_db_vs_quiet': -1.0, 'runoff_db_vs_quiet': -4.0,
          'resonance_db_vs_v12': 0.0, 'pa_db_vs_quiet': 1.0}
JOIN = (156, 168)
PA_STARTS = [44, 170]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rms(x):
    return float(np.sqrt(np.mean(np.square(x.astype(np.float64)))))


def db(x):
    return float(20*np.log10(max(x,1e-12)))


def smooth(x):
    x=np.clip(x,0,1)
    return x*x*(3-2*x)


def load(folder, filename):
    p=folder/filename;r=json.loads((folder/'provenance.json').read_bytes())
    assert digest(p)==r['generatorSha256']
    spec=importlib.util.spec_from_file_location(folder.name.replace('-','_'),p)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    return module


def read_pcm(path, start=0, count=None):
    with wave.open(str(path),'rb') as w:
        assert (w.getframerate(),w.getnchannels(),w.getsampwidth())==(FS,2,2)
        w.setpos(round(start*FS));data=w.readframes(round(count*FS) if count else w.getnframes())
        return np.frombuffer(data,dtype='<i2').reshape(-1,2).astype(np.int32)


def write_pcm(path, data):
    assert np.max(data)<32767 and np.min(data)>-32768
    assert not np.any(data[0]) and not np.any(data[-1])
    with wave.open(str(path),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(FS)
        w.writeframes(data.astype('<i2').tobytes())


def pan_mono(signal, pan):
    return np.column_stack((signal*np.sqrt(1-pan),signal*np.sqrt(pan)))


def scale_core(signal, target, begin, end):
    signal*=target/rms(signal[round(begin*FS):round(end*FS)])
    return signal


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--ffmpeg',required=True);args=parser.parse_args()
    out=Path(__file__).resolve().parent;root=out.parent
    names=['last-train-home-300s.wav','last-train-home-300s.mp3',
           'last-train-home-300s-no-pa.wav','last-train-home-300s-no-pa.mp3']
    assert not any((out/name).exists() for name in names+['provenance.json']), 'Refusing overwrite'
    p12=json.loads((root/'scene-v12/provenance.json').read_bytes())
    source=root/'scene-v12/last-train-home-180s.wav'
    resonance_source=root/'scene-v12/shelter-resonance-only-180s.wav'
    for p in [source,resonance_source]:assert digest(p)==p12['files'][p.name]['sha256']
    old=read_pcm(source);quiet=rms(old[50*FS:53*FS])/32767
    resonance_rms=rms(read_pcm(resonance_source,26,2))/32767
    synth=load(root/'scene-v5','render_scene.py')
    noise_helper=load(root/'scene-v6','render_details.py')
    rng=np.random.default_rng(261031)
    tail_seconds=SECONDS-JOIN[0]
    local=np.arange(tail_seconds*FS)/FS;t=local+JOIN[0]
    tail=np.zeros((len(local),2),dtype=np.float64)
    # Same rain/ventilation bands and relative coefficients as the existing scene.
    rain_gain=synth.RAIN_TRIM*10**(-3/20)*0.7186210417545735
    common_rain=synth.noise(rng,tail_seconds,280,9500,-0.35)
    for ch in range(2):
        side=synth.noise(rng,tail_seconds,550,8200,-0.45)
        tail[:,ch]+=(0.024*common_rain+0.017*side)*rain_gain
    canopy=synth.noise(rng,tail_seconds,110,2400,-1.1)*0.010*rain_gain
    vent=synth.noise(rng,tail_seconds,95,720,-1.05)*0.014*0.7186210417545735
    hum=(np.sin(2*np.pi*110*t)+0.22*np.sin(2*np.pi*220*t+0.6))*0.0018*0.7186210417545735
    tail+=pan_mono(canopy+vent+hum,0.5)*np.sqrt(2)
    # Many softened roof contacts preserve the retained patter density.
    for _ in range(round(95*tail_seconds)):
        begin=int(rng.integers(0,len(local)-round(0.07*FS)))
        duration=float(rng.uniform(0.008,0.042));n=round(duration*FS);dt=np.arange(n)/FS
        envelope=smooth(dt/0.0015)*np.exp(-dt/(duration*0.19))
        center=float(rng.uniform(1700,6000))
        grain=(0.75*rng.normal(size=n)+0.25*np.sin(2*np.pi*center*dt))*envelope
        amp=min(float(rng.exponential(0.010)),0.034)*0.5*rain_gain
        pan=float(rng.uniform(0.15,0.85))
        tail[begin:begin+n]+=pan_mono(grain,pan)*amp
    tail-=np.mean(tail,axis=0)
    tail*=quiet/rms(tail[:12*FS])*10**(LEVELS['tail_bed_db']/20)
    # Weather stays neutral through the join, then changes gradually after departure.
    weather=1-0.18*smooth((t-235)/15)*(1-smooth((t-270)/15))
    tail*=weather[:,None]
    base=np.zeros((FRAMES,2),dtype=np.float64)
    base[:JOIN[1]*FS]=old[:JOIN[1]*FS]/32767
    cross=12*FS;theta=np.linspace(0,np.pi/2,cross,endpoint=False)
    base[JOIN[0]*FS:JOIN[1]*FS]*=np.cos(theta)[:,None]
    base[JOIN[0]*FS:JOIN[1]*FS]+=tail[:cross]*np.sin(theta)[:,None]
    base[JOIN[1]*FS:]=tail[cross:]
    # One shared acceleration/distance trajectory drives departure motor and wheels.
    start,end=185,228;u=np.arange((end-start)*FS)/FS
    acceleration=smooth(u/20);distance=1-smooth((u-18)/25)
    motion=smooth(u/8)*distance
    wheel_rate=1.2+6.0*acceleration
    wheel_phase=np.cumsum(2*np.pi*wheel_rate/FS)
    motor_phase=np.cumsum(2*np.pi*(105+180*acceleration)/FS)
    rolling=noise_helper.band_noise(rng,len(u),70,1400)*(0.83+0.12*np.sin(wheel_phase)+0.05*np.sin(1.93*wheel_phase))
    motor=np.sin(motor_phase)+0.16*np.sin(2*motor_phase)
    departure=(rolling+0.13*motor)*motion
    depart_stereo=pan_mono(departure,0.48+0.18*acceleration)
    scale_core(depart_stereo,quiet*10**(LEVELS['departure_db_vs_quiet']/20),12,20)
    base[start*FS:end*FS]+=depart_stereo
    # Gust, frame response and lagging continuous roof runoff form one weather event.
    start,end=235,265;u=np.arange((end-start)*FS)/FS
    gust_env=smooth(u/7)*(1-smooth((u-20)/10))
    gust=noise_helper.band_noise(rng,len(u),130,850)*gust_env
    gust_stereo=pan_mono(gust,0.42)
    scale_core(gust_stereo,quiet*10**(LEVELS['late_airflow_db_vs_quiet']/20),10,16)
    base[start*FS:end*FS]+=gust_stereo
    start,end=247,265;u=np.arange((end-start)*FS)/FS
    env=smooth(u/3)*(1-smooth((u-13)/5))
    phase=2*np.pi*(235*u+0.15*np.sin(2*np.pi*0.12*u))
    frame=(np.sin(phase)+0.14*np.sin(2.03*phase))*env*(0.92+0.08*np.sin(2*np.pi*0.31*u))
    frame_stereo=pan_mono(frame,0.43)
    scale_core(frame_stereo,resonance_rms*10**(LEVELS['resonance_db_vs_v12']/20),4,6)
    base[start*FS:end*FS]+=frame_stereo
    start,end=243,275;u=np.arange((end-start)*FS)/FS
    runoff_env=smooth(u/6)*(1-smooth((u-22)/10))
    runoff=noise_helper.band_noise(rng,len(u),450,3600)*runoff_env*(0.88+0.12*np.sin(2*np.pi*0.65*u))
    runoff_stereo=pan_mono(runoff,0.60)
    scale_core(runoff_stereo,quiet*10**(LEVELS['runoff_db_vs_quiet']/20),9,16)
    base[start*FS:end*FS]+=runoff_stereo
    # Deliberate finite ending, not a loop or autoplay instruction.
    fade=1-smooth((np.arange(15*FS)/FS)/15)
    base[285*FS:]*=fade[:,None];base[-1]=0
    base_pcm=np.rint(base*32767).astype(np.int32)
    assert np.array_equal(base_pcm[:156*FS],old[:156*FS])
    del base,tail,common_rain,canopy,vent,hum
    pa=np.zeros_like(base_pcm);pa_events=[]
    speech=json.loads((out/'speech-provenance.json').read_bytes())
    common=[args.ffmpeg,'-hide_banner','-nostdin']
    for line,when in zip(speech['lines'],PA_STARTS):
        p=out/line['file']
        run=subprocess.run(common+['-i',str(p),'-af','highpass=f=400,lowpass=f=3200',
            '-ar',str(FS),'-ac','1','-f','f32le','pipe:1'],capture_output=True,check=True)
        voice=np.frombuffer(run.stdout,dtype='<f4').astype(np.float64)
        active=np.abs(voice)>np.max(np.abs(voice))*0.03
        voice*=quiet*10**(LEVELS['pa_db_vs_quiet']/20)/rms(voice[active])
        voice*=smooth(np.arange(len(voice))/FS/0.04)*(1-smooth((np.arange(len(voice))/FS-(len(voice)/FS-0.08))/0.08))
        reverbed=np.pad(voice,(0,round(0.24*FS)))
        for delay,gain in [(0.071,0.18),(0.137,0.09),(0.24,0.04)]:
            d=round(delay*FS);reverbed[d:d+len(voice)]+=voice*gain
        samples=np.rint(pan_mono(reverbed,0.56)*32767).astype(np.int32)
        finish=when+len(samples)/FS
        assert finish < (60 if when==44 else 185)
        pa[when*FS:when*FS+len(samples)]+=samples
        pa_events.append({'startSeconds':when,'endSeconds':finish,'text':line['text'],'sourceSha256':digest(p)})
    with_pa=base_pcm+pa
    write_pcm(out/names[0],with_pa);write_pcm(out/names[2],base_pcm)
    assert np.array_equal(read_pcm(out/names[0])-read_pcm(out/names[2]),pa)
    pa_mask=np.any(pa!=0,axis=1)
    assert np.array_equal(with_pa[~pa_mask],base_pcm[~pa_mask])
    measures={}
    for wav,mp3 in [(names[0],names[1]),(names[2],names[3])]:
        subprocess.run(common+['-i',str(out/wav),'-c:a','libmp3lame','-b:a','128k',str(out/mp3)],capture_output=True,check=True)
        for name in [wav,mp3]:
            run=subprocess.run(common+['-i',str(out/name),'-af','loudnorm=I=-27:TP=-5:LRA=7:print_format=json','-f','null','-'],capture_output=True,check=True)
            text=run.stderr.decode('utf-8',errors='replace');a=text.rfind('{')
            stats=json.loads(text[a:text.index('}',a)+1]);assert float(stats['input_tp']) < -4
            measures[name]={'integratedLufs':float(stats['input_i']),'truePeakDbtp':float(stats['input_tp'])}
    join_levels=[]
    for a,b in [(144,156),(156,168),(168,180)]:
        join_levels.append({'seconds':[a,b],'rms':rms(base_pcm[a*FS:b*FS]),
            'dbVsQuietReference':db(rms(base_pcm[a*FS:b*FS])/(quiet*32767))})
    assert abs(join_levels[1]['dbVsQuietReference'])<2,'Transition level mismatch'
    result={'date':'2026-10-26','durationSeconds':SECONDS,'sampleRateHz':FS,'channels':2,
        'sources':'Retained original v12 master; original procedural tail/departure/weather; original scripted local Windows speech.',
        'sourceMasterSha256':digest(source),'sourceResonanceSha256':digest(resonance_source),
        'levels':LEVELS,'normalization':'none; tail bed calibration and bounded stem gains only, no limiter',
        'tailBedCalibration':'Same synthesis bands/coefficient proportions, matched quiet RMS; new noise realization with no perceptual continuity claim.',
        'preservedNoPaPrefixSeconds':[0,156],'transitionSeconds':list(JOIN),'transitionMeasurements':join_levels,
        'announcements':pa_events,'speechEngine':speech,
        'cueSeconds':{'fadeIn':[0,4],'existingAirflow':[[18,36],[120,143]],'existingResonance':[[22,35],[124,142]],
            'arrival':[60,89],'arrivalPeak':[75,78],'arrivalRail':[62,85],'arrivalBraking':[73,86],
            'arrivalRattle':[73,85],'arrivalMechanicsFade':[79,85],'arrivalAirRelease':[83,88.5],
            'departure':[185,228],'departureStrongest':[197,205],'lateAirflow':[235,265],
            'lateRainEaseAndReturn':[235,285],'roofRunoff':[243,275],'lateResonance':[247,265],'fadeOut':[285,300]},
        'footstepsIncluded':False,'hornsIncluded':False,'automaticLoop':False,
        'measurements':measures,
        'validation':{'exactFrames':FRAMES,'noPaPrefixExact':True,'paOnlyDifferenceExact':True,
            'paWindowsFit':True,'pcmNoClipping':True,'silentEdges':True,'allDeliveryFormatsDecoded':True,
            'auditionedByAgent':False,'ownerListening':'pending','deviceOperations':0},
        'files':{name:{'bytes':(out/name).stat().st_size,'sha256':digest(out/name)} for name in names+['pa-approach-raw.wav','pa-departure-raw.wav']},
        'generatorSha256':digest(Path(__file__)),
        'speechScriptSha256':digest(out/'render_pa.ps1'),
        'limits':['Causal realism, speech intelligibility, join smoothness and sleep comfort require owner listening.',
            'Five-minute finite scene; no seamless-loop claim or playback operation.']}
    (out/'provenance.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'durationSeconds':SECONDS,'announcements':pa_events,'transitionMeasurements':join_levels,'measurements':measures}))


if __name__=='__main__':main()
