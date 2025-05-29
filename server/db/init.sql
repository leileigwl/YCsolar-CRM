/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80031
 Source Host           : localhost:3306
 Source Schema         : crm_system

 Target Server Type    : MySQL
 Target Server Version : 80031
 File Encoding         : 65001

 Date: 29/05/2025 11:37:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attachments
-- ----------------------------
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `communication_id` int(0) NOT NULL,
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_path` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `file_size` int(0) NOT NULL,
  `uploaded_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `communication_id`(`communication_id`) USING BTREE,
  CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`communication_id`) REFERENCES `communications` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of attachments
-- ----------------------------
INSERT INTO `attachments` VALUES (5, 18, '28af63750c2b4a7254f527c39f957939.jpg', 'image/jpeg', '/uploads/28af63750c2b4a7254f527c39f957939-1748078118340.jpg', 540106, '2025-05-25 01:15:18');
INSERT INTO `attachments` VALUES (6, 22, '28af63750c2b4a7254f527c39f957939.jpg', 'image/jpeg', '/uploads/28af63750c2b4a7254f527c39f957939-1748084281697.jpg', 540106, '2025-05-25 02:58:01');
INSERT INTO `attachments` VALUES (7, 22, '1.xls', 'application/vnd.ms-excel', '/uploads/1-1748084281703.xls', 22016, '2025-05-25 02:58:01');
INSERT INTO `attachments` VALUES (8, 25, '14d93ecebd06d384b9f1b6fcbb5e94e3.jpg', 'image/jpeg', '/uploads/14d93ecebd06d384b9f1b6fcbb5e94e3-1748159014629.jpg', 453619, '2025-05-25 15:43:34');
INSERT INTO `attachments` VALUES (9, 25, 'e1e3fb7be3ce042018440584760bb57b.jpg', 'image/jpeg', '/uploads/e1e3fb7be3ce042018440584760bb57b-1748159014661.jpg', 487157, '2025-05-25 15:43:34');
INSERT INTO `attachments` VALUES (10, 28, '3f3ae3da33d589ad8684b328088a99c6.jpg', 'image/jpeg', '/uploads/3f3ae3da33d589ad8684b328088a99c6-1748162568868.jpg', 678933, '2025-05-25 16:42:49');
INSERT INTO `attachments` VALUES (11, 41, '85ef00a1d2cd7b44089ce318dd72c324.png', 'image/png', '/uploads/85ef00a1d2cd7b44089ce318dd72c324-1748164733571.png', 108337, '2025-05-25 17:18:53');
INSERT INTO `attachments` VALUES (12, 42, '29f85f04f2011f9a10b283bd09a1df7e.jpg', 'image/jpeg', '/uploads/29f85f04f2011f9a10b283bd09a1df7e-1748164787078.jpg', 163308, '2025-05-25 17:19:47');
INSERT INTO `attachments` VALUES (13, 43, 'æ¹æ¡æ¥ä»·.pdf', 'application/pdf', '/uploads/æ¹æ¡æ¥ä»·-1748164847078.pdf', 143841, '2025-05-25 17:20:47');
INSERT INTO `attachments` VALUES (14, 45, 'v4 è½¦åå¼ä¸èç¿åä½åè®®ï¼20250507ï¼(1).pdf', 'application/pdf', '/uploads/v4 è½¦åå¼ä¸èç¿åä½åè®®ï¼20250507ï¼(1)-1748224505383.pdf', 191827, '2025-05-26 09:55:05');
INSERT INTO `attachments` VALUES (16, 47, 'Snipaste_2025-05-26_11-45-33.png', 'image/png', '/uploads/Snipaste_2025-05-26_11-45-33-1748231223462.png', 132020, '2025-05-26 11:47:03');
INSERT INTO `attachments` VALUES (17, 47, 'Snipaste_2025-05-26_11-45-33.png', 'image/png', '/uploads/Snipaste_2025-05-26_11-45-33-1748231280006.png', 132020, '2025-05-26 11:48:00');
INSERT INTO `attachments` VALUES (18, 18, '2.png', 'image/png', '/uploads/2-1748441947199.png', 734722, '2025-05-28 22:19:07');
INSERT INTO `attachments` VALUES (19, 54, '1.png', 'image/png', '/uploads/1-1748455932496.png', 1168963, '2025-05-29 02:12:12');
INSERT INTO `attachments` VALUES (32, 55, '25年文心生态AI产品应用说明.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '/uploads/file-1748489552100-7b9d9d7138e314cc.docx', 288968, '2025-05-29 11:32:32');
INSERT INTO `attachments` VALUES (33, 56, '11.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '/uploads/file-1748489616296-a16e3c0d9280c2d4.xlsx', 8599, '2025-05-29 11:33:36');

-- ----------------------------
-- Table structure for communications
-- ----------------------------
DROP TABLE IF EXISTS `communications`;
CREATE TABLE `communications`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `customer_id` int(0) NOT NULL,
  `user_id` int(0) NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `communication_time` timestamp(0) NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `customer_id`(`customer_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `idx_communication_content`(`content`(255)) USING BTREE,
  INDEX `idx_communication_time`(`communication_time`) USING BTREE,
  CONSTRAINT `communications_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `communications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of communications
-- ----------------------------
INSERT INTO `communications` VALUES (6, 2, 1, '222', '2025-05-24 19:07:27', '2025-05-24 19:07:27', '2025-05-24 19:07:27');
INSERT INTO `communications` VALUES (13, 1, 1, 'nihao', '2025-05-24 17:07:11', '2025-05-25 01:07:11', '2025-05-25 01:07:11');
INSERT INTO `communications` VALUES (14, 1, 1, '11', '2025-05-24 17:09:28', '2025-05-25 01:09:28', '2025-05-25 01:09:28');
INSERT INTO `communications` VALUES (16, 1, 1, '时间是17.10\r\n', '2025-05-24 17:10:08', '2025-05-25 01:10:08', '2025-05-25 01:10:08');
INSERT INTO `communications` VALUES (18, 4, 1, '初次添加客户 香港魏蓝贸易有限公司-马峰 2025.5.24 印象不错，伊拉克要一套，上传了 1 个文件。', '2025-05-25 01:15:18', '2025-05-25 01:15:18', '2025-05-25 01:15:18');
INSERT INTO `communications` VALUES (20, 8, 1, '11', '2025-05-25 02:56:48', '2025-05-25 02:56:48', '2025-05-25 02:56:48');
INSERT INTO `communications` VALUES (22, 10, 1, '发射点发生啊搜', '2025-05-25 02:58:01', '2025-05-25 02:58:01', '2025-05-25 02:58:01');
INSERT INTO `communications` VALUES (23, 8, 1, 'ce ', '2025-05-25 03:06:07', '2025-05-25 03:06:07', '2025-05-25 03:06:07');
INSERT INTO `communications` VALUES (24, 11, 1, '沟通了要送货，迟迟不回想跑', '2025-05-25 23:41:39', '2025-05-25 15:41:40', '2025-05-25 15:41:40');
INSERT INTO `communications` VALUES (25, 12, 1, '想要水泵逆变器，四大品牌太阳能板，古瑞瓦特', '2025-05-25 23:43:32', '2025-05-25 15:43:34', '2025-05-25 15:43:34');
INSERT INTO `communications` VALUES (26, 13, 1, '想要德业和瓦特的逆变器', '2025-05-25 23:44:01', '2025-05-25 15:44:01', '2025-05-25 15:44:01');
INSERT INTO `communications` VALUES (27, 14, 1, '想要小米的电器', '2025-05-26 00:39:33', '2025-05-25 16:39:34', '2025-05-25 16:39:34');
INSERT INTO `communications` VALUES (28, 15, 1, '2套系统，6号交货', '2025-05-26 00:42:46', '2025-05-25 16:42:48', '2025-05-25 16:42:48');
INSERT INTO `communications` VALUES (29, 16, 1, '在考量，然后需要是想要一套但是还没有了解，想要后续继续做', '2025-05-26 00:46:02', '2025-05-25 16:46:03', '2025-05-25 16:46:03');
INSERT INTO `communications` VALUES (30, 17, 1, '想要20个逆变器，最近没回消息可以联系一下', '2025-05-26 00:51:16', '2025-05-25 16:51:17', '2025-05-25 16:51:17');
INSERT INTO `communications` VALUES (31, 18, 1, '问了价格，要了工厂，后面没回信息', '2025-05-26 01:02:24', '2025-05-25 17:02:24', '2025-05-25 17:02:24');
INSERT INTO `communications` VALUES (32, 19, 1, '马上要交货发货了，下周也就是5月26号向后，客户应该要定柜子', '2025-05-26 01:10:05', '2025-05-25 17:10:06', '2025-05-25 17:10:06');
INSERT INTO `communications` VALUES (33, 20, 1, '沟通了一下有意向合作', '2025-05-26 01:11:00', '2025-05-25 17:11:00', '2025-05-25 17:11:00');
INSERT INTO `communications` VALUES (34, 21, 1, '需要扬水逆变器的，印象非常不错，现在在回国路上，说以后会找我', '2025-05-26 01:12:06', '2025-05-25 17:12:07', '2025-05-25 17:12:07');
INSERT INTO `communications` VALUES (35, 22, 1, '说客户有意向来，但是一直停滞不前，催催应该有戏', '2025-05-26 01:12:49', '2025-05-25 17:12:50', '2025-05-25 17:12:50');
INSERT INTO `communications` VALUES (36, 23, 1, '沟通了大概的价格，还在等客户反馈，印象不深，但是有机会', '2025-05-26 01:13:29', '2025-05-25 17:13:30', '2025-05-25 17:13:30');
INSERT INTO `communications` VALUES (37, 24, 1, '可以沟通了，上次聊了一下，应该还有戏', '2025-05-26 01:15:40', '2025-05-25 17:15:43', '2025-05-25 17:15:43');
INSERT INTO `communications` VALUES (38, 25, 1, '说在忙，已经发了很多给他， 但是回复少，意向一般般，但有机会', '2025-05-26 01:16:21', '2025-05-25 17:16:21', '2025-05-25 17:16:21');
INSERT INTO `communications` VALUES (39, 26, 1, '给客人写了个报价，后面就没有了，没有谈论太对', '2025-05-26 01:16:57', '2025-05-25 17:16:57', '2025-05-25 17:16:57');
INSERT INTO `communications` VALUES (40, 27, 1, '要晶科的板子', '2025-05-26 01:17:35', '2025-05-25 17:17:35', '2025-05-25 17:17:35');
INSERT INTO `communications` VALUES (41, 28, 1, '好不容易麻烦了王威哥，这个争取一下', '2025-05-26 01:18:51', '2025-05-25 17:18:53', '2025-05-25 17:18:53');
INSERT INTO `communications` VALUES (42, 29, 1, '这个客户看了很多家，跟他们的外贸公司聊天，追问追问可以聊', '2025-05-26 01:19:46', '2025-05-25 17:19:47', '2025-05-25 17:19:47');
INSERT INTO `communications` VALUES (43, 30, 1, '想要一套系统', '2025-05-26 01:20:45', '2025-05-25 17:20:47', '2025-05-25 17:20:47');
INSERT INTO `communications` VALUES (44, 11, 1, '你好，货你卖掉吧，这个货出不去，不好意思。这样子搞就诶，信任有点低', '2025-05-26 17:23:29', '2025-05-26 09:23:30', '2025-05-26 09:55:44');
INSERT INTO `communications` VALUES (45, 31, 1, '已经下单了合同，2025.5.26需要查看一下合同然后进行沟通下单', '2025-05-26 17:55:03', '2025-05-26 09:55:05', '2025-05-26 09:55:05');
INSERT INTO `communications` VALUES (46, 32, 1, '已经联系了很久，有机会下单的', '2025-05-26 18:00:40', '2025-05-26 10:00:40', '2025-05-26 10:00:40');
INSERT INTO `communications` VALUES (47, 33, 1, '第一次就是来进行介绍吧', '2025-05-26 18:04:07', '2025-05-26 10:04:07', '2025-05-26 10:04:07');
INSERT INTO `communications` VALUES (48, 12, 1, '以后后面天合的组件找他！！4大品牌', '2025-05-26 18:05:13', '2025-05-26 10:05:13', '2025-05-26 10:05:13');
INSERT INTO `communications` VALUES (49, 34, 1, '已经有过几次沟通，应该是有机会的', '2025-05-26 18:07:40', '2025-05-26 10:07:40', '2025-05-26 10:07:40');
INSERT INTO `communications` VALUES (50, 35, 1, '有过一次合作，在5月19日完成交货', '2025-05-26 18:15:08', '2025-05-26 10:15:09', '2025-05-26 10:15:09');
INSERT INTO `communications` VALUES (51, 36, 1, '445w全黑框组件，0.66RMB/w 有货，我们实标。\r\n上面的大概率是虚标的组件', '2025-05-26 22:18:02', '2025-05-26 14:18:03', '2025-05-26 14:18:03');
INSERT INTO `communications` VALUES (52, 37, 1, '要黑框440 ，联系了有两三次', '2025-05-28 17:44:46', '2025-05-28 09:44:46', '2025-05-28 09:44:46');
INSERT INTO `communications` VALUES (53, 38, 1, '要逆变器和电池，都要古瑞瓦特的', '2025-05-28 17:45:12', '2025-05-28 09:45:12', '2025-05-28 09:45:12');
INSERT INTO `communications` VALUES (54, 39, 1, '测试', '2025-05-29 02:12:12', '2025-05-29 02:12:12', '2025-05-29 02:12:12');
INSERT INTO `communications` VALUES (55, 39, 1, '22', '2025-05-29 02:21:21', '2025-05-29 02:21:21', '2025-05-29 02:21:21');
INSERT INTO `communications` VALUES (56, 39, 1, '33', '2025-05-29 11:33:36', '2025-05-29 11:33:36', '2025-05-29 11:33:36');

-- ----------------------------
-- Table structure for customers
-- ----------------------------
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_type` enum('WeChat','WhatsApp') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `last_contact_time` timestamp(0) NULL DEFAULT NULL,
  `created_by` int(0) NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  `importance` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '普通',
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `created_by`(`created_by`) USING BTREE,
  INDEX `idx_customer_name`(`name`) USING BTREE,
  INDEX `idx_customer_contact`(`contact_info`) USING BTREE,
  INDEX `idx_customer_country`(`country`) USING BTREE,
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of customers
-- ----------------------------
INSERT INTO `customers` VALUES (1, 'simple', 'WeChat', '住哟啊是是减肥啦是法律实践弗利萨发两句撒拉萨芬建立撒娇发顺丰拉萨解放萨勒夫啊建立撒娇弗利萨飞机拉萨了解对方萨法', '中国', '', '2025-05-25 01:12:07', 1, '2025-05-24 18:08:01', '2025-05-25 15:44:09', 'Normal', 1);
INSERT INTO `customers` VALUES (2, '2', 'WeChat', '222', '1111', '', '2025-05-24 21:55:24', 1, '2025-05-24 18:33:13', '2025-05-25 02:23:36', 'Normal', 1);
INSERT INTO `customers` VALUES (3, 'leileigwl', 'WeChat', '聊天', '中国', '', NULL, 1, '2025-05-24 21:17:56', '2025-05-25 02:22:20', 'Normal', 1);
INSERT INTO `customers` VALUES (4, '马峰', 'WeChat', '要一套系统，印象还可以', '伊拉克', '香港魏蓝贸易有限公司  要一套系统', '2025-05-25 02:03:00', 1, '2025-05-25 01:15:18', '2025-05-25 15:42:16', 'Normal', 0);
INSERT INTO `customers` VALUES (5, '测试', 'WeChat', '11', '22', '', NULL, 1, '2025-05-25 01:23:56', '2025-05-25 01:27:45', 'Normal', 1);
INSERT INTO `customers` VALUES (6, '测试', 'WeChat', '中东测试', '伊拉克', '', NULL, 1, '2025-05-25 01:28:49', '2025-05-25 02:36:40', 'Normal', 1);
INSERT INTO `customers` VALUES (7, '高维磊', 'WeChat', '初始测试', '中国', '', NULL, 1, '2025-05-25 02:22:00', '2025-05-25 02:59:53', 'Normal', 1);
INSERT INTO `customers` VALUES (8, '测试18.52', 'WeChat', '测试18.52', '伊拉克', '', '2025-05-25 03:06:07', 1, '2025-05-25 02:53:00', '2025-05-25 03:06:21', 'VeryImportant', 1);
INSERT INTO `customers` VALUES (9, '测试18.52', 'WeChat', '111', '伊拉克', '', '2025-05-25 02:57:04', 1, '2025-05-25 02:57:04', '2025-05-25 02:57:32', 'Normal', 1);
INSERT INTO `customers` VALUES (10, '高维磊', 'WeChat', '发射点发生啊搜', '伊拉克', '香港魏蓝贸易有限公司  要一套系统', '2025-05-25 02:58:01', 1, '2025-05-25 02:58:01', '2025-05-25 02:58:26', 'Normal', 1);
INSERT INTO `customers` VALUES (11, 'Ibrahim yu', 'WeChat', '沟通了要送货，迟迟不回想跑', '约旦', '合作了一次，最后只收回来定金', '2025-05-26 09:23:30', 1, '2025-05-25 15:41:39', '2025-05-26 09:56:05', 'Normal', 0);
INSERT INTO `customers` VALUES (12, 'monday', 'WeChat', '想要水泵逆变器，四大品牌太阳能板，古瑞瓦特', '尼日利亚', '', '2025-05-26 10:05:14', 1, '2025-05-25 15:43:31', '2025-05-26 10:05:14', 'Normal', 0);
INSERT INTO `customers` VALUES (13, 'feng', 'WeChat', '想要德业和瓦特的逆变器', '非洲', '', '2025-05-25 15:44:02', 1, '2025-05-25 15:44:00', '2025-05-25 15:44:02', 'Normal', 0);
INSERT INTO `customers` VALUES (14, 'Shahal Rahman', 'WeChat', '想要小米的电器', '印度', '', '2025-05-25 16:39:34', 1, '2025-05-25 16:39:33', '2025-05-25 16:39:34', 'Normal', 0);
INSERT INTO `customers` VALUES (15, 'Malik', 'WeChat', '2套系统，6号交货', '苏丹', '', '2025-05-25 16:42:49', 1, '2025-05-25 16:42:46', '2025-05-25 16:43:00', 'VeryImportant', 0);
INSERT INTO `customers` VALUES (16, 'Armando Antonio Leon Chahin', 'WeChat', '在考量，然后需要是想要一套但是还没有了解，想要后续继续做', '危地马拉', '给外贸公司加3个点P ETER（荒漠甘泉）', '2025-05-25 16:46:04', 1, '2025-05-25 16:46:02', '2025-05-25 16:46:04', 'Normal', 0);
INSERT INTO `customers` VALUES (17, 'Ab jabar', 'WeChat', '想要20个逆变器，最近没回消息可以联系一下', '非洲', '', '2025-05-25 16:51:17', 1, '2025-05-25 16:51:16', '2025-05-25 16:51:17', 'Important', 0);
INSERT INTO `customers` VALUES (18, 'H&AG', 'WeChat', '问了价格，要了工厂，后面没回信息', '未知', '', '2025-05-25 17:02:25', 1, '2025-05-25 17:02:24', '2025-05-25 17:02:25', 'Normal', 0);
INSERT INTO `customers` VALUES (19, 'Shirinx Power', 'WeChat', '马上要交货发货了，下周也就是5月26号向后，客户应该要定柜子', '外贸公司', '', '2025-05-25 17:10:06', 1, '2025-05-25 17:10:05', '2025-05-25 17:10:06', 'VeryImportant', 0);
INSERT INTO `customers` VALUES (20, 'Gregory', 'WeChat', '沟通了一下有意向合作', '莫斯科 ', '虽然只是在微信聊天，但是印象还可以', '2025-05-25 17:11:01', 1, '2025-05-25 17:11:00', '2025-05-25 17:11:01', 'Normal', 0);
INSERT INTO `customers` VALUES (21, 'H.A.zzidan', 'WeChat', '需要扬水逆变器的，印象非常不错，现在在回国路上，说以后会找我', '未知', '', '2025-05-25 17:12:07', 1, '2025-05-25 17:12:06', '2025-05-25 17:12:07', 'Normal', 0);
INSERT INTO `customers` VALUES (22, '张飞13710408188', 'WeChat', '说客户有意向来，但是一直停滞不前，催催应该有戏', '外贸公司', '', '2025-05-25 17:12:51', 1, '2025-05-25 17:12:50', '2025-05-25 17:12:51', 'Normal', 0);
INSERT INTO `customers` VALUES (23, '蛙哇 2025.5.15', 'WeChat', '沟通了大概的价格，还在等客户反馈，印象不深，但是有机会', '俄罗斯', '', '2025-05-25 17:13:30', 1, '2025-05-25 17:13:29', '2025-05-25 17:13:30', 'Normal', 0);
INSERT INTO `customers` VALUES (24, 'AMASIYA', 'WeChat', '可以沟通了，上次聊了一下，应该还有戏', '非洲', '', '2025-05-25 17:15:43', 1, '2025-05-25 17:15:40', '2025-05-25 17:15:43', 'Normal', 0);
INSERT INTO `customers` VALUES (25, 'Christine', 'WeChat', '说在忙，已经发了很多给他， 但是回复少，意向一般般，但有机会', '外贸公司', '', '2025-05-25 17:16:22', 1, '2025-05-25 17:16:21', '2025-05-25 17:16:22', 'Normal', 0);
INSERT INTO `customers` VALUES (26, 'Maga', 'WeChat', '给客人写了个报价，后面就没有了，没有谈论太对', '中东', '', '2025-05-25 17:16:58', 1, '2025-05-25 17:16:57', '2025-05-25 17:16:58', 'Normal', 0);
INSERT INTO `customers` VALUES (27, 'Aria-Solar inverter VFD', 'WeChat', '要晶科的板子', '外贸公司', '', '2025-05-25 17:17:36', 1, '2025-05-25 17:17:35', '2025-05-25 17:17:36', 'Normal', 0);
INSERT INTO `customers` VALUES (28, 'ALI', 'WeChat', '好不容易麻烦了王威哥，这个争取一下', '沙特', '', '2025-05-25 17:18:54', 1, '2025-05-25 17:18:52', '2025-05-25 17:18:54', 'Important', 0);
INSERT INTO `customers` VALUES (29, 'CHAI LIFANG', 'WeChat', '这个客户看了很多家，跟他们的外贸公司聊天，追问追问可以聊', '南美', '', '2025-05-25 17:19:47', 1, '2025-05-25 17:19:46', '2025-05-25 17:19:47', 'Normal', 0);
INSERT INTO `customers` VALUES (30, 'Bharat', 'WeChat', '想要一套系统', '巴拿马', '110v电压', '2025-05-25 17:20:47', 1, '2025-05-25 17:20:45', '2025-05-25 17:20:47', 'Normal', 0);
INSERT INTO `customers` VALUES (31, 'Zhou Pro', 'WeChat', '已经下单了合同，2025.5.26需要查看一下合同然后进行沟通下单', '汤加', '', '2025-05-26 09:55:05', 1, '2025-05-26 09:55:03', '2025-05-26 09:55:05', 'VeryImportant', 0);
INSERT INTO `customers` VALUES (32, '李晓慧', 'WeChat', '已经联系了很久，有机会下单的', '朝鲜', '', '2025-05-26 10:00:41', 1, '2025-05-26 10:00:40', '2025-05-26 10:00:41', 'Important', 0);
INSERT INTO `customers` VALUES (33, 'Paul', 'WhatsApp', '第一次就是来进行介绍吧', '刚果金', '想要我们进行合资', '2025-05-26 10:04:08', 1, '2025-05-26 10:04:07', '2025-05-26 10:04:08', 'VeryImportant', 0);
INSERT INTO `customers` VALUES (34, '扎女孩的小辫💖', 'WeChat', '已经有过几次沟通，应该是有机会的', '南美', '广州狮威公司', '2025-05-26 10:07:41', 1, '2025-05-26 10:07:40', '2025-05-26 10:07:41', 'Important', 0);
INSERT INTO `customers` VALUES (35, 'Dilman D.O.S', 'WeChat', '有过一次合作，在5月19日完成交货', '未知', '', '2025-05-26 10:15:09', 1, '2025-05-26 10:15:08', '2025-05-26 10:15:09', 'Normal', 0);
INSERT INTO `customers` VALUES (36, 'Asif Sultani 思福 (Khan Trades)', 'WeChat', '445w全黑框组件，0.66RMB/w 有货，我们实标。\n上面的大概率是虚标的组件', '挪威', '', '2025-05-26 14:18:04', 1, '2025-05-26 14:18:03', '2025-05-26 14:18:04', 'Normal', 0);
INSERT INTO `customers` VALUES (37, 'Asif Sultani 思福 (Khan Trades) ', 'WeChat', '要黑框440 ，联系了有两三次', '挪威', '', '2025-05-28 09:44:46', 1, '2025-05-28 09:44:45', '2025-05-28 09:44:46', 'Normal', 0);
INSERT INTO `customers` VALUES (38, 'Umesh Sah📷萨欧🏇', 'WeChat', '要逆变器和电池，都要古瑞瓦特的', '尼泊尔', '', '2025-05-28 09:45:12', 1, '2025-05-28 09:45:11', '2025-05-28 09:45:12', 'Normal', 0);
INSERT INTO `customers` VALUES (39, '测试', 'WeChat', '测试', '中国', '', '2025-05-29 11:33:36', 1, '2025-05-29 02:12:12', '2025-05-29 11:37:05', 'Normal', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `last_login` timestamp(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'simple', '2960047723@qq.com', '$2b$10$CoeOhy48AjPm9LHlO9RkfORQ9lSTl1SRYGfqoBqCYOY51VqV1JfQu', '2025-05-24 17:45:38', '2025-05-29 11:26:05');
INSERT INTO `users` VALUES (2, '小财迷', '3420322452@qq.com', '$2b$10$I58zz/E8fPJlXa3VQXvOu.Q5dRsLm9hQhOMuR2kYQXXfptZUvNciO', '2025-05-25 18:10:06', NULL);

SET FOREIGN_KEY_CHECKS = 1;
