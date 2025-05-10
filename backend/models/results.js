const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    browser: String
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  totalQuestions: Number,
  attempted: Number,
  correct: Number,
  average: Number,
  timeTaken: Number,
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
