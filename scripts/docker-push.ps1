# PowerShell Script: Push Docker Images

# Set output encoding to UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Read version config
$versionFile = "config/version.json"
$versionContent = Get-Content $versionFile -Raw | ConvertFrom-Json
$VERSION = $versionContent.version
$DOCKER_REGISTRY = $versionContent.docker_registry

Write-Host "Pushing Docker images v${VERSION} to registry..." -ForegroundColor Green

# Push frontend image
Write-Host "Pushing frontend image..." -ForegroundColor Cyan
docker push ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-frontend:latest

# Push backend image
Write-Host "Pushing backend image..." -ForegroundColor Cyan
docker push ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-backend:latest

# Push database image
Write-Host "Pushing database image..." -ForegroundColor Cyan
docker push ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-db:latest

# Update docker-compose.yml version
Write-Host "Updating docker-compose.yml version..." -ForegroundColor Yellow
$composeContent = Get-Content docker-compose.yml -Raw
$composeContent = $composeContent -replace "image: ${DOCKER_REGISTRY}/ycsolar-frontend:[0-9.]+", "image: ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}"
$composeContent = $composeContent -replace "image: ${DOCKER_REGISTRY}/ycsolar-backend:[0-9.]+", "image: ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}"
$composeContent = $composeContent -replace "image: ${DOCKER_REGISTRY}/ycsolar-db:[0-9.]+", "image: ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}"
$composeContent | Set-Content docker-compose.yml -Encoding UTF8

Write-Host "Docker images push completed!" -ForegroundColor Green
Write-Host "Version: ${VERSION}" -ForegroundColor White
Write-Host "Updated docker-compose.yml image versions" -ForegroundColor White 