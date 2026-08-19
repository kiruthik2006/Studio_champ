import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../../context/ThemeContext';

export const Footer = () => {
  const { isLight } = useTheme();

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid var(--border-subtle)',
        background: isLight ? 'rgba(251, 250, 247, 0.96)' : 'rgba(13, 13, 13, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '3.5rem 2rem 2rem',
        marginTop: 'auto',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
        boxShadow: isLight ? '0 -10px 40px rgba(0, 0, 0, 0.04)' : '0 -10px 40px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <BrandLogo size="small" textSuffix="Events" />
          </div>
          <p style={{ color: 'var(--text-main)', opacity: 0.88, fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 440, fontWeight: 450 }}>
            Next-generation event photo retrieval. Find every snapshot of yourself and your loved ones from events in seconds.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <ShieldCheck size={18} color="var(--primary)" /> Privacy & Security Guarantee
          </h4>
          <p style={{ color: 'var(--text-main)', opacity: 0.88, fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 460, fontWeight: 450 }}>
            Your biometric data is encrypted into mathematical representations and never shared with third parties. You have total control to delete your registered face vectors anytime.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          opacity: 0.82,
        }}
      >
        <div>
          © {new Date().getFullYear()} Presence Events / Studio Champ. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Built with <Heart size={14} color="#dfb94a" fill="#dfb94a" /> for event photographers & guests.
        </div>
      </div>
    </footer>
  );
};
