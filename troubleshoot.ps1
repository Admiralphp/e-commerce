# Troubleshooting script for Phone Accessories E-commerce Microservices
# This script provides diagnostic and repair functions for common container issues

# Function to check and fix Nginx configuration
function Fix-NginxConfig {
    Write-Host "Checking Nginx configuration..." -ForegroundColor Cyan
    
    # Ensure nginx config file exists and has content
    if (-not (Test-Path "nginx/nginx.conf") -or (Get-Item "nginx/nginx.conf").Length -eq 0) {
        Write-Host "ERROR: nginx.conf is missing or empty!" -ForegroundColor Red
        Write-Host "Restoring nginx.conf from backup..." -ForegroundColor Yellow
        
        # Try to use the fixed version if available
        if (Test-Path "nginx/nginx.conf.fixed") {
            Copy-Item -Path "nginx/nginx.conf.fixed" -Destination "nginx/nginx.conf" -Force
            Write-Host "Restored nginx.conf from nginx.conf.fixed" -ForegroundColor Green
        } else {
            Write-Host "FAILED: No backup nginx configuration found" -ForegroundColor Red
            return $false
        }
    }
    
    # Validate nginx config using the nginx container
    docker run --rm -v "${PWD}/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:latest nginx -t
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Nginx configuration contains syntax errors" -ForegroundColor Red
        return $false
    } else {
        Write-Host "Nginx configuration syntax is valid" -ForegroundColor Green
        return $true
    }
}

# Function to check and fix product-service issues
function Fix-ProductService {
    Write-Host "Checking product-service configuration..." -ForegroundColor Cyan
    
    # Check for duplicate CMD in Dockerfile
    $dockerfileContent = Get-Content "product-service/Dockerfile" -ErrorAction SilentlyContinue
    $cmdCount = ($dockerfileContent | Where-Object { $_ -match "CMD \[" }).Count
    
    if ($cmdCount -gt 1) {
        Write-Host "ERROR: Duplicate CMD instruction found in product-service Dockerfile" -ForegroundColor Red
        Write-Host "Fixing product-service Dockerfile..." -ForegroundColor Yellow
        
        # Only keep the last CMD instruction
        $fixedContent = @()
        $foundFirstCmd = $false
        
        foreach ($line in $dockerfileContent) {
            if ($line -match "CMD \[" -and -not $foundFirstCmd) {
                $foundFirstCmd = $true
                continue
            }
            $fixedContent += $line
        }
        
        Set-Content -Path "product-service/Dockerfile" -Value $fixedContent
        Write-Host "Fixed duplicate CMD in product-service Dockerfile" -ForegroundColor Green
        
        # Rebuild the service
        Write-Host "Rebuilding product-service container..." -ForegroundColor Yellow
        docker-compose -f docker-compose-final.yml up -d --build product-service
        
        return $true
    } else {
        Write-Host "Product-service Dockerfile looks good" -ForegroundColor Green
        return $true
    }
}

# Function to check and fix database connection issues
function Fix-DatabaseConnections {
    Write-Host "Checking database connections..." -ForegroundColor Cyan
    
    # Check MongoDB availability
    $mongoStatus = docker inspect --format="{{.State.Status}}" phone-accessories-mongo 2>&1
    if ($LASTEXITCODE -ne 0 -or $mongoStatus -ne "running") {
        Write-Host "ERROR: MongoDB container is not running" -ForegroundColor Red
        Write-Host "Starting MongoDB container..." -ForegroundColor Yellow
        docker-compose -f docker-compose-final.yml up -d mongo
        Start-Sleep -Seconds 10
    } else {
        Write-Host "MongoDB container is running" -ForegroundColor Green
    }
    
    # Check PostgreSQL availability
    $postgresStatus = docker inspect --format="{{.State.Status}}" phone-accessories-postgres 2>&1
    if ($LASTEXITCODE -ne 0 -or $postgresStatus -ne "running") {
        Write-Host "ERROR: PostgreSQL container is not running" -ForegroundColor Red
        Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
        docker-compose -f docker-compose-final.yml up -d postgres
        Start-Sleep -Seconds 10
    } else {
        Write-Host "PostgreSQL container is running" -ForegroundColor Green
    }
    
    return $true
}

