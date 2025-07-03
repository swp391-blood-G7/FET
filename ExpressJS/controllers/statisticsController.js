const statisticsModel = require('../models/statisticsModel');

exports.bloodStats = async (req, res) => {
  try {
    const data = await statisticsModel.getBloodStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.donorStats = async (req, res) => {
  try {
    const data = await statisticsModel.getDonorStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestStats = async (req, res) => {
  try {
    const data = await statisticsModel.getRequestStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.appointmentStats = async (req, res) => {
  try {
    const data = await statisticsModel.getAppointmentStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.report = async (req, res) => {
  const { type, from, to } = req.query;
  try {
    const data = await statisticsModel.getReport(type, from, to);
    res.json({ type, from, to, total: data.total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};