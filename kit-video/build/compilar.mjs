/* ============================================================
   COMPILADOR — transforma a montagem (dados) em cenas montadas.
   A montagem é o único arquivo que muda de vídeo para vídeo.
   ============================================================ */

import { writeFileSync, readFileSync } from "node:fs";

/* uma cena, uma forma: `livre`. O desenho vem das peças. */
import * as livre from "../biblioteca/cenas/livre.mjs";

import { PECAS, cssDePecas } from "../biblioteca/pecas/index.mjs";
import { MIN_JANELA } from "../biblioteca/pecas/fim.mjs";
import { FICHAS, fichaPose } from "../biblioteca/personagem.mjs";
import { caixasDaCena } from "../biblioteca/medidas.mjs";

import * as scan from "../biblioteca/transicoes/scan.mjs";
import * as tinta from "../biblioteca/transicoes/tinta.mjs";
import * as circulo from "../biblioteca/transicoes/circulo.mjs";
import * as faixa from "../biblioteca/transicoes/faixa.mjs";
import * as cortina from "../biblioteca/transicoes/cortina.mjs";

import * as barraProgresso from "../biblioteca/overlays/barra-progresso.mjs";
import * as canto from "../biblioteca/overlays/canto.mjs";
import * as marca from "../biblioteca/overlays/marca.mjs";
import * as carimbo from "../biblioteca/overlays/carimbo.mjs";
import * as rabisco from "../biblioteca/overlays/rabisco.mjs";
import * as faisca from "../biblioteca/overlays/faisca.mjs";

const CENAS = { livre };
const TRANSICOES = { scan, tinta, circulo, faixa, cortina };
const OVERLAYS = { "barra-progresso": barraProgresso, canto, marca, carimbo, rabisco, faisca };

const TRACK_CENA = 1;
const TRACK_TRANSICAO = 6;
const TRACK_OVERLAY = 7;

/* formatos de quadro. 16:9 é o padrão; 9:16 é o Short vertical.
   A montagem declara o formato e a cena se desenha nele. */
const FORMATOS = ["16:9", "9:16"];

function validarContrato(contrato, cena, indice) {
  const valores = cena.valores || {};
  const faltando = (contrato.obrigatorios || []).filter(
    (k) => valores[k] === undefined || valores[k] === null || valores[k] === "",
  );
  if (faltando.length) {
    throw new Error(
      `cena ${indice + 1} (${contrato.nome}): faltam ${faltando.join(", ")}`,
    );
  }
  if (!(cena.dur > 0)) {
    throw new Error(`cena ${indice + 1} (${contrato.nome}): dur precisa ser > 0`);
  }
}

/* ---------- ancoragem por palavra ----------
   Em vez de caçar o segundo exato na transcrição, a montagem escreve
   `at: "nunca"` e o compilador resolve. `palavra#2` pega a segunda ocorrência. */
function semAcentoPontuacao(t) {
  return String(t)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?…;:"“”'’()\-–—]/g, "");
}

function mapaDeFala(fala = []) {
  const mapa = [];
  for (const bloco of fala) {
    const palavras = JSON.parse(readFileSync(bloco.json, "utf8"));
    for (const p of palavras) {
      mapa.push({ chave: semAcentoPontuacao(p.text), tempo: (bloco.em || 0) + p.start });
    }
  }
  return mapa;
}

function resolverFala(valor, mapa, id, campo, base = 0) {
  if (typeof valor !== "string") return valor;
  const [alvo, ocorrencia] = valor.split("#");
  const chave = semAcentoPontuacao(alvo);
  const achados = mapa.filter((w) => w.chave === chave || w.chave.startsWith(chave));
  const idx = ocorrencia ? Number(ocorrencia) - 1 : 0;
  if (!achados[idx]) {
    throw new Error(`${id}: "${alvo}" não aparece na transcrição (campo ${campo})`);
  }
  // a palavra está no tempo do filme; o data-at da cena é relativo ao começo dela
  const t = +(achados[idx].tempo - base).toFixed(2);
  if (t < -0.35) {
    console.log(
      `[montagem] ${id}: "${alvo}" ocorre em ${achados[idx].tempo.toFixed(2)}s, antes da cena começar (${base.toFixed(2)}s) — campo ${campo}`,
    );
  }
  return Math.max(0, t);
}

