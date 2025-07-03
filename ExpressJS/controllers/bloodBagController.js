const bloodBagModel = require('../models/bloodBagModel');

// Tạo túi máu mới
exports.createBloodBag = async (req, res) => {
  try {
    await bloodBagModel.createBloodBag(req.body);
    res.status(201).json({ message: 'Tạo túi máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy tất cả túi máu
exports.getAllBloodBags = async (req, res) => {
  try {
    const bags = await bloodBagModel.getAllBloodBags();
    res.json(bags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy túi máu theo ID
exports.getBloodBagById = async (req, res) => {
  try {
    const bag = await bloodBagModel.getBloodBagById(req.params.id);
    if (!bag) return res.status(404).json({ error: 'Không tìm thấy túi máu' });
    res.json(bag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật túi máu
exports.updateBloodBag = async (req, res) => {
  try {
    await bloodBagModel.updateBloodBag(req.params.id, req.body);
    res.json({ message: 'Cập nhật túi máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa túi máu
exports.deleteBloodBag = async (req, res) => {
  try {
    await bloodBagModel.deleteBloodBag(req.params.id);
    res.json({ message: 'Xóa túi máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm túi máu
exports.searchBloodBags = async (req, res) => {
  try {
    const result = await bloodBagModel.searchBloodBags(req.query.q || '');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};