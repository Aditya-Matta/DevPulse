const Interview = require('../models/Interview.model');
const CompanyTag = require('../models/CompanyTag.model');

// GET /api/interviews
const getInterviews = async (req, res) => {
  try {
    const { outcome, company, topic, startDate, endDate, search, page = 1, limit = 20 } = req.query;
    const query = { userId: req.user.id };

    if (outcome) query.outcome = outcome;
    if (company) query.company = new RegExp(company, 'i');
    if (topic) query.topics = { $in: [topic.toLowerCase()] };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { company: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [interviews, total] = await Promise.all([
      Interview.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Interview.countDocuments(query),
    ]);

    res.json({ success: true, data: { interviews, total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/interviews
const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({ ...req.body, userId: req.user.id });
    // Upsert CompanyTag
    await CompanyTag.findOneAndUpdate(
      { company: interview.company },
      { $inc: { count: 1 }, $addToSet: { topics: { $each: interview.topics } } },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, data: { interview } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/interviews/:id
const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, data: { interview } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, data: { interview } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    // Decrement company count
    await CompanyTag.findOneAndUpdate(
      { company: interview.company },
      { $inc: { count: -1 } }
    );
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getInterviews, createInterview, getInterview, updateInterview, deleteInterview };
