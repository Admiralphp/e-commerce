# Script de démarrage de l'application e-commerce d'accessoires téléphoniques
# Ce script configure l'environnement et démarre tous les conteneurs

# Création des répertoires de logs si nécessaires
$logFolders = @("logs/auth", "logs/orders", "logs/products", "logs/frontend", "logs/admin")
foreach ($folder in $logFolders) {
    if (-not (Test-Path $folder)) {
        Write-Host "Création du répertoire de logs: $folder"
        New-Item -Path $folder -ItemType Directory -Force | Out-Null
    }
}

# Modification du fichier hosts (requiert des privilèges administrateur)
$hostEntry = "127.0.0.1 api.phoneaccessories.local"
$hostsFile = "$env:windir\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsFile

if (-not ($hostsContent -match "api.phoneaccessories.local")) {
    Write-Host "Ajout de 'api.phoneaccessories.local' au fichier hosts (nécessite des privilèges administrateur)"
    try {
        Add-Content -Path $hostsFile -Value $hostEntry -ErrorAction Stop
        Write-Host "Entrée ajoutée avec succès au fichier hosts" -ForegroundColor Green
    }
    catch {
        Write-Host "ERREUR: Impossible de modifier le fichier hosts. Veuillez exécuter ce script en tant qu'administrateur." -ForegroundColor Red
        Write-Host "Vous pouvez ajouter manuellement cette ligne à votre fichier hosts: $hostEntry" -ForegroundColor Yellow
    }
}
else {
    Write-Host "L'entrée 'api.phoneaccessories.local' existe déjà dans le fichier hosts" -ForegroundColor Green
}

# Compilation et démarrage des conteneurs
Write-Host "Démarrage de tous les services avec Docker Compose..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml up -d

# Vérification du statut des conteneurs
Start-Sleep -Seconds 5
Write-Host "`nStatut des conteneurs:" -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml ps

# Affichage des URLs d'accès
Write-Host "`nURLs d'accès à l'application:" -ForegroundColor Cyan
Write-Host "Frontend Client: http://localhost:3001" -ForegroundColor Yellow
Write-Host "Admin Dashboard: http://localhost:4200" -ForegroundColor Yellow
Write-Host "API Gateway: http://api.phoneaccessories.local" -ForegroundColor Yellow
Write-Host "MongoDB Express (Interface BDD): http://localhost:8081" -ForegroundColor Yellow
Write-Host "PgAdmin (Interface PostgreSQL): http://localhost:5050" -ForegroundColor Yellow

Write-Host "`nLes logs des services sont disponibles dans le répertoire ./logs/" -ForegroundColor Gray
Write-Host "Pour arrêter tous les services, exécutez: docker-compose -f docker-compose-new.yml down" -ForegroundColor Gray

Write-Host "`nNote: Le démarrage complet des services peut prendre quelques instants. Veuillez patienter avant d'accéder aux URLs." -ForegroundColor Magenta
