import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../configs/axios';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Verifying...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const response = await axios.post('/auth/verify-email', { token });
        console.log(response.data);
        if (response.data.success) {
          setStatus('Email verified successfully! Waiting for 3 seconds, we will redirect you to the dashboard.');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('Email verification failed. The token may be invalid or expired.');
        }
      } catch (error) {
        setStatus('An error occurred while verifying your email. Please try again later.');
      }
    };

    if (token) {
      verifyEmailToken();
    } else {
      setStatus('Invalid verification link.');
    }
  }, [token, navigate]);

  return (
    <div className="verification-status">
      <h2>{status}</h2>
    </div>
  );
}

export default VerifyEmail;
