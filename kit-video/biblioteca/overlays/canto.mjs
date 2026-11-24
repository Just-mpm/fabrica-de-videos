export const contrato = {
  nome: "canto",
  funcao: "moldura de interface: quatro cantos de HUD e um rótulo pequeno, entrando e saindo",
  duracao: "2–4 s",
  obrigatorios: [],
  opcionais: ["rotulo"],
  naoFaz: "ficar o vídeo inteiro; é um acento de interface",
};

export function montar({ id, valores = {} }) {
  const { rotulo = "SEU CANAL" } = valores;
  const inset = 58;

  const cantos = ["tl", "tr", "bl", "br"]
    .map((c) => {
      const pos = {
        tl: `left:${inset}px;top:${inset}px;border-left:2px solid rgba(var(--cyan-rgb),.55);border-top:2px solid rgba(var(--cyan-rgb),.55);border-top-left-radius:8px`,
        tr: `right:${inset}px;top:${inset}px;border-right:2px solid rgba(var(--cyan-rgb),.55);border-top:2px solid rgba(var(--cyan-rgb),.55);border-top-right-radius:8px`,
        bl: `left:${inset}px;bottom:${inset}px;border-left:2px solid rgba(var(--cyan-rgb),.55);border-bottom:2px solid rgba(var(--cyan-rgb),.55);border-bottom-left-radius:8px`,
        br: `right:${inset}px;bottom:${inset}px;border-right:2px solid rgba(var(--cyan-rgb),.55);border-bottom:2px solid rgba(var(--cyan-rgb),.55);border-bottom-right-radius:8px`,
      }[c];
      return `<div style="position:absolute;width:34px;height:34px;${pos}"></div>`;
    })
    .join("");

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
    <div style="position:absolute;inset:0" data-at="0.05" data-anim="fade" data-dur="0.4">
      ${cantos}
      <div data-layout-ignore style="position:absolute;left:${inset + 46}px;top:${inset - 2}px;font-family:var(--body);font-weight:800;font-size:16px;letter-spacing:.2em;text-transform:uppercase;color:rgba(var(--ink-soft-rgb),.8)">${rotulo}</div>
    </div>
  </div>`,
  };
}
