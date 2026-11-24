#!/usr/bin/env node
/**
 * Launcher dos MCPs do template.
 *
 * Motivo: o `opencode.json` precisa ser o mesmo em qualquer máquina (é
 * versionado), mas o programa pode estar em três lugares diferentes:
 *
 *   1. pasta do repositório de pacotes (`mcp.local.json`, gerado pelo setup.ps1
 *      nesta máquina — fora do Git);
 *   2. `node_modules` do próprio template (quem preferir instalar por projeto);
 *   3. npm público, via `npx -y` (os três pacotes já estão publicados).
 *
 * Sem isso, o config teria caminho absoluto de uma máquina só, ou dependeria de
 * um comando global (`npm link`) que quem clona nunca tem.
 *
 * Uso normal (é o que o OpenCode executa): `node .opencode/mcp/run.mjs <nome>`.
 * Diagnóstico: `node .opencode/mcp/run.mjs --check <nome>`.
 * Lista de servidores: `node .opencode/mcp/run.mjs --list` (o setup.ps1 usa).
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..", "..");

/** nome no opencode.json → pacote npm, instalado na primeira execução via npx. */
const SERVERS = {
  "images-audio": { pkg: "@justmpm/images-audio" },
  "youtube-studio": { pkg: "@justmpm/youtube-studio" },
  "google-trends": { pkg: "@justmpm/google-trends" },
};

const args = process.argv.slice(2);

/* `--list` existe para o setup.ps1 não manter uma segunda cópia da lista de servidores. */
if (args[0] === "--list") {
  process.stdout.write(`${Object.keys(SERVERS).join("\n")}\n`);
  process.exit(0);
}

const checking = args[0] === "--check";
const name = checking ? args[1] : args[0];
const rest = checking ? args.slice(2) : args.slice(1);

const server = name !== undefined && Object.hasOwn(SERVERS, name) ? SERVERS[name] : undefined;
if (server === undefined) {
  process.stderr.write(
    `[mcp] servidor desconhecido: "${name ?? ""}". Use um de: ${Object.keys(SERVERS).join(", ")}.\n`,
  );
  process.exit(1);
}

/**
 * Caminhos locais por máquina. Ausente é normal (máquina limpa): nesse caso o
 * launcher cai no `node_modules` ou no npm.
 */
function readLocalDirs() {
  const file = join(projectRoot, "mcp.local.json");
  if (!existsSync(file)) return {};
  try {
    // Bloco de notas e alguns editores gravam UTF-8 com BOM; o JSON.parse
    // recusa o caractere e o arquivo inteiro seria descartado sem motivo.
    const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
    const parsed = JSON.parse(raw);
    const dirs = parsed?.dirs;
    return typeof dirs === "object" && dirs !== null ? dirs : {};
  } catch (error) {
    process.stderr.write(`[mcp] mcp.local.json inválido (${String(error)}); ignorando.\n`);
    return {};
  }
}

function packageVersion(dir) {
  try {
    return JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).version ?? "?";
  } catch {
    return "?";
  }
}

function entryOf(dir) {
  const entry = join(dir, "dist", "index.js");
  return existsSync(entry) ? entry : null;
}

function resolvePlan() {
  const dir = readLocalDirs()[name];
  if (typeof dir === "string" && dir.length > 0) {
    const entry = entryOf(dir);
    if (entry !== null) return { kind: "local", entry, dir };
  }

  const installed = join(projectRoot, "node_modules", ...server.pkg.split("/"));
  const installedEntry = entryOf(installed);
  if (installedEntry !== null) return { kind: "installed", entry: installedEntry, dir: installed };

  return { kind: "npx" };
}

const plan = resolvePlan();

if (checking) {
  const where =
    plan.kind === "npx"
      ? `npx -y ${server.pkg} (baixa na primeira execucao; so funciona se estiver publicado no npm)`
      : `${packageVersion(plan.dir)} ${plan.entry}`;
  process.stdout.write(`${name} (${plan.kind}): ${where}\n`);
  process.exit(0);
}

/** `spawn` de `.cmd` no Windows exige shell; no Linux/macOS o npx é executável direto. */
const isWindows = process.platform === "win32";

/**
 * No Windows o `npx` é um `.cmd` e só roda com shell. A partir do Node 24,
 * passar um array de argumentos junto com `shell: true` emite DEP0190 (os
 * argumentos seriam concatenados sem escape), então a linha vai montada e cada
 * pedaço é citado aqui.
 */
function startNpx() {
  const options = { stdio: "inherit", windowsHide: true };
  if (!isWindows) return spawn("npx", ["-y", server.pkg, ...rest], options);

  /**
   * O `cmd.exe` não tem escape para `%` na linha de comando: dentro de aspas ele
   * ainda expande `%VAR%`, e `%%` só colapsa em arquivo `.bat`. Argumento com `%`
   * neste caminho (npx no Windows) é uma limitação conhecida; o uso normal do
   * template não passa `%` para cá.
   */
  const citar = (valor) => (/[\s"&|<>^]/.test(valor) ? `"${valor.replaceAll('"', '""')}"` : valor);
  const linha = ["npx", "-y", server.pkg, ...rest].map(citar).join(" ");
  return spawn(linha, { ...options, shell: true });
}

const child =
  plan.kind === "npx"
    ? startNpx()
    : spawn(process.execPath, [plan.entry, ...rest], {
        stdio: "inherit",
        windowsHide: true,
      });

child.on("error", (error) => {
  process.stderr.write(`[mcp] falha ao iniciar ${name}: ${error.message}\n`);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal !== null) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
