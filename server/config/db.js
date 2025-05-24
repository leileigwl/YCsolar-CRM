const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ycsolar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
  } catch (err) {
    console.error('数据库连接失败:', err.message);
    // 不要立即退出，让其他系统初始化继续进行，数据库可能还在启动中
    console.log('将在10秒后重试连接...');
    setTimeout(testConnection, 10000);
  }
};

// 应用启动时测试连接
testConnection();

module.exports = pool; 