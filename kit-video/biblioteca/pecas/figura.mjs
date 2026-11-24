import { existsSync } from "node:fs";
import { POSES_VALIDAS, arquivoPose, fichaPose } from "../personagem.mjs";
import { entrada, px } from "./base.mjs";

export const contrato = {
  nome: "figura",
  funcao: "o personagem do canal recortado, em qualquer ponto do quadro",
  usa: "pose, lado, x, y, altura, largura, bottom, pad, at, anim",
  naoFaz: "pose que não existe (o build falha e lista as válidas)",
};

/* Sem x/y, encosta no lado pedido (right/left) com a margem padrão.
   Com x/y, fica exatamente onde foi mandado. */

/* poses já avisadas nesta execução: o aviso sai uma vez por pose ausente,
   não uma vez por figura na tela */
const avisadas = new Set();

export function montar(p = {}) {
  const {
    pose = "apresentando",
    lado = "right",
    altura = 800,
    largura = null,
    x,
    y,
    bottom = -10,
    pad = 90,
    at = 0.3,
    anim = "slideR",
  } = p;

  const arquivo = arquivoPose(pose);
  if (!arquivo) {
    throw new Error(`pose "${pose}" não existe — use: ${POSES_VALIDAS.join(", ")}`);
  }

  /* `altura` é a altura do PERSONAGEM, não da imagem. A calibragem da ficha
     compensa o enquadramento de cada pose. */
  const escala = fichaPose(pose)?.escala ?? 1;
  const alt = Math.round(altura * escala);

  const pos = [];
  if (x != null) pos.push(`left:${px(x)}`);
  else if (lado === "right") pos.push(`right:${px(pad)}`);
  else pos.push(`left:${px(pad)}`);
  if (y != null) pos.push(`top:${px(y)}`);
  else if (bottom != null) pos.push(`bottom:${px(bottom)}`);

  // ele encosta na borda de propósito: negativo é intencional
  const extras = [p.extras, bottom != null && bottom < 0 ? "data-layout-allow-overflow" : null]
    .filter(Boolean)
    .join(" ");

  const src = `assets/personagem/${arquivo}.png`;
  const posicao = `${pos.join(";")};height:${px(alt)}${largura ? `;width:${px(largura)}` : ""}`;

  /* Poses são arte do canal, não código: o kit de template vem sem elas. Quando o
     PNG ainda não existe, a peça desenha um quadro de espera com o nome do arquivo
     — o vídeo compila, o buraco aparece no lugar certo e o recado diz o que gerar.
     O aviso sai uma vez por pose: sem ele, o vídeo iria para o render com caixa
     tracejada e o log diria "tudo certo". */
  if (!existsSync(src)) {
    if (!avisadas.has(arquivo)) {
      avisadas.add(arquivo);
      console.log(`[figura] pose "${pose}" sem arte: ${src} — gere o PNG do personagem`);
    }
    // a largura é desta instância, então vai inline: o css é compartilhado por tipo de peça
    const larguraVazio = largura ?? Math.round(alt * 0.55);

    return {
      css: `
      .fig-vazio{display:flex;flex-direction:column;justify-content:center;gap:10px;padding:24px;
        border:2px dashed rgba(var(--cyan-rgb),.45);border-radius:var(--r-md);
        background:rgba(var(--panel-rgb),.35);font-family:var(--mono);font-size:28px;
        line-height:1.35;color:var(--ink-soft);overflow-wrap:anywhere}
      .fig-vazio b{font-size:30px;letter-spacing:.06em;text-transform:uppercase;color:var(--cyan)}`,
      html: `<div class="fig fig-vazio" style="${posicao};width:${px(larguraVazio)}" data-layout-ignore ${entrada({ ...p, extras }, { at, anim })}>
        <b>pose ${pose}</b>
        <span>${src}</span>
        <span>gere a imagem e rode<br>ferramentas\\normalizar-poses.py</span>
      </div>`,
    };
  }

  return {
    html: `<div class="fig" style="${posicao}" ${entrada({ ...p, extras }, { at, anim })}>
      <img src="${src}" alt="" />
    </div>`,
  };
}
