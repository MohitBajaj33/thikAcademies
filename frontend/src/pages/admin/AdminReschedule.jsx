import { useEffect, useState } from "react";
import axios from "axios";
import {getQuizzesAPI,rescheduleQuizeAPI} from '../../services/quizService';

export default function AdminReschedule() {
  const [quizzes, setQuizzes] = useState([]);
  const [editQuiz, setEditQuiz] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    getQuizzesAPI()
      .then((res) => setQuizzes(res.data));
  }, []);

  const handleUpdate = async (id) => {
    await rescheduleQuizeAPI(
      {
        id:id,
        data:{ startTime, endTime }
      }
    );
    setEditQuiz(null);
    window.location.reload(); // or refresh quiz list
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🕒 Reschedule Quizzes</h2>

      <table className="table-auto w-full text-sm border">
        <thead className="bg-gray-200">
          <tr>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q._id} className="border-t text-center">
              <td>{q.title}</td>
              <td>{new Date(q.startTime).toLocaleString()}</td>
              <td>{new Date(q.endTime).toLocaleString()}</td>
              <td>
                {editQuiz === q._id ? (
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="datetime-local"
                      className="border rounded p-1"
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input
                      type="datetime-local"
                      className="border rounded p-1"
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mt-1"
                      onClick={() => handleUpdate(q._id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditQuiz(q._id)}
                  >
                    Reschedule
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
