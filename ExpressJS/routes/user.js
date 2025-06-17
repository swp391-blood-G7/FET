const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
router.get('/users', userController.getAllUsers);
module.exports = router;
