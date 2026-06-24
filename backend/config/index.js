require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/anibrain_clone',
  },
  mlEngine: {
    url: process.env.ML_ENGINE_URL || 'http://localhost:8000',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimit: {
    auth: {
      windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 60000,
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 100,
    },
    api: {
      windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS, 10) || 60000,
      max: parseInt(process.env.API_RATE_LIMIT_MAX, 10) || 300,
    },
  },
};

module.exports = config;
