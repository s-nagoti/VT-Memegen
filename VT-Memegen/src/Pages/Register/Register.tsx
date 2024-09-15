// src/components/Register.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserContext';

const Register: React.FC = () => {
  // State variables for form fields and UI states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const { register } = useUser();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    setMessage('');
    setLoading(true); // Start loading

    try {
      if(email.includes('@vt.edu')){
      await register(email, password);
      }else{
        setError('Please use a valid VT email');
      }

      setLoading(false);
      navigate('/email-confirmation');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handler to navigate to Login page
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkGrey px-4">
      {/* Registration Form Container */}
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
        {/* Centered Title */}
        <h1 className="text-4xl font-extrabold text-maroon text-center mb-6">VT Memegen</h1>

        {/* Form Heading */}
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Register</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-200 bg-red-800 p-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 text-green-200 bg-green-800 p-3 rounded">
            {message}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-300 font-medium mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon transition-colors"
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye Off Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 3.293a1 1 0 010 1.414L5.414 6H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-1.414l1.707-1.293a1 1 0 00-1.414-1.414L16.172 6H14a1 1 0 01-1-1V5a1 1 0 011-1h2.172l-1.707-1.707a1 1 0 10-1.414 1.414L12.586 5H11a2 2 0 00-2 2v1h2a1 1 0 011 1v.586l-1.293 1.293a1 1 0 101.414 1.414L13 8.414V7a1 1 0 012 0v2a1 1 0 11-2 0v-1.586l-1.293 1.293a1 1 0 01-1.414-1.414L11 5.586V4a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L9.586 7H8a1 1 0 01-1-1V6a1 1 0 011-1h1.586l-1.293-1.293a1 1 0 111.414-1.414L10 4.414V3a1 1 0 012 0v1a2 2 0 01-2 2H8a1 1 0 110-2h1.586l-1.293-1.293a1 1 0 011.414-1.414L10 3.414V2a1 1 0 112 0v1a3 3 0 00-3 3v1.586l1.293 1.293a1 1 0 001.414-1.414L10 7.414V6a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L9 8.414V9a1 1 0 01-2 0V8a1 1 0 112 0v1a2 2 0 012 2v1a3 3 0 00-3-3h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L8 9.414V10a1 1 0 01-2 0V9a1 1 0 112 0v1a2 2 0 012 2v1a3 3 0 00-3-3H6a1 1 0 110-2h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L4 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L3 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L4 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L3 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7a1 1 0 012 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L5 8.414V7a1 1 0 012 0v1a3 3 0 00-3 3v1a4 4 0 014-4h1.586l-1.293-1.293a1 1 0 011.414-1.414L7 9.414V8a1 1 0 112 0v1a2 2 0 01-2 2h-1.586l1.293 1.293a1 1 0 01-1.414 1.414L6 8.414V7z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Eye Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 100-10 5 5 0 000 10z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="flex items-center">
            <span className="text-gray-400 text-sm">Password strength:</span>
            <span
              className={`ml-2 font-semibold ${
                password.length < 6
                  ? 'text-red-500'
                  : password.length < 10
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              {password.length < 6
                ? 'Weak'
                : password.length < 10
                ? 'Medium'
                : 'Strong'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-maroon text-white font-semibold rounded-lg hover:bg-maroonDark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                {/* Loading Spinner */}
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-600"></div>

        {/* Login Section */}
        <div className="text-center">
          <p className="text-gray-400">Already registered?</p>
          <button
            onClick={handleLogin}
            className="mt-2 text-maroon hover:text-maroonDark font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
