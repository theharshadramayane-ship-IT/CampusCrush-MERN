const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.get('/', (req, res) => res.send('Public Chat Server is running!'));

// 🔥 PUBLIC CHAT LOGIC
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // Jab koi message bheje
  socket.on('send_public_message', (data) => {
    // Sabhi connected users ko message bhej do
    io.emit('receive_public_message', data); 
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Public Chat Server on http://localhost:${PORT}`));