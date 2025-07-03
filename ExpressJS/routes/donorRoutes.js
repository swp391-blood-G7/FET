const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');
const { protect } = require('../middleware/authMiddleware');

// Danh sách người hiến máu
router.get('/', donorController.listDonors);

// Tạo người hiến máu mới
router.post('/people/create', donorController.createDonor);

// Lấy lịch sử hiến máu của chính mình (đặt trước /:donor_id/history)
router.get('/my/history', protect, donorController.getMyHistory);

// Lấy thông tin donor của chính mình
router.get('/my/info', protect, donorController.getMyDonorInfo);

// Tìm kiếm người hiến máu (đặt trước các route có :donor_id)
router.get('/search/all', donorController.searchDonors);

// Lấy lịch sử hiến máu theo donor_id
router.get('/:donor_id/history', donorController.getHistory);

// Lấy nhắc nhở hiến máu theo donor_id
router.get('/:donor_id/reminders', donorController.getReminders);

// Sửa thông tin người hiến máu
router.put('/:donor_id', donorController.editDonor);

// Cập nhật trạng thái người hiến máu
router.patch('/:donor_id/status', donorController.updateStatus);

// Xóa người hiến máu
router.delete('/:donor_id', donorController.deleteDonor);

module.exports = router;
