import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { logOutUserAPI, userProfileAPI } from '../services/authService';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    userProfileAPI()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Loading...</p>;

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 rounded hover:bg-gray-200 transition-all ${
      isActive ? 'bg-white text-blue-700 font-semibold shadow' : 'text-white'
    }`;

  return (
    <div className="flex">
      <aside className="w-60 bg-gray-800 h-screen p-4">
        <h2 className="text-white font-bold text-xl mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {user.role === 'admin' ? (
            <>
              <NavLink to="/admin" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/admin/add-quiz" className={navLinkClass}>
                Add Quiz
              </NavLink>
              <NavLink to="/admin/resedhule-quiz" className={navLinkClass}>
                Quiz Rescheduled
              </NavLink>
              <NavLink to="/admin/all-user" className={navLinkClass}>
                All Student
              </NavLink>
              <NavLink to="/admin/email-send" className={navLinkClass}>
                Send Email
              </NavLink>
              <NavLink to="/admin/results" className={navLinkClass}>
                Results
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/user/attempts" className={navLinkClass}>
                My Attempts
              </NavLink>
            </>
          )}
          <button
            className="text-red-400 hover:text-red-600 mt-6 text-left px-4 py-2"
            onClick={async () => {
              await logOutUserAPI();
              localStorage.removeItem('user');
              toast.success('Logout successfully!');
              window.location.href = '/';
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
