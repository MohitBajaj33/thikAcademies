import { useEffect, useState } from "react";
import {getUserResultAPI} from "../../services/authService";

export default function UserAttempts() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getUserResultAPI()
      .then((res) => setResults(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-center">My Quiz Attempts</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border w-full text-sm text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-1">Quiz</th>
              <th className="px-2 py-1">Attempted</th>
              <th className="px-2 py-1">Correct</th>
              <th className="text-center">Incorrect</th>
              <th className="text-center">Total</th>
              <th className="px-2 py-1">Average</th>
              <th className="px-2 py-1">Browser</th>
              <th className="px-2 py-1">Time (s)</th>
              <th className="px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-100">
                <td className="px-2 py-1">{r.quizId?.title || "N/A"}</td>
                <td className="px-2 py-1">{r.attempted}</td>
                <td className="px-2 py-1">{r.correct}</td>
                <td className="text-center">{r.totalQuestions - r.correct}</td>
                <td className="text-center">{r.totalQuestions}</td>
                <td className="px-2 py-1">{r.average}%</td>
                <td className="px-2 py-1">{r.user.browser}</td>
                <td className="px-2 py-1">{r.timeTaken}s</td>
                <td className="px-2 py-1">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
