const sql = require('mssql');

exports.createRequest = async ({ recipient_id, blood_group_id, component_id, quantity }) => {
  const pool = await sql.connect(process.env.DB_CONN);
  await pool.request()
    .input('recipient_id', sql.Int, recipient_id)
    .input('blood_group_id', sql.Int, blood_group_id)
    .input('component_id', sql.Int, component_id)
    .input('quantity', sql.Int, quantity)
    .query(`
      INSERT INTO BloodRequests (recipient_id, blood_group_id, component_id, quantity)
      VALUES (@recipient_id, @blood_group_id, @component_id, @quantity)
    `);
};

exports.getPendingRequests = async () => {
  const pool = await sql.connect(process.env.DB_CONN);
  const result = await pool.request()
    .query(`
      SELECT br.*, u.full_name AS recipient_name
      FROM BloodRequests br
      JOIN Recipients r ON br.recipient_id = r.recipient_id
      JOIN Users u ON r.user_id = u.user_id
      WHERE br.status = 'pending'
    `);
  return result.recordset;
};

exports.issueBlood = async ({ request_id, blood_bag_id, issued_by }) => {
  const pool = await sql.connect(process.env.DB_CONN);
  await pool.request()
    .input('request_id', sql.Int, request_id)
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .input('issued_by', sql.Int, issued_by)
    .query(`
      INSERT INTO BloodIssuance (request_id, blood_bag_id, issued_by)
      VALUES (@request_id, @blood_bag_id, @issued_by);
      
      UPDATE BloodRequests SET status = 'fulfilled' WHERE request_id = @request_id;
      UPDATE BloodBags SET status = 'used' WHERE blood_bag_id = @blood_bag_id;
    `);
};
