# Stop all services using the final docker-compose file with graceful shutdown

Write-Host "Stopping all microservices..." -ForegroundColor Yellow

# First gracefully stop the frontend applications
Write-Host "Stopping frontend applications..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml stop frontend admin-dashboard
Start-Sleep -Seconds 2

# Then stop the API gateway
Write-Host "Stopping API gateway..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml stop nginx
Start-Sleep -Seconds 2

# Then stop the microservices
Write-Host "Stopping core microservices..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml stop order-service product-service auth-service
Start-Sleep -Seconds 2

# Finally stop the databases and monitoring services
Write-Host "Stopping database and monitoring services..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml stop mongo-express pgadmin mongo postgres

# Take down the entire compose setup
Write-Host "Removing containers..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml down

Write-Host "All services have been stopped and containers removed." -ForegroundColor Green
Write-Host "To remove all container data (volumes), run: docker-compose -f docker-compose-final.yml down -v" -ForegroundColor Yellow
Write-Host "To remove all container images, run: docker-compose -f docker-compose-final.yml down --rmi all" -ForegroundColor Yellow
