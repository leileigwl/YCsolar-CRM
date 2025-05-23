const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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

module.exports = router; 