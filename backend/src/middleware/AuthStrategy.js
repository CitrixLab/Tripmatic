// AuthStrategy.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/auth.config");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access Denied' });
  }

  const token = authHeader.split(' ')[1];  // Extract the token after "Bearer"
  
  if (!token) {
    return res.status(401).json({ error: 'Access Denied' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;  // Attach decoded token data (like userEmail, id) to req.user
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};
