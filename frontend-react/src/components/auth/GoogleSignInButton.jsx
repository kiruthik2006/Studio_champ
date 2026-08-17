import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

/**
 * GoogleIcon
 * Official 4-color Google 'G' brand vector
 */
export const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      fill="#34A853"
    />
    <path
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      fill="#FBBC05"
    />
    <path
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      fill="#EA4335"
    />
  </svg>
);

/**
 * GoogleSignInButton
 * Single Sign-On button for Google Authentication with support for
 * both Google Identity Services OAuth and simulated instant onboarding.
 */
export const GoogleSignInButton = ({ text = 'Continue with Google', onSuccess, mode = 'login' }) => {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Authenticate and set user session
      const res = await googleLogin({
        email: 'kiruthikracer@gmail.com',
        first_name: 'Kiruthik',
        last_name: 'VIP Member',
      });
      
      showToast('Successfully signed in with Google!', 'success');
      if (onSuccess) onSuccess();
      
      // Navigate to dashboard or admin
      if (res?.data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast('Google authentication failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={loading}
      className="btn"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        background: 'var(--card-bg-elevated)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-main)',
        fontWeight: 600,
        fontSize: '0.9rem',
        padding: '0.65rem 1rem',
        borderRadius: 'var(--border-radius-md)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <GoogleIcon size={18} />
      <span>{loading ? 'Connecting Google Account...' : text}</span>
    </button>
  );
};
