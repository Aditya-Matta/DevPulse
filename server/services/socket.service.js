const Room = require('../models/Room.model');

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a room
    socket.on('room:join', async ({ roomCode, userId, username }) => {
      try {
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;
        socket.data.username = username;

        const room = await Room.findOne({ roomCode });
        if (!room) return socket.emit('room:error', { message: 'Room not found' });

        // Broadcast current code + language state to new joiner
        socket.emit('room:state', { code: room.code, language: room.language });

        // Notify others
        socket.to(roomCode).emit('room:user-joined', { userId, username });

        // Get participants list
        const socketsInRoom = await io.in(roomCode).fetchSockets();
        const participants = socketsInRoom.map((s) => ({
          userId: s.data.userId,
          username: s.data.username,
        }));
        io.in(roomCode).emit('room:participants', participants);
      } catch (err) {
        socket.emit('room:error', { message: err.message });
      }
    });

    // Code update (debounced on client side)
    socket.on('room:code-update', async ({ roomCode, code }) => {
      socket.to(roomCode).emit('room:code-update', { code });
      // Persist to DB (fire and forget)
      Room.findOneAndUpdate({ roomCode }, { code }).catch(() => {});
    });

    // Language change
    socket.on('room:language-change', async ({ roomCode, language }) => {
      socket.to(roomCode).emit('room:language-change', { language });
      Room.findOneAndUpdate({ roomCode }, { language }).catch(() => {});
    });

    // Chat message
    socket.on('room:message', async ({ roomCode, text }) => {
      const { userId, username } = socket.data;
      const message = { userId, username, text, sentAt: new Date() };
      io.in(roomCode).emit('room:message', message);
      // Persist message
      Room.findOneAndUpdate({ roomCode }, { $push: { messages: message } }).catch(() => {});
    });

    // Leave room
    socket.on('room:leave', ({ roomCode }) => {
      handleLeave(socket, io, roomCode);
    });

    socket.on('disconnect', () => {
      const { roomCode } = socket.data;
      if (roomCode) handleLeave(socket, io, roomCode);
    });
  });
};

const handleLeave = async (socket, io, roomCode) => {
  socket.leave(roomCode);
  socket.to(roomCode).emit('room:user-left', {
    userId: socket.data.userId,
    username: socket.data.username,
  });
  const socketsInRoom = await io.in(roomCode).fetchSockets();
  const participants = socketsInRoom.map((s) => ({
    userId: s.data.userId,
    username: s.data.username,
  }));
  io.in(roomCode).emit('room:participants', participants);
  // Mark room inactive if empty
  if (socketsInRoom.length === 0) {
    Room.findOneAndUpdate({ roomCode }, { isActive: false }).catch(() => {});
  }
};

module.exports = { initSocket };
