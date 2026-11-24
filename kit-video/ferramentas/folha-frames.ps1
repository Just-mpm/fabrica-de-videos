# Monta uma folha de contato (grade 3x3) a partir de PNGs de snapshot.
# Uso: powershell -File ferramentas\folha-frames.ps1 <pasta> <saida.png>
param(
  [Parameter(Mandatory = $true)][string]$Pasta,
  [Parameter(Mandatory = $true)][string]$Saida
)
$ErrorActionPreference = 'Stop'

$imgs = Get-ChildItem -Path $Pasta -Filter *.png |
  Sort-Object { [double]([regex]::Match($_.Name, '(\d+(?:\.\d+)?)s').Groups[1].Value) } |
  Select-Object -First 9

if ($imgs.Count -eq 0) { throw "nenhum PNG em $Pasta" }

$args = @()
foreach ($p in $imgs) { $args += @('-i', $p.FullName) }

$filters = @()
$n = $imgs.Count
for ($k = 0; $k -lt $n; $k++) { $filters += "[$k`:v]scale=640:360[v$k]" }
# completa a grade até 9 quadros repetindo o último
for ($k = $n; $k -lt 9; $k++) { $filters += "[$($n-1):v]scale=640:360[v$k]" }
$filters += '[v0][v1][v2]hstack=3[r0]'
$filters += '[v3][v4][v5]hstack=3[r1]'
$filters += '[v6][v7][v8]hstack=3[r2]'
$filters += '[r0][r1][r2]vstack=3'

& ffmpeg -y -hide_banner -loglevel error @args -filter_complex ($filters -join ';') -frames:v 1 $Saida
Write-Output "ok $Saida ($n quadros)"
