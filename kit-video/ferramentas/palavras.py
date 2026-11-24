import json, os, sys, wave

"""
Gera a tabela de leitura: palavra@segundo, com o offset de cada bloco somado
e grava o JSON que a montagem usa em `fala`.

Uso:
    py -3 ferramentas\\\\palavras.py [pasta-de-transcricoes] [pasta-de-audio] [saida-json]

Padrão:
    work/transcricoes/*.transcript.json  +  assets/audio/*.wav
    O nome do wav é associado ao json por prefixo (01-gancho.wav ↔ 01-gancho.transcript.json).
    Saída: montagem/fala.json

Antes de somar os offsets, cada transcrição passa pela mesma limpeza do
limpar-transcricao.py: o Whisper às vezes repete o fim do áudio com os tempos
voltando para trás, e sem isso a âncora por palavra aponta para o lugar errado.

O JSON gerado já tem os offsets somados, então a montagem usa:
    fala: [{ json: "montagem/fala.json", em: 0 }]
"""


def _carregar_limpeza():
    """Lê a limpeza direto do arquivo: importar criaria __pycache__ no kit."""
    caminho = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "limpar-transcricao.py"
    )
    espaco = {"__file__": caminho, "__name__": "limpar_transcricao"}
    with open(caminho, encoding="utf-8") as f:
        exec(compile(f.read(), caminho, "exec"), espaco)
    return espaco["limpar"]


limpar = _carregar_limpeza()


def sanear(palavras, prefixo, dur):
    """Corta repetição de cauda e palavra depois do fim do áudio."""
    fora_de_ordem = any(
        palavras[i]["start"] < palavras[i - 1]["start"] - 1e-6
        for i in range(1, len(palavras))
    )
    if fora_de_ordem:
        antes = len(palavras)
        removidas = limpar(palavras)
        print(
            f"  [aviso] {prefixo}: timestamps fora de ordem — "
            f"{removidas} de {antes} palavra(s) descartada(s) como repetição do Whisper"
        )
    if dur:
        antes = len(palavras)
        palavras = [p for p in palavras if p["start"] <= dur + 0.5]
        if len(palavras) != antes:
            print(
                f"  [aviso] {prefixo}: {antes - len(palavras)} palavra(s) depois do fim "
                f"do áudio ({dur:.2f}s) descartada(s)"
            )
    return palavras


BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, "work", "transcricoes")
AUDIO = sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE, "assets", "audio")
SAIDA = (
    sys.argv[3] if len(sys.argv) > 3 else os.path.join(BASE, "montagem", "fala.json")
)

GAP = 0.55  # pausa entre blocos na timeline


def duracao(caminho):
    with wave.open(caminho) as w:
        return w.getnframes() / w.getframerate()


def main():
    if not os.path.isdir(TRANS):
        print(f"pasta de transcrições não encontrada: {TRANS}")
        return

    jsons = sorted(f for f in os.listdir(TRANS) if f.endswith(".transcript.json"))
    if not jsons:
        print(f"nenhuma transcrição em {TRANS}")
        return

    offset = 0.0
    saida = []
    for nome in jsons:
        prefixo = nome[: -len(".transcript.json")]
        palavras = json.load(open(os.path.join(TRANS, nome), encoding="utf-8-sig"))

        wav = os.path.join(AUDIO, prefixo + ".wav")
        dur = (
            duracao(wav)
            if os.path.exists(wav)
            else max((p.get("end", 0) for p in palavras), default=0)
        )
        palavras = sanear(palavras, prefixo, dur if os.path.exists(wav) else 0)

        print(f"--- {prefixo} (off {offset:.2f}) ---")
        linha = []
        for p in palavras:
            linha.append(f"{p['text']}@{offset + p['start']:.2f}")
            saida.append(
                {
                    "text": p["text"],
                    "start": round(offset + p["start"], 3),
                    "end": round(offset + p.get("end", p["start"]), 3),
                }
            )
            if len(linha) == 9:
                print("  " + " ".join(linha))
                linha = []
        if linha:
            print("  " + " ".join(linha))

        offset += dur + GAP

    print(f"\ntotal estimado da narração: {offset - GAP:.2f}s")

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with open(SAIDA, "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)
    print(f"fala.json: {SAIDA} ({len(saida)} palavras)")


if __name__ == "__main__":
    main()