/* resolve `at`/`at2` de objetos que carregam animação (blocos, itens, peças,
   passos, eventos…). Um campo `at: "nunca"` vira o segundo da palavra. */
function resolverAt(objeto, mapa, id, caminho, base) {
  if (!objeto || typeof objeto !== "object" || Array.isArray(objeto)) return objeto;
  const saida = { ...objeto };
  for (const chave of ["at", "at2"]) {
    if (saida[chave] !== undefined) {
      saida[chave] = resolverFala(saida[chave], mapa, id, `${caminho}.${chave}`, base);
    }
  }
  /* peças com ritmo interno (artefato, estudio, fichario, sala, fusao) recebem
     um objeto `t`: cada chave é um momento da peça e aceita a mesma palavra. */
  if (saida.t && typeof saida.t === "object" && !Array.isArray(saida.t)) {
    saida.t = Object.fromEntries(
      Object.entries(saida.t).map(([k, v]) => [
        k,
        resolverFala(v, mapa, id, `${caminho}.t.${k}`, base),
      ]),
    );
  }
  /* listas dentro da peça (linhas do ranking, itens do checklist, marcos do
     eixo) também aceitam palavra: cada linha pode entrar na palavra em que o
     número dela é dito, em vez de todas entrarem no ritmo fixo da peça. */
  for (const [campo, valor] of Object.entries(saida)) {
    if (!Array.isArray(valor)) continue;
    saida[campo] = valor.map((item, i) =>
      resolverAt(item, mapa, id, `${caminho}.${campo}[${i}]`, base),
    );
  }
  return saida;
}

/* Num corte, o primeiro elemento da cena nova tem de estar no quadro no
   quadro zero. As cenas nascem com o primeiro `at` em 0,1–0,3 s (entrada
   escalonada), o que deixava ~0,2 s de tela vazia depois de cada corte.
   Aqui só o elemento mais adiantado é puxado para 0; os demais mantêm o
   tempo, para não perder a ancoragem na palavra. */
function ancorarNoCorte(body) {
  if (!body) return body;
  const valores = [...body.matchAll(/data-at="(\d+(?:\.\d+)?)"/g)].map((m) => parseFloat(m[1]));
  if (!valores.length) return body;
  const min = Math.min(...valores);
  if (!(min > 0) || min > 0.35) return body;
  return body.replace(/data-at="(\d+(?:\.\d+)?)"/g, (tudo, v) =>
    Math.abs(parseFloat(v) - min) < 1e-6 ? 'data-at="0"' : tudo,
  );
}

/* Piso de leitura do check: 0,5 s de acomodação + 0,3 s por palavra.
   A `nota` marca quantas palavras tem (data-leitura) e morre com a cena, então
   dá para saber antes do build se ela fica tempo de menos na tela. */
function validarLeitura(cena) {
  if (!cena.body) return;
  for (const tag of cena.body.match(/<[^>]*data-leitura="\d+"[^>]*>/g) || []) {
    const n = Number(/data-leitura="(\d+)"/.exec(tag)?.[1] ?? 0);
    const at = Number(/data-at="([\d.]+)"/.exec(tag)?.[1] ?? 0);
    if (!n) continue;
    const precisa = 0.5 + 0.3 * n;
    const tem = cena.dur - at;
    if (tem + 0.02 < precisa) {
      console.log(
        `[leitura] ${cena.id}: nota de ${n} palavra(s) entra em ${at.toFixed(2)}s de uma cena de ${cena.dur.toFixed(2)}s — ` +
          `${tem.toFixed(2)}s de tela, o check pede ${precisa.toFixed(2)}s. Antecipe o "at" ou alongue a cena.`,
      );
    }
  }
}

function resolverValores(valores, mapa, id, base = 0) {
  if (!mapa.length) return valores;
  const saida = { ...valores };
  if (saida.t && typeof saida.t === "object") {
    saida.t = Object.fromEntries(
      Object.entries(saida.t).map(([k, v]) => [
        k,
        resolverFala(v, mapa, id, `t.${k}`, base),
      ]),
    );
  }
  for (const [campo, valor] of Object.entries(saida)) {
    if (campo === "t" || !Array.isArray(valor)) continue;
    saida[campo] = valor.map((item, i) =>
      resolverAt(item, mapa, id, `${campo}[${i}]`, base),
    );
  }
  return saida;
}

