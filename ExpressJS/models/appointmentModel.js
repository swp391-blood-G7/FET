const { sql, poolConnect } = require('./db');

exports.scheduleAppointment = async (appointment_date, appointment_time, appointment_time_end, status = 'available') => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('appointment_date', sql.DateTime, appointment_date)
    .input('appointment_time', sql.Time, appointment_time)
    .input('appointment_time_end', sql.Time, appointment_time_end)
    .input('status', sql.VarChar, status)
    .query(`
      INSERT INTO DonationAppointments (appointment_date, appointment_time, appointment_time_end, status)
      VALUES (@appointment_date, @appointment_time, @appointment_time_end, @status);
      SELECT SCOPE_IDENTITY() as appointment_id;
    `);
  return result.recordset[0].appointment_id;
};

exports.getAllAppointments = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`
    SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
           d.donor_id,
           u.full_name,
           bg.blood_type + bg.rh_factor as blood_group,
           d.last_donation_date as registration_date,
           d.donation_status,
           COUNT(d.donor_id) OVER (PARTITION BY ap.appointment_id) as donor_count
    FROM DonationAppointments ap
    LEFT JOIN Donors d ON ap.appointment_id = d.appointment_id
    LEFT JOIN Users u ON d.user_id = u.user_id
    LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
    ORDER BY ap.appointment_date, ap.appointment_time
  `);
  return rs.recordset;
};

// Sửa lịch hẹn
exports.updateAppointment = async (appointment_id, data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .input('appointment_date', sql.DateTime, data.appointment_date)
    .input('appointment_time', sql.Time, data.appointment_time)
    .input('appointment_time_end', sql.Time, data.appointment_time_end)
    .input('status', sql.VarChar, data.status)
    .query(`
      UPDATE DonationAppointments
      SET appointment_date = @appointment_date,
          appointment_time = @appointment_time,
          appointment_time_end = @appointment_time_end,
          status = @status
      WHERE appointment_id = @appointment_id
    `);
};

// Cập nhật trạng thái lịch hẹn
exports.updateStatus = async (appointment_id, status) => {
  const pool = await poolConnect;
  await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .input('status', sql.VarChar, status)
    .query(`
      UPDATE DonationAppointments
      SET status = @status
      WHERE appointment_id = @appointment_id
    `);
};

// Xóa lịch hẹn
exports.deleteAppointment = async (appointment_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('appointment_id', sql.Int, appointment_id)
    .query(`DELETE FROM DonationAppointments WHERE appointment_id = @appointment_id`);
};

// Tìm kiếm lịch hẹn
exports.searchAppointments = async (keyword) => {
  const pool = await poolConnect;
  const rs = await pool.request()
    .input('keyword', sql.NVarChar, `%${keyword}%`)
    .query(`
      SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
             u.full_name,
             bg.blood_type + bg.rh_factor as blood_group,
             d.last_donation_date as registration_date,
             d.donation_status
      FROM DonationAppointments ap
      LEFT JOIN Donors d ON ap.appointment_id = d.appointment_id
      LEFT JOIN Users u ON d.user_id = u.user_id
      LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE u.full_name LIKE @keyword 
         OR ap.status LIKE @keyword
         OR (bg.blood_type + bg.rh_factor) LIKE @keyword
         OR CAST(ap.appointment_date AS VARCHAR) LIKE @keyword
    `);
  return rs.recordset;
};

// Lấy lịch hẹn của chính user (theo user_id)
exports.getMyAppointments = async (user_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, user_id)
    .query(`
      SELECT ap.*, d.donor_id, d.last_donation_date as registration_date, d.donation_status,
             bg.blood_type + bg.rh_factor as blood_group
      FROM DonationAppointments ap
      JOIN Donors d ON ap.appointment_id = d.appointment_id
      LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE d.user_id = @user_id
      ORDER BY ap.appointment_date DESC, ap.appointment_time DESC
    `);
  return result.recordset;
};
// Tìm kiếm lịch hẹn theo khoảng ngày
exports.getAppointmentsByDateRange = async (fromDate, toDate) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('from', sql.Date, fromDate)
    .input('to', sql.Date, toDate)
    .query(`
      SELECT ap.*
      FROM DonationAppointments ap
      WHERE CAST(ap.appointment_date AS DATE) BETWEEN @from AND @to
      ORDER BY ap.appointment_date, ap.appointment_time
    `);
  return result.recordset;
};

exports.getDonorByUserId = async (userId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`SELECT donor_id FROM Donors WHERE user_id = @user_id`);
  
  return result.recordset[0];
};

