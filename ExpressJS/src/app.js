const express = require('express');
const cors = require('cors');
const app = express();

// Routes
const userRoutes = require('../routes/user');
const appointmentRoutes = require('../routes/appointments');
const loginRoutes = require('../routes/login');

// Middleware
app.use(cors());
app.use(express.json());

// Gắn route
app.use('/api', userRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api', appointmentRoutes);



module.exports = app;
