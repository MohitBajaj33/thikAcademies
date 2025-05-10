const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  
  startTime: Date,   
  endTime: Date,   
  duration: Number, 
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
