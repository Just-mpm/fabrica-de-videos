/* O artefato: a página que sai das fontes.
   Uma moldura só (cabeçalho de artefato + abas) e quatro corpos:
     generico  → a página que substitui o resumo (abas, gráfico, quiz, checklist)
     revisao   → página de estudo com tópicos, quiz e progresso salvo
     dados     → painel de números com barras, categorias e filtro
     projeto   → rastreador em três colunas com cartões e responsáveis

   O texto do corpo é barra, não frase: é um mockup, e mockup com texto falso
   mente sobre o que a ferramenta escreveu. As barras mostram a estrutura.
   Os poucos rótulos reais são os de interface (abas, colunas, filtro, total). */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "artefato",
  funcao: "a página gerada: moldura de artefato com abas e um corpo por tipo (generico, revisao, dados, projeto)",
  usa:
    "variante (generico|revisao|dados|projeto), w, h, x, y, abas, rotulo, t {abas, corpo, grafico, quiz, check, progresso, total, meses, categorias, filtro, colunas, mover}, at, anim",
  naoFaz: "texto corrido dentro da página; a página é estrutura, não conteúdo",
};

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const T = (t, k, d = 0) => {
  const v = num(t?.[k]);
  return v == null ? null : +(v + d).toFixed(2);
};
const quando = (v) => (v == null ? "" : `data-at="${v}"`);

const IC = (body) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const ICONE = {
  spark: IC('<path d="M12 2.6l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z"/>'),
  down: IC('<path d="M12 4v11"/><path d="M7.6 10.6L12 15l4.4-4.4"/><path d="M4.6 19.4h14.8"/>'),
  abrir: IC('<path d="M14 4.4h5.6V10"/><path d="M19.4 4.6l-8 8"/><path d="M18.6 14v5.4H4.6V5.4H10"/>'),
  check: IC('<path d="M4.8 12.6l4.6 4.6L19.2 6.6"/>'),
  filtro: IC('<path d="M3.4 5.4h17.2l-6.6 8v6.2l-4 2.4v-8.6z"/>'),
};

