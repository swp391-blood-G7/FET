const { poolConnect, sql } = require('./db');

exports.recordDonation = async ({ donor_id, blood_bag_id, donation_date }) => {
  const pool = await poolConnect;
  return pool.request()
    .input('donor_id', sql.Int, donor_id)
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .input('donation_date', sql.Date, donation_date)
    .query(`
      INSERT INTO DonationRecords (donor_id, blood_bag_id, donation_date)
      VALUES (@donor_id, @blood_bag_id, @donation_date);
    `);
};
