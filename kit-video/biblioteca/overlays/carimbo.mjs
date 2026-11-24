export const contrato = {
  nome: "carimbo",
  funcao: "selo que bate por cima da cena (reforço, alerta ou veredito)",
  duracao: "1,2–2 s",
  obrigatorios: ["texto"],
  opcionais: ["tom", "rot", "canto", "tamanho"],
  naoFaz: "cobrir texto importante; mais de três palavras",
  observacao: "overlay: entra numa faixa acima das cenas, sem fundo",
};

const TONS = {
  cyan: { fundo: "var(--cyan)", tinta: "var(--on-accent)", brilho: "rgba(var(--cyan-rgb),.42)" },
  amber: { fundo: "var(--amber)", tinta: "var(--on-accent)", brilho: "rgba(var(--amber-rgb),.38)" },
  red: { fundo: "var(--red)", tinta: "var(--on-accent)", brilho: "rgba(var(--red-rgb),.38)" },
  ink: { fundo: "var(--ink)", tinta: "var(--bg-2)", brilho: "rgba(var(--ink-rgb),.28)" },
};

export function montar({ id, valores = {} }) {
  const { texto, tom = "cyan", rot = -7, canto = "br", tamanho = 56 } = valores;

  if (!texto) throw new Error("carimbo: informe `texto` (até três palavras)");
  const t = TONS[tom];
  if (!t) throw new Error(`carimbo: tom "${tom}" não existe — use: ${Object.keys(TONS).join(", ")}`);

  const pos =
    canto === "br" ? "right:170px;bottom:210px" :
    canto === "tr" ? "right:170px;top:230px" :
    canto === "bl" ? "left:170px;bottom:210px" :
    "left:170px;top:230px";

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
    <div style="position:absolute;${pos};transform:rotate(${rot}deg)" data-at="0.12" data-anim="slamRot" data-rot="${rot}" data-dur="0.36">
      <div style="font-family:var(--display);font-weight:700;text-transform:uppercase;letter-spacing:.03em;font-size:${tamanho}px;line-height:1;padding:16px 32px 10px;background:${t.fundo};color:${t.tinta};border:5px solid ${t.tinta};box-shadow:12px 12px 0 rgba(var(--shadow-rgb),.38),0 0 70px ${t.brilho}">${texto}</div>
    </div>
  </div>`,
  };
}
