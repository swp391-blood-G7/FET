const { sql, poolConnect } = require('./db');

// Tạo yêu cầu máu mới
exports.createRequest = async ({ recipient_id, component_id, quantity, blood_group_id }) => {
  const pool = await poolConnect;

  // Nếu không truyền blood_group_id, lấy từ bảng Recipients
  let bgId = blood_group_id;
  if (!bgId) {
    const result = await pool.request()
      .input('recipient_id', sql.Int, recipient_id)
      .query(`SELECT blood_group_id FROM Recipients WHERE recipient_id = @recipient_id`);

    if (!result.recordset[0]) {
      throw new Error('Recipient not found or missing blood group');
    }

    bgId = result.recordset[0].blood_group_id;
  }

  await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .input('blood_group_id', sql.Int, bgId)
    .input('component_id', sql.Int, component_id)
    .input('quantity', sql.Int, quantity)
    .query(`
      INSERT INTO BloodRequests (recipient_id, blood_group_id, component_id, quantity)
      VALUES (@recipient_id, @blood_group_id, @component_id, @quantity)
    `);
};

// Lấy danh sách các yêu cầu máu đang chờ xử lý
exports.getPendingRequests = async () => {
  const pool = await poolConnect;
  const result = await pool.request()
    .query(`
      SELECT br.*, u.full_name AS recipient_name
      FROM BloodRequests br
      JOIN Recipients r ON br.recipient_id = r.recipient_id
      JOIN Users u ON r.user_id = u.user_id
      WHERE br.status = 'pending'
    `);
  return result.recordset;
};

// Cấp phát máu cho yêu cầu
exports.issueBlood = async ({ request_id, blood_bag_id, issued_by }) => {
  const pool = await poolConnect;
  await pool.request()
    .input('request_id', sql.Int, request_id)
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .input('issued_by', sql.Int, issued_by)
    .query(`
      INSERT INTO BloodIssuance (request_id, blood_bag_id, issued_by)
      VALUES (@request_id, @blood_bag_id, @issued_by);

      UPDATE BloodRequests SET status = 'fulfilled' WHERE request_id = @request_id;
      UPDATE BloodBags SET status = 'used' WHERE blood_bag_id = @blood_bag_id;
    `);
};

// Sửa yêu cầu cấp máu
exports.updateRequest = async (request_id, data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('request_id', sql.Int, request_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .input('component_id', sql.Int, data.component_id)
    .input('quantity', sql.Int, data.quantity)
    .query(`
      UPDATE BloodRequests
      SET blood_group_id = @blood_group_id,
          component_id = @component_id,
          quantity = @quantity
      WHERE request_id = @request_id
    `);
};

// Cập nhật trạng thái yêu cầu máu
exports.updateStatus = async (request_id, status) => {
  const pool = await poolConnect;
  await pool.request()
    .input('request_id', sql.Int, request_id)
    .input('status', sql.VarChar, status)
    .query(`
      UPDATE BloodRequests
      SET status = @status
      WHERE request_id = @request_id
    `);
};

// Xóa yêu cầu máu
exports.deleteRequest = async (request_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('request_id', sql.Int, request_id)
    .query(`DELETE FROM BloodRequests WHERE request_id = @request_id`);
};

// Tìm kiếm yêu cầu máu
exports.searchRequests = async (keyword) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('keyword', sql.NVarChar, `%${keyword}%`)
    .query(`
      SELECT br.*, u.full_name AS recipient_name
      FROM BloodRequests br
      JOIN Recipients r ON br.recipient_id = r.recipient_id
      JOIN Users u ON r.user_id = u.user_id
      WHERE u.full_name LIKE @keyword
         OR br.status LIKE @keyword
    `);
  return result.recordset;
};

// Lấy yêu cầu máu của chính user (theo user_id)
exports.getMyRequests = async (user_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT br.*
      FROM BloodRequests br
      JOIN Recipients r ON br.recipient_id = r.recipient_id
      WHERE r.user_id = @user_id
    `);
  return result.recordset;
};
