# YCsolar-CRM 客户关系管理系统

YCsolar-CRM是一个为销售团队设计的客户关系管理系统，帮助企业有效跟踪和管理客户信息、沟通记录以及重要联系人。该系统提供直观的用户界面，支持客户分类、沟通历史追踪、文件附件管理等功能。

## 功能特点

- 🔍 客户管理：添加、编辑、删除和搜索客户信息
- 🏷️ 客户分类：按重要程度（普通、重要、特别重要）对客户进行分类
- 💬 沟通记录：记录与客户的沟通历史，支持附件上传
- 📊 数据统计：直观展示客户分布和活动情况
- 👥 多用户支持：多账户管理，不同用户只能看到自己的客户数据
- 🔔 通知系统：提醒即将到期的跟进事项
- 🌐 多语言支持：支持中英文界面切换
- 📱 响应式设计：适配桌面和移动设备

## 快速开始

### 方式一：本地开发环境（无需Docker）

#### 前提条件
- Node.js 18+ (后端) 和 Node.js 20+ (前端)
- MySQL 8.0
- npm 或 yarn

#### 步骤 1：设置数据库
1. 安装并启动 MySQL 8.0
2. 创建名为 `crm_system` 的数据库
3. 导入初始化SQL脚本 (位于 `server/db/init.sql`)

#### 步骤 2：运行后端服务
```bash
# 进入后端目录
cd server

# 安装依赖
npm install

# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件，设置数据库连接信息
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=crm_system

# 启动开发服务器
npm run dev
```

#### 步骤 3：运行前端服务
```bash
# 进入前端目录
cd myclient

# 安装依赖
npm install

# 启动开发服务器
npm start
```

#### 步骤 4：访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:5000/api

### 方式二：使用npm脚本快速开发（推荐）

我们提供了便捷的npm脚本来快速设置本地开发环境：

```bash
# 在项目根目录运行
npm run setup:local

# 启动前后端服务
npm start
```

### 方式三：使用Docker部署

#### 前提条件

