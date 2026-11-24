/* audita peças soltas da cena `livre`: toda peça posicionada precisa de x
   (ou left/right); sem x ela cai no fluxo e cola na borda esquerda.
   Sem y (ou top/bottom) o mesmo vale na vertical.

   Exceções que não são defeito:
   - tipos que a cena `livre` já posiciona na margem (PADRAO em cenas/livre.mjs);
   - `figura`, que se posiciona por `lado` (left/right);
   - `marcador`, que se posiciona por `caixa`;
   - `fundo`, que cobre o quadro inteiro de propósito. */
const mod = await import("../montagem/" + (process.argv[2] || "demo-livre") + ".mjs");
const film = mod.default;

const POSICIONAVEIS = new Set(["tag", "texto", "titulo", "nota", "regua", "chip", "marcador", "imagem", "icone", "numero", "barra", "figura", "selo", "prompt", "chat", "terminal", "janela", "rede", "token", "medidor", "comparar", "passos", "onda", "toast", "cartao", "grupo", "linha"]);

// tipos que a cena `livre` cola na margem sozinha quando não recebem x
const NA_MARGEM = new Set(["titulo", "texto", "tag", "nota", "numero", "regua"]);

// peças que se posicionam por outra chave
const POR_OUTRA_CHAVE = {
  figura: ["lado"],
  marcador: ["caixa"],
  fundo: ["qual"],
};

let n = 0;
film.cenas.forEach((c, i) => {
  if (c.bloco !== "livre") return;
  const pecas = c.valores?.pecas || [];
  pecas.forEach((p, j) => {
    if (!POSICIONAVEIS.has(p.tipo)) return;
    const alternativas = POR_OUTRA_CHAVE[p.tipo] || [];
    if (alternativas.some((k) => p[k] != null)) return;
    const temX = p.x != null || p.left != null || p.right != null || NA_MARGEM.has(p.tipo);
    const temY = p.y != null || p.top != null || p.bottom != null;
    if (!temX || !temY) {
      n += 1;
      const rot = p.texto || p.src || p.forma || "";
      console.log(
        `${String(i + 1).padStart(2)}/${String(j + 1).padStart(2)} ${p.tipo.padEnd(8)} ${!temX ? "sem x " : ""}${!temY ? "sem y " : ""} ${String(rot).slice(0, 46)}`,
      );
    }
  });
});
console.log(`\n${n} peça(s) fora de posição`);
