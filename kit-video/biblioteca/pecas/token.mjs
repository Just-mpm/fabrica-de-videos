import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "token",
  funcao: "o texto picado em pedaços, como a IA lê: cada pedaço acende em ordem",
  usa: "texto, tokens, tamanho, w, x, y, at, cor, legenda, contar",
  naoFaz: "texto corrido; para ler uma frase use texto",
};

export function montar(p = {}) {
  const {
    texto = "",
    tokens = null,
    tamanho = 30,
    w = 900,
    at = 0.4,
    cor = "var(--cyan)",
    legenda = null,
    contar = false,
  } = p;

  const pedacos = (Array.isArray(tokens) && tokens.length
    ? tokens
    : String(texto).split(/\s+/).filter(Boolean)
  ).map((t) => String(t));

  if (!pedacos.length) throw new Error("token: informe `texto` ou `tokens`");

  const chips = pedacos
    .map(
      (t, i) => `<span style="display:inline-block;padding:10px 16px 8px;border-radius:10px;border:1px solid rgba(var(--cyan-rgb),.38);background:rgba(var(--cyan-rgb),.07);font-family:var(--mono);font-size:${px(tamanho)};color:var(--ink);box-shadow:inset 0 0 18px rgba(var(--cyan-rgb),.06)" data-at="${(at + i * 0.11).toFixed(2)}" data-anim="pop" data-dur="0.4">${t}</span>`,
    )
    .join("");

  const contador = contar
    ? `<span style="display:inline-block;padding:10px 18px 8px;border-radius:10px;background:${cor};color:var(--on-accent);font-family:var(--mono);font-weight:600;font-size:${px(tamanho)}" data-at="${(at + pedacos.length * 0.11 + 0.2).toFixed(2)}" data-anim="pop">${pedacos.length} tokens</span>`
    : "";

  const rodape = legenda
    ? `<div style="margin-top:20px;font-family:var(--mono);font-size:28px;letter-spacing:.04em;color:var(--ink-dim)" data-at="${(at + pedacos.length * 0.11 + 0.45).toFixed(2)}" data-anim="fade">${legenda}</div>`
    : "";

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)}" ${entrada(p, { at: 0.1, anim: "fade" })}>
        <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">${chips}${contador}</div>
        ${rodape}
      </div>`,
    ),
  };
}
