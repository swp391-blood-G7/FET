const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();
const crypto = require('crypto');
// đăng ký
exports.register = async (req, res) => {
  const {
    username,
    password,
    full_name,
    email,
    phone,
    gender,
    date_of_birth,
    address
  } = req.body;

  try {
    // Kiểm tra trùng username hoặc email
    const existingUser = await userModel.getUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo verify_token (giả định dùng cho xác thực email)
    const verifyToken = crypto.randomBytes(32).toString('hex');

    // Tạo user mới
    const userId = await userModel.createUser({
      username,
      password_hash: hashedPassword,
      full_name,
      email,
      phone,
      gender,
      date_of_birth,
      address,
      role: 'member',
      verify_token: verifyToken,
      is_verified: false
    });

    // Trả về thành công
    res.status(201).json({
      message: 'Registered successfully',
      userId
    });

    // Optionally: gửi email xác thực bằng verify_token (nếu có service email)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isHashed = user.password_hash.startsWith('$2b$') || user.password_hash.startsWith('$2a$');
    let isValid = false;

    if (isHashed) {
      isValid = await bcrypt.compare(password, user.password_hash);
    } else {
      isValid = password === user.password_hash;
    }

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
  { userId: user.user_id, role: user.role, full_name: user.full_name, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// đăng ký nhân viên
exports.createStaff = async (req, res) => {
  const { username, password, full_name, email, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser({
      username,
      password_hash: hashedPassword,
      full_name,
      email,
      phone,
      role: 'staff'
    });
    res.status(201).json({ message: 'Staff account created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Xem thông tin tài khoản của chính mình
exports.getMe = async (req, res) => {
  try {
    // req.user được gán từ middleware protect
    const user = await userModel.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// cập nat thông tin tài khoản của chính mình
exports.updateMe = async (req, res) => {
  try {
    await userModel.updateUserInfo(req.user.userId, req.body);
    res.json({ message: 'User info updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// cập nhật mật khẩu
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userModel.getUserById(req.user.userId);

    // 🛡️ Nếu không có user hoặc không có password_hash
    if (!user || !user.password_hash) {
      return res.status(404).json({ message: 'User not found or password missing' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(req.user.userId, newHash);

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Error in updatePassword:', err); // thêm log
    res.status(500).json({ error: err.message });
  }
};
