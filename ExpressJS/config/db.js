const sql = require('mssql');

const config = {
  user: 'sa',
  password: '12345',
  server: 'localhost', // hoặc IP server SQL
  database: 'SWP',
  options: {
    encrypt: false, // true nếu dùng Azure
    trustServerCertificate: true // dùng cho local dev
  }
};

module.exports = { sql, config };
