const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.set('io', io);

// Routes Connect Karo
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
// app.use('/api/matches', require('./routes/matches')); // Baad mein banayenge
// app.use('/api/messages', require('./routes/messages'));
// app.use('/api/events', require('./routes/events'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 CampusCrush API is running' });
});

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  socket.on('join', (userId) => socket.join(userId));
  socket.on('disconnect', () => console.log('❌ User disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});