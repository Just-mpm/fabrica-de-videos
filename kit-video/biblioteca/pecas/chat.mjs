import { icons } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "chat",
  funcao: "conversa em balões: a pergunta da pessoa e a resposta da IA, na ordem em que são ditas",
  usa: "mensagens [{de:'voce'|'ia', texto, at, digitando}], largura, tamanho, avatar, textura, x, y, gap, at, anim",
  naoFaz: "mensagem com `at` em palavra (a lista interna é resolvida só por número)",
};

/* Tudo na bolha sai de `tamanho` (o corpo do texto). Assim a mesma peça serve
   para o palco grande e para dentro do celular, onde 29 px virava outdoor. */
export function montar(p = {}) {
  const {
    mensagens = [],
    largura = 760,
    tamanho = 29,
    avatar = true,
    textura = false,
    gap = null,
    at = 0.2,
    anim = "rise",
  } = p;

  if (!mensagens.length) throw new Error("chat: informe ao menos uma mensagem");

  const t = tamanho;
  const padY = Math.round(t * 0.6);
  const padX = Math.round(t * 0.88);
  const raio = Math.round(t * 0.68);
  const avatarT = Math.round(t * 1.62);
  const iconeT = Math.round(t * 0.88);
  const gapLinha = gap ?? Math.round(t * 0.46);
  const gapBolha = Math.round(t * 0.5);
  const ponto = Math.max(6, Math.round(t * 0.32));

  const bolhas = mensagens.map((m, i) => {
    const deIa = m.de === "ia";
    const entradaBolha = m.at ?? at + i * 0.9;
    const raioBolha = deIa
      ? `${raio}px ${raio}px ${raio}px ${Math.round(raio * 0.22)}px`
      : `${raio}px ${raio}px ${Math.round(raio * 0.22)}px ${raio}px`;
    const fundo = deIa
      ? "background:linear-gradient(180deg,rgba(var(--panel-2-rgb),.94),rgba(var(--panel-rgb),.96));border:1px solid var(--line)"
      : "background:rgba(var(--cyan-rgb),.12);border:1px solid rgba(var(--cyan-rgb),.45);box-shadow:0 0 30px rgba(var(--cyan-rgb),.08)";

    const conteudo = m.digitando
      ? `<span style="display:inline-flex;gap:${px(Math.round(t * 0.26))};align-items:center;height:${px(Math.round(t * 0.9))}">
           ${[0, 1, 2]
             .map(
               (k) =>
                 `<span style="width:${px(ponto)};height:${px(ponto)};border-radius:50%;background:var(--cyan)" data-at="${(entradaBolha + k * 0.12).toFixed(2)}" data-anim="tecla"></span>`,
             )
             .join("")}
         </span>`
      : m.texto;

    const bolha = `<div${textura ? " data-layout-ignore" : ""} style="max-width:78%;padding:${px(padY)} ${px(padX)};border-radius:${raioBolha};${fundo};font-family:var(--body);font-weight:500;font-size:${px(t)};line-height:1.35;color:var(--ink)">${conteudo}</div>`;

    const avatarEl =
      deIa && avatar
        ? `<div style="width:${px(avatarT)};height:${px(avatarT)};flex:0 0 auto;border-radius:${px(Math.round(avatarT * 0.26))};background:rgba(var(--cyan-rgb),.12);border:1px solid rgba(var(--cyan-rgb),.35);display:grid;place-items:center;color:var(--cyan)">
             <div style="width:${px(iconeT)};height:${px(iconeT)}">${icons.spark}</div>
           </div>`
        : "";

    return `<div style="display:flex;align-items:flex-end;gap:${px(gapLinha)};justify-content:${deIa ? "flex-start" : "flex-end"}" ${entrada({ at: entradaBolha, anim: "rise" })}>
      ${avatarEl}${bolha}
    </div>`;
  });

  return {
    html: envolver(
      p,
      `<div style="width:${px(largura)};display:flex;flex-direction:column;gap:${px(gapBolha)}" ${entrada(p, { at, anim })}>${bolhas.join("")}</div>`,
    ),
  };
}
