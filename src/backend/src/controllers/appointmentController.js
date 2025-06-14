const appointmentModel = require('../models/appointmentModel');

exports.schedule = async (req, res) => {
  const { donor_id, appointment_date } = req.body;
  try {
    await appointmentModel.scheduleAppointment(donor_id, appointment_date);
    res.status(201).json({ message: 'Scheduled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
