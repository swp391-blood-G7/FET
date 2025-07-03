// routes/recipientRoutes.js
const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');
const { protect } = require('../middleware/authMiddleware');

// Lấy thông tin người nhận máu của chính mình (protected)
router.get('/my/info', protect, recipientController.getMyRecipientInfo);

// Lấy thông tin người nhận máu theo user_id (protected)
router.get('/user/:user_id', protect, recipientController.getRecipientByUserId);

// Lấy thông tin người nhận máu theo recipient_id
router.get('/:id', recipientController.getRecipientById);

// Đăng ký nhận máu (protected)
router.post('/register', protect, recipientController.registerRecipient);

// Lấy danh sách tất cả người nhận máu
router.get('/', recipientController.getAllRecipients);

// Cập nhật thông tin người nhận máu
router.put('/:id', recipientController.updateRecipient);

// Cập nhật trạng thái nhận máu
router.patch('/:id/status', recipientController.updateReceiveStatus);

// Xóa người nhận máu
router.delete('/:id', recipientController.deleteRecipient);

module.exports = router;
