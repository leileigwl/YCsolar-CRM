# PowerShell Script: Start Local Development Environment

# 设置输出编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Starting local development environment..." -ForegroundColor Green

# 检查MySQL是否运行
$mysqlRunning = $false
try {
    $mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
    if ($mysqlService -and $mysqlService.Status -eq "Running") {
        $mysqlRunning = $true
        Write-Host "MySQL service is running." -ForegroundColor Green
    } else {
        Write-Host "MySQL service not found or not running." -ForegroundColor Yellow
        Write-Host "Please make sure MySQL is installed and running." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error checking MySQL service: $_" -ForegroundColor Red
}

# 安装前端依赖
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location myclient
npm install --legacy-peer-deps
Pop-Location

# 安装后端依赖
Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Push-Location server
npm install
Pop-Location

# 创建上传目录
if (-not (Test-Path "server/uploads")) {
    Write-Host "Creating uploads directory..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Path "server/uploads" | Out-Null
}

# 检查数据库是否存在
if ($mysqlRunning) {
    Write-Host "Checking database..." -ForegroundColor Cyan
    
    # 提示用户输入MySQL密码
    $password = Read-Host "Enter MySQL root password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
    $mysqlPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    
    # 检查数据库是否存在
    $dbExists = $false
    $checkDbCmd = "mysql -u root -p$mysqlPassword -e 'SHOW DATABASES LIKE ""crm_system""'"
    $dbExists = Invoke-Expression $checkDbCmd | Select-String "crm_system"
    
    if (-not $dbExists) {
        Write-Host "Creating database..." -ForegroundColor Yellow
        $createDbCmd = "mysql -u root -p$mysqlPassword -e 'CREATE DATABASE IF NOT EXISTS crm_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'"
        Invoke-Expression $createDbCmd
        
        # 导入初始数据
        Write-Host "Importing initial data..." -ForegroundColor Yellow
        $importCmd = "mysql -u root -p$mysqlPassword crm_system < server/db/init.sql"
        Invoke-Expression $importCmd
    } else {
        Write-Host "Database 'crm_system' already exists." -ForegroundColor Green
    }
}

# 启动应用
Write-Host "Starting application..." -ForegroundColor Green
Write-Host "Open a new terminal and run: npm run start:frontend" -ForegroundColor Cyan
Write-Host "Open another terminal and run: npm run start:backend" -ForegroundColor Cyan
Write-Host "Or run both with: npm start" -ForegroundColor Cyan 