const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dns = require('dns');

// 🔥 DNS Fix (Windows + Node.js connection error se bachne ke liye)
dns.setServers(['8.8.8.8', '1.1.1.1']);

// .env load karo aur Database Connect karo
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

// 🔥 SAARE ROUTES
app.use('/api/admin', require('./routes/admin'));
app.use('/api/events', require('./routes/events'));

app.get('/', (req, res) => res.send('CampusCrush Full Stack Server is running!'));

// 🔥 SOCKET.IO (Public Chat Logic & Database Save)
const PublicMessage = require('./models/PublicMessage');

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Jab koi public chat mein message bheje
  socket.on('send_public_message', async (data) => {
    try {
      // 1. Message Database mein save karo
      const savedMsg = await PublicMessage.create({ 
        user: data.user, 
        text: data.text 
      });
      
      // 2. Sabhi connected users ko live message bhej do
      io.emit('receive_public_message', {
        _id: savedMsg._id,
        user: data.user,
        text: data.text,
        createdAt: savedMsg.createdAt
      }); 
    } catch (error) {
      console.log('❌ Error saving message to DB:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));