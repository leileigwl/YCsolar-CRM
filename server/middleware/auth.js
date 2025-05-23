const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // 从请求头获取token
  const token = req.header('x-auth-token');

  // 检查是否有token
  if (!token) {
    return res.status(401).json({ message: '无token，认证失败' });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 将用户信息添加到请求对象
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token无效' });
  }
}; 