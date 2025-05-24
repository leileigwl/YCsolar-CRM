const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// 注册新用户
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    console.log('Registration attempt:', { username, email });
    
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
    
    console.log('Attempting to insert user into database');
    
    // 保存用户
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    console.log('User inserted successfully, ID:', result.insertId);
    
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
        if (err) {
          console.error('JWT signing error:', err);
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error details:', err);
    console.error('Error stack:', err.stack);
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

// 更新用户资料
exports.updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
      return res.status(400).json({ message: '用户名不能为空' });
    }
    
    // 检查用户名是否已被其他用户使用
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE username = ? AND id != ?',
      [username, req.user.id]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: '该用户名已被使用' });
    }
    
    // 更新用户资料
    await db.query(
      'UPDATE users SET username = ? WHERE id = ?',
      [username, req.user.id]
    );
    
    // 返回更新后的用户信息
    const [users] = await db.query(
      'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );
    
    res.json(users[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更改密码
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 验证请求数据
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: '当前密码和新密码都必须提供' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: '新密码长度至少为6个字符' });
    }

    // 获取用户信息
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const user = users[0];

    // 验证当前密码
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '当前密码不正确' });
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 更新密码
    await db.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: '密码已成功更新' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}; 