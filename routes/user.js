// routes/userRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile
} from '../controllers/user.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/profile', getUserProfile);
router.post('/profile', updateUserProfile);

export default router;
