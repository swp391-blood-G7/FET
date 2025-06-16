import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

  import authRoutes from './src/backend/src/routes/auth.js';
 // ✅ đường dẫn chính xác
import appointmentRoutes from './src/backend/src/routes/appointments.js'; // (nếu có)

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Gắn route
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes); // (nếu đã tạo file này)

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
