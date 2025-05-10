const Result = require('../models/results');
// const Quiz = require('../models/quiz');
const ExcelJS = require('exceljs');

exports.getAllResults = async (req, res) => {
  const results = await Result.find().populate('quizId');
  res.json(results);
};

exports.getUserResults = async (req, res) => {
  const results = await Result.find({ "user.email": req.user.email }).populate('quizId');
  res.json(results);
};


exports.exportResultsToExcel = async (req, res) => {
  const results = await Result.find().populate('quizId');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Quiz Results');

  sheet.columns = [
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Quiz', key: 'quiz', width: 25 },
    { header: 'Attempted', key: 'attempted', width: 10 },
    { header: 'Correct', key: 'correct', width: 10 },
    { header: 'Average (%)', key: 'average', width: 12 },
    { header: 'Browser', key: 'browser', width: 20 },
    { header: 'Time Taken (s)', key: 'timeTaken', width: 15 },
    { header: 'Date', key: 'date', width: 25 },
  ];

  results.forEach((r) => {
    sheet.addRow({
      name: r.user.name,
      email: r.user.email,
      quiz: r.quizId?.title || 'N/A',
      attempted: r.attempted,
      correct: r.correct,
      average: r.average,
      browser: r.user.browser,
      timeTaken: r.timeTaken,
      date: new Date(r.createdAt).toLocaleString(),
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=results.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};
