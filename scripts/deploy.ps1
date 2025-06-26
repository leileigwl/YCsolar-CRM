# PowerShell Script: Deploy Application

# Set output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Read version config
$versionFile = "config/version.json"
$versionContent = Get-Content $versionFile -Raw | ConvertFrom-Json
$VERSION = $versionContent.version
$DOCKER_REGISTRY = $versionContent.docker_registry

Write-Host "Deploying version: $VERSION" -ForegroundColor Green
Write-Host "Docker Registry: $DOCKER_REGISTRY" -ForegroundColor Green

# Get current server IP or hostname
$SERVER_HOST = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet).IPAddress
if (-not $SERVER_HOST) {
    $SERVER_HOST = [System.Net.Dns]::GetHostName()
}

Write-Host "Deploying to server: $SERVER_HOST" -ForegroundColor Yellow

# Create or update frontend environment variables file
$envContent = @"
# Production API URL
REACT_APP_API_URL=http://${SERVER_HOST}:5000/api
# Current version
REACT_APP_VERSION=${VERSION}
"@

Set-Content -Path "myclient/.env.production" -Value $envContent -Encoding UTF8

Write-Host "Updated frontend API config to http://${SERVER_HOST}:5000/api" -ForegroundColor Cyan
Write-Host "Updated frontend version to ${VERSION}" -ForegroundColor Cyan

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Green
Push-Location myclient
npm install --production
npm run build
Pop-Location

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green
Push-Location server
npm install --production
Pop-Location

# Build Docker images
Write-Host "Building Docker images..." -ForegroundColor Green
& "$PSScriptRoot\docker-build.ps1"

# Push Docker images
Write-Host "Pushing Docker images..." -ForegroundColor Green
& "$PSScriptRoot\docker-push.ps1"

# Start services
Write-Host "Starting services..." -ForegroundColor Green
docker-compose up -d

Write-Host "Deployment completed! Application is running" -ForegroundColor Green
Write-Host "- Frontend: http://${SERVER_HOST}:3000" -ForegroundColor Cyan
Write-Host "- Backend: http://${SERVER_HOST}:5000" -ForegroundColor Cyan 