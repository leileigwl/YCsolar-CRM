const db = require('../config/db');

// 获取所有客户
exports.getAllCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE created_by = ? AND (is_deleted = 0 OR is_deleted IS NULL) ORDER BY last_contact_time DESC',
      [userId]
    );
    
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取单个客户
exports.getCustomerById = async (req, res) => {
  try {
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ? AND (is_deleted = 0 OR is_deleted IS NULL)',
      [req.params.id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    res.json(customers[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 创建客户
exports.createCustomer = async (req, res) => {
  const { name, contact_type, contact_info, country, importance, notes } = req.body;
  
  try {
    const [result] = await db.query(
      `INSERT INTO customers 
       (name, contact_type, contact_info, country, importance, notes, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, contact_type, contact_info, country, importance || '普通', notes, req.user.id]
    );
    
    const [newCustomer] = await db.query(
      'SELECT * FROM customers WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newCustomer[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更新客户
exports.updateCustomer = async (req, res) => {
  const { name, contact_type, contact_info, country, importance, notes } = req.body;
  
  try {
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [req.params.id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    // 更新客户信息
    await db.query(
      `UPDATE customers 
       SET name = ?, contact_type = ?, contact_info = ?, country = ?, importance = ?, notes = ? 
       WHERE id = ?`,
      [name, contact_type, contact_info, country, importance || '普通', notes, req.params.id]
    );
    
    // 获取更新后的客户信息
    const [updatedCustomer] = await db.query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedCustomer[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 删除客户 (改为伪删除)
exports.deleteCustomer = async (req, res) => {
  try {
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ? AND (is_deleted = 0 OR is_deleted IS NULL)',
      [req.params.id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    // 伪删除客户信息 (设置is_deleted = 1)
    await db.query('UPDATE customers SET is_deleted = 1 WHERE id = ?', [req.params.id]);
    
    res.json({ message: '客户已删除' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 恢复已删除的客户
exports.restoreCustomer = async (req, res) => {
  try {
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ? AND is_deleted = 1',
      [req.params.id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到已删除的客户' });
    }
    
    // 恢复客户信息 (设置is_deleted = 0)
    await db.query('UPDATE customers SET is_deleted = 0 WHERE id = ?', [req.params.id]);
    
    // 获取恢复后的客户信息
    const [restoredCustomer] = await db.query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );
    
    res.json(restoredCustomer[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 搜索客户
exports.searchCustomers = async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ message: '请提供搜索关键词' });
  }
  
  try {
    // 构建搜索查询
    const searchTerm = `%${query}%`;
    
    const [customers] = await db.query(
      `SELECT * FROM customers 
       WHERE created_by = ? 
       AND (is_deleted = 0 OR is_deleted IS NULL)
       AND (name LIKE ? OR contact_info LIKE ? OR country LIKE ? OR notes LIKE ?)
       ORDER BY name ASC`,
      [req.user.id, searchTerm, searchTerm, searchTerm, searchTerm]
    );
    
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 更新客户最后联系时间
exports.updateLastContactTime = async (req, res) => {
  try {
    // 检查客户是否存在且属于当前用户
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE id = ? AND created_by = ?',
      [req.params.id, req.user.id]
    );
    
    if (customers.length === 0) {
      return res.status(404).json({ message: '未找到客户' });
    }
    
    // 更新最后联系时间
    await db.query(
      'UPDATE customers SET last_contact_time = NOW() WHERE id = ?',
      [req.params.id]
    );
    
    // 获取更新后的客户信息
    const [updatedCustomer] = await db.query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );
    
    res.json(updatedCustomer[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
};

// 获取已删除的客户
exports.getDeletedCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [customers] = await db.query(
      'SELECT * FROM customers WHERE created_by = ? AND is_deleted = 1 ORDER BY last_contact_time DESC',
      [userId]
    );
    
    res.json(customers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
}; 