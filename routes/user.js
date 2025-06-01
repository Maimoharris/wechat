import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get all users (for chat selection)
router.get('/', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select('username email profilePicture lastSeen')
      .sort({ username: 1 });
    
    res.render('users/index', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).render('error', { message: 'Failed to load users' });
  }
});

// User profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }
    
    res.render('users/profile', { user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
});

// Update profile
router.post('/profile', async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Validate input
    if (!username || !email) {
      return res.render('users/profile', { 
        user: req.session.user, 
        error: 'Username and email are required' 
      });
    }
    
    // Check if username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: req.session.user.id } 
    });
    
    if (existingUser) {
      return res.render('users/profile', { 
        user: req.session.user, 
        error: 'Username is already taken' 
      });
    }
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      { username, email },
      { new: true }
    ).select('-password');
    
    // Update session
    req.session.user.username = updatedUser.username;
    req.session.user.email = updatedUser.email;
    
    res.redirect('/users/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).render('error', { message: 'Failed to update profile' });
  }
});

export default router;