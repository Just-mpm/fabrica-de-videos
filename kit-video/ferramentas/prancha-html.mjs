/* fotografa uma página local (work/prancha.html) — para ver PNG de peça sobre o
   papel do filme, no tamanho em que ele vai aparecer.
   uso: node ferramentas\prancha-html.mjs [arquivo.html] [saida.png] [largura] [altura]
   Precisa do Chrome instalado; se ele estiver fora do lugar comum, defina `CHROME`. */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { caminhoDoChrome } from "./chrome.mjs";

const entrada = path.resolve(process.argv[2] ?? "work/prancha.html");
const out = path.resolve(process.argv[3] ?? "work/prancha.png");
const w = Number(process.argv[4] ?? 1500);
const h = Number(process.argv[5] ?? 900);
const chrome = caminhoDoChrome();

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    `--user-data-dir=${path.resolve("work/_chrome-prancha")}`,
    `--screenshot=${out}`,
    `--window-size=${w},${h}`,
    `file:///${entrada.replace(/\\/g, "/")}`,
  ],
  { stdio: "ignore" },
);
console.log(`${out} · ${fs.statSync(out).size} bytes`);
