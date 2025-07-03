const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', requestController.createRequest);
router.get('/pending', requestController.listPending);
router.post('/issue', requestController.issueBlood);
//Lấy yêu cầu máu của chính mình
router.get('/my', protect, requestController.getMyRequests);

// Sửa yêu cầu cấp máu
router.put('/:request_id', requestController.editRequest);

// Cập nhật trạng thái yêu cầu máu
router.patch('/:request_id/status', requestController.updateStatus);

// Xóa yêu cầu máu
router.delete('/:request_id', requestController.deleteRequest);

// Tìm kiếm yêu cầu máu
router.get('/search/all', requestController.searchRequests);

module.exports = router;
