import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sql from 'mssql';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const config = {
    user: 'sa',
    password: '12345',
    server: 'localhost',
    database: 'SWP',
    options: {
        trustServerCertificate: true,
    },
};

app.post('/api/login', async (req, res) => {
    const { email, password_hash } = req.body;

    try {
        await sql.connect(config);

        const result = await sql.query`
      SELECT full_name, role FROM dbo.Users
      WHERE email = ${email} AND password_hash = ${password_hash}
    `;

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            res.json({ success: true, full_name: user.full_name, role: user.role });
        } else {
            res.json({ success: false, message: 'Sai email hoặc mật khẩu' });
        }
    } catch (err) {
        console.error('Lỗi SQL:', err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    } finally {
        await sql.close();
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
