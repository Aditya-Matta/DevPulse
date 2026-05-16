const router = require('express').Router();
const { createRoom, getRoom, joinRoom } = require('../controllers/room.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.post('/create', createRoom);
router.get('/:code', getRoom);
router.post('/:code/join', joinRoom);

module.exports = router;