/* ---------- ritmo: o guia virando teste ---------- */
function validarRitmo(cenas) {
  if (!cenas.length) return;
  const durs = cenas.map((c) => c.dur).sort((a, b) => a - b);
  const mediana = durs[Math.floor(durs.length / 2)];
  if (mediana < 3.5) console.log(`[ritmo] corte mediano em ${mediana.toFixed(1)}s — guia: 5–8s`);
  if (mediana > 9) console.log(`[ritmo] corte mediano em ${mediana.toFixed(1)}s — guia: 5–8s`);

  cenas.forEach((c) => {
    if (c.dur < 2.4) console.log(`[ritmo] ${c.id} dura ${c.dur}s (mínimo 2,4s)`);
    if (c.dur > 15) console.log(`[ritmo] ${c.id} dura ${c.dur}s (máximo 15s)`);
    const entradas = (c.body.match(/data-at=/g) || []).length;
    if (c.dur > 8 && entradas < 3) {
      console.log(`[ritmo] ${c.id}: ${c.dur}s com ${entradas} entrada(s) — risco de tela parada`);
    }
  });
}

/* ---------- poses: a ficha manda, o nome não ---------- */
const POR_ARQUIVO = Object.fromEntries(Object.entries(FICHAS).map(([nome, f]) => [f.arquivo, nome]));

/* toda figura deixa o caminho do PNG no HTML compilado: é por ele que se conta
   a pose, inclusive a que veio dentro de uma cena `livre`. */
function posesDoCorpo(body) {
  return [...body.matchAll(/assets\/personagem\/([\w-]+)\.png/g)].map((m) => POR_ARQUIVO[m[1]] ?? m[1]);
}

function validarPoses(cenas, slug = null) {
  const usos = [];
  for (const c of cenas) {
    for (const pose of posesDoCorpo(c.body)) usos.push({ id: c.id, pose });
  }
  if (!usos.length) return;

  const vistas = new Map();
  const origens = new Set();
  for (const { id, pose } of usos) {
    const ficha = fichaPose(pose);
    const nome = ficha?.nome ?? pose;
    if (!ficha) console.log(`[pose] ${id}: "${pose}" não está no fichário`);
    if (vistas.has(nome)) {
      console.log(`[pose] ${id}: "${nome}" repete — já está em ${vistas.get(nome)}`);
    } else {
      vistas.set(nome, id);
    }
    if (ficha?.de && ficha.de !== slug && !["kit", "correção"].includes(ficha.de)) origens.add(ficha.de);
  }

  const resumo = `[pose] ${usos.length} uso(s) · ${vistas.size} distinta(s)`;
  console.log(origens.size ? `${resumo} · de outros vídeos: ${[...origens].join(", ")}` : resumo);

  if (usos.length >= 15 && vistas.size < 10) {
    console.log("[pose] piso de variedade: com 15+ figuras, use ao menos 10 poses distintas");
  }
}

/* ---------- textos que dividem a mesma faixa ----------
   O `check` do HyperFrames não compara TEXTO com TEXTO: dois blocos podem
   ocupar a mesma faixa e ele passa. O caso clássico é o título que quebra em
   duas linhas e come o de baixo, que foi posicionado contando uma linha só.

   A peça `titulo` deixa a medida anotada (biblioteca/medidas.mjs). A conta aqui
   é aritmética, sem navegador: altura = linhas × tamanho × line-height. Quem
   declara as linhas com `\n` tem altura exata; quem deixa quebrar sozinho tem
   altura estimada — e o aviso pede para declarar. */
function caixaDeTexto(m) {
  const w = m.w ?? m.larguraTexto;
  const linhas = m.linhas > 0 ? m.linhas : Math.max(1, Math.ceil(m.larguraTexto / w));
  return {
    left: m.x,
    top: m.y,
    right: m.x + Math.min(w, m.larguraTexto),
    bottom: m.y + linhas * m.tamanho * m.lh,
    altura: linhas * m.tamanho * m.lh,
    linhas,
  };
}

