const redis = require('../config/redis');

const AI_CALLS_PER_DAY = 3;

const aiRateLimitMiddleware = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const key = `ai_rate:${req.user.id}`;
  try {
    const count = await redis.incr(key);
    // Set TTL on first call (86400s = 24h)
    if (count === 1) {
      await redis.expire(key, 86400);
    }
    if (count > AI_CALLS_PER_DAY) {
      const ttl = await redis.ttl(key);
      const hoursLeft = Math.ceil(ttl / 3600);
      return res.status(429).json({
        success: false,
        message: `AI analysis limit reached (${AI_CALLS_PER_DAY}/day). Try again in ${hoursLeft}h.`,
        retryAfterHours: hoursLeft,
      });
    }
    req.aiCallsRemaining = AI_CALLS_PER_DAY - count;
    next();
  } catch (err) {
    // If Redis is unavailable, fail open (allow the request)
    console.warn('⚠️ Redis rate limit check failed, allowing request:', err.message);
    next();
  }
};

module.exports = aiRateLimitMiddleware;
