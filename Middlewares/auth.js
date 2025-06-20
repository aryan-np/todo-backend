const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  

  // Check if header is present and well-formatted
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader

  try {
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded; // decoded = { userId, role, iat, exp }
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
