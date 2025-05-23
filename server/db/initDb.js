const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  // 首先创建没有数据库名称的连接
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    // 读取SQL文件
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    // 按语句分割
    const statements = sql.split(';').filter(statement => statement.trim());
    
    // 执行每条语句
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(`${statement};`);
        console.log(`Executed: ${statement.substring(0, 50)}...`);
      }
    }
    
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

initDatabase(); 