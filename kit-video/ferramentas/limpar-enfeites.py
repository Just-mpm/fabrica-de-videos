"""Remove enfeites soltos do PNG (faíscas, interrogações, halos) mantendo só o
personagem: pega o núcleo opaco do recorte, escolhe o maior componente conexo e
dilata essa área para preservar o antialiasing da borda.

Uso: py -3 ferramentas/limpar-enfeites.py assets/personagem/apontando.png [...]
"""

import sys
from collections import deque

from PIL import Image, ImageFilter

OPACO = 200  # alpha que já é tinta cheia
FOLGA = 24  # px de dilatação em volta do núcleo


def maior_componente(mascara, w, h):
    dados = list(mascara.getdata())
    visto = bytearray(w * h)
    melhor = []
    for inicio in range(w * h):
        if visto[inicio] or dados[inicio] == 0:
            continue
        fila = deque([inicio])
        visto[inicio] = 1
        ilha = []
        while fila:
            i = fila.popleft()
            ilha.append(i)
            x, y = i % w, i // w
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    j = ny * w + nx
                    if not visto[j] and dados[j]:
                        visto[j] = 1
                        fila.append(j)
        if len(ilha) > len(melhor):
            melhor = ilha
    saida = Image.new("L", (w, h), 0)
    px = saida.load()
    for i in melhor:
        px[i % w, i // w] = 255
    return saida


for caminho in sys.argv[1:]:
    im = Image.open(caminho).convert("RGBA")
    w, h = im.size
    nucleo = im.getchannel("A").point(lambda v: 255 if v >= OPACO else 0)
    area = maior_componente(nucleo, w, h)
    area = area.filter(ImageFilter.MaxFilter(FOLGA * 2 + 1))
    antes = sum(1 for v in im.getchannel("A").getdata() if v > 40)
    im.putalpha(Image.composite(im.getchannel("A"), Image.new("L", (w, h), 0), area))
    depois = sum(1 for v in im.getchannel("A").getdata() if v > 40)
    print(f"{caminho}: {antes}px de tinta -> {depois}px (removidos {antes - depois})")
    im.save(caminho)
