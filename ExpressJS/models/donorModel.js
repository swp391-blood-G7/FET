const sql = require('mssql');
const { poolConnect } = require('./db');
const { protect } = require('../middleware/authMiddleware');

// Lấy danh sách tất cả người hiến máu
exports.getAllDonors = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT d.*, u.full_name, u.email, bg.blood_type, bg.rh_factor
    FROM Donors d
    JOIN Users u ON d.user_id = u.user_id
    JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
  `);
  return result.recordset;
};

// Tạo người hiến máu mới
exports.createDonor = async (data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('user_id', sql.Int, data.user_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .query(`
      INSERT INTO Donors (user_id, blood_group_id)
      VALUES (@user_id, @blood_group_id)
    `);
};

// Lấy lịch sử hiến máu của người hiến máu
exports.getDonationHistory = async (donor_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`
      SELECT dr.*, bb.blood_group_id, bb.component_id, vt.volume_ml, bb.collection_date
      FROM DonationRecords dr
      JOIN BloodBags bb ON dr.blood_bag_id = bb.blood_bag_id
      JOIN VolumeTypes vt ON bb.volume_type_id = vt.volume_type_id
      WHERE dr.donor_id = @donor_id
    `);
  return result.recordset;
};

// Lấy thông tin donor của user hiện tại
exports.getMyDonorInfo = async (user_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT d.donor_id, d.user_id, d.blood_group_id, d.last_donation_date, d.donation_status,
             u.full_name, u.email, bg.blood_type, bg.rh_factor
      FROM Donors d
      JOIN Users u ON d.user_id = u.user_id
      JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE d.user_id = @user_id
    `);
  return result.recordset[0];
};

// Lấy lịch sử hiến máu của chính user (theo user_id)
exports.getMyDonationHistory = async (user_id) => {
  const pool = await poolConnect;

  // Lấy tất cả các lần đăng ký hiến máu của user, join với lịch hẹn (DonationAppointments)
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT d.donor_id, d.user_id, d.blood_group_id, d.last_donation_date, d.donation_status,
             ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status as appointment_status
      FROM Donors d
      LEFT JOIN DonationAppointments ap ON d.appointment_id = ap.appointment_id
      WHERE d.user_id = @user_id
      ORDER BY ap.appointment_date DESC, ap.appointment_time DESC
    `);
  // Map lại dữ liệu cho frontend dễ dùng, format ngày/giờ rõ ràng
  function formatDate(val) {
    if (!val) return '';
    if (typeof val === 'string') {
      // Nếu là chuỗi yyyy-MM-dd hoặc yyyy-MM-ddTHH:mm:ss, lấy 10 ký tự đầu
      return val.length >= 10 ? val.substring(0, 10) : val;
    }
    if (val instanceof Date) {
      // Nếu là object Date, lấy yyyy-MM-dd
      const y = val.getFullYear();
      const m = (val.getMonth() + 1).toString().padStart(2, '0');
      const d = val.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    return '';
  }
  function formatTime(val) {
    if (!val) return '';
    if (typeof val === 'string') {
      // Nếu là chuỗi kiểu '09:00:00' hoặc '09:00', lấy 5 ký tự đầu
      return val.length >= 5 ? val.substring(0, 5) : val;
    }
    if (val instanceof Date) {
      // Nếu là object Date, lấy giờ và phút (UTC, không cộng thêm giờ)
      const hh = val.getUTCHours().toString().padStart(2, '0');
      const mm = val.getUTCMinutes().toString().padStart(2, '0');
      return `${hh}:${mm}`;
    }
    return '';
  }
  return result.recordset.map(row => ({
    donor_id: row.donor_id,
    blood_group_id: row.blood_group_id,
    last_donation_date: formatDate(row.last_donation_date),
    donation_status: row.donation_status,
    appointment_id: row.appointment_id,
    appointment_date: formatDate(row.appointment_date),
    appointment_time: formatTime(row.appointment_time),
    appointment_time_end: formatTime(row.appointment_time_end),
    appointment_status: row.appointment_status
  }));

};

// Lấy nhắc nhở hiến máu
exports.getReminders = async (donor_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`
      SELECT * FROM DonationReminders WHERE donor_id = @donor_id
    `);
  return result.recordset;
};

// Sửa thông tin người hiến máu
exports.updateDonor = async (donor_id, data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .query(`
      UPDATE Donors
      SET blood_group_id = @blood_group_id
      WHERE donor_id = @donor_id
    `);
};

// Cập nhật trạng thái người hiến máu
exports.updateStatus = async (donor_id, donation_status) => {
  const pool = await poolConnect;
  await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .input('donation_status', sql.VarChar, donation_status)
    .query(`
      UPDATE Donors
      SET donation_status = @donation_status
      WHERE donor_id = @donor_id
    `);
};

// Xóa người hiến máu
exports.deleteDonor = async (donor_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`DELETE FROM Donors WHERE donor_id = @donor_id`);
};

// Tìm kiếm người hiến máu
exports.searchDonors = async (keyword) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('keyword', sql.NVarChar, `%${keyword}%`)
    .query(`
      SELECT d.*, u.full_name, u.email, bg.blood_type, bg.rh_factor
      FROM Donors d
      JOIN Users u ON d.user_id = u.user_id
      JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE u.full_name LIKE @keyword OR bg.blood_type + bg.rh_factor LIKE @keyword
    `);
  return result.recordset;
};

// Đếm tổng số người hiến máu
exports.countAllDonors = async () => {
  const pool = await poolConnect;
  const result = await pool.request()
    .query('SELECT COUNT(*) as total FROM Donors');
  return result.recordset[0].total;
};

// Lấy danh sách người hiến máu theo trang
exports.getDonorsByPage = async (limit, offset) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('limit', sql.Int, limit)
    .input('offset', sql.Int, offset)
    .query(`
      SELECT *
      FROM Donors
      ORDER BY donor_id
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `);
  return result.recordset;
};




