const { poolPromise, sql } = require('../config/db.js');

const getAppointments = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Thiếu tham số from hoặc to' });
  }

  // Parse ngày và kiểm tra hợp lệ
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return res.status(400).json({ error: 'Ngày from hoặc to không hợp lệ' });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input('from', sql.DateTime, fromDate)
      .input('to', sql.DateTime, toDate)
      .query(`
        SELECT 
          appointment_id,
          donor_id,
          appointment_date,
          status,
          LEFT(CONVERT(varchar, appointment_time, 108), 5) AS appointment_time,
          LEFT(CONVERT(varchar, appointment_time_end, 108), 5) AS appointment_time_end
        FROM dbo.DonationAppointments
        WHERE CAST(appointment_date AS DATE) BETWEEN CAST(@from AS DATE) AND CAST(@to AS DATE)
        ORDER BY appointment_date ASC
      `);

    // Nếu không có kết quả trả về
    if (!result.recordset || result.recordset.length === 0) {
      return res.status(200).json([]);
    }

    res.json(result.recordset);
  } catch (error) {
  console.error('Error fetching appointments:', error);
  res.status(500).json({ message: 'Internal server error' });
}
};

module.exports = {
  getAppointments,
};
