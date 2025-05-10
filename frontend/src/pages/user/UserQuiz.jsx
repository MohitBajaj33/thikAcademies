
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function UserQuiz() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quiz/${quizId}`, { withCredentials: true })
      .then(res => {
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      });
  }, [quizId]);

  const handleSelect = (qIdx, optIdx) => {
    const newAns = [...answers];
    newAns[qIdx] = optIdx;
    setAnswers(newAns);
  };

  const handleSubmit = async () => {
    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const res = await axios.post(`http://localhost:5000/api/attempt/${quizId}`, {
        answers,
        timeTaken
      }, { withCredentials: true });
  
      toast.success('Result submitted ✅');
      setSubmitted(true);
  
      setTimeout(() => navigate('/user'), 2000);
    } catch (err) {
      toast.error('Submission failed. Try again!');
    }
  };

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      {quiz.questions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <p className="font-semibold">{idx + 1}. {q.question}</p>
          {q.options.map((opt, i) => (
            <div key={i}>
              <label>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value={i}
                  checked={answers[idx] === i}
                  onChange={() => handleSelect(idx, i)}
                />
                {` ${opt}`}
              </label>
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit Quiz</button>
      ) : (
        <div className="text-green-600 font-semibold">Result submitted successfully ✅</div>
      )}
    </div>
  );
}
