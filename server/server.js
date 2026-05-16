require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socket.service');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

initSocket(io);

const start = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 DevPulse server running on http://localhost:${PORT}`);
  });
};

start();
