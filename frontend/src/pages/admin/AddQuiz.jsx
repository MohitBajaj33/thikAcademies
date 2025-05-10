import { useState } from "react";
import { createQuizAPI} from '../../services/quizService';
import { toast } from 'react-toastify';
export default function AddQuiz() {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");

  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctIndex: 0 },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "text") {
      newQuestions[index].text = value;
    } else if (field === "correctIndex") {
      newQuestions[index].correctIndex = parseInt(value);
    }
    setQuestions(newQuestions);
  };


  const handleOptionChange = (qIdx, optIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[optIdx] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const transformedQuestions = questions.map(q => ({
      question: q.text,
      options: q.options,
      correctAnswer: q.correctIndex,
    }));

    await createQuizAPI({
      title,
      questions: transformedQuestions,
      startTime,
      endTime,
    });

    toast.success("Quiz Created Successfully!");
    setTitle("");
    setQuestions([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
  } catch (err) {
    console.error(err);
    toast.error("Quiz creation failed.");
  }
};


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create New Quiz</h2>
      <div>
        <label className="block font-medium">Start Time</label>
        <input
          type="datetime-local"
          className="border px-3 py-2 w-full"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">End Time</label>
        <input
          type="datetime-local"
          className="border px-3 py-2 w-full"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Quiz Title</label>
          <input
            className="border px-3 py-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border p-4 rounded bg-gray-50 space-y-2">
            <div className="flex justify-between">
              <h4 className="font-semibold">Question {qIdx + 1}</h4>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  className="text-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              className="border px-3 py-1 w-full"
              placeholder="Enter question"
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(qIdx, "text", e.target.value)
              }
              required
            />

            <div className="grid grid-cols-2 gap-2">
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  className="border px-2 py-1"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIdx, optIdx, e.target.value)
                  }
                  required
                />
              ))}
            </div>

            <div>
              <label className="block font-medium mt-2">Correct Answer</label>
              <select
                value={q.correctIndex}
                onChange={(e) =>
                  handleQuestionChange(qIdx, "correctIndex", e.target.value)
                }
                className="border px-3 py-1"
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </select>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Question
          </button>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Submit Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
