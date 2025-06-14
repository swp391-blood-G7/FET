const donorModel = require('../models/donorModel');

exports.listDonors = async (req, res) => {
  try {
    const donors = await donorModel.getAllDonors();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDonor = async (req, res) => {
  try {
    await donorModel.createDonor(req.body);
    res.status(201).json({ message: 'Donor created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const { donor_id } = req.params;
  try {
    const history = await donorModel.getDonationHistory(donor_id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReminders = async (req, res) => {
  const { donor_id } = req.params;
  try {
    const reminders = await donorModel.getReminders(donor_id);
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
