const Quiz = require('../models/quiz');
const Result = require('../models/results');
const ExcelJS = require('exceljs');

// Create quiz
exports.createQuiz = async (req, res) => {
  const { title, questions, startTime, endTime } = req.body;

  const quiz = new Quiz({
    title,
    questions,
    startTime,
    endTime,
  });

  await quiz.save();
  res.status(201).json({ message: "Quiz created" });
};

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).json({ message: 'Quiz not found' });
  }
  res.json(quiz);
};

exports.rescheduleQuiz = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    const updated = await Quiz.findByIdAndUpdate(
      req.params.id,
      { startTime, endTime },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to reschedule quiz" });
  }
}
// Export to Excel
exports.exportResults = async (req, res) => {
  const { quizId } = req.params;
  const results = await Result.find({ quizId });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Results');

  sheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Attempted', key: 'attempted' },
    { header: 'Correct', key: 'correct' },
    { header: 'Average (%)', key: 'average' },
    { header: 'Browser', key: 'browser' },
    { header: 'Time Taken (sec)', key: 'timeTaken' },
  ];

  results.forEach((r) => {
    sheet.addRow({
      name: r.user.name,
      email: r.user.email,
      attempted: r.attempted,
      correct: r.correct,
      average: r.average,
      browser: r.user.browser,
      timeTaken: r.timeTaken
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=results_${quizId}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
};

exports.updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const updatedData = req.body;
 console.log(updatedData.questions);
 
  try {
    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Replace the existing questions with the new ones
    quiz.questions = updatedData.questions || [];

    // Update other fields if necessary
    quiz.title = updatedData.title || quiz.title;

    // Save the updated quiz
    await quiz.save();

    res.status(200).json({ message: 'Quiz updated successfully', quiz });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quiz', error });
  }
};



