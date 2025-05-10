import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {registerAPI} from '../services/authService'
import {verifyEmailAPI,emailSendOneAPI} from '../services/emailService'

export default function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const isFormValid = () => {
    return (
      data.name.trim() &&
      /^\S+@\S+\.\S+$/.test(data.email) &&
      data.password.length >= 6
    );
  };

  const validateInputs = () => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Name is required';
    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errs.email = 'Email format is invalid';
    }
    if (!data.password.trim()) errs.password = 'Password is required';
    else if (data.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await emailSendOneAPI({ email: data.email });
      toast.success('OTP sent to email');

      setStep(2);
    } catch (err) {
      toast.error('Failed to send OTP');

    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) return alert('Please enter OTP');

    try {
      setLoading(true);
      await verifyEmailAPI({ email: data.email, otp });
      await registerAPI(data);
      toast.success('Registered successfully!');

      navigate('/');
    } catch {
      toast.error('Invalid OTP or registration failed');

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-50 from-blue-100 to-purple-200">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm max-h-screen overflow-auto">
        <h1 className=" flex justify-center text-xl items-center font-bold mb-4">Register</h1>

        {step === 1 && (
          <>
            <input
              type='text'
              required
              placeholder="Name"
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="border p-2 mb-1 w-full"
            />
            {errors.name && <div className="text-red-500 text-sm mb-2">{errors.name}</div>}

            <input
              type='email'
              required
              placeholder="Email"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="border p-2 mb-1 w-full"
            />
            {errors.email && <div className="text-red-500 text-sm mb-2">{errors.email}</div>}

            <input
              type="password"
              required
              placeholder="Password"
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="border p-2 mb-1 w-full"
            />
            {errors.password && <div className="text-red-500 text-sm mb-2">{errors.password}</div>}


            <button className="bg-blue-600 text-white py-2 w-full rounded" onClick={sendOtp}>
              Send OTP
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>

          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 mb-4 w-full"
            />
            <button
              className={`py-2 w-full rounded text-white ${otp.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              onClick={verifyOtp}
              disabled={!otp.trim()}
            >
              Verify & Register
            </button>


          </>
        )}
      </div>
    </div>
  );
}
