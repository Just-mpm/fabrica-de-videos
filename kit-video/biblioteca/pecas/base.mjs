/* Base das peças: posição em px e atributos de animação.

   Toda peça recebe as mesmas chaves de entrada:
     x, y, w, h (ou left/top/right/bottom)  → posição no quadro 1920×1080
     at, anim, dur                          → primeira entrada
     at2, anim2, dur2                       → segunda animação no mesmo elemento
     extras                                 → atributos crus (ex. data-layout-ignore)

   Sem x/y, a peça sai no fluxo do container onde foi colocada. É isso que
   permite usar a mesma peça solta na cena e dentro de um cartão.
*/

export const px = (v) => (typeof v === "number" ? `${v}px` : String(v));

export function attrs(p = {}) {
  const out = [];
  if (p.at != null) out.push(`data-at="${p.at}"`);
  if (p.anim) out.push(`data-anim="${p.anim}"`);
  if (p.dur != null) out.push(`data-dur="${p.dur}"`);
  if (p.at2 != null) out.push(`data-at2="${p.at2}"`);
  if (p.anim2) out.push(`data-anim2="${p.anim2}"`);
  if (p.dur2 != null) out.push(`data-dur2="${p.dur2}"`);
  if (p.to != null) out.push(`data-to="${p.to}"`);
  if (p.rot != null) out.push(`data-rot="${p.rot}"`);
  if (p.rot0 != null) out.push(`data-de="${p.rot0}"`);
  if (p.origem) out.push(`data-origem="${p.origem}"`);
  if (p.escala != null) out.push(`data-escala="${p.escala}"`);
  if (p.extras) out.push(String(p.extras));
  return out.join(" ");
}

/* junta a entrada da peça com os defaults do tipo, respeitando `at: null`
   (null significa "não anima", undefined significa "usa o default") */
export function entrada(p = {}, defaults = {}) {
  const out = { ...p };
  for (const k of ["at", "anim", "dur", "at2", "anim2", "dur2", "to", "rot", "rot0", "origem", "escala"]) {
    if (out[k] === undefined && defaults[k] !== undefined) out[k] = defaults[k];
  }
  return attrs(out);
}

export function caixa(p = {}) {
  const s = [];
  if (p.left != null) s.push(`left:${px(p.left)}`);
  else if (p.x != null) s.push(`left:${px(p.x)}`);
  if (p.top != null) s.push(`top:${px(p.top)}`);
  else if (p.y != null) s.push(`top:${px(p.y)}`);
  if (p.right != null) s.push(`right:${px(p.right)}`);
  if (p.bottom != null) s.push(`bottom:${px(p.bottom)}`);
  if (p.w != null) s.push(`width:${px(p.w)}`);
  if (p.h != null) s.push(`height:${px(p.h)}`);
  return s.join(";");
}

export function posicionada(p = {}) {
  return ["x", "y", "left", "top", "right", "bottom"].some((k) => p[k] != null);
}

/* embrulha a peça num div absoluto só quando há posição;
   sem posição, devolve o HTML como está para fluir no container */
export function envolver(p, html, { cls = "", style = "", extra = "" } = {}) {
  if (!posicionada(p)) return html;
  const partes = [caixa(p), style].filter(Boolean).join(";");
  return `<div${cls ? ` class="${cls}"` : ""} style="position:absolute;${partes}"${extra ? ` ${extra}` : ""}>${html}</div>`;
}

/* pinta palavras dentro de um texto com uma classe do sistema visual */
export function pintar(texto, palavras = [], classe = "hl-cyan") {
  if (!texto) return texto;
  const lista = (Array.isArray(palavras) ? palavras : [palavras]).filter(Boolean);
  return lista.reduce(
    (acc, alvo) => acc.split(alvo).join(`<span class="${classe}">${alvo}</span>`),
    String(texto),
  );
}

/* texto com marca-texto de luz estático (o animado é o verbo `marca`) */
export const comMarcador = (texto) => `<span class="marca">${texto}</span>`;
