export const contrato = {
  nome: "marca",
  funcao: "logomarca discreta no canto, para identificar o canal sem competir com a cena",
  duracao: "o vídeo inteiro (ou o trecho escolhido)",
  obrigatorios: [],
  opcionais: ["opacidade", "tamanho", "canto"],
  naoFaz: "ficar grande ou no meio do quadro",
};

export function montar({ id, valores = {} }) {
  const { opacidade = 0.32, tamanho = 64, canto = "br" } = valores;
  const pos = {
    br: "right:56px;bottom:44px",
    bl: "left:56px;bottom:44px",
    tr: "right:56px;top:44px",
    tl: "left:56px;top:44px",
  }[canto] ?? "right:56px;bottom:44px";

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
    <div style="position:absolute;${pos};width:${tamanho}px;height:${tamanho}px;opacity:${opacidade}" data-at="0.2" data-anim="fade" data-dur="0.8">
      <img src="assets/logomarca.png" alt="" style="width:100%;height:100%;object-fit:contain" />
    </div>
  </div>`,
  };
}
