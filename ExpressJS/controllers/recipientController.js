// controllers/recipientController.js
const recipientModel = require('../models/recipientModel');

// Đăng ký nhận máu mới
exports.registerRecipient = async (req, res) => {
  try {
    console.log('=== REGISTER RECIPIENT START ===');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    console.log('Authorization header:', req.headers.authorization);
    
    if (!req.user || !req.user.userId) {
      console.error('User not authenticated properly');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user_id = req.user.userId;
    const { blood_group_id, medical_condition } = req.body;
    
    console.log('Extracted user_id:', user_id);
    console.log('Blood group ID:', blood_group_id);
    console.log('Medical condition:', medical_condition);

    if (!medical_condition || !medical_condition.trim()) {
      return res.status(400).json({ message: 'Thông tin tiền sử bệnh là bắt buộc' });
    }

    // Cho phép đăng ký nhiều lần - không kiểm tra duplicate nữa
    // const existingRecipient = await recipientModel.getRecipientByUserId(user_id);
    // if (existingRecipient) {
    //   return res.status(400).json({ message: 'Bạn đã đăng ký nhận máu trước đó' });
    // }

    const recipientData = {
      user_id,
      blood_group_id: blood_group_id ? parseInt(blood_group_id) : null,
      medical_condition: medical_condition.trim()
      // Bỏ receive_status để database tự động sử dụng default value
    };

    console.log('Recipient data to insert:', recipientData);

    const result = await recipientModel.createRecipient(recipientData);
    console.log('Create recipient result:', result);
    
    // Lấy thông tin recipient vừa tạo để trả về
    const newRecipient = await recipientModel.getRecipientById(result.recipient_id);
    console.log('New recipient data:', newRecipient);
    
    console.log('=== REGISTER RECIPIENT SUCCESS ===');
    res.status(201).json({ 
      message: 'Đăng ký nhận máu thành công',
      recipient: newRecipient
    });
  } catch (error) {
    console.error('=== REGISTER RECIPIENT ERROR ===');
    console.error('Error in register recipient:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific database errors
    if (error.message && error.message.includes('duplicate')) {
      return res.status(400).json({ message: 'Bạn đã đăng ký nhận máu trước đó' });
    }
    
    res.status(500).json({ message: 'Lỗi server khi đăng ký nhận máu', error: error.message });
  }
};

// Lấy danh sách tất cả người nhận máu
exports.getAllRecipients = async (req, res) => {
  try {
    const recipients = await recipientModel.getAllRecipients();
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin người nhận máu theo recipient_id
exports.getRecipientById = async (req, res) => {
  try {
    const recipient = await recipientModel.getRecipientById(req.params.id);
    if (!recipient) return res.status(404).json({ error: 'Không tìm thấy người nhận máu' });
    res.json(recipient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin người nhận máu của chính mình - Trả về tất cả đăng ký
exports.getMyRecipientInfo = async (req, res) => {
  try {
    // Kiểm tra xem user có được xác thực không
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const recipients = await recipientModel.getRecipientByUserId(req.user.userId);
    if (!recipients || recipients.length === 0) {
      return res.status(404).json({ error: 'Bạn chưa đăng ký nhận máu nào' });
    }
    res.json(recipients); // Trả về array
  } catch (err) {
    console.error('Error in getMyRecipientInfo:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy thông tin người nhận máu theo user_id
exports.getRecipientByUserId = async (req, res) => {
  try {
    const recipient = await recipientModel.getRecipientByUserId(req.params.user_id);
    if (!recipient) return res.status(404).json({ error: 'Không tìm thấy người nhận máu' });
    res.json(recipient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin người nhận máu
exports.updateRecipient = async (req, res) => {
  try {
    await recipientModel.updateRecipient(req.params.id, req.body);
    res.json({ message: 'Cập nhật thông tin người nhận máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái nhận máu
exports.updateReceiveStatus = async (req, res) => {
  try {
    await recipientModel.updateReceiveStatus(req.params.id, req.body.receive_status);
    res.json({ message: 'Cập nhật trạng thái nhận máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa người nhận máu
exports.deleteRecipient = async (req, res) => {
  try {
    await recipientModel.deleteRecipient(req.params.id);
    res.json({ message: 'Xóa người nhận máu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
