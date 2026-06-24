function errorHandler(err, _req, res, _next) {
  console.error('Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const errorMessage = err.statusCode ? err.message : 'Internal server error';

  res.status(statusCode).json({
    data: null,
    code: statusCode,
    error: errorMessage,
  });
}

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, AppError };
