const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// 注册新用户
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // 检查用户是否已存在
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }
    
    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 保存用户
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    // 生成JWT Token
    const payload = {
      user: {
        id: result.insertId
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 用户登录
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 检查用户是否存在
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: '用户不存在' });
    }
    
    const user = users[0];
    
    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: '密码错误' });
    }
    
    // 更新最后登录时间
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    // 生成JWT
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(users[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}; 