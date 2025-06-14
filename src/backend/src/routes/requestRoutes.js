const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/create', requestController.createRequest);
router.get('/pending', requestController.listPending);
router.post('/issue', requestController.issueBlood);

module.exports = router;
