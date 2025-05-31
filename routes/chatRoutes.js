const express = require('express');
const {
  getChats,
  createChatroom,
  getAllChatrooms,
  sendMessage,
  getMessages,
} = require('../controllers/chatController'); // Make sure all are defined

const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getChats);
router.post('/rooms', authenticate, createChatroom);
router.get('/rooms', authenticate, getAllChatrooms);
router.post('/chats', authenticate, sendMessage);
router.get('/chats', authenticate, getMessages);

module.exports = router;
