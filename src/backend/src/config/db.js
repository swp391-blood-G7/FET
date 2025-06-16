import sql from 'mssql';

const config = {
  user: 'sa',
  password: '12345',
  server: 'localhost',
  database: 'SWP',
  options: {
    trustServerCertificate: true,
  },
};

// Dùng 1 pool toàn cục (kết nối lại khi dùng nhiều nơi)
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ SQL Server connected');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed!', err);
    throw err;
  });

export { sql, poolPromise };
