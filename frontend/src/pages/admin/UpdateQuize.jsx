import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizeIdAPI, updateQuizeIdAPI } from '../../services/quizService';

export default function EditQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    getQuizeIdAPI(quizId).then((res) => {
      const fixed = {
        ...res.data,
        questions: res.data.questions.map((q) => ({
          ...q,
          options: q.options || [],
        })),
      };
      setQuiz(fixed);
    });
  }, [quizId]);

  const handleChange = (qIndex, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].correctAnswer = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options.push('');
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
    };

    if (quiz && Array.isArray(quiz.questions)) {
      setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    }
  };

  const removeQuestion = (qIndex) => {
    const updatedQuestions = quiz.questions.filter((_, index) => index !== qIndex);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    await updateQuizeIdAPI({ id: quizId, data: quiz });
    navigate('/admin');
  };

  if (!quiz) return <p>Loading...</p>;
  if (!quiz.questions || quiz.questions.length === 0) return <p>No questions available.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={qIndex} className="bg-gray-50 p-4 rounded shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <label className="block font-semibold">Question {qIndex + 1}</label>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-600 hover:underline text-sm"
              >
                🗑 Remove
              </button>
            </div>

            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              value={q.question}
              onChange={(e) => handleChange(qIndex, 'question', e.target.value)}
            />

            <div className="space-y-2">
              {q.options?.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 border p-2 rounded"
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                  />
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctAnswer === opt}
                    onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                  />
                  <span className="text-sm text-gray-600">Correct</span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-blue-600 hover:underline mt-2"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 font-semibold"
        >
          + Add Question
        </button>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold"
        >
          Update Quiz
        </button>
      </form>
    </div>
  );
}
