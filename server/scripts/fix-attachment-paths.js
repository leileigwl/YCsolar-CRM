/**
 * 修复附件路径脚本
 * 
 * 此脚本检查所有附件记录，将完整URL路径转换为相对路径
 * 对于包含IP地址或localhost的路径，只保留/uploads/部分
 */

require('dotenv').config(); // 加载.env文件
const mysql = require('mysql2/promise');

async function fixAttachmentPaths() {
  // 创建数据库连接
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'crm_system',
    port: process.env.DB_PORT || 3306
  });
  
  try {
    console.log('开始修复附件路径...');
    
    // 获取所有附件记录
    const [attachments] = await db.query('SELECT id, file_path FROM attachments');
    
    console.log(`找到 ${attachments.length} 条附件记录需要检查`);
    let updatedCount = 0;
    
    for (const attachment of attachments) {
      const { id, file_path } = attachment;
      
      // 如果路径包含协议或域名
      if (file_path.includes('://') || file_path.includes('localhost') || /\d+\.\d+\.\d+\.\d+/.test(file_path)) {
        // 尝试提取/uploads/部分
        let relativePath = file_path;
        const pathParts = file_path.split('/');
        const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
        
        if (uploadsIndex >= 0) {
          relativePath = '/' + pathParts.slice(uploadsIndex).join('/');
        } else if (file_path.includes('/uploads/')) {
          // 如果找不到但路径包含/uploads/，则从该部分开始截取
          relativePath = file_path.substr(file_path.indexOf('/uploads/'));
        }
        
        // 确保路径以/开头
        if (!relativePath.startsWith('/')) {
          relativePath = '/' + relativePath;
        }
        
        if (relativePath !== file_path) {
          console.log(`修复ID ${id}的路径: ${file_path} -> ${relativePath}`);
          
          // 更新记录
          await db.query('UPDATE attachments SET file_path = ? WHERE id = ?', [relativePath, id]);
          updatedCount++;
        }
      }
    }
    
    console.log(`完成! 共修复了 ${updatedCount} 条记录`);
    
  } catch (err) {
    console.error('修复附件路径时出错:', err);
  } finally {
    // 关闭数据库连接
    await db.end();
  }
}

// 执行修复脚本
fixAttachmentPaths(); 