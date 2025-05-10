import { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import { adminexportAPI, getAllResult } from '../../services/authService'

export default function ResultList() {
      const [results, setResults] = useState([]);

      useEffect(() => {
            getAllResult()
                  .then(res => setResults(res.data));
      }, []);

      const exportToExcel = async () => {
            try {
                  const response = await adminexportAPI({
                        responseType: 'blob',
                        withCredentials: true
                  });
                  const blob = new Blob([response.data], { type: response.headers['content-type'] });
                  saveAs(blob, 'quiz-results.xlsx');
            } catch (err) {
                  toast.error("Export failed.");
            }
      };

      return (
            <div>
                  <h2 className="text-xl font-bold mb-4">All User Results</h2>
                  <table className="table-auto border w-full text-sm">
                        <thead>
                              <tr className="bg-gray-200">
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Email</th>
                                    <th className="text-center">Quiz</th>
                                    <th className="text-center">Attempted</th>
                                    <th className="text-center">Correct</th>
                                    <th className="text-center">Incorrect</th>
                                    <th className="text-center">Total</th>
                                    <th className="text-center">Average</th>
                                    <th className="text-center">Browser</th>
                                    <th className="text-center">Time (s)</th>
                                    <th className="text-center">Date</th>
                              </tr>
                        </thead>
                        <tbody>
                              {results.map((r, idx) => (
                                    <tr key={idx} className="border-t">
                                          <td className="text-center">{r.user.name}</td>
                                          <td className="text-center">{r.user.email}</td>
                                          <td className="text-center">{r.quizId?.title || "N/A"}</td>
                                          <td className="text-center">{r.attempted}</td>
                                          <td className="text-center">{r.correct}</td>
                                          <td className="text-center">{r.totalQuestions - r.correct}</td>
                                          <td className="text-center">{r.totalQuestions}</td>
                                          <td className="text-center">{r.average}%</td>
                                          <td className="text-center">{r.user.browser}</td>
                                          <td className="text-center">{r.timeTaken}s</td>
                                          <td className="text-center">{new Date(r.createdAt).toLocaleString()}</td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>


                  <button
                        onClick={exportToExcel}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
                  >
                        Export to Excel
                  </button>
            </div>
      );
}