// Tạo donor record mới cho mỗi lần đăng ký
exports.createDonorForUser = async (userId, bloodGroupId, appointmentId = null, registrationDate = null) => {
  const pool = await poolConnect;
  
  console.log('createDonorForUser - Debug info:');
  console.log('- userId:', userId);
  console.log('- bloodGroupId:', bloodGroupId);
  console.log('- appointmentId:', appointmentId);
  console.log('- registrationDate:', registrationDate);
  
  // Kiểm tra user có tồn tại không
  const userResult = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`SELECT user_id, full_name FROM Users WHERE user_id = @user_id`);
  
  console.log('- User query result:', userResult.recordset);
  
  if (userResult.recordset.length === 0) {
    throw new Error('User không tồn tại');
  }
  
  // Tạo donor record mới
  const donationDate = registrationDate ? new Date(registrationDate) : new Date();
  
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .input('blood_group_id', sql.Int, bloodGroupId)
    .input('appointment_id', appointmentId ? sql.Int : sql.Int, appointmentId)
    .input('last_donation_date', sql.Date, donationDate)
    .input('donation_status', sql.VarChar, 'scheduled')
    .query(`
      INSERT INTO Donors (user_id, blood_group_id, appointment_id, last_donation_date, donation_status)
      VALUES (@user_id, @blood_group_id, @appointment_id, @last_donation_date, @donation_status);
      SELECT SCOPE_IDENTITY() as donor_id;
    `);
  
  return result.recordset[0].donor_id;
};

// DEPRECATED: Hàm này không còn cần thiết với schema mới
// DonationAppointments không có donor_id nữa
exports.updateAppointmentDonor = async (appointmentId, donorId) => {
  throw new Error('updateAppointmentDonor is deprecated. DonationAppointments table no longer has donor_id column.');
};

exports.getAppointmentById = async (appointmentId) => {
  console.log('Model: Getting appointment with ID:', appointmentId);
  
  const pool = await poolConnect;
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointmentId)
    .query(`
      SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
             d.donor_id,
             d.donation_status,
             u.full_name,
             bg.blood_type + bg.rh_factor as blood_group,
             COUNT(d.donor_id) OVER (PARTITION BY ap.appointment_id) as donor_count
      FROM DonationAppointments ap
      LEFT JOIN Donors d ON ap.appointment_id = d.appointment_id
      LEFT JOIN Users u ON d.user_id = u.user_id
      LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE ap.appointment_id = @appointment_id
    `);
  
  console.log('Model: Query result:', result.recordset);
  
  return result.recordset[0];
};

// Tạo appointment slot đơn giản - chỉ tạo appointment record
exports.createAppointmentSlot = async (appointment_date, appointment_time, appointment_time_end, status = 'available') => {
  const pool = await poolConnect;
  
  const result = await pool.request()
    .input('appointment_date', sql.DateTime, appointment_date)
    .input('appointment_time', sql.Time, appointment_time)
    .input('appointment_time_end', sql.Time, appointment_time_end)
    .input('status', sql.VarChar, status)
    .query(`
      INSERT INTO DonationAppointments (appointment_date, appointment_time, appointment_time_end, status)
      VALUES (@appointment_date, @appointment_time, @appointment_time_end, @status);
      SELECT SCOPE_IDENTITY() as appointment_id;
    `);
  
  return result.recordset[0].appointment_id;
};

// Lấy tất cả appointment slots có sẵn (chưa có ai đăng ký hoặc có thể đăng ký thêm)
exports.getAvailableAppointmentSlots = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
           ISNULL(donor_counts.donor_count, 0) as donor_count,
           'Available for registration' as availability_status
    FROM DonationAppointments ap
    LEFT JOIN (
      SELECT appointment_id, COUNT(*) as donor_count
      FROM Donors 
      WHERE appointment_id IS NOT NULL
      GROUP BY appointment_id
    ) donor_counts ON ap.appointment_id = donor_counts.appointment_id
    WHERE ap.status = 'available'
    ORDER BY ap.appointment_date, ap.appointment_time
  `);
  return result.recordset;
};

// Lấy tất cả appointments đã được đăng ký (có donor thực)
exports.getBookedAppointments = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
           u.full_name,
           bg.blood_type + bg.rh_factor as blood_group,
           d.last_donation_date as registration_date,
           d.donation_status,
           'Booked' as availability_status
    FROM DonationAppointments ap
    INNER JOIN Donors d ON ap.appointment_id = d.appointment_id
    INNER JOIN Users u ON d.user_id = u.user_id
    LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
    ORDER BY ap.appointment_date, ap.appointment_time
  `);
  return result.recordset;
};

// Kiểm tra appointment có thể đăng ký không
exports.getAvailableAppointmentById = async (appointmentId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointmentId)
    .query(`
      SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
             ISNULL(donor_counts.donor_count, 0) as donor_count,
             CASE 
               WHEN ap.status = 'available' THEN 1 
               ELSE 0 
             END as is_available_for_registration
      FROM DonationAppointments ap
      LEFT JOIN (
        SELECT appointment_id, COUNT(*) as donor_count
        FROM Donors 
        WHERE appointment_id = @appointment_id
        GROUP BY appointment_id
      ) donor_counts ON ap.appointment_id = donor_counts.appointment_id
      WHERE ap.appointment_id = @appointment_id
    `);
  
  return result.recordset[0];
};

