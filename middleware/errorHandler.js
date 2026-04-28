const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Internal server error';

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = new ErrorResponse(`Duplicate field: ${message}`, 400);
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = new ErrorResponse(`Validation failed: ${message}`, 400);
  }

  // Sequelize Database Error (e.g., wrong datatype, invalid SQL)
  if (err.name === 'SequelizeDatabaseError') {
    const message = `Database error: ${err.message}`;
    error = new ErrorResponse(message, 500);
  }

  // Sequelize Foreign Key Constraint
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = `Foreign key constraint failed: ${err.message}`;
    error = new ErrorResponse(message, 400);
  }

  // Log the raw error for debugging
  console.error('Error:', err);

  res.status(error.codeStatus || 500).json({
    success: false,
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
