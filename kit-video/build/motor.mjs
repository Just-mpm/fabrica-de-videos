/* ============================================================
   MOTOR — kit-video
   Gera compositions/*.html + index.html a partir de um "filme"
   (lista de cenas) e de um bloco de áudio.

   Regra de ouro: uma única timeline GSAP pausada por cena,
   registrada em window.__timelines[id]. Nada de requestAnimationFrame,
   nada de tempo de parede. O HyperFrames só dá seek → frame idêntico.

   Cada elemento anima por atributos:
     data-at="1.2"       segundos de entrada
     data-anim="words"   tipo de entrada (ver kinds)
     data-dur="0.8"      duração opcional (segundos)
     data-at2 / data-anim2 / data-dur2   segunda animação no mesmo elemento
   ============================================================ */

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";

/* ---------- duração real de mídia (evita tabela manual de durações) ---------- */
const durCache = new Map();
export function probe(src) {
  if (durCache.has(src)) return durCache.get(src);
  let d = null;
  try {
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
      { encoding: "utf8" },
    );
    d = parseFloat(String(out).trim());
    if (!Number.isFinite(d)) d = null;
  } catch {
    d = null;
  }
  durCache.set(src, d);
  return d;
}

/* ---------- runtime de uma cena (GSAP) ---------- */
export function sceneScript(id, dur) {
  return `
(() => {
  const S = document.getElementById('root');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });

  const num = (v) => (v === undefined || v === '' ? NaN : parseFloat(v));

  // cada kind devolve o "de" e o "para"; stagger é opcional
  const kinds = {
    rise:      () => ({ from: { y: 34, opacity: 0 },  to: { y: 0, opacity: 1 } }),
    riseSlow:  () => ({ from: { y: 58, opacity: 0 },  to: { y: 0, opacity: 1, duration: 0.95 } }),
    fade:      () => ({ from: { opacity: 0 },          to: { opacity: 1, duration: 0.72 } }),
    pop:       () => ({ from: { scale: 0.6, opacity: 0 }, to: { scale: 1, opacity: 1, ease: 'back.out(1.6)' } }),
    slam:      () => ({ from: { scale: 2.15, opacity: 0 }, to: { scale: 1, opacity: 1, duration: 0.3, ease: 'power4.inOut' } }),
    slideL:    () => ({ from: { x: -95, opacity: 0 }, to: { x: 0, opacity: 1 } }),
    slideR:    () => ({ from: { x: 95, opacity: 0 },  to: { x: 0, opacity: 1 } }),
    drop:      () => ({ from: { y: -110, opacity: 0 }, to: { y: 0, opacity: 1, ease: 'power4.out' } }),
    draw:      () => ({ from: { strokeDashoffset: 1.1, opacity: 1 }, to: { strokeDashoffset: 0, duration: 0.9, ease: 'sine.inOut' } }),
    growX:     () => ({ from: { scaleX: 0, opacity: 1, transformOrigin: 'left center' }, to: { scaleX: 1 } }),
    growY:     () => ({ from: { scaleY: 0, opacity: 1, transformOrigin: 'center bottom' }, to: { scaleY: 1 } }),
    // revela de cima para baixo, como uma cortina de dados (painel, janela, lista)
    scanIn:    () => ({ from: { clipPath: 'inset(0 0 100% 0)', opacity: 1 }, to: { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' } }),
    // entra desfocado e ganha nitidez: o gesto de "isso está ficando claro"
    blurIn:    () => ({ from: { filter: 'blur(16px)', opacity: 0 }, to: { filter: 'blur(0px)', opacity: 1, duration: 0.9, ease: 'power2.out' } }),
    // falha de sinal curta antes de assentar (título, número, janela)
    glitchIn:  () => ({ from: { x: -10, skewX: 9, opacity: 0 }, to: { x: 0, skewX: 0, opacity: 1, duration: 0.42, ease: 'steps(6)' } }),
    // abre/fecha: estreita o elemento no eixo X até data-escala, a partir de
    // data-origem (dobradiça).
    abre:      (el) => ({
      from: { scaleX: 1, opacity: 1, transformOrigin: el.dataset.origem || 'left center' },
      to: {
        scaleX: Number.isFinite(num(el.dataset.escala)) ? num(el.dataset.escala) : 0.2,
        duration: 1.1,
        ease: 'power2.inOut',
      },
    }),
    // gira até um ângulo: data-de é o ângulo de partida (padrão 0) e data-rot o
    // final; data-origem move o eixo.
    gira:      (el) => ({
      from: {
        rotation: Number.isFinite(num(el.dataset.de)) ? num(el.dataset.de) : 0,
        opacity: 1,
        transformOrigin: el.dataset.origem || 'center center',
      },
      to: {
        rotation: Number.isFinite(num(el.dataset.rot)) ? num(el.dataset.rot) : 0,
        duration: 1.1,
        ease: 'power2.out',
      },
    }),
    // vira: gira no eixo Y em torno de uma dobra — é a folha virando.
    // data-de é o ângulo de partida, data-rot o de chegada e data-origem a
    // dobra ("left center" = lombada à esquerda). A profundidade vem do
    // perspective declarado no pai; sem ele o giro fica chapado.
    vira:      (el) => ({
      from: {
        rotationY: Number.isFinite(num(el.dataset.de)) ? num(el.dataset.de) : 78,
        opacity: 1,
        transformOrigin: el.dataset.origem || 'left center',
      },
      to: {
        rotationY: Number.isFinite(num(el.dataset.rot)) ? num(el.dataset.rot) : -78,
        duration: 1,
        ease: 'power2.inOut',
      },
    }),
    // rotação contínua de uma volta inteira (globo pontilhado, anel de HUD).
    // Uma volta só: repetir para sempre não é permitido no render.
    giraLoop:  (el) => ({
      from: { rotation: 0, opacity: 1, transformOrigin: 'center center' },
      to: { rotation: 360, duration: Number.isFinite(num(el.dataset.dur)) ? num(el.dataset.dur) : 24, ease: 'none' },
    }),
    words:     () => ({ from: { y: 26, opacity: 0 }, to: { y: 0, opacity: 1 }, stagger: 0.072 }),
    chars:     () => ({ from: { y: 42, opacity: 0, rotation: -8 }, to: { y: 0, opacity: 1, rotation: 0, duration: 0.52 }, stagger: 0.044 }),
    charsSlam: () => ({ from: { scale: 2.3, opacity: 0, rotation: -9 }, to: { scale: 1, opacity: 1, rotation: 0, duration: 0.34 }, stagger: 0.058 }),
    zoomIn:    () => ({ from: { scale: 1.14, opacity: 0 }, to: { scale: 1, opacity: 1, duration: 1.4, ease: 'sine.out' } }),
    drift:     () => ({ from: { y: 0 }, to: { y: -14, duration: 1.2, ease: 'sine.inOut' } }),
    // flutua: sobe e volta algumas vezes — objeto solto no espaço, não no papel
    flutua:    () => ({ from: { y: 0 }, to: { y: -18, duration: 1.8, ease: 'sine.inOut', repeat: 3, yoyo: true } }),
    // cursor de texto piscando (finito: o render precisa terminar)
    blink:     () => ({ from: { opacity: 1 }, to: { opacity: 0, duration: 0.5, ease: 'none', repeat: 7, yoyo: true } }),
    // "digitando": os três pontos nunca somem — só acendem e apagam em onda.
    tecla:     () => ({ from: { opacity: 0.22 }, to: { opacity: 1, duration: 0.34, ease: 'sine.inOut', repeat: 9, yoyo: true } }),
    // rolagem: a tira sobe data-to px em data-dur s, em ritmo constante.
    sobe:      (el) => ({ from: { y: 0 }, to: { y: -(num(el.dataset.to) || 600), duration: 6, ease: 'none' } }),
    // desce: a faixa de luz atravessa o quadro de cima para baixo (varredura)
    desce:     (el) => ({ from: { y: 0 }, to: { y: num(el.dataset.to) || 1300, duration: Number.isFinite(num(el.dataset.dur)) ? num(el.dataset.dur) : 3.6, ease: 'none' } }),
    // varre: um objeto percorre o quadro em linha reta, de (data-de, data-yde)
    // até (data-to, data-yto). É o olhar da lupa passando pelos itens — o
    // movimento é o gesto, não a entrada.
    varre:     (el) => ({
      from: {
        x: Number.isFinite(num(el.dataset.de)) ? num(el.dataset.de) : -200,
        y: Number.isFinite(num(el.dataset.yde)) ? num(el.dataset.yde) : 0,
        opacity: 1,
      },
      to: {
        x: Number.isFinite(num(el.dataset.to)) ? num(el.dataset.to) : 600,
        y: Number.isFinite(num(el.dataset.yto)) ? num(el.dataset.yto) : 0,
        duration: Number.isFinite(num(el.dataset.dur)) ? num(el.dataset.dur) : 2.4,
        ease: el.dataset.ease || 'sine.inOut',
      },
    }),
    shake:     () => ({ from: { rotation: 0 }, to: { rotation: 1.6, duration: 0.48, ease: 'sine.inOut' } }),
    unsquish:  () => ({ from: { scaleY: 0.55, opacity: 0 }, to: { scaleY: 1, opacity: 1, ease: 'power4.out' } }),
    // transições: cobrem a tela passando ou crescendo
    wipeR:     () => ({ from: { x: -2560 }, to: { x: 2560, ease: 'power2.inOut' } }),
    wipeD:     () => ({ from: { y: -2440 }, to: { y: 2440, ease: 'power2.inOut' } }),
    // destaques: o verbo vem do gesto, não do bloco
    marca:     () => ({ from: { backgroundSize: '0% 100%', opacity: 0 }, to: { backgroundSize: '100% 100%', opacity: 1, duration: 0.5, ease: 'power2.inOut' } }),
    mascara:   () => ({ from: { clipPath: 'inset(0 100% 0 0)' }, to: { clipPath: 'inset(0 0% 0 0)', duration: 0.75, ease: 'power3.inOut' } }),
    pulso:     () => ({ from: { scale: 1 }, to: { scale: 1.04, duration: 0.42, repeat: 3, yoyo: true, ease: 'sine.inOut' } }),
    circleIn:  () => ({ from: { scale: 0.02, opacity: 1 }, to: { scale: 1, opacity: 1, ease: 'power3.inOut' } }),
    // onda de clique: o anel nasce pequeno, cresce e desaparece (ripple)
    onda:      () => ({ from: { scale: 0.3, opacity: 0.85 }, to: { scale: 2.1, opacity: 0, duration: 0.6, ease: 'power2.out' } }),
    fadeOut:   () => ({ from: { opacity: 1 }, to: { opacity: 0, ease: 'power1.in' } }),
    // transparenta: um véu que deixa de esconder o que está por baixo, sem sumir.
    // A opacidade final vem em data-to; o objeto continua ali, como vidro.
    transparenta: (el) => ({
      from: { opacity: 1 },
      to: {
        opacity: Number.isFinite(num(el.dataset.to)) ? num(el.dataset.to) : 0.16,
        duration: 0.85,
        ease: 'power2.out',
      },
    }),
  };

  const targetsFor = (el, kind) => {
    if (kind === 'words') {
      const alvos = el.querySelectorAll('.wd');
      return alvos.length ? alvos : el;
    }
    if (kind === 'chars' || kind === 'charsSlam') {
      const alvos = el.querySelectorAll('.ch');
      return alvos.length ? alvos : el;
    }
    if (kind === 'equalizador') {
      const alvos = el.querySelectorAll('.eq');
      return alvos.length ? alvos : el;
    }
    return el;
  };

  const run = (el, atKey, animKey, durKey) => {
    const at = num(el.dataset[atKey]);
    // tempo negativo não existe: o GSAP não posiciona a animação e a cena toda
    // fica com os elementos escondidos. Ignora em vez de quebrar.
    if (!Number.isFinite(at) || at < 0) return;
    const kind = el.dataset[animKey] || 'rise';
    const durAttr = num(el.dataset[durKey]);

    // giro 3D: sem perspectiva no pai, o eixo Y fica chapado. O próprio motor
    // dá a profundidade para quem pedir o gesto vira.
    if (kind === 'vira' && el.parentElement) {
      tl.set(el.parentElement, { perspective: 1200 }, 0);
    }

    // contador numérico
    if (kind === 'count') {
      const to = num(el.dataset.to) || 0;
      const de = Number.isFinite(num(el.dataset.from)) ? num(el.dataset.from) : 0;
      const obj = { v: de };
      const fmt = (n) => String(Math.round(n)).replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
      el.textContent = fmt(de);
      // o zero inicial não pode aparecer antes da hora
      tl.set(el, { opacity: 0 }, 0);
      tl.to(el, { opacity: 1, duration: 0.18 }, at);
      tl.to(obj, {
        v: to,
        duration: Number.isFinite(durAttr) ? durAttr : 1.3,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = fmt(obj.v); },
      }, at);
      return;
    }

    // traço desenhado em pedaços: cada elemento data-seg acende em ordem, como
    // a luz percorrendo um caminho.
    if (kind === 'trace') {
      const segs = el.querySelectorAll('[data-seg]');
      const total = Number.isFinite(durAttr) ? durAttr : 0.8;
      if (!segs.length) return;
      tl.fromTo(segs, { opacity: 0 }, {
        opacity: 1,
        duration: Math.max(0.08, total / (segs.length * 1.6)),
        stagger: total / segs.length,
        ease: 'none',
      }, at);
      return;
    }

    // arco de medidor: o círculo tem pathLength=100; data-to é a % preenchida
    if (kind === 'arco') {
      const alvo = Math.max(0, Math.min(100, Number.isFinite(num(el.dataset.to)) ? num(el.dataset.to) : 75));
      tl.fromTo(el, { strokeDashoffset: 110 }, {
        strokeDashoffset: 100 - alvo,
        duration: Number.isFinite(durAttr) ? durAttr : 1.4,
        ease: 'power2.inOut',
      }, at);
      return;
    }

    // barras de áudio: cada .eq cresce em ordem
    if (kind === 'equalizador') {
      const alvos = targetsFor(el, kind);
      tl.fromTo(alvos, { scaleY: 0.18, opacity: 0.35 }, {
        scaleY: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.035,
        ease: 'power2.out',
      }, at);
      return;
    }

    // traço de luz sob a palavra: anima o path interno
    if (kind === 'sublinha') {
      const path = el.querySelector('path');
      tl.set(el, { opacity: 0 }, 0);
      tl.to(el, { opacity: 1, duration: 0.22 }, at);
      if (path) {
        tl.fromTo(path, { strokeDashoffset: 1.1 }, {
          strokeDashoffset: 0,
          duration: Number.isFinite(durAttr) ? durAttr : 0.7,
          ease: 'power1.inOut',
        }, at + 0.08);
      }
      return;
    }

    // texto decodificando (embaralha) ou digitando (maquina)
    if (kind === 'embaralha' || kind === 'maquina') {
      const original = el.textContent;
      const total = Number.isFinite(durAttr)
        ? durAttr
        : kind === 'maquina'
          ? Math.min(2.4, 0.05 * original.length + 0.4)
          : Math.min(1.4, 0.045 * original.length + 0.5);
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*';
      const obj = { p: 0 };
      if (kind === 'maquina') el.textContent = '';
      tl.to(obj, {
        p: 1,
        duration: total,
        ease: 'none',
        onUpdate() {
          if (kind === 'maquina') {
            const n = Math.floor(obj.p * original.length);
            el.textContent = original.slice(0, n) + (obj.p < 0.999 ? '|' : '');
            return;
          }
          const reveal = Math.floor(obj.p * original.length);
          const tick = Math.floor(obj.p * 16);
          let out = '';
          for (let i = 0; i < original.length; i += 1) {
            const ch = original[i];
            if (i < reveal || ch === ' ') { out += ch; continue; }
            const seed = (i * 97 + tick * 31 + 7) % 997;
            out += alphabet[seed % alphabet.length];
          }
          el.textContent = out;
        },
      }, at);
      return;
    }

    const spec = (kinds[kind] || kinds.rise)(el);
    const target = targetsFor(el, kind);
    const to = Object.assign({}, spec.to);
    if (Number.isFinite(durAttr)) to.duration = durAttr;
    if (spec.stagger) to.stagger = spec.stagger;

    // rotacionado (selo/carimbo torto): anima do exagero para o ângulo final
    if (kind === 'slamRot') {
      const r = num(el.dataset.rot);
      const ang = Number.isFinite(r) ? r : -4;
      tl.fromTo(el,
        { scale: 1.9, opacity: 0, rotation: ang * 3.2 },
        { scale: 1, opacity: 1, rotation: ang, duration: Number.isFinite(durAttr) ? durAttr : 0.42, ease: 'power4.out' },
        at);
      return;
    }

    // pulso como ENTRADA (at) também precisa começar escondido;
    // como segunda animação (at2) o elemento já está na tela e não pisca
    if (kind === 'pulso' && atKey === 'at') {
      tl.set(el, { opacity: 0 }, 0);
      tl.to(el, { opacity: 1, duration: 0.2 }, at);
    }

    // garante o estado inicial escondido mesmo se a timeline for buscada direto
    if (spec.from.opacity === 0) tl.set(target, { opacity: 0 }, 0);

    tl.fromTo(target, spec.from, to, at);
  };

  S.querySelectorAll('[data-at]').forEach((el) => run(el, 'at', 'anim', 'dur'));
  S.querySelectorAll('[data-at2]').forEach((el) => run(el, 'at2', 'anim2', 'dur2'));

  // relógio mestre linear: um único tween de 0 → dur
  const clock = gsap.timeline({ paused: true });
  const drv = { p: 0 };
  clock.to(drv, {
    p: 1,
    duration: ${dur},
    ease: 'none',
    onUpdate() { tl.time(drv.p * ${dur}, false); },
  }, 0);

  window.__timelines['${id}'] = clock;
})();
`;
}

