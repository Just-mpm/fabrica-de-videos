/* Cartão final do canal.
   Não é uma tela de "acabou": é a última imagem que fica na cabeça de quem
   assistiu. Por isso ele tem as três coisas que o fim de um vídeo precisa —
   quem fala (o avatar), o que vem depois (o slot do próximo vídeo) e o que
   fazer agora (o botão de inscrever) — e todas as três entram em ordem de
   importância, não de uma vez.

   O slot é um retângulo 16:9 de verdade (940×529 de vídeo), com o cabeçalho
   por fora da área de vídeo — assim uma thumbnail real entra sem letterbox. O
   que está dentro dele é desenho, não promessa: barras, um anel e um play. */

import { envolver } from "./base.mjs";
import { prosa } from "../prosa.mjs";

/* Piso de tempo de tela do cartão. O build (build/compilar.mjs) usa este número
   para esticar a última cena quando a narração termina colada no corte — sem
   isso o cartão herdava só a cauda do áudio (~1,6 s). */
export const MIN_JANELA = 10;

export const contrato = {
  nome: "fim",
  funcao: "cartão final: avatar do canal, nome, slot 16:9 do próximo vídeo e botão de inscrever",
  usa: "titulo, sub, avatar, promessa, rec {rotulo, nota}, inscrever, janela, t {avatar, nome, sub, promessa, slot, play, botao, onda1, onda2, onda3, pulso1, pulso2}, x, y, at, anim",
  naoFaz: "mais de um slot de recomendação; texto corrido; concorrer com a última frase da narração",
};

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const at = (q, extra = 0) => (q == null ? "" : `data-at="${(q + extra).toFixed(2)}"`);

/* Duas linhas do nome: o corte é o que deixa as linhas mais parecidas em
   comprimento. É o que separa "Refúgio / do Mundo" de "Refúgio do / Mundo" —
   e o que mantém "IA Sem / Mistério" junto, sem órfã de duas letras. */
function cortarNome(titulo) {
  const palavras = String(titulo).trim().split(/\s+/).filter(Boolean);
  if (palavras.length < 2) return [palavras.join(" "), ""];
  let corte = 1;
  let menor = Infinity;
  for (let i = 1; i < palavras.length; i += 1) {
    const a = palavras.slice(0, i).join(" ").length;
    const b = palavras.slice(i).join(" ").length;
    const d = Math.abs(a - b);
    if (d < menor) {
      menor = d;
      corte = i;
    }
  }
  return [palavras.slice(0, corte).join(" "), palavras.slice(corte).join(" ")];
}

