const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Lấy danh sách người hiến
router.get('/', donorController.listDonors);

// Tạo người hiến mới
router.post('/', donorController.createDonor);

// Lịch sử hiến máu theo donor_id
router.get('/:donor_id/history', donorController.getHistory);

// Lấy nhắc nhở cho người hiến
router.get('/:donor_id/reminders', donorController.getReminders);

module.exports = router;
