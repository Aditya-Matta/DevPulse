const crypto = require('crypto');
const Room = require('../models/Room.model');

const generateRoomCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// POST /api/rooms/create
const createRoom = async (req, res) => {
  try {
    let roomCode, exists;
    do {
      roomCode = generateRoomCode();
      exists = await Room.findOne({ roomCode });
    } while (exists);

    const room = await Room.create({
      roomCode,
      createdBy: req.user.id,
      participants: [req.user.id],
      language: req.body.language || 'javascript',
    });

    res.status(201).json({ success: true, data: { room } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/rooms/:code
const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomCode: req.params.code.toUpperCase() })
      .populate('createdBy', 'name username avatarUrl')
      .populate('participants', 'name username avatarUrl');
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: { room } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/rooms/:code/join
const joinRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomCode: req.params.code.toUpperCase(), isActive: true },
      { $addToSet: { participants: req.user.id } },
      { new: true }
    ).populate('createdBy', 'name username avatarUrl');

    if (!room) return res.status(404).json({ success: false, message: 'Room not found or inactive' });
    res.json({ success: true, data: { room } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createRoom, getRoom, joinRoom };
