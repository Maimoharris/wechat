import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import userRoutes from './routes/user.js';
import apiRoutes from './routes/api.js';
import expressLayouts from 'express-ejs-layouts';

// Middleware
import { isAuthenticated } from './middleware/auth.js';

// Load environment variables
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(expressLayouts);
app.set('layout', 'layouts/main');
// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'chatapp-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp',
    collectionName: 'sessions' 
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// Pass user to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/chats');
  }
  res.render('index');
});

app.use('/auth', authRoutes);
app.use('/chats', isAuthenticated, chatRoutes);
app.use('/users', isAuthenticated, userRoutes);
app.use('/api', apiRoutes);

// Handle 404
app.use((req, res) => {
  res.status(404).render('404');
});

// Socket.io
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('user_connected', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('user_status_change', { userId, status: 'online' });
  });
  
  socket.on('send_message', async (data) => {
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', {
        senderId: data.senderId,
        message: data.message,
        timestamp: new Date()
      });
    }
  });
  
  socket.on('disconnect', () => {
    let disconnectedUserId = null;
    
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
      }
    });
    
    if (disconnectedUserId) {
      io.emit('user_status_change', { userId: disconnectedUserId, status: 'offline' });
    }
    
    console.log('A user disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };