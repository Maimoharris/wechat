import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.session.user.id;

    if (!content.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });

    await message.save();

    await Conversation.findOneAndUpdate(
      { participants: { $all: [senderId, recipientId] } },
      {
        $set: {
          lastMessage: message._id,
          updatedAt: new Date()
        },
        $setOnInsert: { participants: [senderId, recipientId] }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: {
        id: message._id,
        content: message.content,
        sender: senderId,
        timestamp: message.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const unreadCount = await Message.countDocuments({
      recipient: userId,
      read: false
    });

    res.json({ success: true, count: unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const currentUserId = req.session.user.id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      { sender: otherUserId, recipient: currentUserId, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, message: 'Failed to mark messages as read' });
  }
};
