const Chat = require('../models/Chat');
const Chatroom = require('../models/Chatroom');

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate('sender', 'username');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chats' });
  }
};

exports.createChatroom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = await Chatroom.create({ name });
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: 'Room already exists or invalid' });
  }
};

exports.getAllChatrooms = async (req, res) => {
  try {
    const rooms = await Chatroom.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get chatrooms' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatroomId, message } = req.body;
    // Assuming req.user is set by your auth middleware
    const sender = req.user._id;

    const newMessage = await Chat.create({
      chatroom: chatroomId,
      sender,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatroomId } = req.query;
    const messages = await Chat.find({ chatroom: chatroomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get messages' });
  }
};
