import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useNotification } from '../context/NotificationContext';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(''); // For OTP-based reset
  const [otp, setOtp] = useState('');     // For OTP-based reset
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const { token } = useParams(); // For token-based reset (e.g., /reset-password/:token)
  const [searchParams] = useSearchParams(); // For OTP-based reset (e.g., /reset-password?email=...&otp=...)

  const isTokenReset = !!token;
  const isOtpReset = searchParams.get('otp') && searchParams.get('email');

  useEffect(() => {
    if (isOtpReset) {
      setEmail(searchParams.get('email'));
      setOtp(searchParams.get('otp'));
    }
  }, [isOtpReset, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showNotification('Passwords do not match.', 'error');
      setLoading(false);
      return;
    }

    try {
      let endpoint = '';
      let body = {};

      if (isTokenReset) {
        endpoint = `http://localhost:5000/api/auth/reset-password/${token}`;
        body = { password };
      } else if (isOtpReset) {
        endpoint = 'http://localhost:5000/api/auth/reset-password-otp';
        body = { email, otp, password };
      } else {
        showNotification('Invalid reset method. Please use a valid link or OTP.', 'error');
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification(data.message || 'Password has been reset successfully!', 'success');
        navigate('/login');
      } else {
        showNotification(data.message || 'Failed to reset password.', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isTokenReset && !isOtpReset && (
              <>
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  id="otp"
                  label="One-Time Password (OTP)"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </>
            )}
            <Input
              id="password"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" isLoading={loading}>
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
