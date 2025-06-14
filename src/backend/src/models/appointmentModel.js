const sql = require('mssql');

exports.scheduleAppointment = async (donor_id, appointment_date) => {
  const pool = await sql.connect(process.env.DB_CONN);
  await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .input('appointment_date', sql.DateTime, appointment_date)
    .query(`
      INSERT INTO DonationAppointments (donor_id, appointment_date)
      VALUES (@donor_id, @appointment_date)
    `);
};

exports.getAllAppointments = async () => {
  const pool = await sql.connect(process.env.DB_CONN);
  const rs = await pool.request().query(`
    SELECT ap.*, u.full_name
    FROM DonationAppointments ap
    JOIN Donors d ON ap.donor_id = d.donor_id
    JOIN Users u ON d.user_id = u.user_id
  `);
  return rs.recordset;
};
