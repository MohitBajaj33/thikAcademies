const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cookieParser = require('cookie-parser');

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token; 
    if (!token) return res.status(401).json({ msg: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');

    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('Token error:', err);
    res.status(401).json({ msg: 'Token failed or invalid' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied - admin only' });
  }
  next();
};
