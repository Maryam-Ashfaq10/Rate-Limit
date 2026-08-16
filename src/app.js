const express = require('express');
const  rateLimiterTokenBucket  = require('./algos/rateLimitTokenBucket.js');
const FixedWindowRateLimiter = require('./algos/rateLimitFixedWindow.js');

const usersRoutes = require('./routes/users.route');

const app = express();
app.use(express.json());

const limiter = new FixedWindowRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 10,    // 100 requests per window per key
});

app.use('/api/users', limiter.middleware(), usersRoutes);

// token bucket - rateLimiter({ capacity: 5, refillRate: 1 })
module.exports = app;
