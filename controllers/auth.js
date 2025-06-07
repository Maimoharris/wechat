import User from '../models/User.js';

// GET: Login Page
export const renderLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

// GET: Register Page
export const renderRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

// POST: Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('auth/login', { error: 'Please provide both username and password' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }

    user.lastSeen = new Date();
    await user.save();

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };

    res.redirect('/chats');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', { error: 'An error occurred during login' });
  }
};

// POST: Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.render('auth/register', { error: 'Please fill in all fields' });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('auth/register', { error: 'Username or email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };

    res.redirect('/chats');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', { error: 'An error occurred during registration' });
  }
};

// GET: Logout User
export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/chats');
    res.redirect('/');
  });
};
