# Update your hosts file to include the API domain
Write-Host "Adding api.phoneaccessories.local to your hosts file (requires admin privileges)..."
# This requires running PowerShell as Administrator
$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$hostsContent = Get-Content -Path $hostsPath
if (-not ($hostsContent -match "api.phoneaccessories.local")) {
    Add-Content -Path $hostsPath -Value "127.0.0.1    api.phoneaccessories.local" -Force
    Write-Host "Added api.phoneaccessories.local to hosts file."
} else {
    Write-Host "api.phoneaccessories.local already exists in hosts file."
}

# Start the services with Docker Compose
Write-Host "Starting all services with Docker Compose..."
docker-compose up -d

# Display service status
Write-Host "Service Status:"
docker-compose ps

Write-Host "Application URLs:"
Write-Host "- Frontend:       http://localhost:3001"
Write-Host "- Admin Dashboard: http://localhost:4200"
Write-Host "- API Gateway:     http://api.phoneaccessories.local"
Write-Host "- API Health:      http://api.phoneaccessories.local/health"

Write-Host "Note: It may take a few moments for all services to fully initialize."
