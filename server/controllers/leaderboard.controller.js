const Interview = require('../models/Interview.model');
const CompanyTag = require('../models/CompanyTag.model');
const redis = require('../config/redis');

const CACHE_TTL = 600; // 10 minutes

// GET /api/leaderboard/companies
const topCompanies = async (req, res) => {
  try {
    const cacheKey = 'leaderboard:companies';
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) return res.json({ success: true, data: { companies: cached, cached: true } });

    const companies = await CompanyTag.find({ count: { $gt: 0 } })
      .sort({ count: -1 })
      .limit(20)
      .select('company count topics');

    await redis.set(cacheKey, companies, { ex: CACHE_TTL }).catch(() => {});
    res.json({ success: true, data: { companies, cached: false } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/leaderboard/topics
const topFailedTopics = async (req, res) => {
  try {
    const cacheKey = 'leaderboard:topics';
    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) return res.json({ success: true, data: { topics: cached, cached: true } });

    const topics = await Interview.aggregate([
      { $match: { outcome: 'Failed' } },
      { $unwind: '$topics' },
      { $group: { _id: '$topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { topic: '$_id', count: 1, _id: 0 } },
    ]);

    await redis.set(cacheKey, topics, { ex: CACHE_TTL }).catch(() => {});
    res.json({ success: true, data: { topics, cached: false } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { topCompanies, topFailedTopics };
