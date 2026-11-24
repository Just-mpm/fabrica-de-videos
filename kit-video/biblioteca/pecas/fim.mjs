/* Cartão final do canal.
   Não é uma tela de "acabou": é a última imagem que fica na cabeça de quem
   assistiu. Por isso ele tem as três coisas que o fim de um vídeo precisa —
   quem fala (o avatar), o que vem depois (o slot do próximo vídeo) e o que
   fazer agora (o botão de inscrever) — e todas as três entram em ordem de
   importância, não de uma vez.

   O slot é um retângulo 16:9 de verdade (860×484), do tamanho e no lugar onde
   o elemento de vídeo do YouTube encaixa. O que está dentro dele é desenho,
   não promessa: barras, um anel e um botão de play. */

import { envolver } from "./base.mjs";

export const contrato = {
  nome: "fim",
  funcao: "cartão final: avatar do canal, nome, slot 16:9 do próximo vídeo e botão de inscrever",
  usa: "titulo, sub, avatar, promessa, rec {rotulo, nota}, inscrever, t {avatar, nome, sub, promessa, slot, play, botao, onda1, onda2}, x, y, at, anim",
  naoFaz: "mais de um slot de recomendação; texto corrido; concorrer com a última frase da narração",
};

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const at = (q, extra = 0) => (q == null ? "" : `data-at="${(q + extra).toFixed(2)}"`);

