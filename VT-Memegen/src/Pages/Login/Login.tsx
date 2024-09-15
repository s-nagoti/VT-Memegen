// src/components/Login.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    try {
      await login(email, password);
      navigate('/'); // Navigate to the home page or desired route
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-maroon mb-6">Login</h2>

        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-maroon text-white font-semibold rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon"
          >
            Login
          </button>
        </form>

        {/* Register Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            onClick={handleRegister}
            className="mt-2 text-maroon hover:text-maroon-dark font-semibold"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
