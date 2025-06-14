// controllers/recipientController.js
const recipientModel = require('../models/recipientModel');

exports.createRecipient = async (req, res) => {
  try {
    await recipientModel.createRecipient(req.body);
    res.status(201).json({ message: 'Recipient created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
