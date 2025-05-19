# Run the PIC E-commerce Microservices
# This script runs all services in the e-commerce platform using Docker Compose

# Arrêt et suppression des conteneurs existants
Write-Host "Arrêt et suppression de tous les services existants..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml down

# Suppression des conteneurs orphelins
Write-Host "Suppression des conteneurs orphelins..." -ForegroundColor Cyan
docker container prune -f

# Vérification de la validité du fichier docker-compose
Write-Host "Vérification de la validité du fichier Docker Compose..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml config

# Create a directory for logs
$logFolders = @("logs/auth", "logs/orders", "logs/products", "logs/frontend", "logs/admin")
foreach ($folder in $logFolders) {
    if (-not (Test-Path $folder)) {
        Write-Host "Création du répertoire de logs: $folder"
        New-Item -Path $folder -ItemType Directory -Force | Out-Null
    }
}

# Update your hosts file
Write-Host "Checking hosts file configuration..." -ForegroundColor Cyan
$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsPath -ErrorAction SilentlyContinue
if ($hostsContent -notcontains "127.0.0.1 api.phoneaccessories.local") {
    Write-Host "Please add the following line to your hosts file manually (requires admin privileges):" -ForegroundColor Yellow
    Write-Host "127.0.0.1 api.phoneaccessories.local" -ForegroundColor Yellow
    
    try {
        Add-Content -Path $hostsPath -Value "`n127.0.0.1 api.phoneaccessories.local" -ErrorAction Stop
        Write-Host "Entrée ajoutée avec succès au fichier hosts" -ForegroundColor Green
    }
    catch {
        Write-Host "ERREUR: Impossible de modifier le fichier hosts. Veuillez exécuter ce script en tant qu'administrateur." -ForegroundColor Red
    }
}

# Start all services with Docker Compose
Write-Host "Starting all services with Docker Compose..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml up -d

# Check container status
Start-Sleep -Seconds 5
Write-Host "`nContainer status:" -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml ps

# Output service URLs
Write-Host "`nApplication is now running!" -ForegroundColor Green
Write-Host "URLs:"
Write-Host "- Frontend:        http://localhost:3001" -ForegroundColor Cyan
Write-Host "- Admin Dashboard: http://localhost:4200" -ForegroundColor Cyan
Write-Host "- API Gateway:     http://api.phoneaccessories.local" -ForegroundColor Cyan
Write-Host "- API Health:      http://api.phoneaccessories.local/health" -ForegroundColor Cyan
Write-Host "- MongoDB Express: http://localhost:8081" -ForegroundColor Cyan
Write-Host "- PgAdmin:         http://localhost:5050" -ForegroundColor Cyan
Write-Host "`nCheck the logs directory for service output" -ForegroundColor Yellow
Write-Host "To stop all services, run: docker-compose -f docker-compose-fixed.yml down"
