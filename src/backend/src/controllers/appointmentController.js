import { poolPromise, sql } from '../config/db.js';

export const getAppointments = async (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'Thiếu tham số from hoặc to' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('from', sql.DateTime, new Date(from))
      .input('to', sql.DateTime, new Date(to))
      .query(`
        SELECT 
          appointment_id,
          donor_id,
          appointment_date,
          status,
          LEFT(CONVERT(varchar, appointment_time, 108), 5) AS appointment_time,
          LEFT(CONVERT(varchar, appointment_time_end, 108), 5) AS appointment_time_end
        FROM dbo.DonationAppointments
        WHERE appointment_date BETWEEN @from AND @to
        ORDER BY appointment_date ASC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