function validarCaixas(cena, medidas) {
  /* depurar "por que não avisou?": HF_CAIXAS=1 mostra quantas caixas a cena registrou */
  if (process.env.HF_CAIXAS) console.log(`${cena.id}: ${(medidas || []).length} caixa(s) · ${(medidas || []).map((m) => m.peca).join(",")}`);
  if (!medidas || medidas.length < 2) return;
  const itens = medidas.map((m) => ({
    m,
    c: caixaDeTexto(m),
    de: typeof m.at === "number" ? m.at : 0,
    ate: typeof m.at2 === "number" ? m.at2 : Infinity,
  }));

  for (let i = 0; i < itens.length; i += 1) {
    for (let j = i + 1; j < itens.length; j += 1) {
      const a = itens[i];
      const b = itens[j];
      /* um já saiu quando o outro entrou */
      if (a.ate <= b.de || b.ate <= a.de) continue;
      const larg = Math.min(a.c.right, b.c.right) - Math.max(a.c.left, b.c.left);
      const alt = Math.min(a.c.bottom, b.c.bottom) - Math.max(a.c.top, b.c.top);
      if (larg < 8 || alt < 6) continue;
      const areaA = (a.c.right - a.c.left) * (a.c.bottom - a.c.top);
      const areaB = (b.c.right - b.c.left) * (b.c.bottom - b.c.top);
      const pct = Math.round(((larg * alt) / Math.min(areaA, areaB)) * 100);
      if (pct < 3) continue;

      const estimado = a.m.linhas === 0 || b.m.linhas === 0;
      const quando = cena.start + Math.max(a.de, b.de);
      const verbo = pct >= 12 ? "invade" : "encosta em";
      console.log(
        `[texto] ${cena.id} (${quando.toFixed(1)}s): "${a.m.texto}" (y ${a.m.y}, ${Math.round(a.c.altura)}px em ${a.c.linhas} linha(s)) ${verbo} "${b.m.texto}" (y ${b.m.y}) — ${Math.round(alt)}px de sobreposição` +
          (estimado ? " · altura estimada: quebre a frase com \\n para ser exata" : ""),
      );
    }
  }
}

/* ---------- cartão final com piso de duração ----------
   A última cena é a tela do canal (peça `fim`): avatar, slot do próximo vídeo
   e botão de inscrever. Quando a narração termina colada no corte, essa cena
   herdava só a cauda do áudio — 1,6 s de cartão, tempo de ninguém ler. Aqui a
   cena é esticada até MIN_JANELA (10 s). A montagem pode pedir outro piso com
   `fim: 12`, e desligar com `fim: 0` (vídeo já renderizado, demo).
   A peça recebe `janela` com a duração final: é o que permite espaçar as
   ondas do botão até o fim em vez de amontoá-las no começo. */
function ajustarCartaoFinal(montagem) {
  const pedido = montagem.fim === undefined ? MIN_JANELA : Number(montagem.fim);
  const cenas = (montagem.cenas || []).map((c) => ({ ...c }));
  if (!(pedido > 0) || !cenas.length) return { cenas, esticado: false };

  const ultima = cenas[cenas.length - 1];
  const pecas = ultima.valores?.pecas;
  if (!Array.isArray(pecas) || !pecas.some((p) => p && p.tipo === "fim")) {
    return { cenas, esticado: false };
  }

  let antes = 0;
  for (const c of cenas) {
    if (c === ultima) break;
    antes = (c.em ?? antes) + Number(c.dur);
  }
  const inicio = ultima.em ?? antes;
  const atual = Number(ultima.dur);
  const janela = +Math.max(atual, pedido).toFixed(2);

  if (janela > atual) {
    console.log(`[fim] cartão final em ${inicio}s: ${atual}s → ${janela}s`);
  }
  ultima.dur = janela;
  ultima.valores = {
    ...ultima.valores,
    pecas: pecas.map((p) => (p && p.tipo === "fim" ? { ...p, janela } : p)),
  };
  return { cenas, esticado: janela > atual };
}

