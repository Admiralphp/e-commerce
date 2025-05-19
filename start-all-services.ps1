# Start all services with the updated docker-compose file
# This script uses the fixed Docker configuration for a complete microservices setup

Write-Host "Starting all microservices with the final docker-compose configuration..." -ForegroundColor Green

# Create logs directories if they don't exist
$logDirs = @(
    "logs/admin", 
    "logs/auth", 
    "logs/frontend", 
    "logs/orders", 
    "logs/products"
)

foreach ($dir in $logDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created logs directory: $dir" -ForegroundColor Yellow
    }
}

# Verify nginx.conf file exists and is not empty
if (-not (Test-Path "nginx/nginx.conf") -or (Get-Item "nginx/nginx.conf").Length -eq 0) {
    Write-Host "ERROR: nginx.conf is missing or empty. Please check the file." -ForegroundColor Red
    exit 1
}

# Modification du fichier hosts (requiert des privilèges administrateur)
$hostEntry = "127.0.0.1 api.phoneaccessories.local"
$hostsFile = "$env:windir\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsFile -ErrorAction SilentlyContinue

if (-not ($hostsContent -match "api.phoneaccessories.local")) {
    Write-Host "Adding 'api.phoneaccessories.local' to hosts file (requires admin privileges)" -ForegroundColor Yellow
    try {
        Add-Content -Path $hostsFile -Value $hostEntry -ErrorAction Stop
        Write-Host "Successfully added entry to hosts file" -ForegroundColor Green
    }
    catch {
        Write-Host "ERROR: Cannot modify hosts file. Please run this script as administrator." -ForegroundColor Red
        Write-Host "You can manually add this line to your hosts file: $hostEntry" -ForegroundColor Yellow
    }
}
else {
    Write-Host "Entry 'api.phoneaccessories.local' already exists in hosts file" -ForegroundColor Green
}

# Start services in order using the final configuration
Write-Host "Starting database services..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml up -d mongo postgres
Write-Host "Started database services. Waiting for them to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

Write-Host "Starting monitoring services..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml up -d mongo-express pgadmin
Write-Host "Started monitoring services. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "Starting core microservices..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml up -d auth-service
Write-Host "Started auth service. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

docker-compose -f docker-compose-final.yml up -d product-service
Write-Host "Started product service. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

docker-compose -f docker-compose-final.yml up -d order-service
Write-Host "Started order service. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "Starting API gateway..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml up -d nginx
Write-Host "Started API gateway. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "Starting frontend applications..." -ForegroundColor Cyan
docker-compose -f docker-compose-final.yml up -d frontend
Write-Host "Started frontend. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

docker-compose -f docker-compose-final.yml up -d admin-dashboard
Write-Host "Started admin dashboard. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

docker-compose -f docker-compose-final.yml up -d admin-dashboard
Write-Host "Started admin dashboard with maintenance page. Waiting..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

docker-compose -f docker-compose-final.yml up -d mongo-express pgadmin
Write-Host "Started database admin tools." -ForegroundColor Cyan

Write-Host "`nAll services are now running! You can access them at the following URLs:" -ForegroundColor Green
Write-Host "- Main frontend: http://localhost:3001" -ForegroundColor White
Write-Host "- Admin dashboard (maintenance mode): http://localhost:4200" -ForegroundColor White
Write-Host "- API Gateway: http://localhost:80" -ForegroundColor White
Write-Host "- MongoDB Admin UI: http://localhost:8081" -ForegroundColor White
Write-Host "- PostgreSQL Admin UI: http://localhost:5050" -ForegroundColor White

Write-Host "`nNote: The admin dashboard is running with a maintenance page." -ForegroundColor Yellow
Write-Host "To see service logs, run: docker-compose -f docker-compose-final.yml logs -f [service-name]" -ForegroundColor Yellow
