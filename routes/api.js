import express from 'express';
import { sendMessage, getUnreadCount, markMessagesAsRead } from '../controllers/api.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.use(isAuthenticated);

router.post('/messages', sendMessage);
router.get('/messages/unread', getUnreadCount);
router.put('/messages/read/:userId', markMessagesAsRead);

export default router;
