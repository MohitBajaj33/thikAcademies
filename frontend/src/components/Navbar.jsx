
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Listen to login changes (custom event)
  useEffect(() => {
    const handleLoginChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userChanged', handleLoginChange);

    return () => {
      window.removeEventListener('userChanged', handleLoginChange);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Think<span className="text-purple-600">Academies</span>
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${user.name}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium transition duration-200"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
