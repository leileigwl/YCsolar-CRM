const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// 获取客户的所有沟通记录
exports.getCustomerCommunications = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [customerId, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    // 获取沟通记录
    const [communications] = await db.query(
      `SELECT c.*, u.username as user_name 
       FROM communications c
       JOIN users u ON c.user_id = u.id
       WHERE c.customer_id = ?
       ORDER BY c.communication_time DESC`,
      [customerId]
    );
    
    // 获取每条沟通记录的附件
    for (let comm of communications) {
      const [attachments] = await db.query(
        'SELECT * FROM attachments WHERE communication_id = ?',
        [comm.id]
      );
      
      comm.attachments = attachments;
    }
    
    res.json(communications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取单个沟通记录
exports.getCommunicationById = async (req, res) => {
  try {
    // 获取沟通记录
    const [communications] = await db.query(
      `SELECT c.*, u.username as user_name
       FROM communications c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    
    if (communications.length === 0) {
      return res.status(404).json({ message: '未找到沟通记录' });
    }
    
    const communication = communications[0];
    
    // 检查沟通记录关联的客户是否属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [communication.customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(403).json({ message: '无权访问此沟通记录' });
    }
    
    // 获取附件
    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE communication_id = ?',
      [req.params.id]
    );
    
    communication.attachments = attachments;
    
    res.json(communication);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 创建沟通记录
exports.createCommunication = async (req, res) => {
  try {
    const { customer_id, content, communication_time } = req.body;
    
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    // 创建沟通记录
    const [result] = await db.query(
      `INSERT INTO communications (customer_id, user_id, content, communication_time)
       VALUES (?, ?, ?, ?)`,
      [customer_id, req.user.id, content, communication_time || new Date()]
    );
    
    // 如果有上传的文件，处理附件
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await db.query(
          `INSERT INTO attachments 
           (communication_id, file_name, file_type, file_path, file_size)
           VALUES (?, ?, ?, ?, ?)`,
          [
            result.insertId,
            file.originalname,
            file.mimetype,
            file.path,
            file.size
          ]
        );
      }
    }
    
    // 更新客户的最后联系时间
    await db.query(
      'UPDATE customers SET last_contact_time = ? WHERE id = ?',
      [communication_time || new Date(), customer_id]
    );
    
    // 获取创建的沟通记录
    const [newCommunication] = await db.query(
      `SELECT c.*, u.username as user_name
       FROM communications c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );
    
    // 获取附件
    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE communication_id = ?',
      [result.insertId]
    );
    
    newCommunication[0].attachments = attachments;
    
    res.status(201).json(newCommunication[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更新沟通记录
exports.updateCommunication = async (req, res) => {
  try {
    const { content, communication_time } = req.body;
    
    // 获取沟通记录
    const [communications] = await db.query(
      'SELECT * FROM communications WHERE id = ?',
      [req.params.id]
    );
    
    if (communications.length === 0) {
      return res.status(404).json({ message: '未找到沟通记录' });
    }
    
    const communication = communications[0];
    
    // 检查沟通记录关联的客户是否属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [communication.customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(403).json({ message: '无权修改此沟通记录' });
    }
    
    // 更新沟通记录
    await db.query(
      `UPDATE communications 
       SET content = ?, communication_time = ?
       WHERE id = ?`,
      [content, communication_time, req.params.id]
    );
    
    // 获取更新后的沟通记录
    const [updatedCommunication] = await db.query(
      `SELECT c.*, u.username as user_name
       FROM communications c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [req.params.id]
    );
    
    // 获取附件
    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE communication_id = ?',
      [req.params.id]
    );
    
    updatedCommunication[0].attachments = attachments;
    
    res.json(updatedCommunication[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 删除沟通记录
exports.deleteCommunication = async (req, res) => {
  try {
    // 获取沟通记录
    const [communications] = await db.query(
      'SELECT * FROM communications WHERE id = ?',
      [req.params.id]
    );
    
    if (communications.length === 0) {
      return res.status(404).json({ message: '未找到沟通记录' });
    }
    
    const communication = communications[0];
    
    // 检查沟通记录关联的客户是否属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [communication.customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(403).json({ message: '无权删除此沟通记录' });
    }
    
    // 获取并删除附件文件
    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE communication_id = ?',
      [req.params.id]
    );
    
    for (const attachment of attachments) {
      try {
        fs.unlinkSync(attachment.file_path);
      } catch (err) {
        console.error(`删除文件失败: ${attachment.file_path}`, err);
      }
    }
    
    // 删除沟通记录（会级联删除附件记录）
    await db.query('DELETE FROM communications WHERE id = ?', [req.params.id]);
    
    res.json({ message: '沟通记录已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 搜索沟通记录
exports.searchCommunications = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: '请提供搜索关键词' });
    }
    
    // 构建搜索查询
    const searchTerm = `%${query}%`;
    
    // 查找符合条件的沟通记录，限制只能查找当前用户有权访问的客户相关记录
    const [communications] = await db.query(
      `SELECT c.*, u.username as user_name, cust.name as customer_name
       FROM communications c
       JOIN users u ON c.user_id = u.id
       JOIN customers cust ON c.customer_id = cust.id
       WHERE cust.created_by = ? 
       AND c.content LIKE ?
       ORDER BY c.communication_time DESC`,
      [req.user.id, searchTerm]
    );
    
    // 获取每条沟通记录的附件
    for (let comm of communications) {
      const [attachments] = await db.query(
        'SELECT * FROM attachments WHERE communication_id = ?',
        [comm.id]
      );
      
      comm.attachments = attachments;
    }
    
    res.json(communications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 添加附件到沟通记录
exports.addAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }
    
    // 获取沟通记录
    const [communications] = await db.query(
      'SELECT * FROM communications WHERE id = ?',
      [req.params.id]
    );
    
    if (communications.length === 0) {
      return res.status(404).json({ message: '未找到沟通记录' });
    }
    
    const communication = communications[0];
    
    // 检查沟通记录关联的客户是否属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [communication.customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(403).json({ message: '无权修改此沟通记录' });
    }
    
    // 添加附件
    const [result] = await db.query(
      `INSERT INTO attachments 
       (communication_id, file_name, file_type, file_path, file_size)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.params.id,
        req.file.originalname,
        req.file.mimetype,
        req.file.path,
        req.file.size
      ]
    );
    
    // 获取附件信息
    const [attachment] = await db.query(
      'SELECT * FROM attachments WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(attachment[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 删除附件
exports.deleteAttachment = async (req, res) => {
  try {
    // 获取附件信息
    const [attachments] = await db.query(
      'SELECT a.*, c.customer_id FROM attachments a JOIN communications c ON a.communication_id = c.id WHERE a.id = ?',
      [req.params.attachmentId]
    );
    
    if (attachments.length === 0) {
      return res.status(404).json({ message: '未找到附件' });
    }
    
    const attachment = attachments[0];
    
    // 检查附件关联的客户是否属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [attachment.customer_id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(403).json({ message: '无权删除此附件' });
    }
    
    // 删除文件
    try {
      fs.unlinkSync(attachment.file_path);
    } catch (err) {
      console.error(`删除文件失败: ${attachment.file_path}`, err);
    }
    
    // 删除数据库记录
    await db.query('DELETE FROM attachments WHERE id = ?', [req.params.attachmentId]);
    
    res.json({ message: '附件已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}; 