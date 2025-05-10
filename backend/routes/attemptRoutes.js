const express = require('express');
const router = express.Router();
const { attemptQuiz } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:quizId', protect, attemptQuiz);

module.exports = router;
