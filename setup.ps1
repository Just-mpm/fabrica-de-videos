<#
  Prepara este projeto para usar os MCPs nesta máquina.

  O que ele faz (uma vez por máquina):
    1. confere o Node (o mínimo dos pacotes é 20);
    2. procura os MCPs no repositório de pacotes e, se faltar o `dist/`, roda o build;
    3. grava `mcp.local.json` (fora do Git) com os caminhos encontrados — o
       `opencode.json` fica igual em qualquer máquina e o launcher
       `.opencode/mcp/run.mjs` resolve o resto;
    4. verifica cada servidor com `run.mjs --check`.

  Uso:
    pwsh -File setup.ps1
    pwsh -File setup.ps1 -McpRepo "D:\outro\lugar\mcps-ai"
    pwsh -File setup.ps1 -SkipLogin      # não imprime o passo de login

  O login (perfil do Chrome) é por máquina e não vai no template: rode os
  comandos que aparecem no fim quando for usar cada MCP pela primeira vez.
#>
[CmdletBinding()]
param(
    [string]$McpRepo = $(if ($env:MCP_REPO) { $env:MCP_REPO } else { "D:\Pictures\Pacotes-Pessoais\mcps-ai" }),
    [switch]$SkipLogin
)

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
if ([string]::IsNullOrEmpty($root)) {
    $root = Split-Path -Parent $MyInvocation.MyCommand.Path
}
$launcher = Join-Path (Join-Path $root ".opencode") (Join-Path "mcp" "run.mjs")

Write-Host ""
Write-Host "== MCPs do projeto ==" -ForegroundColor Cyan

# 1. Node
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "Node nao encontrado no PATH. Instale o Node 20 ou superior e rode de novo." -ForegroundColor Red
    exit 1
}
$nodeMajor = & node -p "Number(process.versions.node.split('.')[0])"
if ([int]$nodeMajor -lt 20) {
    Write-Host ("Node {0} encontrado; os pacotes exigem 20 ou superior." -f (& node -v)) -ForegroundColor Red
    exit 1
}
Write-Host ("Node {0}: ok" -f (& node -v))

if (-not (Test-Path $launcher)) {
    Write-Host ("Launcher ausente: {0}" -f $launcher) -ForegroundColor Red
    exit 1
}

# 2. Pacotes
# A lista vem do launcher: uma fonte de verdade só (SERVERS em run.mjs).
$servers = @(& node $launcher --list)
if ($servers.Count -eq 0) {
    Write-Host "Nao foi possivel listar os servidores (run.mjs --list falhou)." -ForegroundColor Red
    exit 1
}
$dirs = @{}

if (-not (Test-Path $McpRepo)) {
    Write-Host ""
    Write-Host ("Repositorio de pacotes nao encontrado em {0}." -f $McpRepo) -ForegroundColor Yellow
    Write-Host "Nada sera gravado. Depois de publicados, os MCPs publicos baixam sozinhos (npx)."
} else {
    Write-Host ""
    Write-Host ("Repositorio: {0}" -f $McpRepo)
    foreach ($name in $servers) {
        $pkgDir = Join-Path $McpRepo $name
        $entry = Join-Path (Join-Path $pkgDir "dist") "index.js"
        $manifest = Join-Path $pkgDir "package.json"

        if ((-not (Test-Path $entry)) -and (Test-Path $manifest)) {
            # Repositório recém-clonado não tem node_modules, e o dist/ não é
            # versionado: sem instalar antes, o build falha por falta do tsc.
            if (-not (Test-Path (Join-Path $pkgDir "node_modules"))) {
                Write-Host ("  {0}: sem dependencias, rodando npm install..." -f $name)
                Push-Location $pkgDir
                try {
                    & npm install --no-audit --no-fund
                    if ($LASTEXITCODE -ne 0) {
                        Write-Warning ("npm install de {0} falhou (codigo {1})" -f $name, $LASTEXITCODE)
                    }
                } finally {
                    Pop-Location
                }
            }

            Write-Host ("  {0}: sem dist, rodando build..." -f $name)
            Push-Location $pkgDir
            try {
                & npm run build
                if ($LASTEXITCODE -ne 0) {
                    Write-Warning ("build de {0} falhou (codigo {1})" -f $name, $LASTEXITCODE)
                }
            } finally {
                Pop-Location
            }
        }

        if (Test-Path $entry) {
            # Barra normal: JSON e o launcher nao reinterpretam escape.
            $dirs[$name] = ($pkgDir -replace "\\", "/")
            Write-Host ("  {0}: ok" -f $name) -ForegroundColor Green
        } else {
            Write-Warning ("{0}: nao encontrado em {1}" -f $name, $pkgDir)
        }
    }
}

