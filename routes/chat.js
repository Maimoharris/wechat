// routes/chatRoutes.js
import express from 'express';
import {
  getAllConversations,
  getConversationWithUser,
  deleteConversation,
  deleteMessage
} from '../controllers/chat.js';

const router = express.Router();

router.get('/', getAllConversations);
router.get('/:userId', getConversationWithUser);
router.delete('/:userId', deleteConversation);
router.delete('/message/:messageId', deleteMessage);

export default router;
