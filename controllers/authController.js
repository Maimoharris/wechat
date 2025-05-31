const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

function isValidEmail(email) {

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

exports.register = async (req, res) => {
  const { username, email, password, phone, fullName } = req.body;

  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const user = await User.create({ username, email, password, phone, fullName });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed. Try again.' });
  }
};


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