# 3. mcp.local.json (fora do Git)
$localFile = Join-Path $root "mcp.local.json"
if ($dirs.Count -gt 0) {
    $payload = [ordered]@{ dirs = $dirs } | ConvertTo-Json -Depth 3
    # Grava em .tmp e troca de uma vez: um run.mjs lendo no meio nunca pega JSON pela metade.
    $tmp = "$localFile.tmp"
    [System.IO.File]::WriteAllText($tmp, $payload, (New-Object System.Text.UTF8Encoding($false)))
    Move-Item -Path $tmp -Destination $localFile -Force
    Write-Host ""
    Write-Host ("Caminhos gravados em {0} (ignorado pelo Git)." -f $localFile) -ForegroundColor Green
} elseif (Test-Path $localFile) {
    # Nao apaga: o arquivo pode ter sido escrito a mao e continua util para o launcher.
    Write-Host ""
    Write-Host "Nenhum caminho local encontrado; o mcp.local.json existente foi mantido." -ForegroundColor Yellow
}

# 4. Verificacao de resolucao
Write-Host ""
Write-Host "Verificando como cada servidor sera iniciado:"
$semServidor = @()
$soViaNpm = @()
foreach ($name in $servers) {
    # Captura so o stdout: o stderr continua indo para o console e nao vira erro
    # terminante por causa de $ErrorActionPreference = "Stop".
    $saida = & node $launcher --check $name
    if ($saida) { Write-Host $saida }
    if ($LASTEXITCODE -ne 0) {
        $semServidor += $name
    } elseif (($saida -join " ") -match "\(npx\)") {
        # Resolveu pelo npm: so conecta se o pacote estiver publicado.
        $soViaNpm += $name
    }
}

# 5. Proximos passos
if (-not $SkipLogin) {
    Write-Host ""
    Write-Host "Primeiro uso de cada MCP nesta maquina (uma vez):" -ForegroundColor Cyan
    Write-Host "  node .opencode/mcp/run.mjs images-audio --login"
    Write-Host "  node .opencode/mcp/run.mjs youtube-studio --login"
    Write-Host "  node .opencode/mcp/run.mjs google-trends --consent"
    Write-Host "  node .opencode/mcp/run.mjs youtube auth --account principal"
    Write-Host ""
    Write-Host "Depois disso, abra o OpenCode nesta pasta: os MCPs ja estao em opencode.json."
}

# 6. Resumo (a ausencia de um servidor nao e erro do script: pode ser o pacote
# privado ou um repositorio que nao existe nesta maquina)
Write-Host ""
if ($semServidor.Count -gt 0) {
    Write-Host ("Sem servidor nesta maquina: {0}." -f ($semServidor -join ", ")) -ForegroundColor Yellow
    Write-Host "Nada foi quebrado. Rode de novo com -McpRepo apontando para os pacotes."
}
if ($soViaNpm.Count -gt 0) {
    Write-Host ("Dependem de download no npm: {0}." -f ($soViaNpm -join ", ")) -ForegroundColor Yellow
    Write-Host "Eles so conectam se o pacote estiver publicado. Para garantir, rode com -McpRepo."
}
if ($semServidor.Count -eq 0 -and $soViaNpm.Count -eq 0) {
    Write-Host "Tudo pronto." -ForegroundColor Green
}
Write-Host ""
exit 0
