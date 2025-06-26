# PowerShell Script: Setup Docker Mirrors

# 设置输出编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Setting up Docker registry mirrors..." -ForegroundColor Green

# 检查Docker Desktop配置文件是否存在
$dockerConfigPath = "$env:USERPROFILE\.docker\config.json"
$dockerDaemonPath = "$env:USERPROFILE\.docker\daemon.json"

# 如果daemon.json不存在，则创建它
if (-not (Test-Path $dockerDaemonPath)) {
    Write-Host "Creating Docker daemon config file..." -ForegroundColor Yellow
    
    # 从项目配置复制
    $mirrors = Get-Content -Raw "config/docker-config.json" | ConvertFrom-Json
    
    # 创建daemon.json
    if (-not (Test-Path "$env:USERPROFILE\.docker")) {
        New-Item -ItemType Directory -Path "$env:USERPROFILE\.docker" | Out-Null
    }
    
    $mirrors | ConvertTo-Json | Set-Content $dockerDaemonPath -Encoding UTF8
    
    Write-Host "Docker registry mirrors configured. Please restart Docker Desktop." -ForegroundColor Green
    Write-Host "Added the following mirrors:" -ForegroundColor Cyan
    foreach ($mirror in $mirrors.'registry-mirrors') {
        Write-Host "- $mirror" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "After restarting Docker Desktop, run the build command again:" -ForegroundColor Yellow
    Write-Host "npm run docker:build" -ForegroundColor White
} else {
    Write-Host "Docker daemon config file already exists at: $dockerDaemonPath" -ForegroundColor Yellow
    Write-Host "Please manually add the registry mirrors if needed." -ForegroundColor Yellow
    
    # 显示当前配置
    $currentConfig = Get-Content -Raw $dockerDaemonPath | ConvertFrom-Json
    if ($currentConfig.'registry-mirrors') {
        Write-Host "Current registry mirrors:" -ForegroundColor Cyan
        foreach ($mirror in $currentConfig.'registry-mirrors') {
            Write-Host "- $mirror" -ForegroundColor White
        }
    } else {
        Write-Host "No registry mirrors configured." -ForegroundColor Red
        Write-Host "You can add the following mirrors to your daemon.json file:" -ForegroundColor Yellow
        $mirrors = Get-Content -Raw "config/docker-config.json" | ConvertFrom-Json
        $mirrorsJson = $mirrors | ConvertTo-Json
        Write-Host $mirrorsJson -ForegroundColor White
    }
} 