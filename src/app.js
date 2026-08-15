const express = require('express');
const  rateLimiter  = require('./config/rateLimitTokenBucket.js');
const usersRoutes = require('./routes/users.route');

const app = express();
app.use(express.json());
app.use('/api/users', rateLimiter({ capacity: 5, refillRate: 1 }), usersRoutes);

module.exports = app;