- 安装 [Docker](https://www.docker.com/get-started)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

#### 步骤 1：克隆项目仓库

```bash
git clone https://github.com/yourusername/YCsolar-CRM.git
cd YCsolar-CRM
```

#### 步骤 2：构建Docker镜像

```bash
# 使用npm脚本构建Docker镜像
npm run docker:build
```

如遇到Docker网络连接问题，可以运行：
```bash
# 修复Docker代理问题
npm run docker:fix-proxy

# 重启Docker Desktop后再次尝试构建
npm run docker:build
```

#### 步骤 3：启动服务

```bash
# 启动所有服务
docker-compose up -d
```

系统将在以下地址启动：
- 前端: http://localhost:3000
- 后端API: http://localhost:5000
- 数据库: localhost:3306 (仅内部访问)

#### 步骤 4：停止服务

```bash
docker-compose down
```

## 技术栈

- **前端**：React、TypeScript、Tailwind CSS
- **后端**：Node.js、Express
- **数据库**：MySQL
- **容器化**：Docker、Docker Compose

## 数据持久化

数据库数据存储在Docker卷中，即使容器被删除数据也不会丢失：

```bash
docker volume ls  # 查看卷列表
```

### 查看日志

```bash
# 查看所有服务的日志
docker-compose logs -f

# 查看特定服务的日志
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

## 系统截图

(在此处添加系统截图)

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证，详情见 [LICENSE](LICENSE) 文件。

## Windows环境部署

在Windows环境中构建和推送Docker镜像：

1. 安装Docker Desktop并确保其正常运行

2. 打开PowerShell并导航到项目目录

3. 运行Windows构建脚本:
   ```powershell
   # 可能需要设置执行策略
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   
   # 运行构建脚本
   .\build-push-win.ps1
   ```

4. 脚本会构建并推送以下镜像到Docker Hub:
   - leileigwl/ycsolar-frontend:latest
   - leileigwl/ycsolar-backend:latest
   - leileigwl/ycsolar-db:latest

## Linux服务器部署

### 方式一：使用部署脚本（推荐）

1. 将`linux-deploy.sh`上传到Linux服务器

2. 添加执行权限并运行:
   ```bash
   chmod +x linux-deploy.sh
   ./linux-deploy.sh
   ```

3. 应用将在以下端口运行:
   - 前端: 3000
   - 后端: 5000
   - 数据库: 3306

### 方式二：手动部署步骤

1. 安装Docker和Docker Compose
   ```bash
   # 安装Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # 安装Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.19.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. 克隆代码仓库
   ```bash
   git clone https://github.com/yourusername/YCsolar-CRM.git
   cd YCsolar-CRM
   ```

3. 创建必要的配置文件
   ```bash
   # 复制环境变量示例文件
   cp .env.example .env
   
   # 根据需要编辑.env文件
   nano .env
   ```

4. 使用Docker Compose启动服务
   ```bash
   # 构建并启动所有服务
   docker-compose up -d --build
   ```

5. 查看服务运行状态
   ```bash
   docker-compose ps
   ```

### 方式三：使用预构建镜像

如果您已经将镜像推送到Docker Hub，可以直接在服务器上拉取并运行：

1. 创建docker-compose.yml文件
   ```bash
   cat > docker-compose.yml << 'EOL'
   version: '3.8'
   
   services:
     frontend:
       image: leileigwl/ycsolar-frontend:latest
       ports:
         - "3000:3000"
       depends_on:
         - backend
       restart: always
   
     backend:
       image: leileigwl/ycsolar-backend:latest
       ports:
         - "5000:5000"
       depends_on:
         - db
       environment:
         - DB_HOST=db
         - DB_USER=crm_user
         - DB_PASSWORD=crm_password
         - DB_NAME=crm_system
       restart: always
       volumes:
         - uploads:/app/uploads
   
     db:
       image: leileigwl/ycsolar-db:latest
       ports:
         - "3306:3306"
       environment:
         - MYSQL_ROOT_PASSWORD=root_password
         - MYSQL_DATABASE=crm_system
         - MYSQL_USER=crm_user
         - MYSQL_PASSWORD=crm_password
       volumes:
         - db_data:/var/lib/mysql
       restart: always
   
   volumes:
     db_data:
     uploads:
   EOL
   ```

2. 启动服务
   ```bash
   docker-compose up -d
   ```

### 服务器防火墙设置

根据您的服务器环境，可能需要配置防火墙以允许应用端口访问：

```bash
# Ubuntu/Debian (使用ufw)
sudo ufw allow 3000/tcp  # 前端
sudo ufw allow 5000/tcp  # 后端API

# CentOS/RHEL (使用firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp  # 前端
sudo firewall-cmd --permanent --add-port=5000/tcp  # 后端API
sudo firewall-cmd --reload
```

### 配置Nginx代理（可选）

为了更好地管理HTTP请求和启用HTTPS，可以配置Nginx作为反向代理：

1. 安装Nginx
   ```bash
   sudo apt update
   sudo apt install nginx -y  # Ubuntu/Debian
   ```

2. 创建Nginx配置文件
   ```bash
   sudo nano /etc/nginx/sites-available/ycsolar-crm
   ```

3. 添加以下配置内容
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;  # 替换为您的域名
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. 启用站点并重启Nginx
   ```bash
   sudo ln -s /etc/nginx/sites-available/ycsolar-crm /etc/nginx/sites-enabled/
   sudo nginx -t  # 检查配置是否正确
   sudo systemctl restart nginx
   ```

5. 配置SSL（可选，使用Certbot）
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

### 服务器维护

- 检查日志
  ```bash
  docker-compose logs -f
  ```

- 更新应用
  ```bash
  # 拉取最新代码
  git pull
  
  # 重新构建并启动容器
  docker-compose up -d --build
  ```

- 备份数据库
  ```bash
  # 创建备份目录
  mkdir -p ~/backups
  
  # 备份数据库
  docker exec -it ycsolar-crm_db_1 mysqldump -u root -p crm_system > ~/backups/crm_backup_$(date +%Y%m%d).sql
  ``` 