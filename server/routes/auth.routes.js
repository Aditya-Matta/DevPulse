const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, logout, refresh, me } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 chars').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username: letters, numbers, underscores only'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], login);

router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authMiddleware, me);

module.exports = router;
