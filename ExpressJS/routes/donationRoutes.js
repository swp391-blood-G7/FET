const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/record', donationController.recordDonation);

module.exports = router;
