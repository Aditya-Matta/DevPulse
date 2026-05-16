const router = require('express').Router();
const { getPrepCard } = require('../controllers/prepcard.controller');

// Public route — no auth needed
router.get('/:username/prepcard', getPrepCard);

module.exports = router;