export function compilar(montagem) {
  const cenas = [];
  const mapa = mapaDeFala(montagem.fala || []);
  let cursor = 0;

  const formato = montagem.formato || "16:9";
  if (!FORMATOS.includes(formato)) {
    throw new Error(
      `formato "${formato}" não existe — use: ${FORMATOS.join(", ")}`,
    );
  }

  const { cenas: cenasMontagem, esticado: cartaoEsticado } = ajustarCartaoFinal(montagem);

  cenasMontagem.forEach((c, i) => {
    const mod = CENAS[c.bloco];
    if (!mod) {
      throw new Error(
        `cena ${i + 1}: bloco "${c.bloco}" não existe. Disponíveis: ${Object.keys(CENAS).join(", ")}`,
      );
    }
    validarContrato(mod.contrato, c, i);

    const id = `s${String(i + 1).padStart(2, "0")}`;
    const start = c.em ?? cursor;
    const dur = +Number(c.dur).toFixed(2);

    if (start < cursor - 0.01) {
      throw new Error(
        `${id}: começa em ${start}s, antes do fim da cena anterior (${cursor.toFixed(2)}s)`,
      );
    }
    if (start > cursor + 0.01) {
      console.log(`[montagem] vão ${(start - cursor).toFixed(2)}s de tela vazia antes de ${id}`);
    }

    const valores = resolverValores(c.valores || {}, mapa, id, start);
    cssDePecas(); // descarta CSS de peças de uma cena anterior
    caixasDaCena(); // idem para as medidas de texto
    const saida = mod.montar({ id, dur, valores, formato });
    validarCaixas({ id, start }, caixasDaCena());
    const body = ancorarNoCorte(saida.body);
    validarLeitura({ id, dur, body });
    const cssPecas = cssDePecas();
    cenas.push({
      id,
      bloco: c.bloco,
      start,
      dur,
      body,
      css: [saida.css || "", cssPecas].filter(Boolean).join("\n"),
      transparent: !!saida.transparent,
      track: TRACK_CENA,
    });

    cursor = start + dur;
  });

  const transicoes = (montagem.transicoes || []).map((t, i) => {
    const mod = TRANSICOES[t.nome];
    if (!mod) {
      throw new Error(
        `transição ${i + 1}: "${t.nome}" não existe. Disponíveis: ${Object.keys(TRANSICOES).join(", ")}`,
      );
    }
    const dur = +Number(t.dur ?? 0.5).toFixed(2);
    const start = +Number(t.em ?? 0).toFixed(2);
    const id = `t${String(i + 1).padStart(2, "0")}`;
    const saida = mod.montar({ id, dur, valores: t.valores || {} });
    return {
      id,
      bloco: `transicao:${t.nome}`,
      start,
      dur,
      body: saida.body,
      css: saida.css || "",
      transparent: true,
      track: TRACK_TRANSICAO,
    };
  });

  const overlays = (montagem.overlays || []).map((o, i) => {
    const mod = OVERLAYS[o.nome];
    if (!mod) {
      throw new Error(
        `overlay ${i + 1}: "${o.nome}" não existe. Disponíveis: ${Object.keys(OVERLAYS).join(", ")}`,
      );
    }
    const dur = +Number(o.dur ?? 1.6).toFixed(2);
    const start = +Number(o.em ?? 0).toFixed(2);
    const id = `o${String(i + 1).padStart(2, "0")}`;
    const saida = mod.montar({ id, dur, valores: o.valores || {} });
    return {
      id,
      bloco: `overlay:${o.nome}`,
      start,
      dur,
      body: saida.body,
      css: saida.css || "",
      transparent: true,
      track: TRACK_OVERLAY,
    };
  });

  // narração: confere se cada bloco começa perto de uma cena (tempo de fala ≠ tempo de corte)
  const narracao = montagem.narracao || [];
  for (const n of narracao) {
    if (n.em === undefined) continue;
    const perto = cenas.some((c) => Math.abs(c.start - n.em) < 0.6);
    if (!perto) {
      console.log(
        `[montagem] narração "${n.src}" começa em ${n.em}s sem cena começando por perto`,
      );
    }
  }

  const fimCenas = Math.max(...cenas.map((c) => c.start + c.dur), 0);
  let total = +(montagem.total ?? fimCenas).toFixed(2);
  if (total < fimCenas - 0.01) {
    if (!cartaoEsticado) {
      throw new Error(`total (${total}s) menor que a última cena (${fimCenas.toFixed(2)}s)`);
    }
    console.log(`[fim] total da montagem (${total}s) acompanha o cartão: ${fimCenas.toFixed(2)}s`);
    total = +fimCenas.toFixed(2);
  }

  // transição fora da linha do tempo é erro silencioso: avisa
  for (const t of transicoes) {
    if (t.start < 0 || t.start + t.dur > total + 0.01) {
      console.log(`[montagem] transição ${t.id} cai fora do vídeo (${t.start}s + ${t.dur}s)`);
    }
  }

  /* a marcação presa ao texto vem com o som do gesto */
  const sfx = [...(montagem.sfx || [])];
  for (const c of cenas) {
    if (!c.body || !c.body.includes("data-marca")) continue;
    const marcas = c.body.matchAll(/data-marca(?![-\w])([^>]*)data-at="([\d.]+)"[^>]*data-dur="([\d.]+)"/g);
    for (const m of marcas) {
      const som = /data-marca-som="([^"]*)"/.exec(m[1])?.[1] ?? "assets/sfx/caneta.wav";
      if (som === "0") continue;
      const vol = Number(/data-marca-vol="([\d.]+)"/.exec(m[1])?.[1] ?? 0.16);
      sfx.push({
        src: som,
        start: +(c.start + parseFloat(m[2])).toFixed(2),
        vol: Number.isFinite(vol) ? vol : 0.16,
      });
    }
  }

  gerarCatalogo();
  validarRitmo(cenas);
  validarPoses(cenas, montagem.slug ?? null);

  return {
    title: montagem.titulo || "Sem título",
    total,
    formato,
    scenes: [...cenas, ...transicoes, ...overlays].sort(
      (a, b) => a.track - b.track || a.start - b.start,
    ),
    audio: montagem.audio || [],
    sfx,
    watermark: montagem.watermark || null,
  };
}

/* catálogo sempre atualizado: é a documentação que não envelhece */
function gerarCatalogo() {
  const linhas = [
    "# Catálogo da biblioteca",
    "",
    "Gerado por `build/compilar.mjs` a cada build. Não editar à mão.",
    "",
    "## A cena",
    "",
    "O kit tem um bloco só. Tudo o que aparece na tela é peça.",
    "",
    "| Bloco | Quando usar | Duração | Obrigatórios | Opcionais | Não faz |",
    "| --- | --- | --- | --- | --- | --- |",
  ];

  for (const [nome, mod] of Object.entries(CENAS)) {
    const c = mod.contrato;
    linhas.push(
      `| \`${nome}\` | ${c.funcao} | ${c.duracao} | ${(c.obrigatorios || []).join(", ") || "—"} | ${(c.opcionais || []).join(", ") || "—"} | ${c.naoFaz || "—"} |`,
    );
  }

  linhas.push("", "## Transições", "", "| Nome | Efeito | Duração |", "| --- | --- | --- |");
  for (const [nome, mod] of Object.entries(TRANSICOES)) {
    const c = mod.contrato;
    linhas.push(`| \`${nome}\` | ${c.funcao} | ${c.duracao} |`);
  }

  linhas.push("", "## Overlays", "", "| Nome | Efeito | Duração |", "| --- | --- | --- |");
  for (const [nome, mod] of Object.entries(OVERLAYS)) {
    const c = mod.contrato;
    linhas.push(`| \`${nome}\` | ${c.funcao} | ${c.duracao} |`);
  }
  linhas.push(
    "",
    "## Peças (o desenho)",
    "",
    "| Peça | Quando usar | Aceita | Não faz |",
    "| --- | --- | --- | --- |",
  );
  for (const [nome, mod] of Object.entries(PECAS)) {
    const c = mod.contrato;
    linhas.push(`| \`${nome}\` | ${c.funcao} | ${c.usa || "—"} | ${c.naoFaz || "—"} |`);
  }

  linhas.push(
    "",
    "## Poses do personagem (assets/personagem)",
    "",
    "| Pose | O que a imagem mostra | Enquadramento | Nasceu em |",
    "| --- | --- | --- | --- |",
  );
  for (const [nome, f] of Object.entries(FICHAS)) {
    linhas.push(`| \`${nome}\` | ${f.ve} | ${f.enquadramento} | ${f.de} |`);
  }

  linhas.push(
    "",
    "Transição entra na montagem como `{ nome, em, dur }` e ocupa uma faixa própria,",
    "por cima do corte. Ela nunca substitui o corte: cobre 0,4–0,7 s dele.",
    "",
    "Overlay entra como `{ nome, em, dur, valores }` e ocupa a faixa mais alta,",
    "acima de cenas e transições.",
    "",
  );

  writeFileSync("biblioteca/CATALOGO.md", linhas.join("\n"), "utf8");
}
