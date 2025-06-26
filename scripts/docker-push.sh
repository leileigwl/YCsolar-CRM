#!/bin/bash

# Docker推送脚本

# 读取版本配置
VERSION=$(grep -o '"version": *"[^"]*"' config/version.json | cut -d'"' -f4)
DOCKER_REGISTRY=$(grep -o '"docker_registry": *"[^"]*"' config/version.json | cut -d'"' -f4)

echo "推送Docker镜像 v${VERSION}到仓库..."

# 推送前端镜像
echo "推送前端镜像..."
docker push ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-frontend:latest

# 推送后端镜像
echo "推送后端镜像..."
docker push ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-backend:latest

# 推送数据库镜像
echo "推送数据库镜像..."
docker push ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-db:latest

# 更新docker-compose.yml中的版本号
echo "更新docker-compose.yml中的版本号..."
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-frontend:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}|g" docker-compose.yml
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-backend:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}|g" docker-compose.yml
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-db:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}|g" docker-compose.yml

echo "Docker镜像推送完成!"
echo "版本: ${VERSION}"
echo "已更新docker-compose.yml中的镜像版本" 