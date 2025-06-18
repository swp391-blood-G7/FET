const { sql, config } = require('../config/db');

exports.register = async (req, res) => {
  const { email, password_hash, full_name, username } = req.body;
  const role = 'member'; // Set cứng role mặc định

  try {
    let pool = await sql.connect(config);

    // Kiểm tra email đã tồn tại chưa
    let check = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (check.recordset.length > 0) {
      return res.json({ success: false, message: 'Email đã tồn tại' });
    }

    // Thêm user mới với role = 'member'
    await pool.request()
      .input('email', sql.VarChar, email)
      .input('password_hash', sql.VarChar, password_hash)
      .input('full_name', sql.NVarChar, full_name)
      .input('role', sql.VarChar, role)
      .input('username', sql.VarChar, username)
      .query(`INSERT INTO users (username, password_hash, full_name, email, role) 
              VALUES (@username, @password_hash, @full_name, @email, @role)`);

    res.json({ success: true, message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Lỗi SQL:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};