-- 创建数据库
CREATE DATABASE IF NOT EXISTS crm_system;
USE crm_system;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- 创建客户表
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_type ENUM('WeChat', 'WhatsApp') NOT NULL,
  contact_info VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  notes TEXT,
  last_contact_time TIMESTAMP NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 创建沟通记录表
CREATE TABLE IF NOT EXISTS communications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  communication_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建附件表
CREATE TABLE IF NOT EXISTS attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  communication_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_size INT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (communication_id) REFERENCES communications(id) ON DELETE CASCADE
);

-- 添加索引以提高搜索性能
CREATE INDEX idx_customer_name ON customers (name);
CREATE INDEX idx_customer_contact ON customers (contact_info);
CREATE INDEX idx_customer_country ON customers (country);
CREATE INDEX idx_communication_content ON communications (content(255));
CREATE INDEX idx_communication_time ON communications (communication_time); 