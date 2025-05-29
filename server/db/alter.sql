-- 添加full_url字段到attachments表
ALTER TABLE attachments ADD COLUMN full_url VARCHAR(1024) NULL AFTER file_size;

-- 更新现有的数据，将full_url填充为完整的URL路径
-- 在实际环境中，执行此脚本时应替换SERVER_URL为实际的服务器地址
UPDATE attachments SET full_url = CONCAT('SERVER_URL', file_path) WHERE full_url IS NULL; 