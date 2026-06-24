require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { errorHandler, apiLimiter, getMLEngineHealth } = require('./middleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const infoRoutes = require('./routes/infoRoutes');
const recommenderRoutes = require('./routes/recommenderRoutes');
const randomizerRoutes = require('./routes/randomizerRoutes');
const tagsRoutes = require('./routes/tagsRoutes');
const listRoutes = require('./routes/listRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const voteRoutes = require('./routes/voteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Health check
app.get('/api/health', async (_req, res) => {
  const mlHealth = await getMLEngineHealth();
  res.json({
    data: {
      status: 'ok',
      uptime: process.uptime(),
      mlEngine: mlHealth.status,
    },
    code: 200,
    metadata: { cache: false },
  });
});

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/recommender', recommenderRoutes);
app.use('/api/randomizer', randomizerRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/list', listRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/reviews', reviewRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    data: null,
    code: 404,
    error: `Route ${req.method} ${req.path} not found.`,
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`AniBrain Clone API running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`ML Engine: ${config.mlEngine.url}`);
});

module.exports = app;
