"""Check retained asset bytes and PCM structure without playback or rendering."""
import array
import hashlib
import json
from pathlib import Path
import sys
import wave

root = Path(__file__).resolve().parent.parent
audio = root / "Bulb-Workbench" / "audio" / "last-train-home"
count = 0
versions = ("preview-v1", "preview-v2", "preview-v3", "scene-v4", "scene-v5", "scene-v6", "scene-v7", "scene-v8")
wav_count = 0
for version in versions:
    folder = audio / version
    duration = 180 if version.startswith("scene-") else 60
    generator = "render_scene.py" if version.startswith("scene-") else "render_preview.py"
    if version == "scene-v6":
        generator = "render_details.py"
    if version == "scene-v7":
        generator = "render_balance.py"
    if version == "scene-v8":
        generator = "render_coherent.py"
    receipt = json.loads((folder / "provenance.json").read_text(encoding="utf-8-sig"))
    for name, expected in receipt["files"].items():
        data = (folder / name).read_bytes()
        assert len(data) == expected["bytes"], (version, name, "size")
        assert hashlib.sha256(data).hexdigest() == expected["sha256"], (version, name, "hash")
        count += 1
    assert hashlib.sha256((folder / generator).read_bytes()).hexdigest() == receipt["generatorSha256"]
    wav_names = [f"last-train-home-{duration}s.wav"]
    if version in ("scene-v6", "scene-v7"):
        wav_names += ["last-train-home-180s-no-footsteps.wav", "footsteps-only-180s.wav"]
    if version == "scene-v8":
        wav_names += ["rail-texture-only-180s.wav", "mechanical-rattle-only-180s.wav"]
    for name in wav_names:
        with wave.open(str(folder / name), "rb") as wav:
            assert (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getnframes()) == (2, 2, 48000, duration * 48000)
            samples = array.array("h", wav.readframes(wav.getnframes()))
            if sys.byteorder != "little":
                samples.byteswap()
            assert all(value == 0 for value in samples[:2] + samples[-2:])
            assert max(samples) < 32767 and min(samples) > -32768
            wav_count += 1
history = root / "Bulb-Workbench/docs/history/GE-SPEAKER-BULB-IR-PLAN-2026-10-22.md"
assert hashlib.sha256(history.read_bytes()).hexdigest() == "8b679626fedcb5584b47a6b94f64ad838221ea9672c0af726fabb6d5334900e2"
print(json.dumps({"versions": len(versions), "audioHashes": count, "generatorHashes": len(versions), "wavFilesChecked": wav_count, "importedPlanHash": "match", "deviceOperations": 0}))
