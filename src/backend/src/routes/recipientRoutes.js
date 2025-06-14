// routes/recipientRoutes.js
const express = require('express');
const router = express.Router();
const recipientController = require('../controllers/recipientController');

// POST /api/recipients
router.post('/', recipientController.createRecipient);

module.exports = router;
