import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "fonte",
  funcao: "citação com autor e veículo: dá lastro ao que está sendo dito",
  usa: "texto, autor, veiculo, ano, w, x, y, at, anim",
  naoFaz: "citação longa (é uma frase); para números use numero ou grafico",
};

export function montar(p = {}) {
  const {
    texto = "",
    autor = null,
    veiculo = null,
    ano = null,
    tamanho = 32,
    w = 860,
    at = 0.4,
    anim = "rise",
  } = p;

  if (!texto) throw new Error("fonte: informe `texto` (a citação)");
  if (!autor && !veiculo) throw new Error("fonte: informe ao menos `autor` ou `veiculo`");

  const credito = [autor, [veiculo, ano].filter(Boolean).join(", ")].filter(Boolean).join(" · ");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};padding:28px 34px 26px;border-radius:var(--r-md);background:rgba(var(--panel-rgb),.66);border:1px solid var(--line);border-left:3px solid var(--cyan)" ${entrada(p, { anim, at })}>
        <div data-layout-ignore style="font-family:var(--display);font-weight:700;font-size:86px;line-height:.62;color:rgba(var(--cyan-rgb),.42)">“</div>
        <div style="margin-top:14px;font-family:var(--body);font-size:${tamanho}px;line-height:1.42;color:var(--ink)">${texto}</div>
        <div data-layout-ignore style="margin-top:20px;font-family:var(--body);font-weight:700;font-size:21px;letter-spacing:.06em;color:var(--cyan)">${credito}</div>
      </div>`,
    ),
  };
}
