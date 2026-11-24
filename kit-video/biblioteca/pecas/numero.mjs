import { caixa, posicionada, px } from "./base.mjs";

export const contrato = {
  nome: "numero",
  funcao: "número grande que conta de 0 até o valor, com sufixo e rótulo",
  usa: "valor, sufixo, rotulo, tamanho, cor, contagem, pulsar, x, y, at",
  naoFaz: "dois números na mesma peça; número sem unidade quando a unidade importa",
};

export function montar(p = {}) {
  const {
    valor = 0,
    sufixo = "",
    rotulo = null,
    tamanho = null,
    cor = "var(--cyan)",
    contagem = 1.2,
    pulsar = false,
    at = 0.5,
    atSufixo = null,
    mt = null,
    lineHeight = 0.84,
    alinhamento = null,
  } = p;

  const size = tamanho ?? (String(Math.round(valor)).length >= 4 ? 170 : 220);
  const estilo = [];
  if (posicionada(p)) estilo.push("position:absolute", caixa(p));
  if (mt != null) estilo.push(`margin-top:${px(mt)}`);
  estilo.push("display:flex", "flex-direction:column", "gap:6px");
  if (alinhamento) estilo.push(`align-items:${alinhamento}`);

  return {
    html: `<div style="${estilo.join(";")}">
      ${rotulo ? `<div data-layout-ignore data-at="${at}" data-anim="fade" style="font-family:var(--body);font-weight:800;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft)">${rotulo}</div>` : ""}
      <div style="display:flex;align-items:flex-end;gap:14px">
        <div class="t-display" style="font-size:${px(size)};line-height:${lineHeight};color:${cor}" data-at="${at}" data-anim="count" data-to="${valor}" data-dur="${contagem}"${pulsar ? ` data-at2="${(at + contagem + 0.15).toFixed(2)}" data-anim2="pulso"` : ""}>0</div>
        ${sufixo ? `<div class="t-display" style="font-size:${Math.round(size * 0.46)}px;line-height:1;color:${cor}" data-at="${atSufixo ?? (at + contagem * 0.6).toFixed(2)}" data-anim="rise">${sufixo}</div>` : ""}
      </div>
    </div>`,
  };
}
