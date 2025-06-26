#!/bin/bash

# 部署脚本 - 在生产环境中自动设置正确的环境变量和版本号

# 读取版本配置
VERSION=$(grep -o '"version": *"[^"]*"' config/version.json | cut -d'"' -f4)
DOCKER_REGISTRY=$(grep -o '"docker_registry": *"[^"]*"' config/version.json | cut -d'"' -f4)

echo "部署版本: $VERSION"
echo "Docker Registry: $DOCKER_REGISTRY"

# 获取当前服务器IP或域名
SERVER_HOST=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_HOST" ]; then
  SERVER_HOST=$(hostname)
fi

echo "部署到服务器: $SERVER_HOST"

# 创建或更新前端环境变量文件
cat > myclient/.env.production << EOL
# 生产环境API地址
REACT_APP_API_URL=http://${SERVER_HOST}:5000/api
# 当前版本
REACT_APP_VERSION=${VERSION}
EOL

echo "已更新前端API配置为 http://${SERVER_HOST}:5000/api"
echo "已更新前端版本为 ${VERSION}"

# 构建前端
cd myclient
npm install --production
npm run build
cd ..

# 安装后端依赖
cd server
npm install --production
cd ..

# 构建Docker镜像
echo "构建Docker镜像 v${VERSION}..."
docker build -t ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION} -f docker/Dockerfile.frontend .
docker build -t ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION} -f docker/Dockerfile.backend .
docker build -t ${DOCKER_REGISTRY}/ycsolar-db:${VERSION} -f docker/Dockerfile.db .

# 推送Docker镜像
echo "推送Docker镜像到仓库..."
docker push ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}
docker push ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}

# 更新docker-compose.yml中的版本号
echo "更新docker-compose.yml中的版本号..."
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-frontend:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-frontend:${VERSION}|g" docker-compose.yml
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-backend:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-backend:${VERSION}|g" docker-compose.yml
sed -i "s|image: ${DOCKER_REGISTRY}/ycsolar-db:[0-9.]*|image: ${DOCKER_REGISTRY}/ycsolar-db:${VERSION}|g" docker-compose.yml

# 启动服务
echo "启动服务..."
docker-compose up -d

echo "部署完成！应用已启动"
echo "- 前端: http://${SERVER_HOST}:3000"
echo "- 后端: http://${SERVER_HOST}:5000" 