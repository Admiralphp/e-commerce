const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and attach user data to request
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ 
      status: 'error',
      message: 'Token is not valid' 
    });
  }
};

module.exports = auth;