export const contrato = {
  nome: "faisca",
  funcao: "as três risquinhas amarelas da marca: surpresa, ideia, 'uau'",
  duracao: "0,6–1,2 s",
  obrigatorios: [],
  opcionais: ["x", "y", "tamanho", "cor", "rot"],
  naoFaz: "mais de uma na mesma cena; competir com o título",
  observacao:
    "overlay: entra numa faixa acima das cenas, sem fundo. x/y marcam o ponto de onde as três riscas saem (o canto da ideia), não o centro do desenho",
};

const ANGULOS = [-40, 0, 40];

/* três barras arredondadas que saem do mesmo ponto, no ângulo do leque.
   Cada uma é um retângulo girado em volta do próprio centro: nada de SVG
   esticado, que deforma a ponta. */
export function montar({ id, valores = {} }) {
  const { x = 1500, y = 240, tamanho = 96, cor = "var(--amber)", rot = 0 } = valores;

  const comprimento = tamanho * 0.52;
  const espessura = Math.max(7, Math.round(tamanho * 0.16));
  const raio = tamanho * 0.2;

  const riscos = ANGULOS.map((grau, i) => {
    const a = ((grau + rot) * Math.PI) / 180;
    const cx = x + (raio + comprimento / 2) * Math.cos(a);
    const cy = y + (raio + comprimento / 2) * Math.sin(a);
    const at = (0.08 + i * 0.08).toFixed(2);
    return `<span style="position:absolute;left:${(cx - comprimento / 2).toFixed(1)}px;top:${(cy - espessura / 2).toFixed(1)}px;width:${comprimento.toFixed(1)}px;height:${espessura}px;border-radius:999px;background:${cor};box-shadow:0 0 16px rgba(var(--amber-rgb),.45);transform:rotate(${(grau + rot).toFixed(1)}deg)" data-at="${at}" data-anim="pop" data-dur="0.34"></span>`;
  }).join("");

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="pointer-events:none">
    ${riscos}
  </div>`,
  };
}
