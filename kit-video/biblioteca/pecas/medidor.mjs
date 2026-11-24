import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "medidor",
  funcao: "anel de progresso com número no centro: confiança, precisão, percentual",
  usa: "valor (0–100), rotulo, tamanho, cor, sufixo, x, y, at, anim",
  naoFaz: "mais de um anel na mesma peça",
};

export function montar(p = {}) {
  const {
    valor = 75,
    rotulo = "",
    tamanho = 300,
    cor = "var(--cyan)",
    sufixo = "%",
    at = 0.4,
    anim = "fade",
  } = p;

  const raio = 88;
  const circunferencia = 100; // pathLength normalizado
  const fonte = Math.round(tamanho * 0.26);

  return {
    html: envolver(
      p,
      `<div style="width:${px(tamanho)};display:flex;flex-direction:column;align-items:center;gap:14px" ${entrada(p, { anim, at })}>
        <div style="position:relative;width:${px(tamanho)};height:${px(tamanho)}">
          <svg viewBox="0 0 200 200" width="${tamanho}" height="${tamanho}" style="transform:rotate(-90deg)">
            <circle cx="100" cy="100" r="${raio}" fill="none" stroke="rgba(var(--line-rgb),.14)" stroke-width="10"/>
            <circle cx="100" cy="100" r="${raio}" fill="none" stroke="${cor}" stroke-width="10" stroke-linecap="round" pathLength="100" stroke-dasharray="100 120" stroke-dashoffset="110" data-at="${(at + 0.15).toFixed(2)}" data-anim="arco" data-to="${valor}" data-dur="1.5" style="filter:drop-shadow(0 0 12px rgba(var(--cyan-rgb),.65))"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:2px">
            <span style="font-family:var(--display);font-weight:700;font-size:${fonte}px;color:var(--ink);letter-spacing:-.03em" data-at="${(at + 0.15).toFixed(2)}" data-anim="count" data-to="${valor}" data-dur="1.5">0</span>
            <span style="font-family:var(--display);font-weight:700;font-size:${Math.round(fonte * 0.55)}px;color:${cor}">${sufixo}</span>
          </div>
        </div>
        ${rotulo ? `<div data-layout-ignore style="font-family:var(--body);font-weight:800;font-size:22px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft)">${rotulo}</div>` : ""}
      </div>`,
    ),
  };
}
