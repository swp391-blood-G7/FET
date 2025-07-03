const { sql, poolConnect } = require('./db');

// Tạo user mới
exports.createUser = async (user) => {
  const pool = await poolConnect;
  await pool.request()
    .input('username', sql.VarChar, user.username)
    .input('password_hash', sql.VarChar, user.password_hash)
    .input('full_name', sql.VarChar, user.full_name)
    .input('email', sql.VarChar, user.email)
    .input('phone', sql.VarChar, user.phone || null)
    .input('gender', sql.VarChar, user.gender || null)
    .input('date_of_birth', sql.Date, user.date_of_birth || null)
    .input('address', sql.Text, user.address || null)
    .input('role', sql.VarChar, user.role)
    .input('status', sql.VarChar, user.status || 'active')
    .input('verify_token', sql.NVarChar, user.verify_token || null)
    .input('is_verified', sql.Bit, user.is_verified || 0)
    .query(`
      INSERT INTO Users (
        username, password_hash, full_name, email, phone, gender, date_of_birth, address, role, status, verify_token, is_verified
      )
      VALUES (
        @username, @password_hash, @full_name, @email, @phone, @gender, @date_of_birth, @address, @role, @status, @verify_token, @is_verified
      )
    `);
};
// Tìm user theo username hoặc email
exports.getUserByUsernameOrEmail = async (username, email) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .input('email', sql.VarChar, email)
    .query(`
      SELECT * FROM Users 
      WHERE username = @username OR email = @email
    `);
  return result.recordset[0]; // nếu cần tất cả thì return result.recordset
};


// Lấy user theo username
exports.getUserByUsername = async (username) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username');
  return result.recordset[0];
};

// Lấy user theo email
exports.getUserByEmail = async (email) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('email', sql.VarChar, email)
    .query('SELECT * FROM Users WHERE email = @email');
  return result.recordset[0];
};

// Lấy user theo user_id
exports.getUserById = async (user_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT user_id, username, password_hash, full_name, email, phone, gender, date_of_birth, address, role, status, created_at, verify_token, is_verified
      FROM Users WHERE user_id = @user_id
    `);
  return result.recordset[0];
};


// Cập nhật thông tin người dùng (không cập nhật role, status, created_at, verify_token, is_verified)
exports.updateUserInfo = async (user_id, data) => {
  const pool = await poolConnect;
  let fields = [];
  const request = pool.request();
  request.input('user_id', sql.Int, user_id);

  if (data.full_name !== undefined) {
    fields.push('full_name = @full_name');
    request.input('full_name', sql.VarChar, data.full_name);
  }
  if (data.email !== undefined) {
    fields.push('email = @email');
    request.input('email', sql.VarChar, data.email);
  }
  if (data.phone !== undefined) {
    fields.push('phone = @phone');
    request.input('phone', sql.VarChar, data.phone);
  }
  if (data.gender !== undefined) {
    fields.push('gender = @gender');
    request.input('gender', sql.VarChar, data.gender);
  }
  if (data.date_of_birth !== undefined) {
    fields.push('date_of_birth = @date_of_birth');
    request.input('date_of_birth', sql.Date, data.date_of_birth);
  }
  if (data.address !== undefined) {
    fields.push('address = @address');
    request.input('address', sql.Text, data.address);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  const sqlQuery = `
    UPDATE Users
    SET ${fields.join(', ')}
    WHERE user_id = @user_id
  `;

  await request.query(sqlQuery);
};

// Đổi mật khẩu
exports.updatePassword = async (user_id, password_hash) => {
  const pool = await poolConnect;
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('password_hash', sql.VarChar, password_hash)
    .query(`
      UPDATE Users
      SET password_hash = @password_hash
      WHERE user_id = @user_id
    `);
};

// Cập nhật trạng thái tài khoản (active/inactive)
exports.updateStatus = async (user_id, status) => {
  const pool = await poolConnect;
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('status', sql.VarChar, status)
    .query(`
      UPDATE Users
      SET status = @status
      WHERE user_id = @user_id
    `);
};

// Xác thực email( chưa làm được)
exports.verifyUser = async (user_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      UPDATE Users
      SET is_verified = 1, verify_token = NULL
      WHERE user_id = @user_id
    `);
};
