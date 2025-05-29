# PowerShell脚本：构建和部署YCsolar-CRM

# 停止现有容器
# Write-Host "停止现有容器..." -ForegroundColor Yellow
# docker-compose down

# # 构建前端镜像
Write-Host "构建前端镜像..." -ForegroundColor Green
docker build -t leileigwl/ycsolar-frontend:1.1.0 -f Dockerfile.frontend .

# 构建后端镜像
Write-Host "构建后端镜像..." -ForegroundColor Green
docker build -t leileigwl/ycsolar-backend:1.1.0 -f Dockerfile.backend .

# 构建数据库镜像
Write-Host "构建数据库镜像..." -ForegroundColor Green
docker build -t leileigwl/ycsolar-db:1.1.0 -f Dockerfile.db .

# # 启动Docker容器
# Write-Host "启动Docker容器..." -ForegroundColor Green
# # docker-compose up -d

# Write-Host "部署完成! 应用已启动" -ForegroundColor Green
# Write-Host "- 前端: http://localhost:3000" -ForegroundColor Cyan
# Write-Host "- 后端: http://localhost:5000" -ForegroundColor Cyan

# # 如需推送镜像到Docker Hub，取消下方注释
# Write-Host "推送镜像到Docker Hub..." -ForegroundColor Yellow
# # docker-compose up -d

# 推送前端镜像
docker push leileigwl/ycsolar-frontend:1.1.0

# 推送后端镜像
docker push leileigwl/ycsolar-backend:1.1.0

# 推送数据库镜像
docker push leileigwl/ycsolar-db:1.1.0

Write-Host "镜像构建并推送完成！" -ForegroundColor Green
Write-Host "镜像名称:" -ForegroundColor Cyan
Write-Host "- leileigwl/ycsolar-frontend:1.1.0" -ForegroundColor White
Write-Host "- leileigwl/ycsolar-backend:1.1.0" -ForegroundColor White
Write-Host "- leileigwl/ycsolar-db:1.1.0" -ForegroundColor White