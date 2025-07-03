const donorModel = require('../models/donorModel');

// Danh sách người hiến máu
exports.listDonors = async (req, res) => {
  try {
    const donors = await donorModel.getAllDonors();
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo người hiến máu
exports.createDonor = async (req, res) => {
  try {
    await donorModel.createDonor(req.body);
    res.status(201).json({ message: 'Donor created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lịch sử người hiến máu
exports.getHistory = async (req, res) => {
  const { donor_id } = req.params;
  
  try {
    // Validate donor_id
    if (!donor_id || isNaN(donor_id)) {
      return res.status(400).json({ error: 'Invalid donor ID. Must be a valid number.' });
    }

    const history = await donorModel.getDonationHistory(parseInt(donor_id));
    res.json(history);
  } catch (err) {
    console.error('Error in getHistory:', err);
    res.status(500).json({ error: err.message });
  }
};

// Nhắc nhở người hiến máu
exports.getReminders = async (req, res) => {
  const { donor_id } = req.params;
  try {
    const reminders = await donorModel.getReminders(donor_id);
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Sửa thông tin người hiến máu
exports.editDonor = async (req, res) => {
  const { donor_id } = req.params;
  try {
    await donorModel.updateDonor(donor_id, req.body);
    res.json({ message: 'Donor updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái người hiến máu
exports.updateStatus = async (req, res) => {
  const { donor_id } = req.params;
  const { donation_status } = req.body;
  try {
    await donorModel.updateStatus(donor_id, donation_status);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa người hiến máu
exports.deleteDonor = async (req, res) => {
  const { donor_id } = req.params;
  try {
    await donorModel.deleteDonor(donor_id);
    res.json({ message: 'Donor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tìm kiếm người hiến máu
exports.searchDonors = async (req, res) => {
  const { q } = req.query;
  try {
    const donors = await donorModel.searchDonors(q || '');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMyHistory = async (req, res) => {
  try {
    console.log('=== getMyHistory called ===');
    console.log('req.user:', req.user);
    
    // Kiểm tra xem user có được xác thực không
    if (!req.user || !req.user.userId) {
      console.log('User not authenticated');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate userId là số hợp lệ
    const userId = parseInt(req.user.userId);
    console.log('userId parsed:', userId);
    
    if (isNaN(userId)) {
      console.log('Invalid user ID');
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    console.log('Calling getMyDonationHistory with userId:', userId);
    const history = await donorModel.getMyDonationHistory(userId);
    console.log('History result:', history);
    
    res.json(history);
  } catch (err) {
    console.error('Error in getMyHistory:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin donor của chính mình
exports.getMyDonorInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const donor = await donorModel.getMyDonorInfo(req.user.userId);
    if (!donor) {
      return res.status(404).json({ error: 'Bạn chưa đăng ký làm người hiến máu' });
    }
    res.json(donor);
  } catch (err) {
    console.error('Error in getMyDonorInfo:', err);
    res.status(500).json({ error: err.message });
  }
};

// lấy yêu cầu máu của chính user (theo user_id)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await requestModel.getMyRequests(req.user.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// lấy lịch hẹn của chính user (theo user_id)
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getMyAppointments(req.user.userId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
