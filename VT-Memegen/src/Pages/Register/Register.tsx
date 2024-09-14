// src/components/Register.tsx
import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  // State variables for form fields and UI states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const { sendVerificationEmail } = useAuth();
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
      // Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendVerificationEmail(); // Ensure sendVerificationEmail accepts a user object

      // Set success message
      setMessage('Registration successful! Please check your email to verify your account.');

      // Optionally, navigate to email confirmation page after a delay
      setTimeout(() => {
        navigate('/email-confirmation');
      }, 3000);
    } catch (err: any) {
      // Set error message
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
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
            {/* Password Visibility Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Hide Password Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 3.293a1 1 0 00-1.414 1.414L4.586 6l-2.293 2.293a1 1 0 001.414 1.414L6 7.414l2.293 2.293a1 1 0 001.414-1.414L7.414 6l2.293-2.293a1 1 0 00-1.414-1.414L6 4.586 3.707 2.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                // Show Password Icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 3C5 3 1.73 6.11 0 10c1.73 3.89 5 7 10 7s8.27-3.11 10-7c-1.73-3.89-5-7-10-7zm0 12a5 5 0 100-10 5 5 0 000 10z" />
                  <path d="M10 7a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              )}
            </button>
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
