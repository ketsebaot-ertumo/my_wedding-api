
const ErrorResponse = require('../utils/errorResponse.js');

// Role-based authorization (e.g., 'admin', 'super_admin')
exports.authorize = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user?.role)) {
        return next(
          new ErrorResponse(`Access Denied. User role '${req.user.role}' is not authorized`, 403)
        );
      }
      next();
    };
};