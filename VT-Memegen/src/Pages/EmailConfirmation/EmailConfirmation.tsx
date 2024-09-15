import React, { useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';

const EmailVerification: React.FC = () => {
  const { sendVerificationEmail, currentUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<boolean>(false);

  const handleSendEmail = async () => {
    setSending(true);
    setMessage(null);
    setError(null);
    try {
      await sendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError('Failed to send verification email. Please try again later.');
    }
    setSending(false);
  };

  return (
    <div className="p-4 bg-red-100 text-red-800 rounded-lg mb-4">
      <p className="mb-2">Your email is not verified. Please verify to access all features.</p>
      <p className="mb-4">It may take a couple minutes for the email to send. We apologize for the delay.</p>
      <button
        onClick={handleSendEmail}
        disabled={sending}
        className={`px-4 py-2 bg-maroon text-white rounded-lg hover:bg-maroon-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-maroon ${
          sending ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {sending ? 'Sending...' : 'Resend Verification Email'}
      </button>
      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default EmailVerification;
