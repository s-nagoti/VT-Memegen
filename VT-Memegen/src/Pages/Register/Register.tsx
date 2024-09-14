// src/components/SignUp.tsx
import React, { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword , sendEmailVerification} from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { sendVerificationEmail } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await sendVerificationEmail();
      navigate('/email-confirmation')
    } catch (err: any) {
      setError(err.message);
    }
  };


  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>


      <div>
        <h1>Already Registered?</h1>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
    </div>
  );
};

export default Register;
