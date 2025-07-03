const requestModel = require('../models/requestModel');
// tạo yêu cầu cấp máu mới
exports.createRequest = async (req, res) => {
  try {
    await requestModel.createRequest(req.body);
    res.status(201).json({ message: 'Request created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// lấy danh sách máu chưa được cấp
exports.listPending = async (req, res) => {
  try {
    const data = await requestModel.getPendingRequests();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//cấp máu
exports.issueBlood = async (req, res) => {
  try {
    await requestModel.issueBlood(req.body);
    res.json({ message: 'Issued' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sửa yêu cầu cấp máu
exports.editRequest = async (req, res) => {
  const { request_id } = req.params;
  try {
    await requestModel.updateRequest(request_id, req.body);
    res.json({ message: 'Request updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái yêu cầu máu
exports.updateStatus = async (req, res) => {
  const { request_id } = req.params;
  const { status } = req.body;
  try {
    await requestModel.updateStatus(request_id, status);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa yêu cầu máu
exports.deleteRequest = async (req, res) => {
  const { request_id } = req.params;
  try {
    await requestModel.deleteRequest(request_id);
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm yêu cầu máu
exports.searchRequests = async (req, res) => {
  const { q } = req.query;
  try {
    const requests = await requestModel.searchRequests(q || '');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.user_id; // nếu middleware protect gán user vào req
    const requests = await requestModel.getMyRequests(userId); // hoặc lấy từ DB
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

