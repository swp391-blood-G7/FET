const { poolPromise } = require('../config/db');
const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy dữ liệu', error: err.message });
    }
};
module.exports = { getAllUsers };