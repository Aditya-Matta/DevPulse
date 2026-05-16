const router = require('express').Router();
const { body } = require('express-validator');
const { getInterviews, createInterview, getInterview, updateInterview, deleteInterview } = require('../controllers/interview.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const interviewValidation = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('round').isIn(['OA', 'Phone', 'Technical', 'HR', 'Final']).withMessage('Invalid round type'),
  body('outcome').isIn(['Passed', 'Failed', 'Pending']).withMessage('Invalid outcome'),
  body('difficulty').isInt({ min: 1, max: 5 }).withMessage('Difficulty must be 1-5'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('topics').optional().isArray().withMessage('Topics must be an array'),
  validate,
];

router.use(authMiddleware);
router.get('/', getInterviews);
router.post('/', interviewValidation, createInterview);
router.get('/:id', getInterview);
router.put('/:id', interviewValidation, updateInterview);
router.delete('/:id', deleteInterview);

module.exports = router;
