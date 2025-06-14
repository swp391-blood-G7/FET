const donationModel = require('../models/donationModel');

exports.recordDonation = async (req, res) => {
  const { donor_id, blood_bag_id, donation_date } = req.body;
  try {
    await donationModel.recordDonation({ donor_id, blood_bag_id, donation_date });
    res.status(201).json({ message: 'Donation recorded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
