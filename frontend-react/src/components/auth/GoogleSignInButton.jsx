import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { GooglePhotosIcon } from '../dashboard/GoogleDriveStorageWidget';
import { Shield, Key, ExternalLink, X, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * GoogleIcon
 * Official 4-color Google 'G' brand vector
 */
export const GoogleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
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
 * Production Google Identity Services (GIS) / OAuth 2.0 Integration
 */
export const GoogleSignInButton = ({ text = 'Continue with Google', onSuccess, mode = 'login' }) => {
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customClientId, setCustomClientId] = useState(() => localStorage.getItem('studio_google_client_id') || '');
  const { googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const googleButtonContainerRef = useRef(null);

  const activeClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || customClientId;

  // Handle Google GIS Response with cryptographic JWT
  const handleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      // response.credential is the signed Google ID Token
      const res = await googleLogin({
        id_token: response.credential,
        credential: response.credential,
      });

      showToast('Successfully signed in with Google!', 'success');
      if (onSuccess) onSuccess();

      if (res?.data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast('Google token verification failed: ' + (err.message || 'Error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Google OAuth 2.0 Token Client (Popup with Photos Scope)
  const triggerGoogleOAuthPopup = () => {
    if (!activeClientId) {
      setShowConfigModal(true);
      return;
    }

    setLoading(true);
    try {
      if (window.google?.accounts?.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'openid email profile https://www.googleapis.com/auth/photoslibrary.readonly',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              const res = await googleLogin({
                access_token: tokenResponse.access_token,
              });
              showToast('Successfully authenticated with Google & Google Photos!', 'success');
              if (onSuccess) onSuccess();
              if (res?.data?.user?.role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/dashboard');
              }
            }
            setLoading(false);
          },
          error_callback: (error) => {
            console.error('Google OAuth error:', error);
            showToast('Google OAuth window closed or cancelled', 'warning');
            setLoading(false);
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
      } else {
        // Direct OAuth 2.0 popup window
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const authUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          new URLSearchParams({
            client_id: activeClientId,
            redirect_uri: window.location.origin,
            response_type: 'token id_token',
            scope: 'openid email profile https://www.googleapis.com/auth/photoslibrary.readonly',
            prompt: 'select_account',
            nonce: Math.random().toString(36).substring(2),
          });

        window.open(
          authUrl,
          'GoogleSignIn',
          `width=${width},height=${height},top=${top},left=${left}`
        );
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setShowConfigModal(true);
    }
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    if (!customClientId.trim()) {
      showToast('Please enter a valid Google Client ID', 'warning');
      return;
    }
    localStorage.setItem('studio_google_client_id', customClientId.trim());
    showToast('Google Client ID saved! Launching Google authentication...', 'success');
    setShowConfigModal(false);
    setTimeout(() => {
      triggerGoogleOAuthPopup();
    }, 500);
  };

  return (
    <>
      <button
        type="button"
        onClick={triggerGoogleOAuthPopup}
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
        <span>{loading ? 'Opening Google Sign-In...' : text}</span>
      </button>

      {/* Google OAuth Client ID Configuration Modal */}
      {showConfigModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowConfigModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'var(--bg-surface)',
              color: 'var(--text-main)',
              borderRadius: 'var(--border-radius-lg)',
              border: '1px solid var(--border-gold)',
              padding: '2rem 1.75rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <GoogleIcon size={28} />
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
                  Real Google OAuth 2.0 Setup
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                  Google Identity Services & Google Photos API
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              To open Google’s real sign-in window (<code>accounts.google.com</code>), enter your <strong>Google OAuth 2.0 Web Client ID</strong> from the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google Cloud Console</a>.
            </p>

            <form onSubmit={handleSaveClientId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Google Client ID (OAuth 2.0 Web App)
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1234567890-xxx.apps.googleusercontent.com"
                  value={customClientId}
                  onChange={(e) => setCustomClientId(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={async () => {
                    setShowConfigModal(false);
                    // Instant seamless fallback if user just wants to test right now
                    const res = await googleLogin({
                      email: 'kiruthikracer@gmail.com',
                      first_name: 'Kiruthik',
                      last_name: 'Studio VIP',
                    });
                    showToast('Logged in via Google account (Development Mode)', 'success');
                    if (onSuccess) onSuccess();
                    navigate('/dashboard');
                  }}
                  className="btn btn-outline"
                  style={{ flex: 1, fontSize: '0.82rem' }}
                >
                  Test Local Session
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.82rem' }}
                >
                  Save & Launch Google Popup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
