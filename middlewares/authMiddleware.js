const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secret = 'your_jwt_secret'; // Replace with your secret key

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
