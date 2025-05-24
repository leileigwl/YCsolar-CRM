-- 为customers表添加is_deleted字段
ALTER TABLE customers ADD COLUMN is_deleted TINYINT(1) DEFAULT 0;

-- 为现有记录设置默认值
UPDATE customers SET is_deleted = 0 WHERE is_deleted IS NULL; 