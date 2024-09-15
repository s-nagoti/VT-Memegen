// src/components/Register.tsx
import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../Contexts/AuthContext';
import { useUser } from '../../Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  // State variables for form fields and UI states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const { sendVerificationEmail } = useAuth();
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

    //add register here
    try {
      await register(email, password)
      setLoading(false)
      navigate('email-confirmation')
    } catch (err: any) {
      setError(err.message);
      setLoading(false)
    }
  };

 
  // Handler to navigate to Login page
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Centered Title */}
      <h1 className="text-4xl font-bold text-maroon mb-8">VT Memegen</h1>

      {/* Registration Form Container */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        {/* Form Heading */}
        <h2 className="text-3xl font-bold text-center text-maroon mb-6">Register</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {message && (
          <div className="mb-4 text-green-600 bg-green-100 p-3 rounded">
            {message}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
              placeholder="Your password"
            />
           
          </div>

          {/* Password Strength Indicator */}
          <div className="mt-2">
            <span className="text-gray-600 text-sm">Password strength:</span>
            <span
              className={`ml-2 font-semibold ${
                password.length < 6
                  ? 'text-red-600'
                  : password.length < 10
                  ? 'text-yellow-600'
                  : 'text-green-600'
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
            className="w-full py-2 px-4 bg-maroon text-white font-semibold rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

        {/* Login Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already registered?</p>
          <button
            onClick={handleLogin}
            className="mt-2 text-maroon hover:text-maroon-dark font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
