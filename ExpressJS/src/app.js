const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('../routes/user');
const loginRoutes = require('../routes/login')
app.use(cors());
app.use(express.json());// đọc json từ body
app.use('/api', userRoutes);
console.log(userRoutes);

// app.use('/api/auth', loginRoutes)
module.exports = app;