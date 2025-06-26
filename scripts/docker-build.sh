#!/bin/bash

# Docker构建脚本

# 读取版本配置
VERSION=$(grep -o '"version": *"[^"]*"' config/version.json | cut -d'"' -f4)
DOCKER_REGISTRY=$(grep -o '"docker_registry": *"[^"]*"' config/version.json | cut -d'"' -f4)

echo "构建Docker镜像 v${VERSION}..."

# 构建前端镜像
echo "构建前端镜像..."
docker build -t ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION} -f docker/Dockerfile.frontend .
docker tag ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION} ${DOCKER_REGISTRY}/ycsolar-frontend:latest

# 构建后端镜像
echo "构建后端镜像..."
docker build -t ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION} -f docker/Dockerfile.backend .
docker tag ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION} ${DOCKER_REGISTRY}/ycsolar-backend:latest

# 构建数据库镜像
echo "构建数据库镜像..."
docker build -t ${DOCKER_REGISTRY}/ycsolar-db:${VERSION} -f docker/Dockerfile.db .
docker tag ${DOCKER_REGISTRY}/ycsolar-db:${VERSION} ${DOCKER_REGISTRY}/ycsolar-db:latest

echo "Docker镜像构建完成!"
echo "版本: ${VERSION}"
echo "镜像:"
echo "- ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}"
echo "- ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}"
echo "- ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}" 