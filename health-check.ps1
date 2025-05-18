# Health check script for Phone Accessories E-commerce Microservices
# This script checks the status of all containers and API endpoints

# Function to check container status and format output
function Check-ContainerStatus {
    param (
        [string]$containerName,
        [string]$serviceName
    )
    
    $containerStatus = docker ps --filter "name=$containerName" --format "{{.Status}}"
    $containerExists = docker ps -a --filter "name=$containerName" --format "{{.Names}}"
    
    if ($containerExists -and -not $containerStatus) {
        $containerStatus = docker ps -a --filter "name=$containerName" --format "{{.Status}}"
        Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
        Write-Host "STOPPED - $containerStatus" -ForegroundColor Red
        return $false
    }
    elseif ($containerStatus -match "Up") {
        if ($containerStatus -match "healthy") {
            Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
            Write-Host "HEALTHY - $containerStatus" -ForegroundColor Green
        }
        elseif ($containerStatus -match "(Restarting)") {
            Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
            Write-Host "RESTARTING - $containerStatus" -ForegroundColor Yellow
            return $false
        }
        else {
            Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
            Write-Host "RUNNING - $containerStatus" -ForegroundColor Green
        }
        return $true
    }
    elseif (-not $containerExists) {
        Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
        Write-Host "NOT FOUND" -ForegroundColor Red
        return $false
    }
    else {
        Write-Host "${serviceName}: " -NoNewline -ForegroundColor Cyan
        Write-Host "NOT RUNNING - $containerStatus" -ForegroundColor Red
        return $false
    }
}

# Function to check API endpoints
function Test-ApiEndpoint {
    param (
        [string]$serviceName,
        [string]$endpoint,
        [string]$expectedStatus = "200"
    )
    
    try {
        $response = Invoke-WebRequest -Uri $endpoint -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq $expectedStatus) {
            Write-Host "API Endpoint ${serviceName}: " -NoNewline -ForegroundColor Cyan
            Write-Host "OK (Status: $statusCode)" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "API Endpoint ${serviceName}: " -NoNewline -ForegroundColor Cyan
            Write-Host "UNEXPECTED STATUS (Status: $statusCode, Expected: $expectedStatus)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "API Endpoint ${serviceName}: " -NoNewline -ForegroundColor Cyan
        Write-Host "FAILED - $errorMessage" -ForegroundColor Red
        return $false
    }
}

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop or Docker service." -ForegroundColor Red
    exit 1
}

Clear-Host
Write-Host "=================================" -ForegroundColor Blue
Write-Host "  MICROSERVICES HEALTH CHECK" -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Blue
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host

# Database Services
Write-Host "DATABASE SERVICES:" -ForegroundColor Magenta
$mongoStatus = Check-ContainerStatus -containerName "phone-accessories-mongo" -serviceName "MongoDB"
$postgresStatus = Check-ContainerStatus -containerName "phone-accessories-postgres" -serviceName "PostgreSQL"

# Core Microservices
Write-Host "`nCORE MICROSERVICES:" -ForegroundColor Magenta
$authStatus = Check-ContainerStatus -containerName "phone-accessories-auth" -serviceName "Auth Service"
$productStatus = Check-ContainerStatus -containerName "phone-accessories-products" -serviceName "Product Service"
$orderStatus = Check-ContainerStatus -containerName "phone-accessories-orders" -serviceName "Order Service"

# Infrastructure Services
Write-Host "`nINFRASTRUCTURE SERVICES:" -ForegroundColor Magenta
$nginxStatus = Check-ContainerStatus -containerName "phone-accessories-gateway" -serviceName "API Gateway (Nginx)"
$mongoExpressStatus = Check-ContainerStatus -containerName "phone-accessories-mongo-express" -serviceName "MongoDB Express"
$pgAdminStatus = Check-ContainerStatus -containerName "phone-accessories-pgadmin" -serviceName "PgAdmin"

# Frontend Applications
Write-Host "`nFRONTEND APPLICATIONS:" -ForegroundColor Magenta
$frontendStatus = Check-ContainerStatus -containerName "phone-accessories-frontend" -serviceName "Frontend Client"
$adminStatus = Check-ContainerStatus -containerName "phone-accessories-admin" -serviceName "Admin Dashboard"

# API endpoint tests (only if Nginx is running)
if ($nginxStatus) {
    Write-Host "`nAPI ENDPOINT TESTS:" -ForegroundColor Magenta
    $healthEndpoint = Test-ApiEndpoint -serviceName "Gateway Health" -endpoint "http://api.phoneaccessories.local/api/health"
    
    if ($authStatus) {
        $authEndpoint = Test-ApiEndpoint -serviceName "Auth Service" -endpoint "http://api.phoneaccessories.local/api/auth/health"
    }
    
    if ($productStatus) {
        $productsEndpoint = Test-ApiEndpoint -serviceName "Products Service" -endpoint "http://api.phoneaccessories.local/api/products"
    }
    
    if ($orderStatus) {
        $ordersEndpoint = Test-ApiEndpoint -serviceName "Orders Service" -endpoint "http://api.phoneaccessories.local/api/orders/health"
    }
}

# Overall system status
Write-Host "`n=================================" -ForegroundColor Blue
Write-Host "  SYSTEM HEALTH SUMMARY" -ForegroundColor Blue
Write-Host "=================================" -ForegroundColor Blue

$allServices = @(
    $mongoStatus, $postgresStatus, $authStatus, $productStatus, $orderStatus, 
    $nginxStatus, $frontendStatus, $adminStatus
)
$runningServices = ($allServices | Where-Object { $_ -eq $true }).Count
$totalServices = $allServices.Count
$healthPercentage = [math]::Round(($runningServices / $totalServices) * 100)

Write-Host "Running Services: $runningServices/$totalServices ($healthPercentage%)" -ForegroundColor Cyan

if ($healthPercentage -eq 100) {
    Write-Host "Overall Status: " -NoNewline
    Write-Host "HEALTHY" -ForegroundColor Green
} elseif ($healthPercentage -ge 75) {
    Write-Host "Overall Status: " -NoNewline
    Write-Host "DEGRADED" -ForegroundColor Yellow
} else {
    Write-Host "Overall Status: " -NoNewline
    Write-Host "CRITICAL" -ForegroundColor Red
}

Write-Host "`nTROUBLESHOOTING TIPS:" -ForegroundColor Cyan
Write-Host "- Check logs: docker logs [container-name]" -ForegroundColor Gray
Write-Host "- Restart specific service: docker-compose -f docker-compose-final.yml restart [service-name]" -ForegroundColor Gray
Write-Host "- Check service configuration: docker-compose -f docker-compose-final.yml config" -ForegroundColor Gray
Write-Host "- Rebuild and start service: docker-compose -f docker-compose-final.yml up -d --build [service-name]" -ForegroundColor Gray
