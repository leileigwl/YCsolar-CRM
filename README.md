# 客户关系管理系统 (CRM)

这是一个基于 React + Express + MySQL 构建的客户关系管理系统，主要用于跟踪客户信息和沟通记录。

## 功能特点

- 🔐 用户认证系统
- 📋 客户信息管理
- 📝 沟通记录管理
- 📎 支持文件和图片附件
- 🔍 全文搜索功能
- 📊 数据统计和分析
- 📱 响应式设计，适配不同设备

## 技术栈

### 前端
- React (TypeScript)
- React Router
- Tailwind CSS
- Axios
- Headless UI
- Heroicons

### 后端
- Node.js
- Express
- MySQL
- JWT认证
- Multer (文件上传)

## 安装和运行

### 先决条件
- Node.js (>= 14.x)
- MySQL (>= 5.7)

### 安装步骤

1. 克隆项目
```
git clone https://github.com/yourusername/crm-system.git
cd crm-system
```

2. 安装依赖
```
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

3. 配置环境变量
```
# 在server目录下，创建.env文件
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=crm_system
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. 初始化数据库
```
cd server
npm run init-db
```

5. 启动应用
```
# 启动后端服务
cd server
npm run dev

# 另一个终端中启动前端服务
cd client
npm start
```

6. 访问应用
浏览器打开 [http://localhost:3000](http://localhost:3000)

## 使用指南

1. 注册/登录账户
2. 添加客户信息
3. 记录与客户的沟通内容
4. 上传相关文件附件
5. 使用搜索功能查找客户或沟通记录

## 项目结构

```
crm-system/
├── client/                # 前端React应用
│   ├── public/            # 静态资源
│   ├── src/               # 源代码
│   │   ├── components/    # UI组件
│   │   ├── contexts/      # 上下文管理
│   │   ├── pages/         # 页面组件
│   │   ├── utils/         # 工具函数
│   │   └── App.tsx        # 应用入口
│   └── package.json       # 依赖配置
│
├── server/                # 后端Node.js应用
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── db/                # 数据库脚本
│   ├── middleware/        # 中间件
│   ├── routes/            # 路由处理
│   ├── uploads/           # 上传文件存储
│   ├── server.js          # 服务器入口
│   └── package.json       # 依赖配置
│
└── README.md              # 项目说明
```

## 许可证

MIT 