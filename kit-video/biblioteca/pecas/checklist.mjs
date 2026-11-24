import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "checklist",
  funcao: "lista de conferência: cada item ganha o traço do check em ordem",
  usa: "itens [{texto, ok, nota}], titulo, contador, w, x, y, at, anim",
  naoFaz: "mais de 6 itens; para etapas numeradas use passos",
};

export function montar(p = {}) {
  const {
    itens = [],
    titulo = null,
    contador = false,
    w = 780,
    at = 0.4,
    anim = "fade",
  } = p;

  if (!itens.length) throw new Error("checklist: informe `itens` — itens: [{ texto }]");
  if (itens.length > 6) throw new Error("checklist: no máximo 6 itens");

  const lista = itens.map((item) => (typeof item === "string" ? { texto: item } : item));
  const marcados = lista.filter((i) => i.ok !== false).length;

  const linhas = lista
    .map((item, i) => {
      const ok = item.ok !== false;
      const bruto = item.at !== undefined ? item.at : at + i * 0.26;
      const quando = typeof bruto === "number" ? bruto : parseFloat(bruto);
      const quandoTxt = typeof bruto === "number" ? bruto.toFixed(2) : bruto;
      const cor = ok ? "var(--cyan)" : "var(--ink-dim)";
      return `<div style="display:flex;align-items:flex-start;gap:18px;padding:13px 0" data-at="${quandoTxt}" data-anim="slideL" data-dur="0.45">
          <div style="width:44px;height:44px;flex:0 0 auto;border-radius:12px;display:grid;place-items:center;border:2px solid ${ok ? "rgba(var(--cyan-rgb),.55)" : "rgba(var(--line-rgb),.25)"};background:${ok ? "rgba(var(--cyan-rgb),.12)" : "transparent"};color:${cor};${ok ? "box-shadow:0 0 24px rgba(var(--cyan-rgb),.16);" : ""}">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.6 12.6l4.8 4.8 10-10.8" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${typeof bruto === "number" ? (bruto + 0.28).toFixed(2) : quandoTxt}" data-anim="draw" data-dur="0.4"/>
            </svg>
          </div>
          <div style="min-width:0;padding-top:2px">
            <div style="font-family:var(--body);font-weight:600;font-size:30px;line-height:1.25;color:${ok ? "var(--ink)" : "var(--ink-soft)"}">${item.texto ?? ""}</div>
            ${item.nota ? `<div data-layout-ignore style="font-family:var(--body);font-size:24px;line-height:1.3;color:var(--ink-dim);margin-top:4px">${item.nota}</div>` : ""}
          </div>
        </div>`;
    })
    .join("");

  const rodape = contador
    ? `<div data-layout-ignore style="margin-top:10px;font-family:var(--body);font-weight:800;font-size:22px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)" data-at="${(at + lista.length * 0.26 + 0.2).toFixed(2)}" data-anim="fade">${marcados} de ${lista.length}</div>`
    : "";

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)}" ${entrada(p, { anim, at: 0.15 })}>
        ${titulo ? `<div data-layout-ignore style="font-family:var(--body);font-weight:800;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:8px">${titulo}</div>` : ""}
        ${linhas}${rodape}
      </div>`,
    ),
  };
}
