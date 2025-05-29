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

## 技术栈

- **前端**：React、TypeScript、Tailwind CSS
- **后端**：Node.js、Express
- **数据库**：MySQL
- **容器化**：Docker、Docker Compose

## 使用Docker部署

### 前提条件

- 安装 [Docker](https://www.docker.com/get-started)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

### 快速开始

1. 克隆项目仓库

```bash
git clone https://github.com/yourusername/YCsolar-CRM.git
cd YCsolar-CRM
```

2. 配置环境变量（可选）

```bash
cp .env.example .env
# 根据需要编辑.env文件
```

3. 启动应用

```bash
docker-compose up -d
```

系统将在以下地址启动：
- 前端: http://localhost
- 后端API: http://localhost/api
- 数据库: localhost:3306 (仅内部访问)

4. 停止服务

```bash
docker-compose down
```

### 数据持久化

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

## 开发环境设置

如果您想在本地开发环境中运行应用：

### 后端服务

```bash
cd server
npm install
cp .env.example .env
# 编辑.env文件，设置数据库连接
npm run dev
```

### 前端服务

```bash
cd myclient
npm install
npm start
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

在Linux服务器上部署已推送的Docker镜像：

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