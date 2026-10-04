const express = require('express');
const cookieParser = require('cookie-parser');
const { configureSecurityMiddleware } = require('./middleware/security');
const { apiLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./errors/errorHandler');
const routes = require('./routes');
const { NotFoundError } = require('./errors/AppError');

const app = express();

// Security headers & CORS
configureSecurityMiddleware(app);

// Request identifier and completion logger
app.use(requestLogger);

// Request parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Global API rate limiter
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'DMS API is operational',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api', routes);

// Handle 404 routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Cannot find route ${req.originalUrl} on this server`));
});

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