// Lấy tất cả appointments (cả available và booked) để hiển thị trong schedule
exports.getAllAppointmentSlots = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT ap.appointment_id, ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status,
           ISNULL(donor_info.donor_names, 'Available') as donor_info,
           ISNULL(donor_info.donor_count, 0) as donor_count,
           CASE 
             WHEN ISNULL(donor_info.donor_count, 0) = 0 THEN 'available' 
             ELSE 'booked' 
           END as slot_status
    FROM DonationAppointments ap
    LEFT JOIN (
      SELECT d.appointment_id,
             STRING_AGG(u.full_name + ' (' + bg.blood_type + bg.rh_factor + ')', ', ') as donor_names,
             COUNT(*) as donor_count
      FROM Donors d
      INNER JOIN Users u ON d.user_id = u.user_id
      LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE d.appointment_id IS NOT NULL
      GROUP BY d.appointment_id
    ) donor_info ON ap.appointment_id = donor_info.appointment_id
    ORDER BY ap.appointment_date, ap.appointment_time
  `);
  return result.recordset;
};

// Kiểm tra user đã đăng ký appointment này chưa (theo schema mới - Donors có appointment_id FK)
exports.checkUserRegisteredAppointment = async (userId, appointmentId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .input('appointment_id', sql.Int, appointmentId)
    .query(`
      SELECT donor_id, user_id, appointment_id, last_donation_date as registration_date, donation_status
      FROM Donors 
      WHERE user_id = @user_id 
        AND appointment_id = @appointment_id
    `);
  
  return result.recordset[0]; // null nếu chưa đăng ký
};

// HÀM NÀY ĐÃ DEPRECATED - Không còn sử dụng với schema mới
// Schema mới: appointment_id cố định, user đăng ký tạo donor record với appointment_id FK
// Sử dụng createDonorForAppointment() thay thế
exports.createAppointmentRegistration_DEPRECATED = async (originalAppointmentId, donorId, userId) => {
  console.warn('createAppointmentRegistration is DEPRECATED. Use createDonorForAppointment instead.');
  throw new Error('This function is deprecated. Use createDonorForAppointment instead.');
};

// TẠO DONOR RECORD MỚI với appointment_id làm FK (theo schema mới)
exports.createDonorForAppointment = async (userId, bloodGroupId, appointmentId, registrationDate) => {
  const pool = await poolConnect;
  
  console.log('Creating donor for appointment - userId:', userId, 'bloodGroupId:', bloodGroupId, 'appointmentId:', appointmentId);
  
  await pool.request()
    .input('user_id', sql.Int, userId)
    .input('blood_group_id', sql.Int, bloodGroupId)
    .input('appointment_id', sql.Int, appointmentId)
    .input('last_donation_date', sql.Date, registrationDate)
    .input('donation_status', sql.VarChar, 'scheduled')
    .query(`
      INSERT INTO Donors (user_id, blood_group_id, appointment_id, last_donation_date, donation_status)
      VALUES (@user_id, @blood_group_id, @appointment_id, @last_donation_date, @donation_status)
    `);
  
  console.log('Donor record created successfully for appointment:', appointmentId);
};

// Lấy donor record mới nhất của user
exports.getLatestDonorByUserId = async (userId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT TOP 1 donor_id, user_id, appointment_id, last_donation_date as registration_date, donation_status
      FROM Donors 
      WHERE user_id = @user_id 
      ORDER BY donor_id DESC
    `);
  
  return result.recordset[0];
};

// Lấy tất cả donors đã đăng ký cho một appointment cụ thể
exports.getDonorsByAppointmentId = async (appointmentId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointmentId)
    .query(`
      SELECT d.donor_id, d.user_id, d.last_donation_date as registration_date, d.donation_status,
             u.full_name, u.email, u.phone,
             bg.blood_type + bg.rh_factor as blood_group,
             ap.appointment_date, ap.appointment_time, ap.appointment_time_end, ap.status
      FROM Donors d
      JOIN Users u ON d.user_id = u.user_id
      JOIN DonationAppointments ap ON d.appointment_id = ap.appointment_id
      LEFT JOIN BloodGroups bg ON d.blood_group_id = bg.blood_group_id
      WHERE d.appointment_id = @appointment_id
      ORDER BY d.last_donation_date, d.donor_id
    `);
  
  return result.recordset;
};

// Đếm số lượng donors đã đăng ký cho một appointment
exports.countDonorsByAppointmentId = async (appointmentId) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('appointment_id', sql.Int, appointmentId)
    .query(`
      SELECT COUNT(*) as donor_count
      FROM Donors 
      WHERE appointment_id = @appointment_id
    `);
  
  return result.recordset[0].donor_count;
};
