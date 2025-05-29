const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

// 所有路由都需要认证
router.use(auth);

// @route   GET api/communications/customer/:customerId
// @desc    获取客户的所有沟通记录
// @access  Private
router.get('/customer/:customerId', communicationController.getCustomerCommunications);

// @route   GET api/communications/search
// @desc    搜索沟通记录
// @access  Private
router.get('/search', communicationController.searchCommunications);

// @route   GET api/communications/:id
// @desc    获取单个沟通记录
// @access  Private
router.get('/:id', communicationController.getCommunicationById);

// @route   POST api/communications
// @desc    创建沟通记录
// @access  Private
router.post('/', upload.array('attachments', 5), communicationController.createCommunication);

// @route   PUT api/communications/:id
// @desc    更新沟通记录
// @access  Private
router.put('/:id', communicationController.updateCommunication);

// @route   DELETE api/communications/:id
// @desc    删除沟通记录
// @access  Private
router.delete('/:id', communicationController.deleteCommunication);

// @route   POST api/communications/:id/attachments
// @desc    添加附件到沟通记录
// @access  Private
router.post('/:id/attachments', upload.single('attachment'), communicationController.addAttachment);

// @route   DELETE api/communications/:id/attachments/:attachmentId
// @desc    删除附件
// @access  Private
router.delete('/:id/attachments/:attachmentId', communicationController.deleteAttachment);

// 测试文件上传编码
router.post('/test-upload', upload.single('attachment'), (req, res) => {
  console.log('测试文件上传编码');
  console.log('原始文件名：', req.file.originalname);
  
  // 如果有修复后的文件名，使用修复后的
  let fixedName = req.file.originalname;
  if (req.fileData && req.fileData[path.basename(req.file.path)]) {
    fixedName = req.fileData[path.basename(req.file.path)].originalName;
  }
  
  // 检查编码情况
  console.log('字节缓冲区：', Buffer.from(req.file.originalname).toString('hex'));
  
  try {
    // 尝试不同的编码
    console.log('UTF-8解码：', Buffer.from(req.file.originalname, 'utf8').toString('utf8'));
    console.log('ASCII解码：', Buffer.from(req.file.originalname, 'ascii').toString('utf8'));
    console.log('二进制解码：', Buffer.from(req.file.originalname, 'binary').toString('utf8'));
    console.log('Latin1解码：', Buffer.from(req.file.originalname, 'latin1').toString('utf8'));
    console.log('修复后的文件名：', fixedName);
  } catch (e) {
    console.error('解码出错', e);
  }
  
  res.json({ 
    success: true, 
    originalFilename: req.file.originalname,
    fixedFilename: fixedName,
    filePath: req.file.path,
    binaryRepresentation: Array.from(Buffer.from(req.file.originalname)).join(',')
  });
});

module.exports = router; 