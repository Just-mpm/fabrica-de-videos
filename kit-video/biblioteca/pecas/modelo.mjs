import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";
import { larguraDe } from "../medidas.mjs";

export const contrato = {
  nome: "modelo",
  funcao:
    "o cartão de um modelo de IA: versão, nome, papel e estado — a peça de uma família (Gemini, GPT, Claude)",
  usa:
    "nome, versao, papel, cor, estado (normal|aceso|apagado|fantasma), icone, badge, nota, w, h, x, y, at, anim",
  naoFaz:
    "dois modelos no mesmo cartão; parágrafo no papel (é uma linha de posicionamento, 2–4 palavras)",
};

/* Um modelo da família é sempre a mesma coisa: um nome próprio que acende.
   A cor diz o papel (azul = fronteira, azul-claro = potência, limão = velocidade,
   ciano = equilíbrio); o estado diz o que a história está fazendo com ele:
   aceso (o foco), normal (existe), apagado (perdeu espaço) e fantasma (a vaga
   vazia — o modelo que sumiu da lista). */

const ESTADOS = ["normal", "aceso", "apagado", "fantasma"];

/* cor com transparência: `var(--cyan)55` não existe em CSS, e é isso que
   apagava a aura e o brilho. color-mix aceita token e hex. */
const alfa = (cor, pct) => `color-mix(in srgb, ${cor} ${pct}%, transparent)`;

export function montar(p = {}) {
  const {
    nome = "",
    versao = null,
    papel = null,
    nota = null,
    cor = "var(--cyan)",
    estado = "normal",
    icone = "spark",
    badge = null,
    w = 340,
    h = null,
  } = p;

  if (!ESTADOS.includes(estado)) {
    throw new Error(`modelo: estado "${estado}" não existe — use: ${ESTADOS.join(", ")}`);
  }
  if (!nome) {
    throw new Error(
      `modelo: falta \`nome\` — o cartão existe para mostrar o nome do modelo, ex.: { tipo: "modelo", nome: "Modelo X", versao: "v4" }`,
    );
  }

  const altura = h ?? Math.round(w * 1.06);
  const pad = 26;
  const util = w - pad * 2;

  /* o nome não pode vazar o cartão: a fonte é medida, não chutada */
  const emCem = larguraDe(String(nome).toUpperCase(), "display", 100, -0.02);
  const tamNome = Math.max(28, Math.min(Math.round(w * 0.235), Math.floor((100 * util) / Math.max(1, emCem))));

  const aceso = estado === "aceso";
  const apagado = estado === "apagado";
  const fantasma = estado === "fantasma";

  const fundo = fantasma
    ? "background:rgba(var(--panel-rgb),.28)"
    : aceso
      ? "background:linear-gradient(165deg, rgba(var(--panel-2-rgb),.96) 0%, rgba(var(--bg-2-rgb),.97) 100%)"
      : "background:linear-gradient(180deg, rgba(var(--panel-rgb),.94) 0%, rgba(var(--panel-rgb),.94) 100%)";

  const borda = fantasma
    ? "border:2px dashed rgba(var(--line-rgb),.4)"
    : aceso
      ? `border:2px solid ${cor}`
      : "border:1px solid rgba(var(--line-rgb),.22)";

  const sombra = aceso
    ? `box-shadow:0 0 46px ${alfa(cor, 30)}, 0 24px 60px rgba(var(--shadow-rgb),.5), inset 0 1px 0 rgba(var(--ink-rgb),.16)`
    : fantasma
      ? "box-shadow:none"
      : "box-shadow:0 18px 44px rgba(var(--shadow-rgb),.4)";

  const corNome = aceso ? cor : apagado || fantasma ? "rgba(var(--ink-soft-rgb),.42)" : "var(--ink)";
  const brilho = aceso
    ? `text-shadow:0 0 26px ${alfa(cor, 60)}, 0 0 60px ${alfa(cor, 26)}`
    : "text-shadow:none";

  const opacidade = apagado ? 0.62 : 1;

  const aura = aceso
    ? `<div class="modelo-aura" data-layout-allow-overflow style="background:radial-gradient(circle at 50% 34%, ${alfa(cor, 24)} 0%, ${alfa(cor, 7)} 42%, transparent 72%)" data-at="${(Number(p.at ?? 0.25) + 0.25).toFixed(2)}" data-anim="fade" data-dur="0.9"></div>`
    : "";

  const topo = `<div class="modelo-topo" data-layout-ignore>
      <div class="modelo-glifo" style="color:${aceso ? cor : "rgba(var(--ink-soft-rgb),.7)"}">${icons[icone] ?? icons.spark}</div>
      ${versao ? `<div class="modelo-versao">${versao}</div>` : ""}
      ${badge ? `<div class="modelo-badge" style="color:${cor};border-color:${alfa(cor, 55)}">${badge}</div>` : ""}
    </div>`;

  const nomeHtml = `<div class="modelo-nome" style="font-size:${px(tamNome)};color:${corNome};${brilho}">${nome}</div>`;

  /* o papel é texto de leitura: nunca abaixo do piso de 28 px, que é o que
     garante legibilidade no celular */
  const fsPapel = Math.max(28, Math.round(w * 0.062));
  const papelHtml = papel
    ? `<div class="modelo-papel" style="font-size:${fsPapel}px;color:${aceso ? "var(--ink)" : "var(--ink-soft)"}">${papel}</div>`
    : "";

  const notaHtml = nota ? `<div class="modelo-nota">${nota}</div>` : "";

  const fio = `<div class="modelo-fio" style="background:linear-gradient(90deg, ${aceso ? cor : "rgba(var(--line-rgb),.35)"}, transparent)"></div>`;

  const corpo = `<div class="modelo${fantasma ? " modelo-vazio" : ""}" style="width:${px(w)};height:${px(altura)};${fundo};${borda};${sombra};opacity:${opacidade}" ${entrada(p, { anim: "rise", at: 0.25 })}>
      ${aura}
      ${topo}
      ${nomeHtml}
      ${fio}
      ${papelHtml}
      ${notaHtml}
    </div>`;

  return {
    css: `
    .modelo{position:relative;border-radius:var(--r-md);padding:26px;display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box}
    .modelo-aura{position:absolute;inset:-30% -30% 20% -30%;pointer-events:none}
    .modelo-topo{position:relative;display:flex;align-items:center;gap:10px;min-height:26px}
    .modelo-glifo{width:26px;height:26px;flex:0 0 auto}
    .modelo-versao{font-family:var(--body);font-weight:800;font-size:16px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}
    .modelo-badge{margin-left:auto;font-family:var(--body);font-weight:800;font-size:15px;letter-spacing:.12em;text-transform:uppercase;border:1.5px solid;border-radius:var(--r-sm);padding:3px 10px 2px}
    .modelo-nome{position:relative;margin-top:auto;font-family:var(--display);font-weight:800;text-transform:uppercase;line-height:.94;letter-spacing:-.02em;white-space:nowrap}
    .modelo-fio{position:relative;height:3px;margin:18px 0 14px;border-radius:999px}
    .modelo-papel{position:relative;font-family:var(--body);font-weight:600;font-size:24px;line-height:1.22;color:var(--ink-soft)}
    .modelo-nota{position:relative;margin-top:8px;font-family:var(--body);font-weight:600;font-size:19px;line-height:1.3;color:var(--ink-dim)}
    .modelo-vazio .modelo-nome{opacity:.55}
    `,
    html: envolver(p, corpo),
  };
}
