// controllers/eligibilityController.js
const eligibilityModel = require('../models/eligibilityModel');

exports.checkEligibility = async (req, res) => {
  const { donor_id, date } = req.query;
  try {
    const result = await eligibilityModel.checkEligibility(donor_id, date);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
