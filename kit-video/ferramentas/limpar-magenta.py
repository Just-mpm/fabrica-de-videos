"""Apaga a tela magenta de um mockup e deixa o furo transparente.

Uso:
    py -3 ferramentas\\limpar-magenta.py assets\\desenhos\\celular.png

Para que serve: a tela do mockup é gerada em magenta chapado (#FF00FF) para
poder ser medida por cor. Medida a área, o magenta não precisa mais existir —
a peça pinta o fundo por cima. Deixar o magenta no arquivo é o que faz aparecer
aquele contorno rosa quando a pintura fica 1 px menor que o furo.

O original é guardado em `assets/desenhos/_originais/<nome>-magenta.png` antes
da primeira limpeza (rodar de novo não sobrescreve a cópia).
"""

import os
import shutil
import sys

from PIL import Image


def limpar(caminho: str) -> None:
    raiz = os.path.dirname(caminho)
    guarda = os.path.join(raiz, "_originais")
    os.makedirs(guarda, exist_ok=True)
    copia = os.path.join(
        guarda, os.path.splitext(os.path.basename(caminho))[0] + "-magenta.png"
    )
    if not os.path.exists(copia):
        shutil.copy2(caminho, copia)

    im = Image.open(caminho).convert("RGBA")
    largura, altura = im.size
    p = im.load()

    for y in range(altura):
        for x in range(largura):
            r, g, b, a = p[x, y]
            magenta = min(r, b) - g  # quanto o pixel puxa para magenta
            t = (magenta - 25) / 90.0  # 0 = nada, 1 = magenta puro
            if t <= 0:
                continue
            t = min(t, 1.0)
            novo = int(round(a * (1.0 - t)))
            if novo <= 0:
                p[x, y] = (0, 0, 0, 0)
            else:
                k = 1.0 - t  # tira o rosa que sobrou, mantém o escuro
                p[x, y] = (int(r * k), int(g * k), int(b * k), novo)

    im.save(caminho)

    sobra = sum(
        1
        for y in range(altura)
        for x in range(largura)
        if (lambda q: q[3] > 20 and min(q[0], q[2]) - q[1] > 60)(p[x, y])
    )
    print(f"{caminho}: {largura}x{altura} · magenta restante: {sobra} px")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("uso: py -3 ferramentas\\limpar-magenta.py <imagem.png>")
        raise SystemExit(1)
    for alvo in sys.argv[1:]:
        limpar(alvo)
