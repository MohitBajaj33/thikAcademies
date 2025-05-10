const express = require('express');
const router = express.Router();
const { createQuiz, getAllQuizzes, exportResults, getQuizById ,updateQuiz,rescheduleQuiz} = require('../controllers/quizController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/create', protect, adminOnly, createQuiz);
router.get('/', protect, getAllQuizzes);
router.get('/export/:quizId', protect, adminOnly, exportResults);
router.get('/:id', protect, getQuizById);
router.put('/:id/reschedule',protect,adminOnly,rescheduleQuiz)
router.post('/:quizId',protect,adminOnly,updateQuiz);

module.exports = router;
