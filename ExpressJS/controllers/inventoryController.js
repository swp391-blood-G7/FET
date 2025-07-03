// controllers/inventoryController.js
const inventoryModel = require('../models/inventoryModel');

// lấy danh sách các loại máu trong kho
exports.getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.getInventory();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách tất cả nhóm máu
exports.getBloodGroups = async (req, res) => {
  try {
    const bloodGroups = await inventoryModel.getBloodGroups();
    res.json(bloodGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
