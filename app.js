const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

// mongoose.connect('mongodb://localhost:27017/wechatdb')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('MongoDB connection error:', err));


app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

app.use('/api', userRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.render('index');
});

app.use(errorHandler);

module.exports = app;
