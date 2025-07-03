// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory/blood-groups - Lấy danh sách nhóm máu
router.get('/blood-groups', inventoryController.getBloodGroups);

// GET /api/inventory
router.get('/', inventoryController.getInventory);

module.exports = router;
