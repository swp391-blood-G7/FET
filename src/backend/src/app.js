const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);
// app.js hoặc server.js
const express = require('express');
const app = express();
const eligibilityRoutes = require('./routes/eligibilityRoutes');

// Middleware
app.use(express.json());

// Use routes
app.use('/api/eligibility', eligibilityRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);
const recipientRoutes = require('./routes/recipientRoutes');
app.use('/api/recipients', recipientRoutes);
