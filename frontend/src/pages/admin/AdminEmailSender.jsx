import React, { useEffect, useState } from "react";
import axios from "axios";
import {emailSenderApi} from '../../services/emailService'

export default function AdminEmailSender() {
  const [users, setUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/userall", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const sendEmails = async () => {
    if (!subject || !message)
      return setResult("⚠️ Subject and message required");

    setLoading(true);
    try {
      const url = sendToAll
        ? `/email/send-all`
        : `/email/send-multiple`;

      const payload = sendToAll
        ? { subject, message }
        : { emails: selectedEmails, subject, message };

        
      const res = await emailSenderApi(url, payload);

      setResult(res.data.message || "✅ Email(s) sent successfully");
    } catch (err) {
      console.error(err);
      setResult("❌ Failed to send email(s)");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6"> Send Email to Users</h2>

      {/* Subject */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Subject</label>
        <input
          type="text"
          placeholder="Enter subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Message</label>
        <textarea
          placeholder="Enter message or quiz link"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded h-32"
        ></textarea>
      </div>

      {/* Toggle All Users */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sendToAll}
            onChange={(e) => {
              setSendToAll(e.target.checked);
              setSelectedEmails([]);
            }}
          />
          <span className="font-medium">Send to All Users</span>
        </label>
      </div>

      {/* Select Specific Users */}
      {!sendToAll && (
        <div className="mb-4">
          <p className="font-medium mb-1">Select Users:</p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border p-2 rounded">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(user.email)}
                  onChange={() => toggleEmail(user.email)}
                />
                {user.name} ({user.email})
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={sendEmails}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading || (!sendToAll && selectedEmails.length === 0)}
      >
        {loading ? "Sending..." : "Send Email"}
      </button>

      {result && <p className="mt-4 text-sm text-gray-700">{result}</p>}
    </div>
  );
}
