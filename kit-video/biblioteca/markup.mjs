/* utilidades de markup usadas pelas peças */

export const ch = (text, cls = "") =>
  `<span class="${cls}">${[...text]
    .map((c) => `<span class="ch">${c === " " ? "&nbsp;" : c}</span>`)
    .join("")}</span>`;

export const wd = (text, cls = "") =>
  `<span class="${cls}">${text
    .split(" ")
    .map((w) => `<span class="wd">${w}</span>`)
    .join(" ")}</span>`;

/* ícones de luz: grade 24, traço 1.7, sem preenchimento.
   São glifos de interface — nunca um desenho de cena. */
const I = (body) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const icons = {
  spark: I('<path d="M12 2.6l2 5.6 5.6 2-5.6 2-2 5.6-2-5.6-5.6-2 5.6-2z"/><path d="M18.6 15.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'),
  brain: I('<path d="M12 4.2a3.4 3.4 0 00-6.2 2 3.2 3.2 0 00-1.6 5.6A3.4 3.4 0 006 17.4a3.3 3.3 0 006 1.6"/><path d="M12 4.2a3.4 3.4 0 016.2 2 3.2 3.2 0 011.6 5.6A3.4 3.4 0 0118 17.4a3.3 3.3 0 01-6 1.6"/><path d="M12 4.2v14.8"/><path d="M9 9h1.6M13.4 12H15M9.4 14.4h1.4"/>'),
  chip: I('<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><rect x="10" y="10" width="4" height="4" rx="1"/><path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21"/>'),
  bot: I('<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4.5V8"/><circle cx="12" cy="3.4" r="1.2"/><path d="M9 13h.1M15 13h.1"/><path d="M9.6 16h4.8"/>'),
  chat: I('<path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2-1 0-2-.1-2.9-.4L4.5 20.5l1.2-3.6A6.9 6.9 0 013.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2z"/>'),
  search: I('<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.5 15.5L20.5 20.5"/>'),
  image: I('<rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.4"/><circle cx="8.6" cy="9.8" r="1.6"/><path d="M3.6 16.4l4.7-4.2 3.6 3.1 3-2.6 5.4 4.6"/>'),
  video: I('<rect x="3.2" y="5.4" width="13" height="13.2" rx="2.6"/><path d="M16.4 10.6l4.4-2.6v8l-4.4-2.6z"/>'),
  music: I('<path d="M9.4 17.4V5.6l9-1.8v11.4"/><circle cx="6.9" cy="17.9" r="2.5"/><circle cx="15.9" cy="15.9" r="2.5"/>'),
  doc: I('<path d="M6 3.2h7.4L19 8.8v12H6z"/><path d="M13.2 3.4V9h5.6"/><path d="M9 12.6h6M9 16h6"/>'),
  mic: I('<rect x="9" y="2.8" width="6" height="11" rx="3"/><path d="M5.6 11.4a6.4 6.4 0 0012.8 0"/><path d="M12 17.8V21M9 21h6"/>'),
  cloud: I('<path d="M7.4 18.4a4.2 4.2 0 01-.5-8.4 5.6 5.6 0 0110.8-1.4 3.9 3.9 0 01-.3 9.8z"/>'),
  db: I('<ellipse cx="12" cy="5.8" rx="7.2" ry="2.9"/><path d="M4.8 5.8v12.4c0 1.6 3.2 2.9 7.2 2.9s7.2-1.3 7.2-2.9V5.8"/><path d="M4.8 12c0 1.6 3.2 2.9 7.2 2.9s7.2-1.3 7.2-2.9"/>'),
  lock: I('<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.4"/><path d="M8.2 10.4V7.8a3.8 3.8 0 017.6 0v2.6"/><path d="M12 14.4v2.6"/>'),
  bolt: I('<path d="M13.6 2.6L5.4 13.8h5.4l-1 7.6 8.2-11.2h-5.4z"/>'),
  check: I('<path d="M4.6 12.6l4.8 4.8 10-10.8"/>'),
  arrow: I('<path d="M4.4 12h15.2"/><path d="M13.8 6.2l5.8 5.8-5.8 5.8"/>'),
  clock: I('<circle cx="12" cy="12" r="8.6"/><path d="M12 6.8V12l3.6 2.4"/>'),
  shield: I('<path d="M12 2.8l7.4 2.8v6.2c0 4.6-3.2 7.8-7.4 9.4-4.2-1.6-7.4-4.8-7.4-9.4V5.6z"/><path d="M8.8 12.2l2.4 2.4 4.4-4.8"/>'),
  code: I('<path d="M8.4 7.2L3.6 12l4.8 4.8"/><path d="M15.6 7.2L20.4 12l-4.8 4.8"/><path d="M13.4 4.8l-2.8 14.4"/>'),
  layers: I('<path d="M12 3.4l8.6 4.4-8.6 4.4L3.4 7.8z"/><path d="M3.4 12.2l8.6 4.4 8.6-4.4"/><path d="M3.4 16.4l8.6 4.4 8.6-4.4"/>'),
  gear: I('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.8M12 18.6v2.8M2.6 12h2.8M18.6 12h2.8M5.4 5.4l2 2M16.6 16.6l2 2M18.6 5.4l-2 2M7.4 16.6l-2 2"/>'),
  globe: I('<circle cx="12" cy="12" r="8.6"/><path d="M3.6 12h16.8"/><path d="M12 3.4c2.4 2.3 3.6 5.2 3.6 8.6s-1.2 6.3-3.6 8.6c-2.4-2.3-3.6-5.2-3.6-8.6S9.6 5.7 12 3.4z"/>'),
  cursor: I('<path d="M5.6 3.8l13.2 7.4-6 1.2-2.6 5.8z"/>'),
  send: I('<path d="M20.4 3.6L10.2 13.8"/><path d="M20.4 3.6l-6.6 16.8-3.6-6.6L3.6 10.2z"/>'),
  bulb: I('<path d="M9.2 17.4a6.4 6.4 0 116.2-9.4 6.4 6.4 0 01-2.4 9.4z"/><path d="M9.6 17.4h4.8M10.2 20.6h3.6"/>'),
  alert: I('<path d="M12 3.8l9 15.4H3z"/><path d="M12 9.4v4.4M12 16.8h.1"/>'),
  close: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  eye: I('<path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  wand: I('<path d="M4.4 19.6L15 9"/><path d="M17.4 3.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/><path d="M18.6 13.4l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"/>'),
  chart: I('<path d="M4 20h16"/><rect x="5.4" y="12.4" width="3.6" height="6" rx="1"/><rect x="10.4" y="8.4" width="3.6" height="10" rx="1"/><rect x="15.4" y="5" width="3.6" height="13.4" rx="1"/>'),
  key: I('<circle cx="8.2" cy="8.2" r="4.4"/><path d="M11.4 11.4L20.4 20.4"/><path d="M17.4 17.4l2-2M20 20l1.6-1.6"/>'),
  box: I('<path d="M12 3.2l8.4 4.4v8.8L12 20.8l-8.4-4.4V7.6z"/><path d="M3.6 7.6L12 12l8.4-4.4M12 12v8.8"/>'),
  net: I('<circle cx="12" cy="4.6" r="2.2"/><circle cx="4.8" cy="18" r="2.2"/><circle cx="19.2" cy="18" r="2.2"/><path d="M10.8 6.6L6.2 15.8M13.2 6.6l4.6 9.2M7 18h10"/>'),
  user: I('<circle cx="12" cy="8.2" r="3.8"/><path d="M4.8 20.4a7.2 7.2 0 0114.4 0"/>'),
  download: I('<path d="M12 3.6v11.2"/><path d="M7.6 10.4L12 14.8l4.4-4.4"/><path d="M4.4 19.4h15.2"/>'),
  refresh: I('<path d="M20.2 12a8.2 8.2 0 11-2.6-6"/><path d="M20.6 3.6v5.2h-5.2"/>'),
  plug: I('<path d="M9 3.2v5M15 3.2v5"/><path d="M6.4 8.2h11.2v3.6a5.6 5.6 0 01-11.2 0z"/><path d="M12 17.4v3.4"/>'),
  play: I('<circle cx="12" cy="12" r="8.6"/><path d="M10 8.6l5.4 3.4-5.4 3.4z"/>'),
  pause: I('<circle cx="12" cy="12" r="8.6"/><path d="M10 8.8v6.4M14 8.8v6.4"/>'),
  grid: I('<rect x="3.6" y="3.6" width="7" height="7" rx="1.4"/><rect x="13.4" y="3.6" width="7" height="7" rx="1.4"/><rect x="3.6" y="13.4" width="7" height="7" rx="1.4"/><rect x="13.4" y="13.4" width="7" height="7" rx="1.4"/>'),
};

export const iconEl = (name, size = 56, color = "var(--ink)") =>
  `<div style="width:${size}px;height:${size}px;color:${color};flex:0 0 auto">${icons[name] ?? icons.spark}</div>`;

/* linha de luz desenhada sob uma palavra (o runtime anima o path com data-anim="sublinha") */
export const sub = (text, cor = "var(--cyan)", attrs = "") =>
  `<span class="sublinha" style="color:${cor}" ${attrs}>${text}<svg viewBox="0 0 300 26" preserveAspectRatio="none" aria-hidden="true"><path d="M4 17 C 70 6, 150 22, 296 8" pathLength="1" stroke="${cor}" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/></svg></span>`;

/* marca-texto de luz que acende da esquerda para a direita (data-anim="marca") */
export const marca = (text) => `<span class="marca">${text}</span>`;
