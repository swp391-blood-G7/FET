const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import các route cho từng chức năng
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const donationRoutes = require('./routes/donationRoutes');
const donorRoutes = require('./routes/donorRoutes');
const eligibilityRoutes = require('./routes/eligibilityRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const recipientRoutes = require('./routes/recipientRoutes');
const requestRoutes = require('./routes/requestRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const bloodBagRoutes = require('./routes/bloodBagRoutes'); 
const profileRoutes = require('./routes/profileRoutes');

const errorHandler = require('./middleware/errorHandler'); 

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

// Mount các route
app.use('/api/auth', authRoutes); // done
app.use('/api/appointments', appointmentRoutes); // done
app.use('/api/donations', donationRoutes);//done
app.use('/api/donors', donorRoutes); // done
app.use('/api/eligibility', eligibilityRoutes);// done
app.use('/api/inventory', inventoryRoutes);// done
app.use('/api/recipients', recipientRoutes);//done
app.use('/api/requests', requestRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/blood-bags', bloodBagRoutes); // done

// Trang chủ test API
app.get('/', (req, res) => {
  res.send('Blood Donation API Server is running!');
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Thêm middleware xử lý lỗi vào cuối cùng
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
