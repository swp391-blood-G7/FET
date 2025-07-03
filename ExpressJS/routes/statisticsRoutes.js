const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect } = require('../middleware/authMiddleware');

// Thống kê tổng hợp
router.get('/blood', protect, statisticsController.bloodStats);
router.get('/donors', protect, statisticsController.donorStats);
router.get('/requests', protect, statisticsController.requestStats);
router.get('/appointments', protect, statisticsController.appointmentStats);

// Báo cáo theo ngày/tháng/năm
// Ví dụ: /api/statistics/report?type=donation&from=2024-01-01&to=2024-12-31
router.get('/report', protect, statisticsController.report);

module.exports = router;