const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.post('/schedule', appointmentController.schedule);
router.get('/list', appointmentController.listAppointments);

module.exports = router;
