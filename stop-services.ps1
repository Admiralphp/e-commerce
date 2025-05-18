# Stop all PIC E-commerce Microservices

# Stop Docker containers via docker-compose
Write-Host "Arrêt de tous les services Docker..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml down

# Vérification que tous les conteneurs sont arrêtés
Write-Host "`nStatut des conteneurs après arrêt:" -ForegroundColor Cyan
docker ps

Write-Host "`nTous les services ont été arrêtés." -ForegroundColor Green
Write-Host "Les données des bases de données sont persistantes dans les volumes Docker." -ForegroundColor Gray
Write-Host "Pour supprimer également les volumes (et perdre vos données), exécutez: docker-compose -f docker-compose-fixed.yml down -v" -ForegroundColor Yellow

Write-Host "All services have been stopped" -ForegroundColor Green
