const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, restrictToAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Chỉ admin mới được tạo staff
router.post('/create-staff', protect, restrictToAdmin, authController.createStaff);

// Xem thông tin tài khoản của chính mình
router.get('/me', protect, authController.getMe);
// Cập nhật thông tin tài khoản của chính mình
router.put('/me/update', protect, authController.updateMe);
// Cập nhật mật khẩu của chính mình
router.put('/me/password', protect, authController.updatePassword);

module.exports = router;
