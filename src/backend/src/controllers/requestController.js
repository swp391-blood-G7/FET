const requestModel = require('../models/requestModel');

exports.createRequest = async (req, res) => {
  try {
    await requestModel.createRequest(req.body);
    res.status(201).json({ message: 'Request created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listPending = async (req, res) => {
  try {
    const data = await requestModel.getPendingRequests();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.issueBlood = async (req, res) => {
  try {
    await requestModel.issueBlood(req.body);
    res.json({ message: 'Issued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
