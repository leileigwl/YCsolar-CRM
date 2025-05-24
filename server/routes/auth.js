const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    注册用户
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    用户登录
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth/me
// @desc    获取当前用户信息
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   PUT api/auth/profile
// @desc    更新用户个人资料
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   PUT api/auth/password
// @desc    修改用户密码
// @access  Private
router.put('/password', auth, authController.changePassword);

module.exports = router; 