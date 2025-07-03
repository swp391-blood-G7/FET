// models/inventoryModel.js
const { sql, poolConnect } = require('./db');
// lấy danh sách các loại máu trong kho

const getInventory = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`
    SELECT i.inventory_id, 
           bg.blood_type + bg.rh_factor AS blood_group,
           c.component_name, 
           i.quantity, 
           i.last_updated
    FROM Inventory i
    JOIN BloodGroups bg ON i.blood_group_id = bg.blood_group_id
    JOIN Components c ON i.component_id = c.component_id
  `);
  return rs.recordset;
};

// Lấy danh sách tất cả nhóm máu
const getBloodGroups = async () => {
  const pool = await poolConnect;
  const rs = await pool.request().query(`
    SELECT blood_group_id, blood_type, rh_factor
    FROM BloodGroups
    ORDER BY blood_group_id
  `);
  return rs.recordset;
};

module.exports = {
  getInventory,
  getBloodGroups
};
