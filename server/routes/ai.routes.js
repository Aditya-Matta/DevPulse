const router = require('express').Router();
const { analyse, lastAnalysis } = require('../controllers/ai.controller');
const authMiddleware = require('../middleware/auth.middleware');
const aiRateLimit = require('../middleware/rateLimit.middleware');

router.use(authMiddleware);
router.post('/analyse', aiRateLimit, analyse);
router.get('/last-analysis', lastAnalysis);

module.exports = router;