/* ---------- casca de uma cena ---------- */
const ROOT_CSS = `    #root {
      position: absolute;
      inset: 0;
      overflow: hidden;
      background-color: var(--bg);
      background-image:
        radial-gradient(1000px 620px at 82% 4%, rgba(var(--cyan-rgb), 0.13), transparent 62%),
        radial-gradient(980px 720px at 8% 96%, rgba(var(--blue-rgb), 0.20), transparent 64%),
        linear-gradient(rgba(var(--line-rgb), 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--line-rgb), 0.05) 1px, transparent 1px);
      background-size: auto, auto, 80px 80px, 80px 80px;
      font-family: var(--body);
      color: var(--ink);
    }`;

function shell(s, W = 1920, H = 1080) {
  const transparent = !!s.transparent;
  let body = (s.body || "")
    .replace(/class="hf-scene is-dark"/, 'class="scene-dark"')
    .replace(/class="hf-scene"/, "");

  // a cena declara 1920×1080 por padrão; no 9:16 o quadro é outro
  if (W !== 1920 || H !== 1080) {
    body = body
      .replace(/data-width="1920"/g, `data-width="${W}"`)
      .replace(/data-height="1080"/g, `data-height="${H}"`);
  }

  if (!transparent) {
    body = body.replace(/(<div id="root"[^>]*>)/, `$1<div class="vig"></div>`);
  }
  // traço de luz: dasharray/offset conforme o runtime de "draw"
  body = body.replace(
    /stroke-dasharray="1" stroke-dashoffset="1"/g,
    'stroke-dasharray="1 1.2" stroke-dashoffset="1.1"',
  );
  // entradas "slam" crescem sobre vizinhos de propósito
  body = body
    .replace(/data-anim="(slam|slamRot|charsSlam)"/g, 'data-anim="$1" data-layout-allow-overlap')
    .replace(/data-anim2="(slam|slamRot|charsSlam)"/g, 'data-anim2="$1" data-layout-allow-overlap');

  return `<template>
  <link rel="stylesheet" href="assets/film.css" />
  <style>
${transparent ? TRANSPARENT_CSS : ROOT_CSS}
${s.css || ""}
  </style>
${body}
  <script>${sceneScript(s.id, s.dur)}</script>
</template>
`;
}

