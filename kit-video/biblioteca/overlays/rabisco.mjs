import { tracos } from "../pecas/marcador.mjs";

export const contrato = {
  nome: "rabisco",
  funcao: "marca à mão sobre um ponto da cena (círculo, retângulo arredondado ou seta), desenhada por cima",
  duracao: "1,2–2 s",
  obrigatorios: ["caixa"],
  opcionais: ["forma", "cor", "grossura", "rot", "fatias"],
  naoFaz: "contornar parágrafo inteiro; rabisco é para apontar uma palavra",
  observacao:
    "caixa: { left, top, width, height } em px do quadro 1920×1080 — o traço é calculado no tamanho real da caixa, então a velocidade da caneta é a mesma na horizontal e na vertical",
};

/* o traço é o mesmo da peça `marcador`; aqui ele vira um overlay numa faixa
   acima das cenas, para apontar algo que a montagem já desenhou */
export function montar({ id, valores = {} }) {
  const {
    forma = "circulo",
    caixa = { left: 600, top: 400, width: 520, height: 300 },
    cor = "var(--cyan)",
    grossura = 8,
    rot = 0,
    fatias = 34,
  } = valores;

  const w = Math.max(60, Math.round(caixa.width));
  const h = Math.max(60, Math.round(caixa.height));
  const desenho = tracos(forma, w, h, grossura, fatias);
  if (!desenho) throw new Error(`rabisco: forma "${forma}" não existe — use: circulo, caixa, seta`);

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="pointer-events:none">
    <div style="position:absolute;left:${caixa.left}px;top:${caixa.top}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg)">
      <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="${cor}" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible;filter:drop-shadow(0 0 14px rgba(var(--cyan-rgb),.5))" data-at="0.05" data-anim="trace" data-dur="0.9">
        ${desenho}
      </svg>
    </div>
  </div>`,
  };
}
