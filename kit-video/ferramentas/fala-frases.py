"""Imprime a fala em blocos de frase, com o tempo absoluto de cada palavra.

Uso:
    py -3 ferramentas\\fala-frases.py [inicio] [fim]

Lê `montagem/fala.json`; para outro arquivo, defina a variável de ambiente
`FALA` (ex.: FALA=montagem/fala-meu-video.json).

Sem argumentos, imprime tudo. Cada linha é uma frase (pausa > 0.42 s),
começando pelo tempo absoluto da primeira palavra.
"""

import json
import os
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
P = Path(os.environ.get("FALA") or BASE / "montagem" / "fala.json")

inicio = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
fim = float(sys.argv[2]) if len(sys.argv) > 2 else 1e9

falas = json.load(open(P, encoding="utf-8"))
falas = [f for f in falas if fim >= f["start"] >= inicio]

linhas = []
atual = []
anterior = None
for f in falas:
    if anterior is not None and f["start"] - anterior > 0.42:
        linhas.append(atual)
        atual = []
    atual.append(f)
    anterior = f["end"]
if atual:
    linhas.append(atual)


def mmss(t):
    m = int(t // 60)
    return f"{m}:{t - m * 60:05.2f}".replace(".", ",")


for grupo in linhas:
    t0 = grupo[0]["start"]
    cabeca = f"[{mmss(t0)}] "
    corpo = " ".join(f"{w['text']}" for w in grupo)
    print(cabeca + corpo)
