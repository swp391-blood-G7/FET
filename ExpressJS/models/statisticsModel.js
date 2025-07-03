const { sql, poolConnect } = require('./db');

// Tổng số lượng máu từng loại
exports.getBloodStats = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`
    SELECT bg.blood_type + bg.rh_factor AS blood_group, c.component_name, SUM(i.quantity) AS total_quantity
    FROM Inventory i
    JOIN BloodGroups bg ON i.blood_group_id = bg.blood_group_id
    JOIN Components c ON i.component_id = c.component_id
    GROUP BY bg.blood_type, bg.rh_factor, c.component_name
  `);
  return rs.recordset;
};

// Tổng số người hiến máu
exports.getDonorStats = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`SELECT COUNT(*) AS total_donors FROM Donors`);
  return rs.recordset[0];
};

// Tổng số yêu cầu máu
exports.getRequestStats = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`SELECT COUNT(*) AS total_requests FROM BloodRequests`);
  return rs.recordset[0];
};

// Tổng số lịch hẹn hiến máu
exports.getAppointmentStats = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`SELECT COUNT(*) AS total_appointments FROM DonationAppointments`);
  return rs.recordset[0];
};

// Báo cáo theo ngày/tháng/năm cho từng loại
exports.getReport = async (type, from, to) => {
  let table, dateField;
  if (type === 'donation') {
    table = 'DonationRecords';
    dateField = 'donation_date';
  } else if (type === 'request') {
    table = 'BloodRequests';
    dateField = 'request_date';
  } else if (type === 'appointment') {
    table = 'DonationAppointments';
    dateField = 'appointment_date';
  } else {
    throw new Error('Invalid type');
  }
  const pool = await poolConnect;
  const rs = await pool.request()
    .input('from', sql.Date, from)
    .input('to', sql.Date, to)
    .query(`
      SELECT COUNT(*) AS total
      FROM ${table}
      WHERE ${dateField} BETWEEN @from AND @to
    `);
  return rs.recordset[0];
};