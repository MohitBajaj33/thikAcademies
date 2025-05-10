
import { useEffect, useState } from "react";
import {getQuizzesAPI} from "../../services/quizService";

export default function AdminDashboard() {
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




  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Quizzes</h2>
      <ul className="space-y-4">
        {quizzes.map((quiz) => (
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
              href={`/admin/update/${quiz._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
