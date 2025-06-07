// controllers/userController.js
import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
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
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('-password');

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    res.render('users/profile', { user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).render('error', { message: 'Failed to load profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.render('users/profile', {
        user: req.session.user,
        error: 'Username and email are required'
      });
    }

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

    const updatedUser = await User.findByIdAndUpdate(
      req.session.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    req.session.user.username = updatedUser.username;
    req.session.user.email = updatedUser.email;

    res.redirect('/users/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).render('error', { message: 'Failed to update profile' });
  }
};
