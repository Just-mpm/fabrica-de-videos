/* desenha uma prancha de teste (work/prancha.svg) num PNG, para olhar as formas
   antes de colocá-las nas peças. Chrome sem cabeça, sem build e sem render.
   uso: node ferramentas\prancha.mjs [arquivo.svg] [saida.png] [largura] [altura]
   Rode da raiz do kit. Precisa do Chrome; se estiver fora do lugar comum, defina `CHROME`. */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { caminhoDoChrome } from "./chrome.mjs";

const svg = path.resolve(process.argv[2] ?? "work/prancha.svg");
const out = path.resolve(process.argv[3] ?? "work/prancha.png");
const w = Number(process.argv[4] ?? 1500);
const h = Number(process.argv[5] ?? 900);
const chrome = caminhoDoChrome();

const html = `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:#060c1c}svg{display:block}</style>
${fs.readFileSync(svg, "utf8")}`;
const tmp = path.resolve("work/_prancha.html");
fs.writeFileSync(tmp, html, "utf8");

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    // perfil próprio: não disputa a janela aberta do Chrome nem a do render
    `--user-data-dir=${path.resolve("work/_chrome-prancha")}`,
    `--screenshot=${out}`,
    `--window-size=${w},${h}`,
    `file:///${tmp.replace(/\\/g, "/")}`,
  ],
  { stdio: "ignore" },
);
console.log(`${out} · ${fs.statSync(out).size} bytes`);
