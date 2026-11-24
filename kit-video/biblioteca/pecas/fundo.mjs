import { entrada, px } from "./base.mjs";

export const contrato = {
  nome: "fundo",
  funcao: "o mundo atrás da cena: ondas da marca, grade, aurora, globo pontilhado, circuito ou scanlines",
  usa: "qual (ondas|grade|aurora|globo|circuito|scan|vazio), opacidade, x, y, d, at",
  naoFaz: "duas variantes na mesma cena; o fundo é um só e a cena se desenha por cima",
};

const QUAL = ["ondas", "grade", "aurora", "globo", "circuito", "scan", "vazio"];

/* gerador determinístico: o mesmo frame em todo render, sem Math.random */
function sorteio(semente) {
  let s = semente;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/* esfera de pontos: latitudes e longitudes projetadas em perspectiva simples.
   Lê como "mundo inteiro" — serve de fundo para qualquer assunto global. */
function globo(cx, cy, R, cor, op) {
  const pontos = [];
  for (let lat = -78; lat <= 78; lat += 12) {
    const la = (lat * Math.PI) / 180;
    const n = Math.max(6, Math.round(40 * Math.cos(la)));
    for (let i = 0; i < n; i += 1) {
      const lon = (i / n) * Math.PI * 2;
      const x3 = Math.cos(la) * Math.sin(lon);
      const y3 = Math.sin(la);
      const z3 = Math.cos(la) * Math.cos(lon);
      const frente = (z3 + 1) / 2;
      const r = 1.2 + 2.8 * frente;
      const o = (0.08 + 0.5 * frente) * op;
      pontos.push(
        `<circle cx="${(cx + R * x3).toFixed(1)}" cy="${(cy - R * y3).toFixed(1)}" r="${r.toFixed(1)}" fill="${cor}" opacity="${o.toFixed(3)}"/>`,
      );
    }
  }
  const anel = `<ellipse cx="${cx}" cy="${cy}" rx="${(R * 1.16).toFixed(1)}" ry="${(R * 0.34).toFixed(1)}" fill="none" stroke="${cor}" stroke-width="1.4" opacity="${(0.22 * op).toFixed(2)}" transform="rotate(-18 ${cx} ${cy})"/>`;
  const brilho = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${cor}" stroke-width="1" opacity="${(0.12 * op).toFixed(2)}"/>`;
  return anel + brilho + pontos.join("");
}

/* placa de circuito: trilhas ortogonais com pinos nas pontas. Cresce em
   sequência, como um sistema acordando. */
function circuito(op) {
  const rnd = sorteio(41);
  const trilhas = [];
  const pinos = [];
  for (let i = 0; i < 16; i += 1) {
    const daEsquerda = i % 2 === 0;
    const x0 = daEsquerda ? -20 : 1940;
    const y0 = 80 + rnd() * 920;
    const x1 = daEsquerda ? 180 + rnd() * 380 : 1740 - rnd() * 380;
    const y1 = y0 + (rnd() - 0.5) * 160;
    const x2 = x1 + (daEsquerda ? 120 + rnd() * 220 : -(120 + rnd() * 220));
    const d = `M${x0} ${y0.toFixed(0)} L${x1.toFixed(0)} ${y0.toFixed(0)} L${x1.toFixed(0)} ${y1.toFixed(0)} L${x2.toFixed(0)} ${y1.toFixed(0)}`;
    trilhas.push(
      `<path d="${d}" fill="none" stroke="var(--cyan)" stroke-width="1.4" opacity="${(0.34 * op).toFixed(2)}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${(0.15 + i * 0.09).toFixed(2)}" data-anim="draw" data-dur="1.1"/>`,
    );
    pinos.push(
      `<circle cx="${x2.toFixed(0)}" cy="${y1.toFixed(0)}" r="4" fill="var(--cyan)" opacity="${(0.75 * op).toFixed(2)}" data-at="${(1.0 + i * 0.09).toFixed(2)}" data-anim="pop" data-dur="0.35"/>`,
    );
  }
  return trilhas.join("") + pinos.join("");
}

export function montar(p = {}) {
  const {
    qual = "grade",
    opacidade = 1,
    x = null,
    y = null,
    d = 420,
    cor = "var(--cyan)",
    at = 0,
  } = p;

  if (!QUAL.includes(qual)) {
    throw new Error(`fundo: "${qual}" não existe — use: ${QUAL.join(", ")}`);
  }

  if (qual === "vazio") return { html: "" };

  /* as ondas: dois blocos de azul e um de ciano, com o canto macio.
     É a assinatura de fundo da identidade — uma por cena, sempre atrás de tudo. */
  if (qual === "ondas") {
    return {
      html: `<div data-layout-allow-overflow style="position:absolute;inset:0;overflow:hidden;opacity:${opacidade};pointer-events:none">
        <svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">
          <path d="M-60 706 C 250 640 500 900 880 846 C 1250 794 1560 640 1990 716 L1990 1140 L-60 1140 Z" style="fill:var(--blue)" opacity=".30"/>
          <path d="M1990 -60 L1990 486 C 1720 452 1520 250 1590 -60 Z" style="fill:var(--cyan)" opacity=".10"/>
          <path d="M-60 236 C 300 196 500 60 548 -60 L-60 -60 Z" style="fill:var(--blue)" opacity=".18"/>
          <circle cx="1500" cy="940" r="330" style="fill:var(--cyan)" opacity=".07"/>
        </svg>
      </div>`,
    };
  }

  if (qual === "grade") {
    return {
      html: `<div data-layout-allow-overflow style="position:absolute;inset:0;opacity:${opacidade};pointer-events:none">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(var(--line-rgb),.07) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--line-rgb),.07) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(120% 90% at 50% 40%,#000 30%,transparent 82%)"></div>
      </div>`,
    };
  }

  if (qual === "aurora") {
    return {
      html: `<div data-layout-allow-overflow style="position:absolute;inset:0;overflow:hidden;opacity:${opacidade};pointer-events:none">
        <div class="glow-cyan" style="width:1100px;height:900px;left:1050px;top:-420px"></div>
        <div class="glow-blue" style="width:1000px;height:900px;left:-380px;top:520px"></div>
        <div class="glow-cyan" style="width:640px;height:520px;left:520px;top:640px;opacity:.5"></div>
      </div>`,
    };
  }

  if (qual === "globo") {
    const cx = x ?? 1450;
    const cy = y ?? 430;
    return {
      html: `<svg data-layout-allow-overflow viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0;opacity:${opacidade};pointer-events:none">
        <defs>
          <radialGradient id="haloGlobo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${cor}" stop-opacity=".16"/>
            <stop offset="70%" stop-color="${cor}" stop-opacity=".03"/>
            <stop offset="100%" stop-color="${cor}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${d * 1.35}" fill="url(#haloGlobo)"/>
        ${globo(cx, cy, d, cor, 1)}
      </svg>`,
    };
  }

  if (qual === "circuito") {
    return {
      html: `<svg data-layout-allow-overflow viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0;opacity:${opacidade};pointer-events:none">
        ${circuito(1)}
      </svg>`,
    };
  }

  // scan: linhas de varredura + uma faixa de luz atravessando o quadro
  return {
    html: `<div data-layout-allow-overflow style="position:absolute;inset:0;opacity:${opacidade};pointer-events:none">
      <div class="scanlines" style="opacity:.7"></div>
      <div style="position:absolute;left:0;right:0;height:260px;top:-300px;background:linear-gradient(180deg,transparent,rgba(var(--cyan-rgb),.06) 55%,rgba(var(--cyan-rgb),.20) 100%);box-shadow:0 0 70px rgba(var(--cyan-rgb),.16)" data-at="${at}" data-anim="desce" data-to="1500" data-dur="4.2"></div>
    </div>`,
  };
}
