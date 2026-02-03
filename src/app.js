const express = require('express');
const { userLimiter } = require('./config/rateLimit');
const usersRoutes = require('./routes/users.route');

const app = express();
app.use(express.json());
app.use('/api/users', userLimiter, usersRoutes);

module.exports = app;
