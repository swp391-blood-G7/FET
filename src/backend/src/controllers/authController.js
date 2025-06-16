import { poolPromise, sql } from '../config/db.js';

export const login = async (req, res) => {
  const { email, password_hash } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('password_hash', sql.NVarChar, password_hash)
      .query(`
        SELECT full_name, role FROM dbo.Users
        WHERE email = @email AND password_hash = @password_hash
      `);

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.json({ success: true, full_name: user.full_name, role: user.role });
    } else {
      res.json({ success: false, message: 'Sai email hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi SQL:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
