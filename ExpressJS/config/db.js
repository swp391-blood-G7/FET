const sql = require('mssql');

const config = {
  user: 'sa',
  password: '12345',
  server: 'localhost',
  database: 'SWP',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => {
    console.error('Database Connection Failed! Bad Config: ', err);
  });

module.exports = {
  sql,
  config,
  poolPromise,
};
