import json, sys, os, glob

"""
Limpa transcrições do Whisper: o modelo às vezes repete um trecho inteiro
no fim do arquivo, com os tempos voltando para trás. A palavra existe uma
vez no áudio, mas aparece duas na transcrição — e o `fala.json` passa a
ancorar `t: { campo: "palavra" }` no lugar errado.

Sintoma: `start` menor que o `start` da palavra anterior.

Uso:
    py -3 ferramentas\\limpar-transcricao.py [pasta-ou-arquivo]

Padrão: work/transcricoes
Correções pontuais de grafia: edite o JSON na mão depois; os tempos não mudam.
"""

ALVO = (
    sys.argv[1]
    if len(sys.argv) > 1
    else os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "work",
        "transcricoes",
    )
)


def limpar(palavras):
    removidas = 0
    i = 1
    while i < len(palavras):
        if palavras[i]["start"] < palavras[i - 1]["start"] - 1e-6:
            # repetição imediata: procura o maior bloco que repete o anterior
            melhor = 0
            for L in range(1, 26):
                if i - L < 0 or i + L > len(palavras):
                    break
                if [w["text"] for w in palavras[i : i + L]] == [
                    w["text"] for w in palavras[i - L : i]
                ]:
                    melhor = L
            if melhor:
                del palavras[i : i + melhor]
                removidas += melhor
                continue
            del palavras[i]
            removidas += 1
            continue
        i += 1
    return removidas


def main():
    arquivos = (
        [ALVO]
        if os.path.isfile(ALVO)
        else sorted(glob.glob(os.path.join(ALVO, "*.transcript.json")))
    )
    for caminho in arquivos:
        palavras = json.load(open(caminho, encoding="utf-8-sig"))
        antes = len(palavras)
        n = limpar(palavras)
        if n:
            json.dump(
                palavras,
                open(caminho, "w", encoding="utf-8"),
                ensure_ascii=False,
                indent=2,
            )
        print(f"{os.path.basename(caminho)}: {antes} palavras, {n} removida(s)")


if __name__ == "__main__":
    main()
