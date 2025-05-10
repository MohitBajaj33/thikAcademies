
import { useState } from 'react';
import { loginAPI } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: '', password: '' });

  const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
  const isValidPassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: isValidEmail(email) ? '' : 'Invalid email format',
      password: isValidPassword(password) ? '' : 'Password must be at least 6 characters',
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const res = await loginAPI({ email, password });
      const userData = res?.data?.user;
      const role = userData?.role;
      const token = res?.data.token
      console.log(token);
      
      if (userData && role) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", JSON.stringify(token));
        window.dispatchEvent(new Event('userChanged'));
        toast.success('Login successful!');
        navigate(role === 'admin' ? '/admin' : '/user');
      } else {
        toast.error('Login failed!');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 from-blue-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 ${
              errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
