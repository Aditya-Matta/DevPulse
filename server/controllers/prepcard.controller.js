const User = require('../models/User.model');
const Interview = require('../models/Interview.model');

// GET /api/users/:username/prepcard  (public — no auth)
const getPrepCard = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() })
      .select('name username avatarUrl streakCount createdAt');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const interviews = await Interview.find({ userId: user._id });
    const total = interviews.length;
    const passed = interviews.filter((i) => i.outcome === 'Passed').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    // Top 5 topics
    const topicCounts = {};
    interviews.forEach((iv) => {
      iv.topics.forEach((t) => {
        topicCounts[t] = (topicCounts[t] || 0) + 1;
      });
    });
    const top5Topics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    res.json({
      success: true,
      data: {
        user: { name: user.name, username: user.username, avatarUrl: user.avatarUrl, streakCount: user.streakCount, memberSince: user.createdAt },
        stats: { totalInterviews: total, passRate, top5Topics },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPrepCard };
