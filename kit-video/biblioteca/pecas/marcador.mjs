import { entrada, caixa, px } from "./base.mjs";

export const contrato = {
  nome: "marcador",
  funcao: "traço à mão em volta de algo que já está na tela: círculo, retângulo arredondado ou seta",
  usa: "forma (circulo|caixa|seta), caixa {left,top,width,height}, cor, grossura, rot, fatias, at, dur",
  naoFaz: "marcar sem saber a caixa do alvo — meça a peça e passe os números",
};

const FORMAS = ["circulo", "caixa", "seta"];

/* ---------- geometria ----------
   O traço é calculado nas coordenadas REAIS da caixa, nunca num 0–100
   esticado. Era isso que quebrava o desenho: com viewBox esticado
   (`preserveAspectRatio="none"`) o pontilhado do dash virava arco solto e
   a caneta corria mais rápido na horizontal do que na vertical.

   Aqui o caminho é uma polilinha densa, fatiada em pedaços iguais medidos em
   pixels e acesa em ordem — sem dash, sem esticamento, velocidade uniforme. */

function pontosCirculo(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const rx = Math.max(12, w / 2 - 10);
  const ry = Math.max(12, h / 2 - 10);
  const inicio = -2.5;
  const volta = Math.PI * 2 + 0.45;
  const passos = 120;
  const pts = [];
  for (let i = 0; i <= passos; i += 1) {
    const a = inicio + (i / passos) * volta;
    const desvio = 1 + 0.026 * Math.sin(a * 3 + 1.1) + 0.015 * Math.sin(a * 5 + 0.4);
    pts.push([cx + Math.cos(a) * rx * desvio, cy + Math.sin(a) * ry * desvio]);
  }
  return [pts];
}

function pontosCaixa(w, h) {
  const m = 8;
  const x0 = m;
  const y0 = m;
  const x1 = w - m;
  const y1 = h - m;
  const r = Math.max(10, Math.min(30, Math.min(w, h) * 0.22));
  const pts = [];

  const reta = (ax, ay, bx, by, n = 6) => {
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      pts.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
    }
  };
  const canto = (cx, cy, a0) => {
    for (let i = 0; i <= 8; i += 1) {
      const a = a0 + (Math.PI / 2) * (i / 8);
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };

  // entra pela aresta de cima, um pouco à esquerda do canto, e dá a volta
  reta(x0 + r + 40, y0 - 3, x1 - r, y0, 10);
  canto(x1 - r, y0 + r, -Math.PI / 2);
  reta(x1, y0 + r, x1, y1 - r, 8);
  canto(x1 - r, y1 - r, 0);
  reta(x1 - r, y1, x0 + r, y1, 10);
  canto(x0 + r, y1 - r, Math.PI / 2);
  reta(x0, y1 - r, x0, y0 + r, 8);
  canto(x0 + r, y0 + r, Math.PI);
  // sobrepassa um pouco o ponto de entrada, como a caneta que não fecha exato
  reta(x0, y0 + r, x0 + r + 32, y0 - 2, 8);

  return [pts];
}

function pontosSeta(w, h) {
  const x1 = 10;
  const y1 = h - 14;
  const x2 = w - 34;
  const y2 = 22;
  const corpo = [];
  for (let i = 0; i <= 48; i += 1) {
    const t = i / 48;
    corpo.push([
      x1 + (x2 - x1) * t,
      y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * h * 0.13,
    ]);
  }
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const asa = 30;
  const a1 = ang + Math.PI * 0.8;
  const a2 = ang - Math.PI * 0.8;
  const ponta = [
    [x2 + Math.cos(a1) * asa, y2 + Math.sin(a1) * asa],
    [x2, y2],
    [x2 + Math.cos(a2) * asa, y2 + Math.sin(a2) * asa],
  ];
  return [corpo, ponta];
}

const pontosDaForma = (forma, w, h) =>
  forma === "caixa" ? pontosCaixa(w, h) : forma === "seta" ? pontosSeta(w, h) : pontosCirculo(w, h);

const comprimento = (pts) => {
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) {
    total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return total;
};

const paraPath = (pts) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

/* divide uma polilinha em n pedaços de mesmo comprimento, mantendo os pontos
   originais (cortar em linha reta entre dois cortes comeria os cantos) */
function fatiar(pts, n) {
  const total = comprimento(pts);
  if (!(total > 0)) return [];
  const passo = total / n;
  const fatias = [];
  let atual = [pts[0]];
  let acumulado = 0;
  let alvo = passo;

  for (let i = 1; i < pts.length; i += 1) {
    let a = pts[i - 1];
    const b = pts[i];
    let d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    while (d > 0 && acumulado + d >= alvo - 1e-9) {
      const t = (alvo - acumulado) / d;
      const meio = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      atual.push(meio);
      fatias.push(atual);
      atual = [meio];
      a = meio;
      d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      acumulado = alvo;
      alvo += passo;
    }
    atual.push(b);
    acumulado += d;
  }
  if (atual.length > 1) fatias.push(atual);
  return fatias;
}

/* fatias de todos os sub-caminhos, com a cota de cada um pelo seu comprimento:
   o corpo da seta recebe mais pedaços do que as duas asas da ponta */
export function tracoEmSegmentos(forma, w, h, fatias = 34) {
  const grupos = pontosDaForma(forma, w, h);
  const totais = grupos.map(comprimento);
  const soma = totais.reduce((a, b) => a + b, 0);
  if (!(soma > 0)) return [];

  const saida = [];
  grupos.forEach((pts, i) => {
    const cota = Math.max(2, Math.round((totais[i] / soma) * fatias));
    for (const f of fatiar(pts, cota)) {
      if (f.length > 1) saida.push(paraPath(f));
    }
  });
  return saida;
}

/* miolo do SVG: um <path data-seg> por fatia, na ordem em que a caneta anda.
   O motor acende um depois do outro no gesto `trace`. */
export function tracos(forma, w, h, grossura, fatias = 34) {
  return tracoEmSegmentos(forma, w, h, fatias)
    .map((d) => `<path d="${d}" data-seg stroke-width="${grossura}"/>`)
    .join("");
}

export function montar(p = {}) {
  const {
    forma = "circulo",
    caixa: box = null,
    cor = "var(--cyan)",
    grossura = 5,
    rot = 0,
    fatias = 34,
    at = 1,
    dur = 0.8,
  } = p;

  if (!FORMAS.includes(forma)) {
    throw new Error(`marcador: forma "${forma}" não existe — use: ${FORMAS.join(", ")}`);
  }
  if (!box || box.left == null || box.top == null || !box.width || !box.height) {
    throw new Error("marcador: informe `caixa: { left, top, width, height }`");
  }

  const w = Math.round(box.width);
  const h = Math.round(box.height);

  return {
    html: `<div style="position:absolute;left:${box.left}px;top:${box.top}px;width:${w}px;height:${h}px;pointer-events:none;transform:rotate(${rot}deg)">
      <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke="${cor}" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible;filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.45))" data-at="${at}" data-anim="trace" data-dur="${dur}">
        ${tracos(forma, w, h, grossura, fatias)}
      </svg>
    </div>`,
  };
}
