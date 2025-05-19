/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: messages
    });
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate value entered'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Default to 500 server error
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Server Error'
  });
};

module.exports = errorHandler;