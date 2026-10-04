const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(el => el.message);
    message = `Invalid input data: ${errors.join('. ')}`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}': ${err.value}`;
  }

  // Handle Mongo Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for ${field}. An entity with this ${field} already exists.`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  if (env.nodeEnv === 'development') {
    return res.status(statusCode).json({
      status: statusCode < 500 ? 'fail' : 'error',
      message,
      requestId: req.id,
      error: err,
      stack: err.stack
    });
  }

  // Production response (do not leak internal server details)
  return res.status(statusCode).json({
    status: statusCode < 500 ? 'fail' : 'error',
    message: statusCode === 500 ? 'An unexpected server error occurred' : message,
    requestId: req.id
  });
};

module.exports = errorHandler;
