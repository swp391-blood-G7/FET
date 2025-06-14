// models/eligibilityModel.js
const sql = require('mssql');

const checkEligibility = async (donor_id, date) => {
  const pool = await sql.connect(process.env.DB_CONN);
  const result = await pool.request()
    .input('DonorId', sql.Int, donor_id)
    .input('RequestedDate', sql.Date, date)
    .output('IsEligible', sql.Bit)
    .output('NextEligibleDate', sql.Date)
    .execute('CheckDonorEligibility');

  return {
    eligible: result.output.IsEligible === 1,
    nextDate: result.output.NextEligibleDate
  };
};

module.exports = {
  checkEligibility
};