export function montar(p = {}) {
  const {
    variante = "generico",
    w = 880,
    h = 610,
    abas = null,
    rotulo = "artefato do notebook",
    t = {},
    at = 0.3,
    anim = "rise",
  } = p;

  const s = w / 880;
  const pxv = (v) => Math.round(v * s);

  const abasPadrao = {
    generico: ["visão geral", "gráfico", "quiz", "checklist"],
    revisao: ["tópicos", "quiz", "progresso"],
    dados: ["resumo", "meses", "categorias"],
    projeto: ["quadro", "cronograma"],
  }[variante] ?? ["visão geral"];
  const listaAbas = abas ?? abasPadrao;

  const tAbas = T(t, "abas");
  const barras = (n, cls = "") =>
    Array.from({ length: n }, (_, i) => `<i class="af-linha ${cls}" style="width:${64 + ((i * 37) % 34)}%"></i>`).join("");

  /* ---------- corpos ---------- */

  const grafico = (t0) => {
    const alturas = [46, 72, 58, 88, 64];
    return `<div class="af-graf">
      <div class="af-graf-topo"><i class="af-linha" style="width:38%"></i><span class="af-rotulo-mini">cliques</span></div>
      <div class="af-barras">
        ${alturas
          .map(
            (a, i) => `<div class="af-barra" style="height:${a}%;${
              t0 != null ? `transform-origin:center bottom" data-at="${(t0 + i * 0.1).toFixed(2)}" data-anim="growY" data-dur="0.5` : ""
            }"></div>`,
          )
          .join("")}
      </div>
    </div>`;
  };

  const quiz = (t0, comErro = false) => {
    const certo = t0 != null ? +(t0 + 0.75).toFixed(2) : null;
    const errado = comErro && t0 != null ? +(t0 + 0.35).toFixed(2) : null;
    const opcao = (i, texto) => {
      const ok = i === 1;
      const cls = ok ? "af-op af-op-ok" : "af-op";
      const disparo = ok ? quando(certo) : quando(errado);
      const acao = ok ? (certo == null ? "" : ' data-anim="pop" data-dur="0.4"') : errado == null ? "" : ' data-anim="shake" data-dur="0.45"';
      return `<div class="${cls}" ${disparo}${acao}>${ok ? `<span class="af-op-ic">${ICONE.check}</span>` : '<span class="af-op-bola"></span>'}<span class="af-op-txt">${texto}</span></div>`;
    };
    return `<div class="af-quiz">
      <div class="af-quiz-topo"><span class="af-quiz-selo">quiz</span><i class="af-linha" style="width:52%"></i></div>
      <div class="af-ops">${opcao(0, "")}${opcao(1, "")}${opcao(2, "")}</div>
    </div>`;
  };

  const checklist = (t0) => {
    const itens = 3;
    return `<div class="af-check">${Array.from({ length: itens }, (_, i) => {
      const q = t0 != null ? +(t0 + i * 0.28).toFixed(2) : null;
      return `<div class="af-item">
        <span class="af-caixa" ${quando(q)}${q != null ? ' data-anim="pop" data-dur="0.32"' : ""}>
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.8 12.6l4.6 4.6L19.2 6.6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" ${quando(q != null ? +(q + 0.22).toFixed(2) : null)}${q != null ? ' data-anim="draw" data-dur="0.34"' : ""}/>
          </svg>
        </span>
        <i class="af-linha" style="width:${68 - i * 8}%"></i>
      </div>`;
    }).join("")}</div>`;
  };

  const progresso = (t0, valor = 62) => {
    const q = t0 != null ? t0 : null;
    return `<div class="af-prog">
      <div class="af-prog-topo"><span class="af-rotulo-mini">progresso</span><span class="af-prog-num">${valor}%</span></div>
      <div class="af-prog-trilho"><div class="af-prog-fill" style="width:${valor}%${q != null ? `" data-at="${q}" data-anim="growX" data-dur="0.9` : ""}"></div></div>
    </div>`;
  };

  const corpoGenerico = () => {
    const tCorpo = T(t, "corpo");
    const tGraf = T(t, "grafico");
    const tQuiz = T(t, "quiz");
    const tCheck = T(t, "check");
    return `<div class="af-conteudo">
      <div class="af-titulo"><i class="af-linha af-linha-forte" style="width:46%"></i><i class="af-linha" style="width:28%"></i></div>
      <div class="af-duas">
        ${grafico(tGraf ?? tCorpo)}
        ${quiz(tQuiz, true)}
      </div>
      ${checklist(tCheck)}
    </div>`;
  };

  const corpoRevisao = () => {
    const tCorpo = T(t, "corpo");
    const tQuiz = T(t, "quiz");
    const tCheck = T(t, "check");
    const tProg = T(t, "progresso");
    const topicos = ["o que é", "como age", "efeitos", "revisão"];
    return `<div class="af-conteudo">
      <div class="af-topicos">
        ${topicos
          .map(
            (nome, i) => `<div class="af-topico" ${quando(tCorpo != null ? +(tCorpo + i * 0.16).toFixed(2) : null)}${tCorpo != null ? ' data-anim="slideL" data-dur="0.42"' : ""}>
              <span class="af-num">${i + 1}</span><span class="af-topico-nome">${nome}</span><i class="af-linha" style="width:${52 - i * 6}%"></i>
            </div>`,
          )
          .join("")}
      </div>
      <div class="af-duas">
        ${quiz(tQuiz)}
        <div class="af-lado">
          ${checklist(tCheck)}
          ${progresso(tProg, 62)}
        </div>
      </div>
    </div>`;
  };

  const corpoDados = () => {
    const tTotal = T(t, "total");
    const tMeses = T(t, "meses");
    const tCat = T(t, "categorias");
    const tFil = T(t, "filtro");
    const meses = [
      { m: "jan", v: 42 },
      { m: "fev", v: 58 },
      { m: "mar", v: 49 },
      { m: "abr", v: 74 },
    ];
    const cats = [
      { n: "casa", v: 38, c: "var(--cyan)" },
      { n: "transporte", v: 27, c: "var(--blue-l)" },
      { n: "lazer", v: 18, c: "var(--lime)" },
    ];
    const totalCirc = 2 * Math.PI * 46;
    return `<div class="af-conteudo">
      <div class="af-kpi">
        <div>
          <span class="af-rotulo-mini">total do período</span>
          <div class="af-kpi-num"><span class="af-moeda">R$</span> <span data-at="${tTotal ?? 0}" data-anim="count" data-to="12480" data-dur="1.1">0</span></div>
        </div>
        <div class="af-filtros" ${quando(tFil)}${tFil != null ? ' data-anim="slideL" data-dur="0.4"' : ""}>
          ${["mês", "trimestre", "ano"].map((f, i) => `<span class="af-filtro${i === 1 ? " af-filtro-on" : ""}">${f}</span>`).join("")}
          <span class="af-filtro-ic">${ICONE.filtro}</span>
        </div>
      </div>
      <div class="af-duas af-duas-dados">
        <div class="af-meses">
          ${meses
            .map(
              (m, i) => `<div class="af-mes">
                <div class="af-mes-trilho"><div class="af-mes-fill" style="height:${m.v}%${tMeses != null ? `" data-at="${(tMeses + i * 0.1).toFixed(2)}" data-anim="growY" data-dur="0.55` : ""}"></div></div>
                <span class="af-mes-nome">${m.m}</span>
              </div>`,
            )
            .join("")}
        </div>
        <div class="af-cats">
          <svg viewBox="0 0 120 120" class="af-donut" ${quando(tCat)}${tCat != null ? ' data-anim="circleIn" data-dur="0.7"' : ""}>
            <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(var(--line-rgb),.18)" stroke-width="16"/>
            ${cats
              .map((c, i) => {
                const acumulado = cats.slice(0, i).reduce((a, b) => a + b.v, 0);
                return `<circle cx="60" cy="60" r="46" fill="none" stroke="${c.c}" stroke-width="16" stroke-linecap="butt"
                  stroke-dasharray="${((c.v / 100) * totalCirc).toFixed(1)} ${totalCirc.toFixed(1)}"
                  stroke-dashoffset="${(-(acumulado / 100) * totalCirc).toFixed(1)}" transform="rotate(-90 60 60)"/>`;
              })
              .join("")}
          </svg>
          <div class="af-legenda">
            ${cats
              .map(
                (c, i) => `<div class="af-leg-item" ${quando(tCat != null ? +(tCat + 0.35 + i * 0.12).toFixed(2) : null)}${tCat != null ? ' data-anim="fade"' : ""}>
                  <span class="af-leg-cor" style="background:${c.c}"></span><span class="af-leg-nome">${c.n}</span><span class="af-leg-val">${c.v}%</span>
                </div>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>`;
  };

  const corpoProjeto = () => {
    const tCol = T(t, "colunas");
    const tMove = T(t, "mover");
    const col = (titulo, itens, idx) => `<div class="af-col">
      <div class="af-col-topo" ${quando(tCol != null ? +(tCol + idx * 0.18).toFixed(2) : null)}${tCol != null ? ' data-anim="rise" data-dur="0.42"' : ""}>
        <span class="af-col-nome">${titulo}</span><span class="af-col-n">${itens.length}</span>
      </div>
      ${itens
        .map(
          (c, i) => `<div class="af-cartao" ${quando(c.at ?? null)}${c.at != null ? ` data-anim="${c.anim ?? "pop"}" data-dur="0.4"` : ""}>
            <i class="af-linha" style="width:${c.largura}%"></i>
            <div class="af-cartao-pe">
              <span class="af-prazo">${c.prazo}</span>
              <span class="af-avatares">${Array.from({ length: c.pessoas }, (_, k) => `<span class="af-av" style="--k:${k}"></span>`).join("")}</span>
            </div>
          </div>`,
        )
        .join("")}
    </div>`;

    const moverQ = tMove;
    const pendentes = [
      { largura: 78, prazo: "seg", pessoas: 1 },
      { largura: 62, prazo: "ter", pessoas: 2 },
    ];
    if (moverQ != null) pendentes.push({ largura: 70, prazo: "qua", pessoas: 1, at: +(moverQ + 0.55).toFixed(2), anim: "fadeOut" });
    const andamento = [{ largura: 74, prazo: "qua", pessoas: 2 }];
    if (moverQ != null) andamento.push({ largura: 70, prazo: "qua", pessoas: 1, at: moverQ });
    const pronto = [
      { largura: 66, prazo: "ok", pessoas: 1 },
      { largura: 58, prazo: "ok", pessoas: 2 },
      { largura: 72, prazo: "ok", pessoas: 1 },
    ];
    return `<div class="af-conteudo">
      <div class="af-quadro">${col("pendente", pendentes, 0)}${col("em andamento", andamento, 1)}${col("pronto", pronto, 2)}</div>
    </div>`;
  };

  const CORPO = {
    generico: corpoGenerico,
    revisao: corpoRevisao,
    dados: corpoDados,
    projeto: corpoProjeto,
  };

  if (!CORPO[variante]) {
    throw new Error(`artefato: variante "${variante}" não existe — use: ${Object.keys(CORPO).join(", ")}`);
  }

  const abasHtml = listaAbas
    .map(
      (nome, i) => `<div class="af-aba${i === 0 ? " af-aba-on" : ""}" ${
        tAbas != null ? `data-at="${(tAbas + i * 0.12).toFixed(2)}" data-anim="slideL" data-dur="0.4"` : ""
      }><span class="af-aba-txt">${nome}</span></div>`,
    )
    .join("");

  const corpo = `<div class="af-card" style="width:${px(w)};height:${pxv(h)}px;--s:${s.toFixed(3)}">
      <div class="af-topo">
        <span class="af-selo"><span class="af-selo-ic">${ICONE.spark}</span>${rotulo}</span>
        <span class="af-acoes">
          <span class="af-acao">${ICONE.down}</span>
          <span class="af-acao">${ICONE.abrir}</span>
        </span>
      </div>
      <div class="af-abas">${abasHtml}</div>
      ${CORPO[variante]()}
    </div>`;

  return {
    css: `
    .af-card{position:relative;display:flex;flex-direction:column;background:linear-gradient(170deg,rgba(var(--panel-2-rgb),.98),rgba(var(--panel-rgb),1) 55%,rgba(var(--bg-2-rgb),1));border:1.5px solid rgba(var(--line-rgb),.34);border-radius:calc(24px * var(--s));box-shadow:inset 0 1.5px 0 rgba(var(--ink-rgb),.14),0 26px 60px rgba(var(--shadow-rgb),.55);overflow:hidden;font-family:var(--body)}
    .af-topo{display:flex;align-items:center;justify-content:space-between;padding:calc(14px * var(--s)) calc(18px * var(--s));border-bottom:1px solid rgba(var(--line-rgb),.18)}
    .af-selo{display:inline-flex;align-items:center;gap:calc(8px * var(--s));font-family:var(--mono);font-size:calc(14px * var(--s));letter-spacing:.14em;text-transform:uppercase;color:var(--cyan)}
    .af-selo-ic{width:calc(17px * var(--s));height:calc(17px * var(--s));display:inline-block;filter:drop-shadow(0 0 8px rgba(var(--cyan-rgb),.5))}
    .af-acoes{display:flex;gap:calc(10px * var(--s))}
    .af-acao{width:calc(18px * var(--s));height:calc(18px * var(--s));display:inline-block;color:var(--ink-dim)}
    .af-abas{display:flex;gap:calc(6px * var(--s));padding:calc(10px * var(--s)) calc(16px * var(--s));border-bottom:1px solid rgba(var(--line-rgb),.14)}
    .af-aba{padding:calc(7px * var(--s)) calc(14px * var(--s));border-radius:999px;font-size:calc(15px * var(--s));font-weight:700;color:var(--ink-soft);white-space:nowrap}
    .af-aba-on{background:rgba(var(--bg-rgb),.55);color:var(--cyan);border:1px solid rgba(var(--cyan-rgb),.45)}
    .af-conteudo{flex:1;min-height:0;display:flex;flex-direction:column;gap:calc(16px * var(--s));padding:calc(18px * var(--s));overflow:hidden}
    .af-linha{display:block;height:calc(9px * var(--s));border-radius:999px;background:rgba(var(--ink-rgb),.22)}
    .af-linha-forte{height:calc(16px * var(--s));background:rgba(var(--ink-rgb),.55)}
    .af-rotulo-mini{font-family:var(--mono);font-size:calc(12px * var(--s));letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim)}
    .af-titulo{display:flex;flex-direction:column;gap:calc(10px * var(--s))}
    .af-duas{display:flex;gap:calc(16px * var(--s));align-items:stretch;flex:1;min-height:0}
    .af-duas>*{flex:1;min-height:0}
    .af-graf,.af-quiz{height:100%}
    .af-lado{display:flex;flex-direction:column;gap:calc(14px * var(--s));justify-content:center}
    .af-graf{background:rgba(var(--bg-2-rgb),.45);border:1px solid rgba(var(--line-rgb),.18);border-radius:calc(16px * var(--s));padding:calc(14px * var(--s));display:flex;flex-direction:column;gap:calc(12px * var(--s))}
    .af-graf-topo{display:flex;align-items:center;justify-content:space-between}
    .af-barras{flex:1;min-height:calc(100px * var(--s));display:flex;align-items:flex-end;gap:calc(12px * var(--s))}
    .af-barra{flex:1;border-radius:calc(6px * var(--s)) calc(6px * var(--s)) 0 0;background:linear-gradient(180deg,var(--cyan),rgba(var(--cyan-rgb),.25));box-shadow:0 0 18px rgba(var(--cyan-rgb),.28)}
    .af-quiz{background:rgba(var(--bg-2-rgb),.45);border:1px solid rgba(var(--line-rgb),.18);border-radius:calc(16px * var(--s));padding:calc(14px * var(--s));display:flex;flex-direction:column;gap:calc(11px * var(--s))}
    .af-quiz-topo{display:flex;align-items:center;gap:calc(10px * var(--s))}
    .af-quiz-selo{font-family:var(--mono);font-size:calc(12px * var(--s));letter-spacing:.16em;text-transform:uppercase;color:var(--cyan);border:1px solid rgba(var(--cyan-rgb),.4);border-radius:999px;padding:calc(3px * var(--s)) calc(9px * var(--s))}
    .af-ops{display:flex;flex-direction:column;gap:calc(8px * var(--s))}
    .af-op{display:flex;align-items:center;gap:calc(9px * var(--s));padding:calc(8px * var(--s)) calc(10px * var(--s));border-radius:calc(10px * var(--s));border:1px solid rgba(var(--line-rgb),.22);background:rgba(var(--panel-rgb),.35);min-height:calc(26px * var(--s))}
    .af-op-bola{width:calc(11px * var(--s));height:calc(11px * var(--s));border-radius:50%;border:1.5px solid rgba(var(--line-rgb),.5);flex:0 0 auto}
    .af-op-txt{flex:1;height:calc(8px * var(--s));border-radius:999px;background:rgba(var(--ink-rgb),.18)}
    .af-op-ic{width:calc(14px * var(--s));height:calc(14px * var(--s));flex:0 0 auto;display:none;color:var(--lime)}
    .af-op-ok{border-color:rgba(var(--lime-rgb),.7);background:rgba(var(--lime-rgb),.14)}
    .af-op-ok .af-op-ic{display:block}
    .af-op-ok .af-op-txt{background:rgba(var(--lime-rgb),.55)}
    .af-check{display:flex;flex-direction:column;gap:calc(9px * var(--s))}
    .af-item{display:flex;align-items:center;gap:calc(10px * var(--s))}
    .af-caixa{width:calc(22px * var(--s));height:calc(22px * var(--s));flex:0 0 auto;border-radius:calc(7px * var(--s));border:1.5px solid rgba(var(--cyan-rgb),.55);background:rgba(var(--cyan-rgb),.10);display:grid;place-items:center;padding:calc(4px * var(--s));color:var(--cyan)}
    .af-prog{display:flex;flex-direction:column;gap:calc(8px * var(--s))}
    .af-prog-topo{display:flex;align-items:baseline;justify-content:space-between}
    .af-prog-num{font-family:var(--mono);font-size:calc(18px * var(--s));color:var(--cyan)}
    .af-prog-trilho{height:calc(12px * var(--s));border-radius:999px;background:rgba(var(--line-rgb),.16);overflow:hidden}
    .af-prog-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--cyan),var(--lime));box-shadow:0 0 16px rgba(var(--cyan-rgb),.45);transform-origin:left center}
    .af-kpi{display:flex;align-items:flex-end;justify-content:space-between;gap:calc(16px * var(--s))}
    .af-kpi-num{font-family:var(--display);font-weight:800;font-size:calc(56px * var(--s));line-height:.9;color:var(--ink);letter-spacing:-.02em}
    .af-moeda{font-size:calc(26px * var(--s));color:var(--ink-dim)}
    .af-filtros{display:flex;align-items:center;gap:calc(6px * var(--s))}
    .af-filtro{font-size:calc(13px * var(--s));font-weight:700;color:var(--ink-dim);border:1px solid rgba(var(--line-rgb),.25);border-radius:999px;padding:calc(5px * var(--s)) calc(10px * var(--s))}
    .af-filtro-on{color:var(--cyan);border-color:rgba(var(--cyan-rgb),.55);background:rgba(var(--cyan-rgb),.12)}
    .af-filtro-ic{width:calc(17px * var(--s));height:calc(17px * var(--s));color:var(--ink-dim);display:inline-block;margin-left:calc(4px * var(--s))}
    .af-duas-dados{align-items:stretch}
    .af-meses{display:flex;align-items:flex-end;gap:calc(14px * var(--s));background:rgba(var(--bg-2-rgb),.45);border:1px solid rgba(var(--line-rgb),.18);border-radius:calc(16px * var(--s));padding:calc(16px * var(--s));min-height:calc(150px * var(--s))}
    .af-mes{flex:1;display:flex;flex-direction:column;align-items:center;gap:calc(7px * var(--s));height:100%;justify-content:flex-end}
    .af-mes-trilho{width:100%;flex:1;display:flex;align-items:flex-end;background:rgba(var(--line-rgb),.06);border-radius:calc(6px * var(--s))}
    .af-mes-fill{width:100%;border-radius:calc(6px * var(--s)) calc(6px * var(--s)) 0 0;background:linear-gradient(180deg,var(--blue-l),rgba(var(--blue-l-rgb),.25));transform-origin:center bottom}
    .af-mes-nome{font-family:var(--mono);font-size:calc(12px * var(--s));color:var(--ink-dim);text-transform:uppercase;letter-spacing:.1em}
    .af-cats{display:flex;align-items:center;gap:calc(12px * var(--s));background:rgba(var(--bg-2-rgb),.45);border:1px solid rgba(var(--line-rgb),.18);border-radius:calc(16px * var(--s));padding:calc(14px * var(--s))}
    .af-donut{width:calc(112px * var(--s));height:calc(112px * var(--s));flex:0 0 auto;filter:drop-shadow(0 0 14px rgba(var(--cyan-rgb),.18))}
    .af-legenda{display:flex;flex-direction:column;gap:calc(7px * var(--s));min-width:0}
    .af-leg-item{display:flex;align-items:center;gap:calc(7px * var(--s));font-size:calc(13px * var(--s));color:var(--ink-soft);white-space:nowrap}
    .af-leg-cor{width:calc(9px * var(--s));height:calc(9px * var(--s));border-radius:2px;flex:0 0 auto}
    .af-leg-nome{flex:1}
    .af-leg-val{font-family:var(--mono);color:var(--ink)}
    .af-topico{display:flex;align-items:center;gap:calc(10px * var(--s));padding:calc(8px * var(--s)) calc(10px * var(--s));border-radius:calc(12px * var(--s));background:rgba(var(--panel-2-rgb),.28);border:1px solid rgba(var(--line-rgb),.16)}
    .af-topicos{display:flex;flex-direction:column;gap:calc(7px * var(--s))}
    .af-num{width:calc(22px * var(--s));height:calc(22px * var(--s));border-radius:50%;display:grid;place-items:center;font-family:var(--mono);font-size:calc(12px * var(--s));color:var(--cyan);border:1px solid rgba(var(--cyan-rgb),.5);flex:0 0 auto}
    .af-topico-nome{font-size:calc(15px * var(--s));font-weight:700;color:var(--ink);white-space:nowrap}
    .af-quadro{flex:1;display:flex;gap:calc(14px * var(--s));min-height:0}
    .af-col{flex:1;display:flex;flex-direction:column;gap:calc(9px * var(--s));background:rgba(var(--bg-2-rgb),.42);border:1px solid rgba(var(--line-rgb),.16);border-radius:calc(16px * var(--s));padding:calc(12px * var(--s));min-width:0}
    .af-col-topo{display:flex;align-items:center;justify-content:space-between;padding-bottom:calc(4px * var(--s))}
    .af-col-nome{font-family:var(--mono);font-size:calc(12px * var(--s));letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);white-space:nowrap}
    .af-col-n{font-family:var(--mono);font-size:calc(12px * var(--s));color:var(--cyan)}
    .af-cartao{background:rgba(var(--panel-2-rgb),.55);border:1px solid rgba(var(--line-rgb),.22);border-radius:calc(12px * var(--s));padding:calc(10px * var(--s));display:flex;flex-direction:column;gap:calc(9px * var(--s));box-shadow:0 calc(6px * var(--s)) calc(14px * var(--s)) rgba(var(--shadow-rgb),.3)}
    .af-cartao-pe{display:flex;align-items:center;justify-content:space-between}
    .af-prazo{font-family:var(--mono);font-size:calc(11px * var(--s));color:var(--ink-dim);text-transform:uppercase;letter-spacing:.1em}
    .af-avatares{display:flex}
    .af-av{width:calc(15px * var(--s));height:calc(15px * var(--s));border-radius:50%;border:1.5px solid rgba(var(--bg-2-rgb),1);margin-left:calc(-4px * var(--s));background:linear-gradient(160deg,var(--cyan),var(--blue-l))}
    .af-av:nth-child(2){background:linear-gradient(160deg,var(--lime),var(--cyan))}
    .af-av:nth-child(3){background:linear-gradient(160deg,var(--amber),var(--lime))}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
