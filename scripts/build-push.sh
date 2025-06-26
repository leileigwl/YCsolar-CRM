#!/bin/bash

# Docker Hub用户名
DOCKER_USERNAME="leileigwl"

# 版本号定义
FRONTEND_VERSION="1.0.5"
BACKEND_VERSION="1.0.5"
DB_VERSION="1.0.5"

# 确保已登录Docker Hub
echo "请确保已登录Docker Hub，如果未登录，请运行: docker login"
echo "准备构建并推送镜像..."

# 构建前端镜像
echo "构建前端镜像..."
docker build -t leileilgwl/ycsolar-frontend:1.0.5 -f Dockerfile.frontend .

# 构建后端镜像
echo "构建后端镜像..."
docker build -t $DOCKER_USERNAME/ycsolar-backend:$BACKEND_VERSION -f Dockerfile.backend .

# 构建数据库镜像
echo "构建数据库镜像..."
docker build -t $DOCKER_USERNAME/ycsolar-db:$DB_VERSION -f Dockerfile.db .

# 推送镜像到Docker Hub
echo "推送镜像到Docker Hub..."

# # 推送前端镜像
# docker push $DOCKER_USERNAME/ycsolar-frontend:$FRONTEND_VERSION

# # 推送后端镜像
# docker push $DOCKER_USERNAME/ycsolar-backend:$BACKEND_VERSION

# # 推送数据库镜像
# docker push $DOCKER_USERNAME/ycsolar-db:$DB_VERSION

# echo "镜像构建并推送完成！"
# echo "镜像名称:"
# echo "- $DOCKER_USERNAME/ycsolar-frontend:$FRONTEND_VERSION"
# echo "- $DOCKER_USERNAME/ycsolar-backend:$BACKEND_VERSION"
# echo "- $DOCKER_USERNAME/ycsolar-db:$DB_VERSION" 