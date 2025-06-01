import express from 'express';
import User from '../models/User.js';
import { isNotAuthenticated, isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Login page
router.get('/login', isNotAuthenticated, (req, res) => {
  res.render('auth/login', { error: null });
});

// Register page
router.get('/register', isNotAuthenticated, (req, res) => {
  res.render('auth/register', { error: null });
});

// Login process
router.post('/login', isNotAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.render('auth/login', { 
        error: 'Please provide both username and password' 
      });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid username or password' });
    }
    
    // Update last seen
    user.lastSeen = new Date();
    await user.save();
    
    // Set session
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
});

// Register process
router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.render('auth/register', { 
        error: 'Please fill in all fields' 
      });
    }
    
    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('auth/register', { 
        error: 'Username or email already exists' 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Set session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture
    };
    
    res.redirect('/chats');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', { 
      error: 'An error occurred during registration' 
    });
  }
});

// Logout
router.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/chats');
    }
    res.redirect('/');
  });
});

export default router;