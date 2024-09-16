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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handler for form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    setMessage('');
    setLoading(true); // Start loading

    try {
      if (email.includes('@vt.edu')) {
        await register(email, password);
        navigate('/email-confirmation');
      } else {
        setError('Please use a valid VT email');
      }
      setLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Registration Form Container */}
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Centered Title */}
        <h1 className="text-4xl font-extrabold text-[#861F41] text-center mb-6">VT Memegen</h1>

        {/* Form Heading */}
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Register</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 bg-red-200 p-4 rounded-lg border border-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 text-green-500 bg-green-200 p-4 rounded-lg border border-green-400">
            {message}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-white font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87722] transition-colors text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-white font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87722] transition-colors text-white"
              placeholder="Your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#861F41] text-white font-semibold rounded-lg hover:bg-[#E87722] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#E87722] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="mt-2 text-[#E87722] hover:text-[#861F41] font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
