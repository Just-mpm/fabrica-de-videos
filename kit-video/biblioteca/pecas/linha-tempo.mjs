import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "linha-tempo",
  funcao: "eixo com marcos datados: história, versões, lançamentos em ordem",
  usa: "marcos [{data, titulo, texto, estado}], w, h, escala, estatico, at, anim",
  naoFaz: "mais de 6 marcos; texto longo em cada marco",
};

/* -------------------------------------------------------------------------
   Eixo que atravessa cenas.
   Cada cena desenha o MESMO eixo na mesma posição. `estado` diz o que já
   existia antes do corte:
     "novo"   → entra com animação, é o marco desta cena;
     "pronto" → já estava lá: desenhado desde o quadro zero, sem animação;
     "oculto" → ainda não aconteceu: reservado no espaço, invisível.
   Com `estatico`, o eixo entra pronto. Sem isso, cada corte remontava a
   linha do zero e o espectador via uma piscada no lugar de uma continuação.
   ------------------------------------------------------------------------- */
export function montar(p = {}) {
  const {
    marcos = [],
    w = 1600,
    h = 360,
    escala = 1,
    estatico = false,
    at = 0.4,
    anim = "fade",
  } = p;

  if (marcos.length < 2) throw new Error("linha-tempo: informe ao menos 2 marcos");
  if (marcos.length > 6) throw new Error("linha-tempo: no máximo 6 marcos");

  const e = Number(escala) > 0 ? Number(escala) : 1;
  const fsData = Math.round(22 * e);
  const fsTitulo = Math.round(28 * e);
  const fsTexto = Math.round(24 * e);
  const haste = Math.round(46 * e);
  const ponto = Math.round(18 * e);
  const folga = Math.round(9 * e);

  const meio = Math.round(h / 2);
  const esq = 70;
  const dir = w - 70;
  const passo = (dir - esq) / (marcos.length - 1);
  const larguraBloco = Math.max(180 * e, Math.min(300 * e, passo * 1.08));
  const posBloco = (x) =>
    Math.max(4, Math.min(x - larguraBloco / 2, w - larguraBloco - 4));

  const eixo = estatico
    ? `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="position:absolute;inset:0" fill="none">
      <line x1="${esq}" y1="${meio}" x2="${dir}" y2="${meio}" stroke="rgba(var(--line-rgb),.32)" stroke-width="2"/>
      <line x1="${esq}" y1="${meio}" x2="${dir}" y2="${meio}" stroke="var(--cyan)" stroke-width="2" opacity=".5" style="filter:blur(4px)"/>
    </svg>`
    : `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="position:absolute;inset:0" fill="none">
      <line x1="${esq}" y1="${meio}" x2="${dir}" y2="${meio}" stroke="rgba(var(--line-rgb),.32)" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${at}" data-anim="draw" data-dur="1.1"/>
      <line x1="${esq}" y1="${meio}" x2="${dir}" y2="${meio}" stroke="var(--cyan)" stroke-width="2" opacity=".5" style="filter:blur(4px)" data-at="${(at + 0.2).toFixed(2)}" data-anim="growX" data-dur="1.1"/>
    </svg>`;

  const itens = marcos
    .map((m, i) => {
      const estado = m.estado ?? "novo";
      const x = esq + i * passo;
      const acima = i % 2 === 0;
      const quando = at + 0.35 + i * 0.22;
      const novo = estado === "novo";
      const oculto = estado === "oculto";

      /* Atributos de entrada: só o marco desta cena anima. Quem está "pronto"
         ou "oculto" não recebe data-anim nenhum — com data-anim sem data-at o
         motor aplica o estado final da animação no quadro zero, e o marco
         escondido aparecia como um círculo fantasma no fim do eixo. */
      const anima = (atraso = 0, tipo = "fade", d = "0.4") =>
        novo
          ? ` data-at="${(quando + atraso).toFixed(2)}" data-anim="${tipo}" data-dur="${d}"`
          : "";
      const esconde = oculto ? "opacity:0;" : "";

      const hasteCss = acima
        ? `top:${meio - haste}px;height:${haste}px`
        : `top:${meio}px;height:${haste}px`;
      const bloco = acima
        ? `bottom:${h - meio + haste}px`
        : `top:${meio + haste}px`;

      const haloIcone = novo
        ? "box-shadow:0 0 26px rgba(var(--cyan-rgb),.85),0 0 60px rgba(var(--cyan-rgb),.35)"
        : "box-shadow:0 0 14px rgba(var(--cyan-rgb),.35)";
      const corTitulo = novo ? "var(--ink)" : "var(--ink-soft)";

      return `<div style="position:absolute;left:${(x - 1).toFixed(1)}px;${hasteCss};width:2px;background:linear-gradient(${acima ? "0deg" : "180deg"},rgba(var(--cyan-rgb),.7),rgba(var(--cyan-rgb),0));${esconde}"${anima(0, "growY", "0.4")}></div>
        <div style="position:absolute;left:${(x - folga).toFixed(1)}px;top:${meio - folga}px;width:${ponto}px;height:${ponto}px;border-radius:50%;background:var(--bg);border:2.5px solid var(--cyan);${haloIcone};${esconde}"${anima(0, "pop", "0.34")}></div>
        <div style="position:absolute;left:${posBloco(x).toFixed(1)}px;${bloco};width:${larguraBloco.toFixed(0)}px;text-align:center;${esconde}"${anima(0.12, acima ? "drop" : "rise", "0.45")}>
          <div data-layout-ignore style="font-family:var(--mono);font-size:${fsData}px;letter-spacing:.14em;color:${novo ? "var(--cyan)" : "rgba(var(--cyan-rgb),.55)"}">${m.data ?? ""}</div>
          <div style="margin-top:${Math.round(6 * e)}px;font-family:var(--body);font-weight:600;font-size:${fsTitulo}px;line-height:1.2;color:${corTitulo}">${m.titulo ?? ""}</div>
          ${m.texto ? `<div data-layout-ignore style="margin-top:${Math.round(6 * e)}px;font-family:var(--body);font-size:${fsTexto}px;line-height:1.3;color:var(--ink-dim)">${m.texto}</div>` : ""}
        </div>`;
    })
    .join("");

  return {
    html: envolver(
      p,
      `<div style="position:relative;width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at: 0.15 })}>${eixo}${itens}</div>`,
    ),
  };
}
