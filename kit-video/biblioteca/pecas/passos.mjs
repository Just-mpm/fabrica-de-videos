import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "passos",
  funcao: "sequência numerada em cartões ligados por uma linha: passo 1, 2, 3",
  usa: "passos [{titulo, texto}], ativo, w, gap, x, y, at, anim",
  naoFaz: "mais de 5 passos numa faixa; a partir daí use lista vertical (grupo)",
};

export function montar(p = {}) {
  const {
    passos = [],
    ativo = 1,
    w = 1500,
    gap = 18,
    at = 0.4,
    anim = "fade",
  } = p;

  if (!passos.length) throw new Error("passos: informe ao menos um passo");

  const cartoes = passos
    .map((s, i) => {
      const numero = i + 1;
      const ativoAgora = numero === ativo;
      const cor = ativoAgora ? "var(--cyan)" : "var(--ink-dim)";
      const fundo = ativoAgora ? "rgba(var(--cyan-rgb),.10)" : "rgba(var(--panel-rgb),.55)";
      const borda = ativoAgora ? "rgba(var(--cyan-rgb),.5)" : "rgba(var(--line-rgb),.14)";
      const ligacao = i < passos.length - 1
        ? `<div style="flex:0 0 26px;height:1px;background:linear-gradient(90deg,rgba(var(--cyan-rgb),.45),rgba(var(--line-rgb),.18))" data-at="${(at + i * 0.28 + 0.2).toFixed(2)}" data-anim="fade"></div>`
        : "";
      return `<div style="flex:1;display:flex;align-items:center;gap:18px;padding:22px 24px;border-radius:14px;background:${fundo};border:1px solid ${borda}" data-at="${(at + i * 0.28).toFixed(2)}" data-anim="rise">
          <div data-layout-ignore style="width:46px;height:46px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;border:1.5px solid ${cor};color:${ativoAgora ? "var(--on-accent)" : cor};background:${ativoAgora ? "var(--cyan)" : "transparent"};font-family:var(--display);font-weight:700;font-size:22px">${numero}</div>
          <div style="min-width:0">
            <div style="font-family:var(--body);font-weight:600;font-size:28px;line-height:1.2;color:${ativoAgora ? "var(--ink)" : "var(--ink-soft)"}">${s.titulo ?? ""}</div>
            ${s.texto ? `<div data-layout-ignore style="font-family:var(--body);font-size:24px;color:var(--ink-dim);margin-top:4px">${s.texto}</div>` : ""}
          </div>
        </div>${ligacao}`;
    })
    .join("");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:stretch;gap:${px(gap)}" ${entrada(p, { anim, at: 0.2 })}>${cartoes}</div>`,
    ),
  };
}
