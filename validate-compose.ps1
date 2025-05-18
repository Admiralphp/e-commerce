# Script for testing the Docker Compose file
# This script checks if the Docker Compose file is valid

Write-Host "Validating Docker Compose file..." -ForegroundColor Cyan
docker-compose -f docker-compose-fixed.yml config

if ($?) {
    Write-Host "Docker Compose file is valid!" -ForegroundColor Green
} else {
    Write-Host "Docker Compose file has errors" -ForegroundColor Red
}

# List all Docker resources to check the current state
Write-Host "`nCurrent Docker containers:" -ForegroundColor Cyan
docker ps -a

Write-Host "`nCurrent Docker networks:" -ForegroundColor Cyan
docker network ls

Write-Host "`nCurrent Docker volumes:" -ForegroundColor Cyan
docker volume ls

Write-Host "`nDocker disk usage:" -ForegroundColor Cyan
docker system df
