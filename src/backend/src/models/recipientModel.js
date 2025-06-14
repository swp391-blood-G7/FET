// models/recipientModel.js
const sql = require('mssql');

const createRecipient = async (recipientData) => {
  const { user_id, blood_group_id, date_of_birth, gender, address, medical_condition } = recipientData;

  const pool = await sql.connect(process.env.DB_CONN);
  await pool.request()
    .input('user_id', sql.Int, user_id)
    .input('blood_group_id', sql.Int, blood_group_id)
    .input('date_of_birth', sql.Date, date_of_birth)
    .input('gender', sql.VarChar, gender)
    .input('address', sql.Text, address)
    .input('medical_condition', sql.Text, medical_condition)
    .query(`
      INSERT INTO Recipients (user_id, blood_group_id, date_of_birth, gender, address, medical_condition)
      VALUES (@user_id, @blood_group_id, @date_of_birth, @gender, @address, @medical_condition)
    `);
};

module.exports = {
  createRecipient
};
