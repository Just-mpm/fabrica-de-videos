# Gera folhas de contato (grade de frames) para avaliar as demos.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
$tmp = Join-Path $root 'renders\demos\_tmp'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

function Folha($nome, $tempos) {
  $video = "renders\demos\$nome.mp4"
  $imgs = @()
  $i = 0
  foreach ($t in $tempos) {
    $out = Join-Path $tmp ("{0}-{1}.png" -f $nome, $i)
    & ffmpeg -y -hide_banner -loglevel error -i $video -ss $t -frames:v 1 $out
    $imgs += $out
    $i++
  }
  $n = $imgs.Count
  $cols = if ($n -le 4) { 2 } else { 3 }
  $w = [int](1920 / $cols)
  $h = [int](1080 / $cols)
  $args = @()
  foreach ($p in $imgs) { $args += @('-i', $p) }
  $filters = @()
  for ($k = 0; $k -lt $n; $k++) { $filters += "[$k`:v]scale=${w}:${h}[v$k]" }
  if ($n -le 4) {
    $filters += '[v0][v1]hstack[t]'
    $filters += '[v2][v3]hstack[b]'
    $filters += '[t][b]vstack'
  } elseif ($n -eq 6) {
    $filters += '[v0][v1][v2]hstack=3[t]'
    $filters += '[v3][v4][v5]hstack=3[b]'
    $filters += '[t][b]vstack'
  } else {
    $filters += '[v0][v1][v2]hstack=3[r0]'
    $filters += '[v3][v4][v5]hstack=3[r1]'
    $filters += '[v6][v7][v8]hstack=3[r2]'
    $filters += '[r0][r1][r2]vstack=3'
  }
  $dest = "renders\demos\folha-$nome.png"
  & ffmpeg -y -hide_banner -loglevel error @args -filter_complex ($filters -join ';') -frames:v 1 $dest
  Write-Output "ok $dest"
}

Folha 'filme-exemplo'      @(3.0, 9.0, 17.0, 24.0, 29.0)
Folha 'demo-livre'         @(4.8, 12.0, 19.0, 24.8)
Folha 'demo' @(3.0, 10.5, 23.0, 30.5, 42.0, 53.5)

Remove-Item -Recurse -Force $tmp
