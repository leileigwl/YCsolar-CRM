// 更新客户重要性值的脚本
const db = require('../config/db');

/**
 * 将英文的客户重要性值更新为中文
 */
async function updateImportanceValues() {
  try {
    console.log('开始更新客户重要性值...');

    // 首先修改字段类型，增加长度
    console.log('1. 更新数据库字段类型，增加字段长度...');
    await db.query(
      `ALTER TABLE customers MODIFY COLUMN importance VARCHAR(50) NOT NULL DEFAULT '普通'`
    );
    console.log('字段类型更新成功');

    // 更新Normal为普通
    console.log('2. 开始更新重要性值...');
    const [normalResult] = await db.query(
      `UPDATE customers SET importance = '普通' WHERE importance = 'Normal'`
    );
    console.log(`已将${normalResult.affectedRows}条客户记录的重要性从'Normal'更新为'普通'`);

    // 更新Important为重要
    const [importantResult] = await db.query(
      `UPDATE customers SET importance = '重要' WHERE importance = 'Important'`
    );
    console.log(`已将${importantResult.affectedRows}条客户记录的重要性从'Important'更新为'重要'`);

    // 更新VeryImportant为特别重要
    const [veryImportantResult] = await db.query(
      `UPDATE customers SET importance = '特别重要' WHERE importance = 'VeryImportant'`
    );
    console.log(`已将${veryImportantResult.affectedRows}条客户记录的重要性从'VeryImportant'更新为'特别重要'`);

    // 查看更新后的数据分布
    const [distribution] = await db.query(
      `SELECT importance, COUNT(*) as count FROM customers GROUP BY importance`
    );
    console.log('更新后的数据分布:');
    console.table(distribution);

    console.log('客户重要性值更新完成！');
  } catch (err) {
    console.error('更新客户重要性值时出错:', err);
  } finally {
    // 关闭数据库连接
    process.exit();
  }
}

// 执行更新
updateImportanceValues(); 