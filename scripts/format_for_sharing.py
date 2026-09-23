import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
data_file = BASE_DIR / "data" / "call_scripts.json"

d = json.load(open(data_file, encoding='utf-8'))
for s in d['scripts']:
    print(f"*Script {s['id']}: {s['title']}*")
    for t in s['transcript']:
        print(f"*{t['speaker']}:* {t['line']}")
    print("-" * 40 + "\n")

