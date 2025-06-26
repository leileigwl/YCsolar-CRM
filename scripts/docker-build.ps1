# PowerShell Script: Build Docker Images

# Set output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Read version config
$versionFile = "config/version.json"
$versionContent = Get-Content $versionFile -Raw | ConvertFrom-Json
$VERSION = $versionContent.version
$DOCKER_REGISTRY = $versionContent.docker_registry

Write-Host "Building Docker images v${VERSION}..." -ForegroundColor Green

# Build frontend image
Write-Host "Building frontend image..." -ForegroundColor Cyan
docker build -t ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION} -f docker/Dockerfile.frontend .
docker tag ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION} ${DOCKER_REGISTRY}/ycsolar-frontend:latest

# Build backend image
Write-Host "Building backend image..." -ForegroundColor Cyan
docker build -t ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION} -f docker/Dockerfile.backend .
docker tag ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION} ${DOCKER_REGISTRY}/ycsolar-backend:latest

# Build database image
Write-Host "Building database image..." -ForegroundColor Cyan
docker build -t ${DOCKER_REGISTRY}/ycsolar-db:${VERSION} -f docker/Dockerfile.db .
docker tag ${DOCKER_REGISTRY}/ycsolar-db:${VERSION} ${DOCKER_REGISTRY}/ycsolar-db:latest

Write-Host "Docker images build completed!" -ForegroundColor Green
Write-Host "Version: ${VERSION}" -ForegroundColor White
Write-Host "Images:" -ForegroundColor White
Write-Host "- ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}" -ForegroundColor White
Write-Host "- ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}" -ForegroundColor White
Write-Host "- ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}" -ForegroundColor White 