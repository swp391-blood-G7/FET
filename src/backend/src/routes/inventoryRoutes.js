// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory
router.get('/', inventoryController.getInventory);

module.exports = router;
