const { sql, poolConnect } = require('./db');

exports.recordDonation = async ({ donor_id, blood_bag_id, donation_date }) => {
  const pool = await poolConnect;

  // Kiểm tra donor_id có tồn tại không
  const checkResult = await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`SELECT 1 FROM Donors WHERE donor_id = @donor_id`);

  if (checkResult.recordset.length === 0) {
    throw new Error(`Donor ID ${donor_id} không tồn tại trong bảng Donors`);
  }

  // Nếu donor tồn tại thì mới insert
  return pool.request()
    .input('donor_id', sql.Int, donor_id)
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .input('donation_date', sql.Date, donation_date)
    .query(`
      INSERT INTO DonationRecords (donor_id, blood_bag_id, donation_date)
      VALUES (@donor_id, @blood_bag_id, @donation_date);
    `);
};
