import React from 'react';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--footer-bg)',
      padding: '4rem 2rem 2rem',
      marginTop: 'auto',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '3rem'
      }}>
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <BrandLogo size="small" textSuffix="Events" />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Next-generation event photo retrieval powered by DeepFace and Facenet512 vector embeddings. Find every snapshot of yourself in seconds.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" /> Privacy & Accuracy
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Your biometric data is encrypted into mathematical representations and never shared with third parties. You have total control to delete your registered vectors anytime.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" /> Features
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <li>• Multi-Angle Live Face Registration</li>
            <li>• 512-Dimensional Vector Matching</li>
            <li>• Event Gallery Bulk Ingestion</li>
            <li>• Full-Resolution Instant Downloads</li>
          </ul>
        </div>
      </div>

      <div style={{
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
        color: 'var(--text-muted)'
      }}>
        <div>
          © {new Date().getFullYear()} FaceRec Events / Studio Champ. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Built with <Heart size={14} color="#dfb94a" fill="#dfb94a" /> for event photographers & guests.
        </div>
      </div>
    </footer>
  );
};