export function montar(p = {}) {
  const {
    titulo = "SEU CANAL",
    sub = "seu slogan aqui",
    avatar = "assets/logomarca.png",
    promessa = ["tem mais vídeo", "aqui no canal"],
    rec = { rotulo: "próximo vídeo", nota: "em breve" },
    inscrever = "Inscreva-se",
    t = {},
    at: inicio = 0.2,
    anim = "fade",
  } = p;

  const qAvatar = num(t.avatar) ?? inicio;
  const qNome = num(t.nome) ?? qAvatar + 0.4;
  const qSub = num(t.sub) ?? qNome + 0.5;
  const qPromessa = num(t.promessa) ?? qSub + 0.3;
  const qSlot = num(t.slot) ?? qPromessa + 0.4;
  const qPlay = num(t.play) ?? qSlot + 0.45;
  const qBotao = num(t.botao) ?? qPlay + 0.9;
  const qOnda1 = num(t.onda1) ?? qBotao + 1.4;
  const qOnda2 = num(t.onda2) ?? qBotao + 5.2;
  const qPulso1 = num(t.pulso1);
  const qPulso2 = num(t.pulso2);

  // duas linhas do nome: a segunda herda o destaque de cor
  const nome = String(titulo).trim().split(/\s+/);
  const corte = Math.max(1, nome.length - 1);
  const l1 = nome.slice(0, corte).join(" ");
  const l2 = nome.slice(corte).join(" ");

  const corpo = `<div class="fm">
      <div class="fm-luz"></div>

      <div class="fm-esq">
        <div class="fm-avatar-caixa">
          <div class="fm-anel" ${at(qAvatar)} data-anim="circleIn" data-dur="0.95"></div>
          <div class="fm-anel-giro" ${at(qAvatar + 0.6)} data-anim="giraLoop" data-dur="34"></div>
          <div class="fm-avatar" ${at(qAvatar)} data-anim="pop" data-dur="0.7">
            <img src="${avatar}" alt="" />
          </div>
        </div>

        <div class="fm-nome">
          <span class="fm-l1" ${at(qNome)} data-anim="riseSlow">${l1}</span>
          <span class="fm-l2" ${at(qNome + 0.14)} data-anim="riseSlow">${l2}</span>
        </div>

        <div class="fm-sub" ${at(qSub)} data-anim="fade">${sub}</div>

        <div class="fm-botao-caixa">
          <div class="fm-botao" ${at(qBotao)} data-anim="slam" data-dur="0.42"
            ${qPulso2 != null ? `data-at2="${qPulso2}" data-anim2="pulso" data-dur2="0.42"` : ""}>
            <span class="fm-yt"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></span>
            ${inscrever}
          </div>
          <div class="fm-onda" ${at(qOnda1)} data-anim="onda" data-dur="0.8"></div>
          <div class="fm-onda" ${at(qOnda2)} data-anim="onda" data-dur="0.8"></div>
        </div>
      </div>

      <div class="fm-dir">
        <div class="fm-promessa">
          ${(Array.isArray(promessa) ? promessa : [promessa])
            .map((l, i) => `<span ${at(qPromessa + i * 0.16)} data-anim="rise">${l}</span>`)
            .join("")}
        </div>

        <div class="fm-slot" ${at(qSlot)} data-anim="riseSlow" data-dur="0.9">
          <div class="fm-slot-topo">
            <span class="fm-bola"></span><span class="fm-bola"></span><span class="fm-bola"></span>
            <span class="fm-slot-rot">${rec.rotulo}</span>
            <span class="fm-slot-nota">${rec.nota}</span>
          </div>
          <div class="fm-slot-corpo">
            <div class="fm-arte">
              <span class="fm-arte-grade"></span>
              <span class="fm-arte-linha" style="width:46%;bottom:104px"></span>
              <span class="fm-arte-linha" style="width:28%;bottom:66px;opacity:.5"></span>
            </div>
            <div class="fm-play-p">
              <div class="fm-play" ${at(qPlay)} data-anim="pop" data-dur="0.55"
                ${qPulso1 != null ? `data-at2="${qPulso1}" data-anim2="pulso" data-dur2="0.42"` : ""}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l12-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return {
    css: `
    .fm{position:relative;width:1920px;height:1080px}
    .fm-luz{position:absolute;left:-120px;top:-160px;width:1100px;height:1100px;border-radius:50%;
      background:radial-gradient(circle,rgba(var(--cyan-rgb),.16),transparent 62%)}

    .fm-esq{position:absolute;left:140px;top:165px;width:660px;display:flex;flex-direction:column;align-items:flex-start}
    .fm-avatar-caixa{position:relative;width:300px;height:300px}
    .fm-anel{position:absolute;inset:-18px;border-radius:50%;border:2px solid rgba(var(--cyan-rgb),.42);
      box-shadow:0 0 60px rgba(var(--cyan-rgb),.28),inset 0 0 40px rgba(var(--cyan-rgb),.14)}
    .fm-anel-giro{position:absolute;inset:-18px;border-radius:50%;
      background:conic-gradient(from 0deg,rgba(var(--cyan-rgb),0),rgba(var(--cyan-rgb),.85),rgba(var(--lime-rgb),.5),rgba(var(--cyan-rgb),0));
      -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
      mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px))}
    .fm-avatar{position:absolute;inset:0;border-radius:50%;overflow:hidden;
      box-shadow:0 26px 70px rgba(var(--shadow-rgb),.55)}
    .fm-avatar img{width:100%;height:100%;object-fit:cover;display:block}

    .fm-nome{display:flex;flex-direction:column;margin-top:58px;font-family:var(--display);
      font-weight:800;font-size:92px;line-height:.96;letter-spacing:-.02em;color:var(--ink)}
    .fm-l2{color:var(--ice)}
    .fm-sub{margin-top:24px;font-family:var(--mono);font-size:23px;letter-spacing:.035em;
      color:var(--ink-dim);white-space:nowrap}

    .fm-botao-caixa{position:relative;margin-top:52px;align-self:flex-start}
    .fm-botao{display:inline-flex;align-items:center;gap:20px;height:96px;padding:0 44px 0 18px;
      border-radius:999px;background:linear-gradient(180deg,color-mix(in srgb, var(--cyan) 52%, white),var(--cyan));color:var(--on-accent);
      font-family:var(--display);font-weight:800;font-size:34px;letter-spacing:-.01em;
      box-shadow:0 18px 44px rgba(var(--cyan-rgb),.42),inset 0 2px 0 rgba(var(--ink-rgb),.65)}
    .fm-yt{display:grid;place-items:center;width:62px;height:62px;border-radius:20px;background:var(--on-accent)}
    .fm-yt svg{width:34px;height:34px;fill:color-mix(in srgb, var(--cyan) 52%, white)}
    .fm-onda{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:999px;
      border:2px solid rgba(var(--cyan-rgb),.9);pointer-events:none;opacity:0}

    .fm-dir{position:absolute;left:860px;top:145px;width:960px}
    .fm-promessa{display:flex;flex-direction:column;font-family:var(--display);font-weight:800;
      font-size:56px;line-height:1.02;letter-spacing:-.015em;color:var(--ink);margin-bottom:34px}
    .fm-promessa span:last-child{color:var(--cyan)}

    .fm-slot{position:relative;width:940px;height:529px;border-radius:26px;overflow:hidden;
      background:linear-gradient(160deg,rgba(var(--panel-2-rgb),.95),rgba(var(--bg-2-rgb),.99));
      border:1.5px solid rgba(var(--line-rgb),.34);
      box-shadow:0 30px 80px rgba(var(--shadow-rgb),.55),inset 0 1px 0 rgba(var(--ink-rgb),.12)}
    .fm-slot-topo{display:flex;align-items:center;gap:10px;height:62px;padding:0 26px;
      border-bottom:1px solid rgba(var(--line-rgb),.16);background:rgba(var(--shadow-rgb),.28)}
    .fm-bola{width:11px;height:11px;border-radius:50%;background:rgba(var(--line-rgb),.45)}
    .fm-slot-rot{margin-left:16px;font-family:var(--mono);font-size:19px;letter-spacing:.16em;
      text-transform:uppercase;color:rgba(var(--ink-rgb),.72)}
    .fm-slot-nota{margin-left:auto;font-family:var(--mono);font-size:18px;letter-spacing:.14em;
      text-transform:uppercase;color:var(--cyan);opacity:.8}
    .fm-slot-corpo{position:absolute;inset:62px 0 0 0}
    .fm-arte{position:absolute;inset:0;overflow:hidden;
      background:
        radial-gradient(105% 120% at 82% 4%,rgba(var(--cyan-rgb),.30),transparent 58%),
        radial-gradient(90% 110% at 6% 104%,rgba(var(--blue-rgb),.55),transparent 64%),
        linear-gradient(160deg,rgba(var(--panel-rgb),.9),rgba(var(--shadow-rgb),.98))}
    .fm-arte-grade{position:absolute;inset:0;
      background-image:linear-gradient(rgba(var(--line-rgb),.09) 1px,transparent 1px),
        linear-gradient(90deg,rgba(var(--line-rgb),.09) 1px,transparent 1px);
      background-size:56px 56px}
    .fm-arte-linha{position:absolute;left:52px;height:16px;border-radius:999px;
      background:rgba(var(--ink-rgb),.24)}
    .fm-play-p{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);
      width:132px;height:132px}
    .fm-play{width:132px;height:132px;border-radius:50%;display:grid;place-items:center;
      background:rgba(var(--shadow-rgb),.72);border:2px solid rgba(var(--cyan-rgb),.75);
      box-shadow:0 0 60px rgba(var(--cyan-rgb),.35),inset 0 0 40px rgba(var(--cyan-rgb),.18)}
    .fm-play svg{width:58px;height:58px;fill:var(--cyan);margin-left:6px}
    `,
    html: envolver({ x: 0, y: 0, ...p }, corpo),
  };
}