export function montar(p = {}) {
  const {
    avatar = "assets/logomarca.png",
    t = {},
    janela,
    at: inicio = 0.2,
    anim = "fade",
  } = p;

  /* As frases do cartão também obedecem à regra de caixa (biblioteca/prosa.mjs).
     O `montarPeca` já corrige o que vem da montagem; aqui ficam os defaults da
     própria peça, que não passam por lá. `prosa` é idempotente. */
  const titulo = prosa(p.titulo ?? "SEU CANAL");
  const sub = prosa(p.sub ?? "seu slogan aqui");
  const promessa = prosa(p.promessa ?? ["tem mais vídeo", "aqui no canal"]);
  const inscrever = prosa(p.inscrever ?? "Inscreva-se");
  const rec = {
    rotulo: prosa(p.rec?.rotulo ?? "próximo vídeo"),
    nota: prosa(p.rec?.nota ?? "em breve"),
  };

  const qAvatar = num(t.avatar) ?? inicio;
  const qNome = num(t.nome) ?? qAvatar + 0.4;
  const qSub = num(t.sub) ?? qNome + 0.5;
  const qPromessa = num(t.promessa) ?? qSub + 0.3;
  const qSlot = num(t.slot) ?? qPromessa + 0.4;
  const qPlay = num(t.play) ?? qSlot + 0.45;
  const qBotao = num(t.botao) ?? qPlay + 0.9;
  const qJanela = num(janela);
  const qOnda1 = num(t.onda1) ?? qBotao + 1.4;
  /* `janela` é a duração real da cena (o build informa). As ondas se espalham
     até o corte — uma a cada ~2,2 s — para o botão respirar até o fim em vez de
     pulsar três vezes e congelar. A última fecha 2 s antes do corte: um halo
     pego no meio do caminho no último frame parece defeito de render. */
  const qOnda2 = num(t.onda2) ?? +(qOnda1 + 2.2).toFixed(2);
  const qOnda3 =
    num(t.onda3) ?? (qJanela != null ? +(qJanela - 2).toFixed(2) : qOnda2 + 2.2);
  const qPulso1 = num(t.pulso1);
  const qPulso2 = num(t.pulso2);

  const [l1, l2] = cortarNome(titulo);

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
          <div class="fm-onda" ${at(qOnda1)} data-anim="ondaCampo"
            data-cor="0,212,255" data-spread="26" data-alfa="0.55"
            data-blur="8"></div>
          <div class="fm-onda" ${at(qOnda2)} data-anim="ondaCampo"
            data-cor="0,212,255" data-spread="26" data-alfa="0.55"
            data-blur="8"></div>
          ${qOnda3 != null ? `<div class="fm-onda" ${at(qOnda3)} data-anim="ondaCampo"
            data-cor="0,212,255" data-spread="26" data-alfa="0.55"
            data-blur="8"></div>` : ""}
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
            <span class="fm-slot-rot" data-layout-ignore>${rec.rotulo}</span>
            <span class="fm-slot-nota" data-layout-ignore>${rec.nota}</span>
          </div>
          <div class="fm-slot-corpo">
            <div class="fm-arte">
              <span class="fm-arte-grade"></span>
              <span class="fm-arte-luz"></span>
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
      background:conic-gradient(from 0deg,rgba(var(--cyan-rgb),0),rgba(var(--cyan-rgb),.55),rgba(var(--lime-rgb),.32),rgba(var(--cyan-rgb),0));
      -webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px));
      mask:radial-gradient(farthest-side,transparent calc(100% - 6px),#000 calc(100% - 5px))}
    .fm-avatar{position:absolute;inset:0;border-radius:50%;overflow:hidden;
      box-shadow:0 26px 70px rgba(3,10,30,.55)}
    .fm-avatar img{width:100%;height:100%;object-fit:cover;display:block}

    .fm-nome{display:flex;flex-direction:column;margin-top:58px;font-family:var(--display);
      font-weight:800;font-size:92px;line-height:.96;letter-spacing:-.02em;color:var(--ink)}
    .fm-l2{color:var(--ice)}
    .fm-sub{margin-top:24px;font-family:var(--body);font-weight:600;font-size:30px;letter-spacing:0;
      color:var(--ink-dim);max-width:660px;line-height:1.35}

    .fm-botao-caixa{position:relative;margin-top:52px;align-self:flex-start}
    .fm-botao{display:inline-flex;align-items:center;gap:20px;height:96px;padding:0 44px 0 18px;
      border-radius:999px;background:linear-gradient(180deg,#7fe9ff,var(--cyan));color:#052042;
      font-family:var(--display);font-weight:800;font-size:34px;letter-spacing:-.01em;
      box-shadow:0 18px 44px rgba(0,170,220,.42),inset 0 2px 0 rgba(255,255,255,.65)}
    .fm-yt{display:grid;place-items:center;width:62px;height:62px;border-radius:20px;background:#052042}
    .fm-yt svg{width:34px;height:34px;fill:#7fe9ff}
    /* o eco não escala: ele difunde. Uma sombra sem deslocamento espalha o
       mesmo tanto em todas as direções, então o halo fica concêntrico em
       qualquer formato de pílula (com scale, a lateral abria 60 px e o topo 9). */
    .fm-onda{position:absolute;left:0;top:0;width:100%;height:100%;border-radius:999px;
      pointer-events:none}

    .fm-dir{position:absolute;left:860px;top:145px;width:960px}
    .fm-promessa{display:flex;flex-direction:column;font-family:var(--display);font-weight:800;
      font-size:56px;line-height:1.02;letter-spacing:-.015em;color:var(--ink);margin-bottom:34px}
    .fm-promessa span:last-child{color:var(--cyan)}

    .fm-slot{position:relative;width:940px;height:591px;border-radius:26px;overflow:hidden;
      background:linear-gradient(160deg,rgba(27,79,168,.95),rgba(7,20,54,.99));
      border:1.5px solid rgba(var(--line-rgb),.34);
      box-shadow:0 30px 80px rgba(3,10,30,.55),inset 0 1px 0 rgba(var(--ink-rgb),.12)}
    .fm-slot-topo{display:flex;align-items:center;gap:10px;height:62px;padding:0 26px;
      border-bottom:1px solid rgba(var(--line-rgb),.16);background:rgba(4,12,34,.28)}
    .fm-bola{width:11px;height:11px;border-radius:50%;background:rgba(var(--line-rgb),.45)}
    .fm-slot-rot{margin-left:16px;font-family:var(--mono);font-size:26px;line-height:1;letter-spacing:.15em;
      text-transform:uppercase;color:rgba(var(--ink-rgb),.85)}
    .fm-slot-nota{margin-left:auto;font-family:var(--mono);font-size:26px;line-height:1;letter-spacing:.13em;
      text-transform:uppercase;color:var(--cyan)}
    /* a área de vídeo é 16:9 de verdade: 940×529, com o cabeçalho POR FORA dela.
       Antes o cabeçalho comia 62 px por dentro e a área útil virava 2:1. */
    .fm-slot-corpo{position:absolute;left:0;right:0;top:62px;height:529px}
    .fm-arte{position:absolute;inset:0;overflow:hidden;
      background:
        radial-gradient(105% 120% at 82% 4%,rgba(var(--cyan-rgb),.30),transparent 58%),
        radial-gradient(90% 110% at 6% 104%,rgba(21,101,216,.55),transparent 64%),
        linear-gradient(160deg,rgba(11,45,110,.9),rgba(5,14,40,.98))}
    .fm-arte-grade{position:absolute;inset:0;
      background-image:linear-gradient(rgba(var(--line-rgb),.09) 1px,transparent 1px),
        linear-gradient(90deg,rgba(var(--line-rgb),.09) 1px,transparent 1px);
      background-size:56px 56px}
    .fm-arte-linha{position:absolute;left:52px;height:16px;border-radius:999px;
      background:rgba(var(--ink-rgb),.24)}
    /* a luz parada: uma diagonal de ciano cortando o painel. Sem animação de
       propósito — aqui ela é estrutura, não efeito. */
    .fm-arte-luz{position:absolute;inset:0;pointer-events:none;
      background:linear-gradient(114deg,transparent 34%,rgba(var(--cyan-rgb),.10) 46%,
        rgba(var(--cyan-rgb),.04) 55%,transparent 68%)}
    .fm-play-p{position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);
      width:132px;height:132px}
    .fm-play{width:132px;height:132px;border-radius:50%;display:grid;place-items:center;
      background:rgba(5,32,66,.72);border:2px solid rgba(var(--cyan-rgb),.75);
      box-shadow:0 0 60px rgba(var(--cyan-rgb),.35),inset 0 0 40px rgba(var(--cyan-rgb),.18)}
    .fm-play svg{width:58px;height:58px;fill:var(--cyan);margin-left:6px}
    `,
    html: envolver({ x: 0, y: 0, ...p }, corpo),
  };
}
