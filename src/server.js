import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sql from 'mssql';

const app = express();
const PORT = 3001; // Server sẽ chạy ở cổng này

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',
    password: '12345',
    server: 'localhost',
    database: 'BloodDB',
    options: {
        trustServerCertificate: true,
    }
};

// API đăng nhập
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        await sql.connect(config);

        const result = await sql.query`
            SELECT * FROM Account 
            WHERE gmail = ${email} AND password = ${password}
        `;

        if (result.recordset.length > 0) {
            res.json({ success: true, message: 'Đăng nhập thành công' });
        } else {
            res.json({ success: false, message: 'Sai email hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('Lỗi SQL:', err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    } finally {
        await sql.close(); // luôn đóng kết nối
    }
});

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
