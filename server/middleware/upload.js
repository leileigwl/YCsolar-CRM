const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 尝试修复文件名编码问题
const fixChineseFilename = (filename) => {
  // 检测编码问题，尝试恢复原始文件名
  try {
    if (!filename) {
      return '未命名文件';
    }
    
    // 尝试检测并修复常见的中文乱码模式
    if (/å|æ|ç|è|é|ê|ë|ì|í|î|ï/.test(filename)) {
      console.log('检测到损坏的中文文件名，尝试修复:', filename);
      
      // 尝试从损坏的UTF-8重新编码为正确的中文
      // 这是一个常见的Latin1误解UTF-8的修复方法
      try {
        // 将错误编码的字符串转换回正确的UTF-8
        // 1. 先转为Latin1字节序列
        const latin1Buffer = Buffer.from(filename, 'latin1');
        // 2. 将Latin1字节重新解释为UTF-8
        return latin1Buffer.toString('utf8');
      } catch (e) {
        console.error('文件名重编码失败:', e);
      }
    }
    
    // 返回原始文件名
    return filename;
  } catch (e) {
    console.error('修复文件名失败:', e);
    return filename || '未命名文件';
  }
};

// 设置存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    try {
      // 检测并修复中文文件名
      const originalname = fixChineseFilename(file.originalname);
      
      // 使用时间戳和随机字符串生成唯一文件名
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      
      // 尝试从文件名中提取扩展名
      let ext = '';
      try {
        const fileNameParts = originalname.split('.');
        if (fileNameParts.length > 1) {
          ext = '.' + fileNameParts[fileNameParts.length - 1];
        }
      } catch (e) {
        console.error('解析文件扩展名错误', e);
      }
      
      // 如果扩展名解析失败，尝试从MIME类型获取
      if (!ext && file.mimetype) {
        const mimeToExt = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
          'application/pdf': '.pdf',
          'application/msword': '.doc',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
          'application/vnd.ms-excel': '.xls',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
          'text/plain': '.txt'
        };
        ext = mimeToExt[file.mimetype] || '';
      }
      
      // 创建新文件名
      const newFilename = `file-${timestamp}-${randomString}${ext}`;
      
      // 把原始文件名保存在请求对象中
      if (!req.fileData) req.fileData = {};
      req.fileData[newFilename] = {
        originalName: originalname
      };
      
      console.log(`文件处理: 原始文件名="${originalname}"`);
      console.log(`文件处理: 新文件名="${newFilename}"`);
      
      cb(null, newFilename);
    } catch (err) {
      console.error('文件名处理错误:', err);
      // 出错时使用一个安全的默认文件名
      cb(null, `file-${Date.now()}.unknown`);
    }
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

// 创建上传中间件
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 增加文件大小限制为50MB
});

module.exports = upload; 