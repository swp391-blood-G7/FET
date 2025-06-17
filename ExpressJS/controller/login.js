const { sql, config } = require('../config/db');

exports.login = async (req, res) => {
  const { email, password_hash } = req.body;
  try {
    // Kết nối tới SQL Server
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password_hash', sql.VarChar, password_hash)
      .query('SELECT * FROM users WHERE email = @email AND password_hash = @password_hash');

    if (result.recordset.length > 0) {
      res.json({ success: true, full_name: result.recordset[0].full_name, role: result.recordset[0].role });
    } else {
      res.json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi SQL:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};