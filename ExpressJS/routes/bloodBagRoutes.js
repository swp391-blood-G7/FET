const express = require('express');
const router = express.Router();
const bloodBagController = require('../controllers/bloodBagController');

// Tạo túi máu mới
router.post('/create/bloodbag', bloodBagController.createBloodBag);

// Lấy tất cả túi máu
router.get('/take/bloodbag', bloodBagController.getAllBloodBags);

// Tìm kiếm túi máu
router.get('/search/all', bloodBagController.searchBloodBags);

// Lấy túi máu theo ID
router.get('/:id', bloodBagController.getBloodBagById);

// Cập nhật túi máu
router.put('/:id', bloodBagController.updateBloodBag);

// Xóa túi máu
router.delete('/:id', bloodBagController.deleteBloodBag);


module.exports = router;