import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "codigo",
  funcao: "bloco de código com realce de sintaxe, linha a linha, e saída opcional",
  usa: "linhas, titulo, linguagem, destaques, saida, w, fonte, x, y, at, anim",
  naoFaz: "realce de linguagem exótica; cobre Python, JS e shell pelo vocabulário comum",
};

const CHAVE = new Set([
  "def", "return", "if", "else", "elif", "for", "while", "in", "import", "from", "as",
  "class", "print", "await", "async", "const", "let", "var", "function", "new", "try",
  "except", "with", "lambda", "True", "False", "None", "true", "false", "null", "and",
  "or", "not", "export", "default", "yield", "raise", "pass", "break", "continue",
]);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* realce mínimo: comentário, string, número, palavra-chave e chamada de função.
   A ordem das alternativas é o que impede o `#` de dentro da string virar comentário. */
function realce(linha) {
  const re = /(#[^\n]*|\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:[.,]\d+)?\b)|([A-Za-zÀ-ÿ_][\wÀ-ÿ]*)/g;
  let saida = "";
  let ultimo = 0;
  let m;
  while ((m = re.exec(linha))) {
    saida += esc(linha.slice(ultimo, m.index));
    const todo = m[0];
    const [comentario, texto, numero, palavra] = [m[1], m[2], m[3], m[4]];
    if (comentario) saida += `<span style="color:var(--ink-dim)">${esc(todo)}</span>`;
    else if (texto) saida += `<span style="color:var(--green)">${esc(todo)}</span>`;
    else if (numero) saida += `<span style="color:var(--amber)">${esc(todo)}</span>`;
    else if (palavra) {
      const chamada = /^\s*\(/.test(linha.slice(m.index + todo.length));
      if (CHAVE.has(todo)) saida += `<span style="color:var(--violet)">${esc(todo)}</span>`;
      else if (chamada) saida += `<span style="color:var(--cyan)">${esc(todo)}</span>`;
      else saida += esc(todo);
    }
    ultimo = m.index + todo.length;
  }
  return saida + esc(linha.slice(ultimo));
}

export function montar(p = {}) {
  const {
    linhas = [],
    titulo = null,
    linguagem = null,
    destaques = [],
    saida = [],
    w = 900,
    fonte = 28,
    at = 0.4,
    anim = "fade",
    gap = 0,
  } = p;

  const lista = Array.isArray(linhas) ? linhas : String(linhas).split("\n");
  if (!lista.length || !lista.some(Boolean)) {
    throw new Error("codigo: informe `linhas` (string com \\n ou lista)");
  }

  const marcadas = new Set(destaques.map((n) => Number(n)));
  const altura = Math.round(fonte * 1.55);

  const corpo = lista
    .map((linha, i) => {
      const numero = i + 1;
      const destaque = marcadas.has(numero);
      return `<div style="display:flex;gap:20px;padding:2px 22px 2px ${destaque ? "14px" : "22px"};${destaque ? "background:rgba(var(--cyan-rgb),.07);border-left:2px solid var(--cyan);" : ""}" data-at="${(at + i * 0.16).toFixed(2)}" data-anim="fade" data-dur="0.3">
          <div data-layout-ignore style="width:38px;flex:0 0 auto;text-align:right;font-family:var(--mono);font-size:22px;line-height:${altura}px;color:rgba(var(--ink-dim-rgb),.55)">${numero}</div>
          <div style="font-family:var(--mono);font-size:${px(fonte)};line-height:${altura}px;white-space:pre;color:var(--ink)">${realce(linha) || "&nbsp;"}</div>
        </div>`;
    })
    .join("");

  const linhasSaida = saida
    .map((l, i) => `<div style="display:flex;gap:12px;padding:2px 22px;font-family:var(--mono);font-size:${px(fonte)};line-height:${altura}px;color:var(--green)" data-at="${(at + lista.length * 0.16 + 0.2 + i * 0.18).toFixed(2)}" data-anim="fade" data-dur="0.3">
        <span style="color:rgba(var(--lime-rgb),.6)">›</span><span style="white-space:pre">${esc(l)}</span>
      </div>`)
    .join("");

  const cabecalho = titulo
    ? `<div style="display:flex;align-items:center;gap:12px;padding:14px 22px;border-bottom:1px solid var(--line);background:rgba(var(--panel-rgb),.7)">
        <div style="width:18px;height:18px;flex:0 0 auto;color:var(--cyan)">${icons.code}</div>
        <span data-layout-ignore style="font-family:var(--mono);font-size:22px;color:var(--ink-soft)">${titulo}</span>
        ${linguagem ? `<span data-layout-ignore style="margin-left:auto;font-family:var(--mono);font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:var(--cyan);border:1px solid rgba(var(--cyan-rgb),.35);border-radius:999px;padding:3px 12px">${linguagem}</span>` : ""}
      </div>`
    : "";

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};border-radius:var(--r-md);overflow:hidden;background:rgba(var(--panel-rgb),.94);border:1px solid var(--line);box-shadow:0 26px 60px rgba(var(--shadow-rgb),.5)" ${entrada(p, { anim, at: 0.2 })}>
        ${cabecalho}
        <div style="padding:${px(20 + gap)}px 0">${corpo}${linhasSaida ? `<div style="margin-top:12px;border-top:1px solid rgba(var(--line-rgb),.12);padding-top:12px">${linhasSaida}</div>` : ""}</div>
      </div>`,
    ),
  };
}
