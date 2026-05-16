const Interview = require('../models/Interview.model');
const User = require('../models/User.model');
const { analyseInterviews } = require('../services/claude.service');

// POST /api/ai/analyse
const analyse = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(50)
      .select('company role round outcome difficulty topics notes date');

    if (interviews.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Log at least 3 interviews before requesting AI analysis.',
      });
    }

    const result = await analyseInterviews(interviews);

    // Persist analysis to user document
    await User.findByIdAndUpdate(req.user.id, {
      'lastAIAnalysis.generatedAt': new Date(),
      'lastAIAnalysis.weaknesses': result.weaknesses,
    });

    res.json({
      success: true,
      data: {
        ...result,
        generatedAt: new Date(),
        callsRemaining: req.aiCallsRemaining ?? null,
      },
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(502).json({ success: false, message: 'AI returned invalid response. Try again.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ai/last-analysis
const lastAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('lastAIAnalysis');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: { analysis: user.lastAIAnalysis } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { analyse, lastAnalysis };
