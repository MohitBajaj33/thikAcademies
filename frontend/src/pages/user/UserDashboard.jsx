import { useEffect, useState } from "react";
import {getQuizzesAPI} from "../../services/quizService";

export default function UserDashboard() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getQuizzesAPI();
        setQuizzes(res.data);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };
    fetchQuizzes();
  }, []);

  const now = new Date();

const activeQuizzes = quizzes.filter((quiz) => {
  const start = new Date(quiz.startTime);
  const end = new Date(quiz.endTime);
  return now >= start && now <= end;
});


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
      <ul className="space-y-4">
        {activeQuizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="border p-4 rounded bg-white shadow-md flex justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-sm text-gray-500">
                {quiz.questions.length} Questions
              </p>
            </div>
            <a
              href={`user/quiz/${quiz._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Attempt
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
