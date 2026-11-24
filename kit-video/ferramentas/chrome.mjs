/* Acha o Chrome instalado nesta máquina.

   Usado pelas pranchas (fotografar HTML/SVG sem build). Não há caminho que sirva
   para todo mundo, então: variável de ambiente `CHROME` primeiro, depois os
   lugares comuns de Windows, macOS e Linux. Se nada existir, falha com recado
   claro em vez de `ENOENT` sem explicação. */

import fs from "node:fs";

const CANDIDATOS = [
  process.env.CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  process.env.LOCALAPPDATA &&
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

export function caminhoDoChrome() {
  for (const caminho of CANDIDATOS) {
    if (fs.existsSync(caminho)) return caminho;
  }
  throw new Error(
    [
      "Chrome não encontrado. Instale o Chrome ou aponte o caminho na variável de ambiente CHROME:",
      '  PowerShell:  $env:CHROME = "C:\\caminho\\para\\chrome.exe"',
    ].join("\n"),
  );
}
