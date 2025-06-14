// models/inventoryModel.js
const sql = require('mssql');

const getInventory = async () => {
  const pool = await sql.connect(process.env.DB_CONN);
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

module.exports = {
  getInventory
};
