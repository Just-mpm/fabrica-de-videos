"""Imprime as palavras de um intervalo com o tempo de cada uma.

Uso:
    py -3 ferramentas\\palavras-cena.py 137 156 [passo]

Lê `montagem/fala.json`; para outro arquivo, defina `FALA`.
`passo` é quantas palavras por linha (padrão 12).
"""

import json
import os
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
falas = json.load(
    open(
        Path(os.environ.get("FALA") or BASE / "montagem" / "fala.json"),
        encoding="utf-8",
    )
)

a = float(sys.argv[1]) if len(sys.argv) > 1 else 0
b = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9
passo = int(sys.argv[3]) if len(sys.argv) > 3 else 12

sel = [f for f in falas if a <= f["start"] <= b]
linha = []
for i, f in enumerate(sel, 1):
    linha.append(f"{f['text']}@{f['start']:.2f}")
    if i % passo == 0:
        print("  ".join(linha))
        linha = []
if linha:
    print("  ".join(linha))
