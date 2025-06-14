const sql = require('mssql');

exports.createUser = async (user) => {
  const pool = await sql.connect(process.env.DB_CONN);
  await pool.request()
    .input('username', sql.VarChar, user.username)
    .input('password', sql.VarChar, user.password)
    .input('full_name', sql.VarChar, user.full_name)
    .input('email', sql.VarChar, user.email)
    .input('phone', sql.VarChar, user.phone)
    .input('role', sql.VarChar, user.role)
    .query(`
      INSERT INTO Users (username, password_hash, full_name, email, phone, role)
      VALUES (@username, @password, @full_name, @email, @phone, @role)
    `);
};

exports.getUserByUsername = async (username) => {
  const pool = await sql.connect(process.env.DB_CONN);
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM Users WHERE username = @username');
  return result.recordset[0];
};
