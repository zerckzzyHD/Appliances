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
for version in ("preview-v1", "preview-v2", "preview-v3"):
    folder = audio / version
    receipt = json.loads((folder / "provenance.json").read_text(encoding="utf-8-sig"))
    for name, expected in receipt["files"].items():
        data = (folder / name).read_bytes()
        assert len(data) == expected["bytes"], (version, name, "size")
        assert hashlib.sha256(data).hexdigest() == expected["sha256"], (version, name, "hash")
        count += 1
    assert hashlib.sha256((folder / "render_preview.py").read_bytes()).hexdigest() == receipt["generatorSha256"]
    with wave.open(str(folder / "last-train-home-60s.wav"), "rb") as wav:
        assert (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getnframes()) == (2, 2, 48000, 2880000)
        samples = array.array("h", wav.readframes(wav.getnframes()))
        if sys.byteorder != "little":
            samples.byteswap()
        assert all(value == 0 for value in samples[:2] + samples[-2:])
        assert max(samples) < 32767 and min(samples) > -32768
history = root / "Bulb-Workbench/docs/history/GE-SPEAKER-BULB-IR-PLAN-2026-10-22.md"
assert hashlib.sha256(history.read_bytes()).hexdigest() == "8b679626fedcb5584b47a6b94f64ad838221ea9672c0af726fabb6d5334900e2"
print(json.dumps({"versions": 3, "audioHashes": count, "generatorHashes": 3, "wavMasters": 3, "importedPlanHash": "match", "deviceOperations": 0}))
