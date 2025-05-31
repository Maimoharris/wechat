const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const app = require('./app');
const Chat = require('./models/Chat');
const User = require('./models/User');
const connectDB = require('./config/db');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const secret = 'your_jwt_secret'; // Replace with your secret key

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  try {
    const decoded = jwt.verify(token, secret);
    socket.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.username}`);

  socket.on('chat message', async (msg) => {
    const chat = await Chat.create({ sender: socket.user._id, message: msg });
    io.emit('chat message', {
      message: chat.message,
      sender: socket.user.username,
      createdAt: chat.createdAt,
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});

connectDB();
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






