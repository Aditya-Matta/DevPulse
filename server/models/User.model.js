const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30 },
    avatarUrl: { type: String, default: '' },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    lastAIAnalysis: {
      generatedAt: { type: Date, default: null },
      weaknesses: [
        {
          topic: String,
          diagnosis: String,
          studyPlan: [String],
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
