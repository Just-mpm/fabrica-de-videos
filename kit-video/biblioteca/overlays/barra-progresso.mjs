export const contrato = {
  nome: "barra-progresso",
  funcao: "orientar em vídeo longo: onde estamos dentro do bloco",
  duracao: "2–3 s (entra no começo da cena)",
  obrigatorios: ["atual", "total"],
  opcionais: ["rotulo"],
  naoFaz: "ficar o vídeo inteiro na tela; entra, mostra e sai",
  observacao: "atual/total contam capítulos, não segundos",
};

export function montar({ id, valores = {} }) {
  const { atual = 1, total = 3, rotulo = "" } = valores;
  const barras = Array.from({ length: total })
    .map(
      (_, i) =>
        `<div style="width:46px;height:5px;border-radius:999px;background:${i < atual ? "var(--cyan)" : "rgba(var(--line-rgb),.22)"};${i < atual ? "box-shadow:0 0 12px rgba(var(--cyan-rgb),.6)" : ""}"></div>`,
    )
    .join("");

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
    <div style="position:absolute;left:140px;top:62px;display:flex;align-items:center;gap:18px" data-at="0.1" data-anim="fade">
      ${rotulo ? `<p class="tag" data-layout-ignore style="font-size:19px;letter-spacing:.22em">${rotulo}</p>` : ""}
      <div style="display:flex;gap:8px">${barras}</div>
      <p class="small" data-layout-ignore style="font-family:var(--body);font-weight:800;font-size:18px;color:var(--ink-dim)">${atual}/${total}</p>
    </div>
  </div>`,
  };
}