# Function to check and fix network issues
function Fix-NetworkIssues {
    Write-Host "Checking network configuration..." -ForegroundColor Cyan
    
    # Check if microservices-network exists
    $networkExists = docker network ls --filter "name=pic_microservices-network" --format "{{.Name}}" | Where-Object { $_ -match "microservices-network" }
    
    if (-not $networkExists) {
        Write-Host "ERROR: microservices-network doesn't exist" -ForegroundColor Red
        Write-Host "Creating network..." -ForegroundColor Yellow
        docker network create pic_microservices-network
        
        # Restart all services to connect to the new network
        Write-Host "Restarting all services to connect to the new network..." -ForegroundColor Yellow
        docker-compose -f docker-compose-final.yml restart
        
        return $true
    } else {
        Write-Host "microservices-network exists" -ForegroundColor Green
    }
    
    # Check if hosts file has the correct entry
    $hostsContent = Get-Content -Path "$env:windir\System32\drivers\etc\hosts" -ErrorAction SilentlyContinue
    if (-not ($hostsContent -match "api.phoneaccessories.local")) {
        Write-Host "WARNING: api.phoneaccessories.local entry missing from hosts file" -ForegroundColor Yellow
        Write-Host "Please run start-all-services.ps1 as administrator to fix this issue" -ForegroundColor Yellow
    } else {
        Write-Host "Hosts file entry for api.phoneaccessories.local exists" -ForegroundColor Green
    }
    
    return $true
}

# Function to check and fix volume permission issues
function Fix-VolumePermissions {
    Write-Host "Checking volume permissions..." -ForegroundColor Cyan
    
    # Ensure all log directories exist and are writable
    $logDirs = @(
        "logs/admin", 
        "logs/auth", 
        "logs/frontend", 
        "logs/orders", 
        "logs/products"
    )
    
    foreach ($dir in $logDirs) {
        if (-not (Test-Path $dir)) {
            Write-Host "Creating missing log directory: $dir" -ForegroundColor Yellow
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
        
        # Create a test file to verify we have write permissions
        try {
            $testFile = Join-Path -Path $dir -ChildPath "test_write_permissions.txt"
            "Write test" | Out-File -FilePath $testFile -ErrorAction Stop
            Remove-Item -Path $testFile -ErrorAction SilentlyContinue
            Write-Host "Directory $dir is writable" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: Cannot write to directory $dir" -ForegroundColor Red
            return $false
        }
    }
    
    return $true
}

# Main troubleshooting workflow
Clear-Host
Write-Host "===================================" -ForegroundColor Blue
Write-Host "  MICROSERVICES TROUBLESHOOTER" -ForegroundColor Blue
Write-Host "===================================" -ForegroundColor Blue
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host

# Check if Docker is running
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop or Docker service." -ForegroundColor Red
    exit 1
}

# Start the troubleshooting process
$troubleshootingSteps = @(
    @{Name="Network Configuration"; Function=(Get-Command Fix-NetworkIssues)},
    @{Name="Volume Permissions"; Function=(Get-Command Fix-VolumePermissions)},
    @{Name="Database Connections"; Function=(Get-Command Fix-DatabaseConnections)},
    @{Name="Nginx Configuration"; Function=(Get-Command Fix-NginxConfig)},
    @{Name="Product Service Issues"; Function=(Get-Command Fix-ProductService)}
)

$overallSuccess = $true

foreach ($step in $troubleshootingSteps) {
    Write-Host "`n[STEP] $($step.Name)" -ForegroundColor Magenta
    $success = & $step.Function
    
    if (-not $success) {
        $overallSuccess = $false
        Write-Host "Failed to fix $($step.Name)" -ForegroundColor Red
    }
}

Write-Host "`n===================================" -ForegroundColor Blue
Write-Host "  TROUBLESHOOTING COMPLETE" -ForegroundColor Blue
Write-Host "===================================" -ForegroundColor Blue

if ($overallSuccess) {
    Write-Host "All issues have been addressed. Try starting the services again:" -ForegroundColor Green
    Write-Host "   ./start-all-services.ps1" -ForegroundColor Cyan
} else {
    Write-Host "Some issues could not be fixed automatically." -ForegroundColor Yellow
    Write-Host "Please review the log output above and address the remaining issues manually." -ForegroundColor Yellow
    Write-Host "After fixing the issues, run ./start-all-services.ps1 again." -ForegroundColor Cyan
}

Write-Host "`nAfter starting services, use ./health-check.ps1 to verify system health." -ForegroundColor Gray
