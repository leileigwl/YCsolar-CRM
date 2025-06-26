# PowerShell Script: Fix Docker Proxy Settings

# 设置输出编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Fixing Docker proxy settings..." -ForegroundColor Green

# 检查Docker Desktop配置文件是否存在
$dockerConfigPath = "$env:USERPROFILE\.docker\config.json"

if (Test-Path $dockerConfigPath) {
    Write-Host "Found Docker config at: $dockerConfigPath" -ForegroundColor Cyan
    
    # 读取当前配置
    $config = Get-Content -Raw $dockerConfigPath | ConvertFrom-Json
    
    # 检查是否有代理设置
    if ($config.proxies -and $config.proxies.default) {
        Write-Host "Current proxy settings:" -ForegroundColor Yellow
        Write-Host "HTTP Proxy: $($config.proxies.default.httpProxy)" -ForegroundColor White
        Write-Host "HTTPS Proxy: $($config.proxies.default.httpsProxy)" -ForegroundColor White
        Write-Host "No Proxy: $($config.proxies.default.noProxy)" -ForegroundColor White
        
        # 询问是否要禁用代理
        Write-Host ""
        Write-Host "Do you want to disable Docker proxy settings? (y/n)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "y") {
            # 禁用代理
            if (-not $config.proxies.default.PSObject.Properties.Name -contains "disabled") {
                $config.proxies.default | Add-Member -MemberType NoteProperty -Name "disabled" -Value $true
            } else {
                $config.proxies.default.disabled = $true
            }
            
            # 保存配置
            $config | ConvertTo-Json -Depth 10 | Set-Content $dockerConfigPath -Encoding UTF8
            
            Write-Host "Docker proxy settings have been disabled." -ForegroundColor Green
            Write-Host "Please restart Docker Desktop for changes to take effect." -ForegroundColor Yellow
        } else {
            Write-Host "No changes made to Docker proxy settings." -ForegroundColor Cyan
        }
    } else {
        Write-Host "No proxy settings found in Docker config." -ForegroundColor Cyan
    }
} else {
    Write-Host "Docker config file not found at: $dockerConfigPath" -ForegroundColor Red
    Write-Host "Make sure Docker Desktop is installed and has been run at least once." -ForegroundColor Yellow
}

# 显示当前Docker镜像源设置
Write-Host ""
Write-Host "Current Docker registry mirrors:" -ForegroundColor Cyan
docker info | Select-String "Registry Mirrors:"
docker info | Select-String "https://" | ForEach-Object { Write-Host "  $_" -ForegroundColor White }

Write-Host ""
Write-Host "After making changes and restarting Docker Desktop, try building again:" -ForegroundColor Yellow
Write-Host "npm run docker:build" -ForegroundColor White 