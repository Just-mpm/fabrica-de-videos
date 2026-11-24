"""Recorta a margem transparente das poses do personagem.

A `figura` controla a altura, então uma pose quadrada e uma muito alta
renderizam presenças diferentes com o mesmo `altura`. Recortando a margem
transparente, a altura passa a ser a altura do personagem — e `altura: 800`
quer dizer a mesma coisa em toda pose.

Uso:
    py -3 ferramentas\\normalizar-poses.py --seco   (só mostra)
    py -3 ferramentas\\normalizar-poses.py          (grava)

Os originais vão para assets/personagem/_originais/ na primeira execução.
"""

import sys
from pathlib import Path

from PIL import Image

BASE = Path(__file__).resolve().parent.parent
PASTA = BASE / "assets" / "personagem"
ORIGINAIS = PASTA / "_originais"
IGNORAR = {"folha-de-personagem.png"}
MARGEM = 0.02  # 2% da altura do conteúdo, em volta
LADO = 1400  # lado maior da imagem final

seco = "--seco" in sys.argv


def recortar(caminho: Path):
    img = Image.open(caminho).convert("RGBA")
    caixa = img.split()[-1].getbbox()
    if not caixa:
        return img.size, img.size

    esq, topo, dir_, base = caixa
    folga = round((base - topo) * MARGEM)
    esq = max(0, esq - folga)
    topo = max(0, topo - folga)
    dir_ = min(img.width, dir_ + folga)
    base = min(img.height, base + folga)

    nova = img.crop((esq, topo, dir_, base))
    if max(nova.size) > LADO:
        f = LADO / max(nova.size)
        nova = nova.resize(
            (round(nova.width * f), round(nova.height * f)), Image.LANCZOS
        )

    antes = img.size
    depois = nova.size

    if depois == antes:
        return antes, depois

    if not seco:
        ORIGINAIS.mkdir(exist_ok=True)
        backup = ORIGINAIS / caminho.name
        if not backup.exists():
            Image.open(caminho).save(backup)
        nova.save(caminho, optimize=True)

    return antes, depois


def main() -> None:
    arquivos = sorted(p for p in PASTA.glob("*.png") if p.name not in IGNORAR)
    if not arquivos:
        print("nenhuma pose encontrada")
        return

    print(f"{'pose':24} {'antes':>12}  {'depois':>12}  proporção")
    mudou = 0
    for caminho in arquivos:
        antes, depois = recortar(caminho)
        mudou += antes != depois
        razao = depois[0] / depois[1]
        print(
            f"{caminho.stem:24} {antes[0]:5}x{antes[1]:<6}  {depois[0]:5}x{depois[1]:<6}  {razao:.2f}"
        )

    print(
        f"\n{mudou}/{len(arquivos)} recortada(s)"
        + (" — nada gravado (--seco)" if seco else "")
    )


if __name__ == "__main__":
    main()
