// models/bloodBagModel.js
const { sql, poolConnect } = require('./db');

// Tạo túi máu mới
exports.createBloodBag = async (data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('donor_id', sql.Int, data.donor_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .input('component_id', sql.Int, data.component_id)
    .input('volume_type_id', sql.Int, data.volume_type_id)
    .input('collection_date', sql.Date, data.collection_date)
    .input('expiry_date', sql.Date, data.expiry_date)
    .input('status', sql.VarChar, data.status || 'available')
    .query(`
      INSERT INTO BloodBags (donor_id, blood_group_id, component_id, volume_type_id, collection_date, expiry_date, status)
      VALUES (@donor_id, @blood_group_id, @component_id, @volume_type_id, @collection_date, @expiry_date, @status)
    `);
};

// Lấy tất cả túi máu (kèm thông tin dung tích)
exports.getAllBloodBags = async () => {
  const pool = await poolConnect;
  const result = await pool.request().query(`
    SELECT bb.*, vt.volume_ml, c.component_name, bg.blood_type, bg.rh_factor, d.donor_id, u.full_name AS donor_name
    FROM BloodBags bb
    JOIN VolumeTypes vt ON bb.volume_type_id = vt.volume_type_id
    JOIN Components c ON bb.component_id = c.component_id
    JOIN BloodGroups bg ON bb.blood_group_id = bg.blood_group_id
    JOIN Donors d ON bb.donor_id = d.donor_id
    JOIN Users u ON d.user_id = u.user_id
  `);
  return result.recordset;
};

// Lấy túi máu theo ID
exports.getBloodBagById = async (blood_bag_id) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .query(`
      SELECT bb.*, vt.volume_ml, c.component_name, bg.blood_type, bg.rh_factor, d.donor_id, u.full_name AS donor_name
      FROM BloodBags bb
      JOIN VolumeTypes vt ON bb.volume_type_id = vt.volume_type_id
      JOIN Components c ON bb.component_id = c.component_id
      JOIN BloodGroups bg ON bb.blood_group_id = bg.blood_group_id
      JOIN Donors d ON bb.donor_id = d.donor_id
      JOIN Users u ON d.user_id = u.user_id
      WHERE bb.blood_bag_id = @blood_bag_id
    `);
  return result.recordset[0];
};

// Cập nhật thông tin túi máu
exports.updateBloodBag = async (blood_bag_id, data) => {
  const pool = await poolConnect;
  await pool.request()
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .input('donor_id', sql.Int, data.donor_id)
    .input('blood_group_id', sql.Int, data.blood_group_id)
    .input('component_id', sql.Int, data.component_id)
    .input('volume_type_id', sql.Int, data.volume_type_id)
    .input('collection_date', sql.Date, data.collection_date)
    .input('expiry_date', sql.Date, data.expiry_date)
    .input('status', sql.VarChar, data.status)
    .query(`
      UPDATE BloodBags
      SET donor_id = @donor_id,
          blood_group_id = @blood_group_id,
          component_id = @component_id,
          volume_type_id = @volume_type_id,
          collection_date = @collection_date,
          expiry_date = @expiry_date,
          status = @status
      WHERE blood_bag_id = @blood_bag_id
    `);
};

// Xóa túi máu
exports.deleteBloodBag = async (blood_bag_id) => {
  const pool = await poolConnect;
  await pool.request()
    .input('blood_bag_id', sql.Int, blood_bag_id)
    .query(`DELETE FROM BloodBags WHERE blood_bag_id = @blood_bag_id`);
};

// Tìm kiếm túi máu theo tên người hiến, nhóm máu, trạng thái, dung tích
exports.searchBloodBags = async (keyword) => {
  const pool = await poolConnect;
  const result = await pool.request()
    .input('keyword', sql.NVarChar, `%${keyword}%`)
    .query(`
      SELECT bb.*, vt.volume_ml, c.component_name, bg.blood_type, bg.rh_factor, u.full_name AS donor_name
      FROM BloodBags bb
      JOIN VolumeTypes vt ON bb.volume_type_id = vt.volume_type_id
      JOIN Components c ON bb.component_id = c.component_id
      JOIN BloodGroups bg ON bb.blood_group_id = bg.blood_group_id
      JOIN Donors d ON bb.donor_id = d.donor_id
      JOIN Users u ON d.user_id = u.user_id
      WHERE u.full_name LIKE @keyword
         OR bg.blood_type LIKE @keyword
         OR bg.rh_factor LIKE @keyword
         OR c.component_name LIKE @keyword
         OR bb.status LIKE @keyword
         OR CAST(vt.volume_ml AS NVARCHAR) LIKE @keyword
    `);
  return result.recordset;
};