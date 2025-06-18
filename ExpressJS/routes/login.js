const express = require('express');
const router = express.Router();
const loginController = require('../controller/login');
const sql = require('../config/db'); // hoặc '../db' nếu file bạn tên là db.js

router.post('/login', loginController.login);

exports.login = (req, res) => {
  const { email, password_hash } = req.body;
  const query = 'SELECT * FROM users WHERE email = ? AND password_hash = ?';
  sql.query(query, [email, password_hash], (err, results) => {
    if (err) {
      console.error('Lỗi SQL:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
    if (results.length > 0) {
      // Đăng nhập thành công
      res.json({ success: true, full_name: results[0].full_name, role: results[0].role });
    } else {
      // Sai tài khoản hoặc mật khẩu
      res.json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
  });
};

module.exports = router