import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { NeuralCanvas } from '../components/common/NeuralCanvas';
import { LoginModal } from '../components/auth/LoginModal';
import { RegisterModal } from '../components/auth/RegisterModal';
import { InteractiveBiometricHero } from '../components/landing/InteractiveBiometricHero';
import { CosineSimulatorWidget } from '../components/landing/CosineSimulatorWidget';
import { EditorialShowcase } from '../components/landing/EditorialShowcase';
import { VisualStepJourney } from '../components/landing/VisualStepJourney';
import {
  Camera,
  Cpu,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Sliders,
  HardDrive
} from 'lucide-react';

export const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  };

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      handleOpenRegister();
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenLogin={handleOpenLogin} onOpenRegister={handleOpenRegister} />
      <NeuralCanvas />

      {/* 1. Interactive Biometric Hero Showcase */}
      <InteractiveBiometricHero
        onStart={handleCTA}
        onLogin={handleOpenLogin}
        isAuthenticated={isAuthenticated}
      />

      {/* 2. Interactive Live Cosine Similarity Simulator */}
      <CosineSimulatorWidget />

      {/* 3. Visual 3-Step Journey */}
      <VisualStepJourney />

      {/* 4. Curated Editorial Stories ("Presence in the Moment") */}
      <EditorialShowcase />

      {/* 5. AI Technology & Privacy Architecture Section */}
      <section
        id="technology"
        style={{
          padding: '5rem 2rem',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-card-elevated"
          style={{
            padding: '3.5rem 3rem',
            borderRadius: '28px',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.03) 50%, var(--card-bg) 100%)',
          }}
        >
          {/* Left: Architecture Narrative */}
          <div>
            <span
              className="status-badge badge-gold"
              style={{
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Cpu size={14} />
              <span>Biometric Security Architecture</span>
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                color: 'var(--text-main)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              512-D Neural Embeddings vs. Legacy Tagging
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Unlike basic thumbnail comparison, Presence generates 512-dimensional Euclidean space vectors. Our mathematical representations capture subtle facial geometry and distances that remain resilient across sunglasses, dynamic stage lighting, and candid expressions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={19} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Cosine Similarity Distance:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    Calculates high-dimensional angular distance in milliseconds across thousands of portraits.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={19} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Zero Raw Photo Storage:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    Biometric vectors are encrypted mathematical numbers; raw scan images can be purged instantly.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={19} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Google Cloud & Drive Integration:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                    Stream direct to personal Google Photos and Drive libraries with OAuth2 security.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Real-Time Architecture Meters */}
          <div
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-gold)',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 800 }}>
              <Zap size={19} color="var(--primary)" /> Real-Time Engine Specs
            </h3>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Core Model Architecture</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>ArcFace / Facenet512</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Embedding Vector Dimensions</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>512 Floating Point Metrics</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Matching Latency</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>&lt; 0.04s per 1,000 photos</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '96%', height: '100%', background: '#10b981', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Grand Conversion Finale */}
      <section
        style={{
          padding: '5rem 2rem 7rem',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-card-elevated"
          style={{
            padding: '4rem 3rem',
            borderRadius: '28px',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.85fr)',
            gap: '3rem',
            alignItems: 'center',
            background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.08) 50%, var(--card-bg) 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="hero-grid-responsive"
        >
          {/* Left: Call To Action */}
          <div>
            <span
              className="status-badge badge-gold"
              style={{
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={14} />
              <span>Experience The Future</span>
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                color: 'var(--text-main)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.15,
                marginBottom: '1rem',
              }}
            >
              Ready To Discover <br />
              <span className="gold-text">Your Event Moments?</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
              Register your face in 30 seconds and let our neural engine find every photo of you across all your favorite events.
            </p>

            <button
              type="button"
              onClick={handleCTA}
              className="btn btn-primary btn-lg"
              style={{
                padding: '1.1rem 2.4rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: 'var(--btn-primary-shadow)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <Camera size={21} />
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started in 30s'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right: Crystal Camera Luxury Visual Emblem */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '320px',
                aspectRatio: '1 / 1',
                borderRadius: '24px',
                border: '1px solid var(--border-gold)',
                boxShadow: 'var(--shadow-xl), 0 0 45px rgba(201, 162, 39, 0.2)',
                background: '#000000',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/crystal_camera_hero.jpg"
                alt="Presence Optical Crystal Camera"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={authModalOpen && authModalMode === 'login'}
        onClose={() => setAuthModalOpen(false)}
        onSwitchToRegister={handleOpenRegister}
      />
      <RegisterModal
        isOpen={authModalOpen && authModalMode === 'register'}
        onClose={() => setAuthModalOpen(false)}
        onSwitchToLogin={handleOpenLogin}
      />
    </div>
  );
};
