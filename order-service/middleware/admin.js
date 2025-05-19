/**
 * Middleware to check if user has admin role
 * Requires auth middleware to be used first
 */
const admin = (req, res, next) => {
  if (!req.user || !req.user.role || req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

module.exports = admin;