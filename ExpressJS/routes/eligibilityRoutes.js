// routes/eligibilityRoutes.js
const express = require('express');
const router = express.Router();
const eligibilityController = require('../controllers/eligibilityController');

// Example: GET /api/eligibility/check?donor_id=1&date=2025-06-14
router.get('/check', eligibilityController.checkEligibility);

module.exports = router;
