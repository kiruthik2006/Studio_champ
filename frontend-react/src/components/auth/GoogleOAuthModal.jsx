import React, { useState } from 'react';
import { GoogleIcon } from './GoogleSignInButton';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { GooglePhotosIcon } from '../dashboard/GoogleDriveStorageWidget';
import { Shield, Check, Lock, ExternalLink, X, Plus } from 'lucide-react';

/**
 * GoogleOAuthModal
 * Interactive Google Account Chooser & Consent Screen
 * Opens when the user clicks "Continue with Google"
 */
export const GoogleOAuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const { googleLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [step, setStep] = useState('select_account'); // 'select_account' | 'consent'
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Available Google Accounts on this machine/session
  const availableAccounts = [
    {
      email: 'kiruthikracer@gmail.com',
      name: 'Kiruthik',
      avatarColor: '#4285F4',
      avatarLetter: 'K',
      signedIn: true,
    },
    {
      email: 'studiochamp.vip@gmail.com',
      name: 'Studio Champ Pro',
      avatarColor: '#EA4335',
      avatarLetter: 'S',
      signedIn: false,
    },
  ];

  const handleSelectAccount = (account) => {
    setSelectedEmail(account);
    setStep('consent');
  };

  const handleConfirmOAuth = async () => {
    if (!selectedEmail) return;
    setLoading(true);

    try {
      const res = await googleLogin({
        email: selectedEmail.email,
        first_name: selectedEmail.name.split(' ')[0] || 'User',
        last_name: selectedEmail.name.split(' ')[1] || 'Studio Member',
      });

      showToast(`Signed in as ${selectedEmail.email}`, 'success');
      onClose();

      if (res?.data?.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      showToast('Google OAuth failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          color: '#202124',
          borderRadius: '12px',
          padding: '2rem 1.75rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#5f6368',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <GoogleIcon size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 500, margin: 0, color: '#202124' }}>
            {step === 'select_account' ? 'Choose an account' : 'Sign in with Google'}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#5f6368', margin: '0.35rem 0 0' }}>
            to continue to <strong style={{ color: '#202124' }}>Studio Champ</strong>
          </p>
        </div>

        {/* Step 1: Account Selection */}
        {step === 'select_account' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {availableAccounts.map((account) => (
              <div
                key={account.email}
                onClick={() => handleSelectAccount(account)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f3f4',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: account.avatarColor,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {account.avatarLetter}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>
                    {account.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#5f6368' }}>
                    {account.email}
                  </div>
                </div>
                {account.signedIn && (
                  <span style={{ fontSize: '0.72rem', color: '#137333', fontWeight: 600, background: '#e6f4ea', padding: '0.15rem 0.45rem', borderRadius: '999px' }}>
                    Signed in
                  </span>
                )}
              </div>
            ))}

            {/* Use another account */}
            <div
              onClick={() =>
                handleSelectAccount({
                  email: 'kiruthikracer@gmail.com',
                  name: 'Kiruthik (Default)',
                  avatarColor: '#4285F4',
                  avatarLetter: 'K',
                })
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.75rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                color: '#1a73e8',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid #dadce0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5f6368',
                }}
              >
                <Plus size={18} />
              </div>
              <span>Use another account</span>
            </div>
          </div>
        )}

        {/* Step 2: Scopes & Permissions Consent */}
        {step === 'consent' && selectedEmail && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Selected User Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                background: '#f8f9fa',
                borderRadius: '999px',
                border: '1px solid #dadce0',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: selectedEmail.avatarColor,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {selectedEmail.avatarLetter}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#202124', fontWeight: 600, flex: 1 }}>
                {selectedEmail.email}
              </div>
              <button
                type="button"
                onClick={() => setStep('select_account')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1a73e8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Change
              </button>
            </div>

            {/* Permission Scopes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ color: '#5f6368' }}>
                Studio Champ wants to access your Google Account:
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#3c4043' }}>
                <Check size={16} color="#1a73e8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>View your primary Google Account email address and basic profile info.</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', color: '#3c4043' }}>
                <GooglePhotosIcon size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  Allow automatic portrait delivery and biometric face indexing with Google Photos.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setStep('select_account')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#1a73e8',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmOAuth}
                disabled={loading}
                style={{
                  background: '#1a73e8',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {loading ? 'Signing in...' : 'Allow & Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f3f4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#70757a',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Shield size={13} color="#1a73e8" />
            <span>Google Identity Services</span>
          </div>
          <span>Privacy • Terms</span>
        </div>
      </div>
    </div>
  );
};
