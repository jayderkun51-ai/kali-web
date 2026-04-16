# Ejecuta supabase/automate_all.sql contra el proyecto enlazado.
# Si no tienes CLI o link, abre el archivo y pégalo en Supabase → SQL Editor.

$ErrorActionPreference = "Stop"
# Repo root = carpeta padre de /scripts
$root = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $root "supabase\automate_all.sql"))) {
  $root = (Get-Location).Path
}

$sql = Join-Path $root "supabase\automate_all.sql"
if (-not (Test-Path $sql)) {
  Write-Host "No encuentro supabase/automate_all.sql (cwd: $(Get-Location))"
  exit 1
}

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

$supabase = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabase) {
  Write-Host ""
  Write-Host "=== Supabase CLI no instalada ===" -ForegroundColor Yellow
  Write-Host "Opción 1: npx (recomendado)" -ForegroundColor Cyan
  Write-Host "  npx supabase@latest login"
  Write-Host "  npx supabase@latest link --project-ref TU_PROJECT_REF"
  Write-Host "  npx supabase@latest db query --file supabase/automate_all.sql --linked"
  Write-Host ""
  Write-Host "Opción 2: pega manualmente en Dashboard → SQL Editor:" -ForegroundColor Cyan
  Write-Host "  $sql"
  Write-Host ""
  exit 0
}

Write-Host "Ejecutando $sql contra proyecto enlazado..." -ForegroundColor Green
Push-Location $root
try {
  & supabase db query --file "supabase/automate_all.sql" --linked --agent no
} finally {
  Pop-Location
}
if ($LASTEXITCODE -ne 0) {
  Write-Host "Falló el CLI. Pega el SQL en el editor web o ejecuta: supabase link" -ForegroundColor Yellow
  exit $LASTEXITCODE
}
Write-Host "Listo." -ForegroundColor Green
