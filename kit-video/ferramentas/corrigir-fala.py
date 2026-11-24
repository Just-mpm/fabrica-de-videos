"""Ajusta a transcrição do TTS ao texto que foi mandado ler.

O Whisper erra nome próprio ("Sofia" por "Sofya", "Álvaro" por "Alvaru") e
número escrito ("20" onde o texto dizia "vinte"). Como a montagem ancora os
elementos na PALAVRA, a transcrição precisa ter a grafia do roteiro — senão o
`at: "sofya"` não resolve e o build falha.

O tempo é do Whisper (é ele quem ouviu o áudio); o texto é do roteiro. O
alinhamento é por sequência (difflib), então palavra trocada, faltando ou
sobrando não desalinha o resto.

Uso:
    py -3 ferramentas\\corrigir-fala.py ..\\videos\\<slug>\\roteiro.md work\\transcricoes\\<slug>
"""

import difflib
import json
import os
import re
import sys
import unicodedata

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def norm(t):
    t = unicodedata.normalize("NFD", str(t).lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", t)


def blocos_do_roteiro(caminho):
    texto = open(caminho, encoding="utf-8").read()
    partes = re.split(r"^## ", texto, flags=re.M)[1:]
    saida = []
    for parte in partes:
        titulo, _, corpo = parte.partition("\n")
        corpo = re.sub(r"<[^>]+>", " ", corpo)  # tags de expressão
        corpo = re.sub(r"^---.*$", " ", corpo, flags=re.M)
        palavras = corpo.split()
        if palavras:
            saida.append({"titulo": titulo.strip(), "palavras": palavras})
    return saida


def corrigir(roteiro, transcricao):
    a = [norm(p) for p in roteiro]
    b = [norm(p["text"]) for p in transcricao]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    faltando, trocadas = [], []
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                transcricao[j1 + k]["text"] = roteiro[i1 + k]
        elif op == "replace":
            for k in range(min(i2 - i1, j2 - j1)):
                trocadas.append((transcricao[j1 + k]["text"], roteiro[i1 + k]))
                transcricao[j1 + k]["text"] = roteiro[i1 + k]
            for k in range(j2 - j1 - (i2 - i1)):
                pass
            for k in range(i2 - i1 - (j2 - j1)):
                faltando.append(roteiro[i1 + j2 - j1 + k])
        elif op == "delete":
            faltando.extend(roteiro[i1:i2])
    return faltando, trocadas


def main():
    roteiro_path = sys.argv[1]
    pasta = sys.argv[2]
    blocos = blocos_do_roteiro(roteiro_path)
    arquivos = sorted(f for f in os.listdir(pasta) if f.endswith(".transcript.json"))
    print(f"{len(arquivos)} transcrição(ões) · {len(blocos)} bloco(s) no roteiro")
    for bloco, nome in zip(blocos, arquivos):
        caminho = os.path.join(pasta, nome)
        transcricao = json.load(open(caminho, encoding="utf-8-sig"))
        faltando, trocadas = corrigir(bloco["palavras"], transcricao)
        json.dump(
            transcricao,
            open(caminho, "w", encoding="utf-8"),
            ensure_ascii=False,
            indent=2,
        )
        print(f"\n--- {nome} · {bloco['titulo']}")
        print(f"    roteiro {len(bloco['palavras'])} · transcrito {len(transcricao)}")
        if trocadas:
            print("    corrigidas: " + ", ".join(f"{d}->{p}" for d, p in trocadas[:14]))
        if faltando:
            print("    sem tempo no áudio: " + ", ".join(faltando[:14]))


if __name__ == "__main__":
    main()
