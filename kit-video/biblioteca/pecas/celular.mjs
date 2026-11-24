import { entrada, envolver, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "celular",
  funcao: "mockup de celular com a tela viva: a área interna aceita peças, como uma janela pequena",
  usa: "pecas|html, w, x, y, at, anim, sombra",
  naoFaz: "tela com muito texto (a largura útil é ~300 px); para desktop use janela",
};

/* Medidas tiradas do PNG (assets/desenhos/celular.png), em fração da largura e
   da altura da imagem. A tela foi gerada em magenta chapado para poder ser
   medida por cor; depois o magenta foi apagado do arquivo
   (ferramentas/limpar-magenta.py), então a área é um furo transparente e a
   peça pinta o fundo por cima.
   O `folga` cobre esse furo inteiro — 1 px de sobra sobre a moldura escura
   é invisível e evita qualquer fresta. */
const TELA = { esq: 0.1105, topo: 0.0456, dir: 0.8876, base: 0.9544 };
const PROPORCAO = 900 / 507; // altura / largura do arquivo
const FOLGA = 0.006; // em fração da largura do aparelho

export function montar(p = {}) {
  const {
    src = "assets/desenhos/celular.png",
    w = 380,
    pecas = [],
    html = null,
    sombra = true,
    at = 0.3,
    anim = "rise",
  } = p;

  const h = Math.round(w * PROPORCAO);
  const larguraTela = (TELA.dir - TELA.esq + FOLGA * 2) * 100;
  const alturaTela = (TELA.base - TELA.topo + FOLGA * 2 * PROPORCAO) * 100;
  const esqTela = (TELA.esq - FOLGA) * 100;
  const topoTela = (TELA.topo - FOLGA * PROPORCAO) * 100;
  const raio = Math.round(((TELA.dir - TELA.esq) * w * 0.125) + 4);

  const conteudo = html != null ? html : htmlDePecas(pecas);

  return {
    html: envolver(
      p,
      `<div style="position:relative;width:${px(w)};height:${px(h)}${sombra ? ";filter:drop-shadow(0 26px 50px rgba(var(--shadow-rgb),.55))" : ""}" ${entrada(p, { anim, at })}>
        <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;display:block"/>
        <div style="position:absolute;left:${esqTela.toFixed(2)}%;top:${topoTela.toFixed(2)}%;width:${larguraTela.toFixed(2)}%;height:${alturaTela.toFixed(2)}%;border-radius:${raio}px;background:var(--bg);overflow:hidden">
          <div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,rgba(var(--cyan-rgb),.10),transparent 62%)"></div>
          ${conteudo}
        </div>
      </div>`,
    ),
  };
}