const TRANSPARENT_CSS = `    #root {
      position: absolute;
      inset: 0;
      background: transparent;
    }`;

/* ---------- build do filme inteiro ---------- */
/* dimensões do quadro: 16:9 é o padrão do canal; 9:16 é o Short */
const QUADROS = {
  "16:9": { w: 1920, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
};

export function buildFilm(film) {
  const {
    title = "Sem título",
    total,
    scenes,
    audio = [],
    sfx = [],
    watermark = null,
    lang = "pt-BR",
    formato = "16:9",
  } = film;

  if (!QUADROS[formato]) {
    throw new Error(
      `formato "${formato}" não existe — use: ${Object.keys(QUADROS).join(", ")}`,
    );
  }
  const { w: W, h: H } = QUADROS[formato];

  // trilha sonora: se não houver `total`, deduz do fim da última cena
  const TOTAL = Number.isFinite(total)
    ? total
    : Math.max(...scenes.map((s) => s.start + s.dur));

  const OUT = "compositions";
  if (!existsSync(OUT)) mkdirSync(OUT);

  // limpa cenas de builds anteriores: sobra de outro filme vira arquivo morto
  const atuais = new Set(scenes.map((s) => `${s.id}.html`));
  for (const f of readdirSync(OUT)) {
    if (f.endsWith(".html") && !atuais.has(f)) rmSync(`${OUT}/${f}`);
  }

  for (const s of scenes) writeFileSync(`${OUT}/${s.id}.html`, shell(s, W, H), "utf8");

  // ordem no DOM define o empilhamento: cenas primeiro, overlays depois
  const hosts = [...scenes]
    .sort((a, b) => (a.track ?? 1) - (b.track ?? 1) || a.start - b.start)
    .map(
      (s) => `      <div
        id="${s.id}"
        data-composition-id="${s.id}"
        data-composition-src="compositions/${s.id}.html"
        data-start="${s.start.toFixed(2)}"
        data-duration="${s.dur.toFixed(2)}"
        data-track-index="${s.track ?? 1}"
        data-track-kind="graphics"
        data-width="${W}"
        data-height="${H}"
      ></div>`,
    )
    .join("\n");

  const audioTags = audio.map((a, i) => {
    const d = Number.isFinite(a.dur) ? a.dur : probe(a.src);
    if (!d) console.log(`[audio] duração desconhecida em ${a.src} — informe dur`);
    const dur = Number.isFinite(a.dur) ? a.dur : d || 1;
    return `    <audio id="${a.id}" class="clip" src="${a.src}" data-start="${(a.start || 0).toFixed(2)}" data-duration="${dur.toFixed(2)}" data-volume="${a.vol ?? 1}" data-track-index="${a.lane ?? 2 + i}"></audio>`;
  });

  const sfxTags = sfx.map((s, i) => {
    const d = Number.isFinite(s.dur) ? s.dur : probe(s.src);
    if (!d) console.log(`[sfx] duração desconhecida em ${s.src} — informe dur`);
    const dur = Number.isFinite(s.dur) ? s.dur : d || 1;
    return `    <audio id="fx-${String(i + 1).padStart(2, "0")}" class="clip" src="${s.src}" data-start="${(s.start || 0).toFixed(2)}" data-duration="${dur.toFixed(2)}" data-volume="${s.vol ?? 0.3}" data-track-index="${20 + i}"></audio>`;
  });

  const wm = watermark
    ? `      <div id="wm"><img src="${watermark}" alt="" /></div>`
    : "";

  const html = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>${title}</title>
    <link rel="stylesheet" href="assets/film.css" />
    <script src="assets/lib/gsap.min.js"></script>
    <style>
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: var(--bg); }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #wm { position: absolute; right: 54px; bottom: 46px; width: 84px; height: 84px; opacity: 0.4; z-index: 900; pointer-events: none; }
      #wm img { width: 100%; height: 100%; object-fit: contain; }
    </style>
  </head>
  <body>
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-duration="${TOTAL.toFixed(2)}"
      data-width="${W}"
      data-height="${H}"
    >
${hosts}
${audioTags.join("\n")}
${sfxTags.join("\n")}
${wm}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;

  writeFileSync("index.html", html, "utf8");
  console.log(
    `ok: ${scenes.length} cenas · ${TOTAL.toFixed(2)}s · ${audio.length} áudio(s) · ${sfx.length} efeito(s)`,
  );
  return { total: TOTAL };
}

/* ---------- checagem rápida de cena (evita colisão de tempo) ---------- */
export function validateScenes(scenes) {
  const problems = [];
  const ids = new Set();
  let cursor = 0;
  for (const s of [...scenes].sort((a, b) => a.start - b.start)) {
    if (ids.has(s.id)) problems.push(`id repetido: ${s.id}`);
    ids.add(s.id);
    if (s.start < cursor - 0.01) problems.push(`${s.id} começa em ${s.start}s, antes do fim da cena anterior (${cursor.toFixed(2)}s)`);
    cursor = s.start + s.dur;
  }
  if (problems.length) throw new Error("cenas com problema:\n- " + problems.join("\n- "));
  return true;
}
