const mongoose = require('mongoose');

const companyTagSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, unique: true, trim: true },
    topics: [{ type: String, trim: true, lowercase: true }],
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CompanyTag', companyTagSchema);
