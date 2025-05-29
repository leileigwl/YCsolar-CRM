// 服务器配置
const config = {
  // 上传文件路径
  uploadsPath: process.env.UPLOADS_PATH || './uploads',
  
  // JWT密钥
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  
  // JWT过期时间
  jwtExpire: process.env.JWT_EXPIRE || '7d'
};

module.exports = config; 