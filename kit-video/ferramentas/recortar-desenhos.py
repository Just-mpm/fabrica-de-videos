"""Prepara os desenhos de peça (assets/desenhos/).

Cada arquivo aqui é um desenho gerado (objeto, aparelho, ícone grande) que uma
peça usa como imagem. Duas coisas, nesta ordem:

1. recorta a margem transparente — assim `w` da peça é a largura do desenho, não
   do quadro, e o mesmo `w` quer dizer a mesma coisa em todo desenho;
2. reduz o lado maior para 900 px — o desenho aparece com no máximo ~600 px no
   filme, então 1500 px só pesa no build.

A pasta é só de desenho de peça: `assets/imagens/` (imagem solta de outros
vídeos) e `assets/personagem/` (poses do personagem) não são tocadas.

Os originais ficam em assets/desenhos/_originais/ na primeira execução.

Uso:
    py -3 ferramentas\\recortar-desenhos.py --seco   (só mostra)
    py -3 ferramentas\\recortar-desenhos.py          (grava)
"""

import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent.parent
PASTA = BASE / "assets" / "desenhos"
ORIGINAIS = PASTA / "_originais"
LADO = 900
MARGEM = 0.02  # 2% do conteúdo, em volta

seco = "--seco" in sys.argv


def preparar(caminho: Path) -> str:
    img = Image.open(caminho).convert("RGBA")
    antes = img.size
    caixa = img.split()[-1].getbbox()
    if not caixa:
        return f"{caminho.name}: vazio"
    esq, topo, dir_, base = caixa
    folga = round(max(base - topo, dir_ - esq) * MARGEM)
    esq = max(0, esq - folga)
    topo = max(0, topo - folga)
    dir_ = min(img.width, dir_ + folga)
    base = min(img.height, base + folga)
    img = img.crop((esq, topo, dir_, base))

    if max(img.size) > LADO:
        f = LADO / max(img.size)
        img = img.resize((round(img.width * f), round(img.height * f)), Image.LANCZOS)

    if seco:
        return f"{caminho.name}: {antes} -> {img.size} (seco)"

    ORIGINAIS.mkdir(parents=True, exist_ok=True)
    guardado = ORIGINAIS / caminho.name
    if not guardado.exists():
        Image.open(caminho).save(guardado)
    img.save(caminho, optimize=True)
    return f"{caminho.name}: {antes} -> {img.size}"


for p in sorted(PASTA.glob("*.png")):
    print(preparar(p))
