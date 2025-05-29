const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 5000;

// CORS 配置
const corsOptions = {
  // 根据环境设置不同的 CORS 配置
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:3000'] // 生产环境
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],   // 开发环境
  credentials: true, // 允许发送凭据
  optionsSuccessStatus: 200
};

// 中间件
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 设置响应头来确保UTF-8编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 静态文件服务 - 用于存储上传的文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  // 设置适当的内容类型头
  setHeaders: (res, filePath) => {
    const filename = path.basename(filePath);
    
    // 为不同类型的文件设置正确的Content-Type和disposition
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    // 为文本文件设置正确的Content-Type
    else if (filePath.endsWith('.txt')) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline');
    }
    // 为HTML文件设置正确的Content-Type
    else if (filePath.endsWith('.html') || filePath.endsWith('.htm')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline');
    }
    // 为图片文件设置正确的Content-Type
    else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)) {
      res.setHeader('Content-Type', `image/${path.extname(filePath).substring(1)}`);
      res.setHeader('Content-Disposition', 'inline');
    }
    // Word文档强制下载
    else if (/\.(docx?|xlsx?|pptx?|csv)$/i.test(filePath)) {
      // 设置Office文档类型
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.csv': 'text/csv'
      };
      
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      // 强制下载 Office 文档
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    }
    // 其他类型的文件默认强制下载
    else {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    }
  }
}));

// 添加静态文件服务 - 用于测试页面和其他静态资源
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/communications', require('./routes/communications'));

// 健康检查端点，用于Docker健康检查
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 简单的健康检查路由
app.get('/', (req, res) => {
  res.send('CRM API is running');
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app; 