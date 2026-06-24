const rateLimit = require('express-rate-limit');
const config = require('../config');

const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    code: 429,
    error: 'Too many requests. Please try again later.',
  },
});

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.api.windowMs,
  max: config.rateLimit.api.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    code: 429,
    error: 'Too many requests. Please try again later.',
  },
});

module.exports = { authLimiter, apiLimiter };
