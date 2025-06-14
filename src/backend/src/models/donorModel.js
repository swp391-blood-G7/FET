const { poolConnect, sql } = require('./db');

exports.addDonor = async (data) => {
  const { user_id, blood_group_id, date_of_birth, gender, address } = data;
  const pool = await poolConnect;
  return pool.request()
    .input('user_id', sql.Int, user_id)
    .input('blood_group_id', sql.Int, blood_group_id)
    .input('date_of_birth', sql.Date, date_of_birth)
    .input('gender', sql.VarChar, gender)
    .input('address', sql.Text, address)
    .query(`
      INSERT INTO Donors (user_id,blood_group_id,date_of_birth,gender,address)
      VALUES (@user_id,@blood_group_id,@date_of_birth,@gender,@address);
      SELECT SCOPE_IDENTITY() AS donor_id;
    `);
};

exports.getAllDonors = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT d.donor_id, u.full_name, bg.blood_type+bg.rh_factor AS blood_group,
           d.date_of_birth, d.gender, d.address, d.last_donation_date
    FROM Donors d
    JOIN Users u ON d.user_id=u.user_id
    JOIN BloodGroups bg ON d.blood_group_id=bg.blood_group_id
  `);
  return result.recordset;
};

exports.getDonorHistory = async (donor_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`
      SELECT dh.*, dr.donation_date
      FROM DonationHistory dh
      JOIN DonationRecords dr ON dh.donation_id=dr.donation_id
      WHERE dh.donor_id=@donor_id
    `);
  return result.recordset;
};

exports.getReminders = async (donor_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('donor_id', sql.Int, donor_id)
    .query(`
      SELECT * FROM DonationReminders
      WHERE donor_id=@donor_id
    `);
  return result.recordset;
};
