require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const characterRoutes = require('./routes/characters');
const videoRoutes = require('./routes/videos');
const billingRoutes = require('./routes/billing');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true || false,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --------------- Health Check ---------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'eigon-backend', timestamp: new Date().toISOString() });
});

// --------------- Routes ---------------
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/billing', billingRoutes);

// --------------- Error Handler ---------------
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// --------------- Start Server ---------------
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Models synced');
  } catch (err) {
    console.warn('⚠️  Database connection failed — running without DB:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Eigon Backend running on http://localhost:${PORT}`);
  });
}

start();
