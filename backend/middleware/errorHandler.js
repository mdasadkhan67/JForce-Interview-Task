const logger = require('../helper/logger');

const formatJoiErrors = (error) => {
  if (!error || !error.details) return [];
  return error.details.map((detail) => ({
    field: detail.path.join('.') || detail.context?.key,
    message: detail.message
  }));
};

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, route: req.originalUrl, method: req.method });

  if (err.isJoi || err.name === 'ValidationError') {
    const validationErrors = formatJoiErrors(err);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }

  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 600) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Request failed',
      error: err.details || undefined
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
};

module.exports = errorHandler;
