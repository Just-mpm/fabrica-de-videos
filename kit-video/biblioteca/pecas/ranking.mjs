import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "ranking",
  funcao:
    "placar de comparação: uma linha por modelo, com barra e valor contando em ordem — quem está na frente fica evidente",
  usa:
    "linhas [{nome, valor, cor, nota, at}], max, unidade, w, destaque, legenda, titulo, x, y, at, anim",
  naoFaz:
    "mais de 6 linhas; misturar unidades na mesma escala; barra sem limite (informe max)",
};

/* O ranking existe porque comparar dois números em texto corrido é difícil:
   a barra diz a distância, o número diz o quanto, e o destaque diz quem ganhou. */
export function montar(p = {}) {
  const {
    linhas = [],
    max = 100,
    unidade = null,
    w = 900,
    destaque = null,
    legenda = null,
    titulo = null,
    at = 0.4,
    anim = "rise",
  } = p;

  if (!linhas.length) throw new Error("ranking: informe `linhas`");
  if (linhas.length > 6) throw new Error("ranking: no máximo 6 linhas");
  if (!(max > 0)) throw new Error("ranking: `max` precisa ser maior que zero");

  const alfa = (cor, pct) => `color-mix(in srgb, ${cor} ${pct}%, transparent)`;
  const base = typeof at === "number" ? at : 0.4;

  const regua = `<div class="rank-regua" style="width:${px(w)}"></div>`;

  const corpo = linhas
    .map((l, i) => {
      /* `at` na linha manda: cada barra pode entrar na palavra em que o número
         é dito, em vez de todas entrarem juntas no ritmo do stagger. */
      const quando = typeof l.at === "number" ? l.at : +(base + 0.12 + i * 0.2).toFixed(2);
      const pct = Math.max(0, Math.min(100, (Number(l.valor) / max) * 100));
      const cor = l.cor ?? "var(--cyan)";
      const forte = destaque === i;
      const corNome = forte ? "var(--ink)" : "var(--ink-soft)";

      const marca = forte
        ? `<div class="rank-luz" style="background:linear-gradient(90deg, ${alfa(cor, 12)}, transparent 78%);border-left:3px solid ${cor}" data-at="${quando}" data-anim="growX" data-dur="0.5"></div>`
        : "";

      return `<div class="rank-linha" style="width:${px(w)}" data-at="${quando}" data-anim="fade" data-dur="0.45">
        ${marca}
        <div class="rank-nome" style="color:${corNome}">
          ${l.nome}
          ${l.nota ? `<span class="rank-nota">${l.nota}</span>` : ""}
        </div>
        <div class="rank-trilho">
          <div class="rank-fill" style="width:${pct.toFixed(1)}%;background:linear-gradient(90deg, ${alfa(cor, 45)}, ${cor});box-shadow:0 0 ${forte ? 26 : 16}px ${alfa(cor, forte ? 55 : 32)}" data-at="${quando}" data-anim="growX" data-dur="0.85"></div>
        </div>
        <div class="rank-valor" style="color:${forte ? cor : "var(--ink)"}" data-at="${(quando + 0.08).toFixed(2)}" data-anim="count" data-to="${Number(l.valor)}" data-dur="0.9">0</div>
      </div>`;
    })
    .join("");

  const unidadeHtml = unidade
    ? `<div class="rank-unidade" data-layout-ignore>${unidade}</div>`
    : "";

  return {
    css: `
    .rank-linha{position:relative;display:flex;align-items:center;gap:22px;padding:11px 14px;border-radius:12px}
    .rank-luz{position:absolute;inset:0;border-radius:12px;pointer-events:none;transform-origin:left center}
    .rank-nome{position:relative;width:230px;flex:0 0 auto;font-family:var(--display);font-weight:700;font-size:31px;letter-spacing:-.01em;text-transform:uppercase;display:flex;align-items:baseline;gap:10px}
    .rank-nota{font-family:var(--body);font-weight:600;font-size:18px;letter-spacing:0;text-transform:lowercase;color:var(--ink-dim)}
    .rank-trilho{position:relative;flex:1;height:20px;border-radius:999px;background:rgba(var(--line-rgb),.10);overflow:hidden}
    .rank-fill{height:100%;border-radius:999px;transform-origin:left center}
    .rank-valor{position:relative;width:96px;flex:0 0 auto;text-align:right;font-family:var(--mono);font-weight:600;font-size:46px;line-height:1}
    .rank-regua{height:1px;background:linear-gradient(90deg, rgba(var(--line-rgb),.28), rgba(var(--line-rgb),.06));margin:4px 14px 14px}
    .rank-unidade{font-family:var(--body);font-weight:800;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);margin:0 14px 0 auto;text-align:right}
    `,
    html: envolver(
      p,
      `<div style="display:flex;flex-direction:column;gap:2px;width:${px(w)}" ${entrada(p, { anim, at: 0.1 })}>
        ${titulo ? `<div class="tag" style="margin-bottom:14px">${titulo}</div>` : ""}
        ${corpo}${regua}${unidadeHtml}
        ${legenda ? `<div data-layout-ignore class="rank-unidade" style="margin:10px 14px 0 14px;text-align:left;letter-spacing:.02em;font-family:var(--body);font-size:22px;text-transform:none;color:var(--ink-dim)">${legenda}</div>` : ""}
      </div>`,
    ),
  };
}
