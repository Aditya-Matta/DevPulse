const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true, uppercase: true, length: 6 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    language: { type: String, default: 'javascript', enum: ['javascript', 'python', 'java', 'cpp'] },
    code: { type: String, default: '// Start coding here...' },
    isActive: { type: Boolean, default: true },
    messages: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        text: String,
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
