import express from 'express';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Chat dashboard - show all conversations
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Find all conversations for this user
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate({
      path: 'participants',
      match: { _id: { $ne: userId } }, // Exclude the current user
      select: 'username profilePicture lastSeen'
    })
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
    
    res.render('chat/index', { conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).render('error', { message: 'Failed to load conversations' });
  }
});

// Chat with specific user
router.get('/:userId', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const otherUserId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).render('error', { message: 'Invalid user ID' });
    }
    
    // Get other user info
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }
    
    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });
    
    if (!conversation) {
      conversation = new Conversation({
        participants: [currentUserId, otherUserId]
      });
      await conversation.save();
    }
    
    // Get messages
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    })
    .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, recipient: currentUserId, read: false },
      { read: true }
    );
    
    res.render('chat/conversation', { 
      otherUser,
      messages,
      currentUserId
    });
  } catch (error) {
    console.error('Error loading chat:', error);
    res.status(500).render('error', { message: 'Failed to load chat' });
  }
});

// Delete a conversation
router.delete('/:userId', async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const otherUserId = req.params.userId;
    
    // Delete messages
    await Message.deleteMany({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    });
    
    // Delete conversation
    await Conversation.findOneAndDelete({
      participants: { $all: [currentUserId, otherUserId] }
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ success: false, message: 'Failed to delete conversation' });
  }
});

// Delete a specific message
router.delete('/message/:messageId', async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.session.user.id;
    
    // Find message and verify ownership
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    // Delete message
    await Message.findByIdAndDelete(messageId);
    
    // Update conversation's last message if needed
    const conversation = await Conversation.findOne({
      participants: { $all: [message.sender, message.recipient] },
      lastMessage: messageId
    });
    
    if (conversation) {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: message.sender, recipient: message.recipient },
          { sender: message.recipient, recipient: message.sender }
        ]
      })
      .sort({ createdAt: -1 });
      
      if (lastMessage) {
        conversation.lastMessage = lastMessage._id;
      } else {
        conversation.lastMessage = null;
      }
      
      await conversation.save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

export default router;