# SENEFLIX - Démarrer Frontend + Backend
# Utilisation: .\start-dev.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SENEFLIX - Démarrage Development" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Vérification de WAMP/MySQL..." -ForegroundColor Yellow
$mysql = Get-Service -Name "wampmysqld" -ErrorAction SilentlyContinue
if ($mysql -and $mysql.Status -eq "Running") {
    Write-Host "✓ MySQL est en cours d'exécution" -ForegroundColor Green
} else {
    Write-Host "⚠ MySQL pourrait ne pas être démarré. Lancez WAMP." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Démarrage du Backend (NestJS) sur http://localhost:3000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\backend'; npm run start:dev"

Start-Sleep -Seconds 2

Write-Host "Démarrage du Frontend (Vite) sur http://localhost:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  URLs:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "  - Swagger:  http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter les deux serveurs." -ForegroundColor Gray
