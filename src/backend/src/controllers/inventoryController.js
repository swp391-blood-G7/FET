// controllers/inventoryController.js
const inventoryModel = require('../models/inventoryModel');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.getInventory();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
