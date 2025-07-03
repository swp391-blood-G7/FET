const { sql, poolConnect } = require('./db');

// Tạo người nhận máu mới - cho phép multiple registrations
exports.createRecipient = async (data) => {
  console.log('=== MODEL: Creating recipient ===');
  console.log('Input data:', data);
  
  const pool = await poolConnect;
  
  try {
    console.log('Database connection established');
    
    const result = await pool.request()
      .input('user_id', sql.Int, data.user_id)
      .input('blood_group_id', sql.Int, data.blood_group_id) // Sẽ tự động xử lý null
      .input('medical_condition', sql.Text, data.medical_condition)
      .query(`
        INSERT INTO Recipients (user_id, blood_group_id, medical_condition, registration_date)
        VALUES (@user_id, @blood_group_id, @medical_condition, GETDATE());
        SELECT SCOPE_IDENTITY() AS recipient_id;
      `);
    
    console.log('Database query result:', result);
    console.log('Generated recipient_id:', result.recordset[0].recipient_id);
    
    return { recipient_id: result.recordset[0].recipient_id };
  } catch (error) {
    console.error('=== MODEL ERROR ===');
    console.error('Database error in createRecipient:', error);
    console.error('Error code:', error.code);
    console.error('Error number:', error.number);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Lấy danh sách tất cả người nhận máu
exports.getAllRecipients = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT r.recipient_id, r.user_id, r.blood_group_id, r.medical_condition,
           r.receive_status, r.registration_date,
           u.full_name, u.email,
           bg.blood_type, bg.rh_factor
    FROM Recipients r
    JOIN Users u ON r.user_id = u.user_id
    LEFT JOIN BloodGroups bg ON r.blood_group_id = bg.blood_group_id
  `);
  return result.recordset;
};

// Lấy thông tin người nhận máu theo recipient_id
exports.getRecipientById = async (recipient_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .query(`
      SELECT r.recipient_id, r.user_id, r.blood_group_id, r.medical_condition,
             r.receive_status, r.registration_date,
             u.full_name, u.email,
             bg.blood_type, bg.rh_factor
      FROM Recipients r
      JOIN Users u ON r.user_id = u.user_id
      LEFT JOIN BloodGroups bg ON r.blood_group_id = bg.blood_group_id
      WHERE r.recipient_id = @recipient_id
    `);
  return result.recordset[0];
};

// Lấy thông tin người nhận máu theo user_id - Trả về tất cả đăng ký
exports.getRecipientByUserId = async (user_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT r.recipient_id, r.user_id, r.blood_group_id, r.medical_condition,
             r.receive_status, r.registration_date,
             u.full_name, u.email,
             bg.blood_type, bg.rh_factor
      FROM Recipients r
      JOIN Users u ON r.user_id = u.user_id
      LEFT JOIN BloodGroups bg ON r.blood_group_id = bg.blood_group_id
      WHERE r.user_id = @user_id
      ORDER BY r.registration_date DESC
    `);
  return result.recordset; // Trả về array thay vì single object
};

// Cập nhật thông tin người nhận máu
exports.updateRecipient = async (recipient_id, data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .input('medical_condition', sql.Text, data.medical_condition)
    .query(`
      UPDATE Recipients
      SET blood_group_id = @blood_group_id,
          medical_condition = @medical_condition
      WHERE recipient_id = @recipient_id
    `);
};

// Cập nhật trạng thái nhận máu
exports.updateReceiveStatus = async (recipient_id, receive_status) => {
  const pool = await poolConnect;
  await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .input('receive_status', sql.VarChar, receive_status)
    .query(`
      UPDATE Recipients
      SET receive_status = @receive_status
      WHERE recipient_id = @recipient_id
    `);
};

// Xóa người nhận máu
exports.deleteRecipient = async (recipient_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .query(`
      DELETE FROM Recipients WHERE recipient_id = @recipient_id
    `);
};
