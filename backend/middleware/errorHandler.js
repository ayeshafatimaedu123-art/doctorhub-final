const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  let message = err.message || 'Server Error';
  let statusCode = err.statusCode || 500;

  if (err.code === '23505') { message = 'Already exists'; statusCode = 400; }
  if (err.code === '23503') { message = 'Referenced record not found'; statusCode = 400; }
  if (err.name === 'JsonWebTokenError') { message = 'Invalid token'; statusCode = 401; }
  if (err.name === 'TokenExpiredError') { message = 'Token expired'; statusCode = 401; }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
