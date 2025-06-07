import express from 'express';
import {
  renderLogin,
  renderRegister,
  loginUser,
  registerUser,
  logoutUser
} from '../controllers/auth.js';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Pages
router.get('/login', isNotAuthenticated, renderLogin);
router.get('/register', isNotAuthenticated, renderRegister);

// Actions
router.post('/login', isNotAuthenticated, loginUser);
router.post('/register', isNotAuthenticated, registerUser);
router.get('/logout', isAuthenticated, logoutUser);

export default router;
