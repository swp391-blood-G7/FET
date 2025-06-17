const express = require('express');
const { getAppointments } = require('../controller/appointmentController.js');

const router = express.Router();

router.get('/appointments', getAppointments);

module.exports = router;
