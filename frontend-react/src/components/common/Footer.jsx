import React from 'react';
import { Camera, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(10, 10, 10, 0.95)',
      padding: '4rem 2rem 2rem',
      marginTop: 'auto',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--gradient-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0d0d0d'
            }}>
              <Camera size={18} />
            </div>
            <span className="font-display" style={{ fontSize: '1.4rem', color: '#fff' }}>
              Face<span className="gold-text">Rec</span> Events
            </span>
          </div>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Next-generation event photo retrieval powered by DeepFace and Facenet512 vector embeddings. Find every snapshot of yourself in seconds.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="#dfb94a" /> Privacy & Accuracy
          </h4>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Your biometric data is encrypted into mathematical representations and never shared with third parties. You have total control to delete your registered vectors anytime.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="#dfb94a" /> Features
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--gray-light)' }}>
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
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.85rem',
        color: 'var(--gray)'
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
