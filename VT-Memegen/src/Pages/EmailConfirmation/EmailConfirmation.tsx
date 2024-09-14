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
    <div style={{ padding: '1rem', backgroundColor: '#ffdddd', margin: '1rem 0' }}>
      <p>Your email is not verified. Please verify to access all features.</p>
      <p>It may take a couple minutes for the email to send. We appologize for the delay</p>
      <button onClick={handleSendEmail} disabled={sending}>
        {sending ? 'Sending...' : 'Resend Verification Email'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EmailVerification;
