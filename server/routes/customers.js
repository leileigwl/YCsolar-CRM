const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

// 所有路由都需要认证
router.use(auth);

// @route   GET api/customers
// @desc    获取所有客户
// @access  Private
router.get('/', customerController.getAllCustomers);

// @route   GET api/customers/search
// @desc    搜索客户
// @access  Private
router.get('/search', customerController.searchCustomers);

// @route   GET api/customers/:id
// @desc    获取单个客户
// @access  Private
router.get('/:id', customerController.getCustomerById);

// @route   POST api/customers
// @desc    创建客户
// @access  Private
router.post('/', customerController.createCustomer);

// @route   PUT api/customers/:id
// @desc    更新客户
// @access  Private
router.put('/:id', customerController.updateCustomer);

// @route   DELETE api/customers/:id
// @desc    删除客户
// @access  Private
router.delete('/:id', customerController.deleteCustomer);

// @route   PUT api/customers/:id/contact
// @desc    更新客户最后联系时间
// @access  Private
router.put('/:id/contact', customerController.updateLastContactTime);

module.exports = router; 