const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    round: {
      type: String,
      enum: ['OA', 'Phone', 'Technical', 'HR', 'Final'],
      required: true,
    },
    outcome: {
      type: String,
      enum: ['Passed', 'Failed', 'Pending'],
      required: true,
    },
    difficulty: { type: Number, min: 1, max: 5, required: true },
    topics: [{ type: String, trim: true, lowercase: true }],
    notes: { type: String, default: '' },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index for efficient filtering
interviewSchema.index({ userId: 1, date: -1 });
interviewSchema.index({ userId: 1, outcome: 1 });
interviewSchema.index({ userId: 1, company: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
