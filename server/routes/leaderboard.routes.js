const router = require('express').Router();
const { topCompanies, topFailedTopics } = require('../controllers/leaderboard.controller');

// Public routes — no auth needed
router.get('/companies', topCompanies);
router.get('/topics', topFailedTopics);

module.exports = router;
