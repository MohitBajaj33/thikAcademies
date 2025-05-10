const Quiz = require('../models/quiz');
const Result = require('../models/results');
const UAParser = require('ua-parser-js');

exports.attemptQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let correct = 0, attempted = 0;

    quiz.questions.forEach((q, idx) => {
      
      if (answers[idx] !== null && answers[idx] !== undefined) {
        attempted++;
        if (q.correctAnswer === answers[idx]) correct++;
      }
    });

    const avg = (correct / quiz.questions.length) * 100;
    const parser = new UAParser(req.headers['user-agent']);
    const browser = parser.getBrowser().name || 'Unknown';

    const result = await Result.create({
      user: {
        name: req.user.name,
        email: req.user.email,
        browser,
      },
      quizId,
      totalQuestions: quiz.questions.length,
      attempted,
      correct,
      average: avg.toFixed(2),
      timeTaken,
    });

    return res.status(200).json({ message: 'Result submitted', result });

  } catch (error) {
    console.error("Quiz attempt error:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
