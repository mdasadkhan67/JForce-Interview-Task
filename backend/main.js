const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./router/authRoutes');
const taskRoutes = require('./router/taskRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./helper/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
db.connect((err) => {
  if (err) {
    logger.error('Database connection failed', { error: err });
    return;
  }

  logger.info('MySQL connected successfully');
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to User Authentication API');
});

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/', authRoutes);

// Task Routes
app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});