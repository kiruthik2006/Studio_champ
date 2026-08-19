import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { NeuralCanvas } from '../components/common/NeuralCanvas';
import { LoginModal } from '../components/auth/LoginModal';
import { RegisterModal } from '../components/auth/RegisterModal';
import { CinematicHero } from '../components/landing/CinematicHero';
import { BeforeAfterShowcase } from '../components/landing/BeforeAfterShowcase';
import { LifestyleGallery } from '../components/landing/LifestyleGallery';
import { ValuePropositionCards } from '../components/landing/ValuePropositionCards';
import { Camera, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const { isAuthenticated } = useAuth();
  const { isLight } = useTheme();
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

      {/* Atmospheric Wallpaper Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/landing_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: isLight ? 0.82 : 0.62,
          pointerEvents: 'none',
          zIndex: 0,
          filter: isLight ? 'saturate(1.35) contrast(1.12) brightness(1.04)' : 'brightness(0.85) contrast(1.05)',
        }}
      />
      {/* Soft Atmospheric Gradient Overlay for Perfect Contrast */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isLight
            ? 'linear-gradient(180deg, rgba(251, 250, 247, 0.12) 0%, rgba(251, 250, 247, 0.32) 40%, rgba(251, 250, 247, 0.6) 100%)'
            : 'linear-gradient(180deg, rgba(13, 13, 13, 0.3) 0%, rgba(13, 13, 13, 0.6) 40%, rgba(13, 13, 13, 0.85) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <NeuralCanvas />

      {/* 1. Cinematic Editorial Centered Hero with Dynamic Floating Memory Mosaic */}
      <CinematicHero
        onStart={handleCTA}
        onLogin={handleOpenLogin}
        isAuthenticated={isAuthenticated}
      />

      {/* 2. Before vs. After (Relatable Problem & Solution) */}
      <BeforeAfterShowcase />

      {/* 3. Lifestyle Event Moments Gallery (Weddings, Galas, Family Circles) */}
      <LifestyleGallery />

      {/* 4. The 4 Human Pillars of Presence */}
      <ValuePropositionCards />

      {/* 5. Grand Luxury Conversion Finale */}
      <section
        style={{
          padding: '5rem 2rem 7rem',
          maxWidth: 1120,
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-card-elevated"
          style={{
            padding: '4rem 3.5rem',
            borderRadius: '28px',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.85fr)',
            gap: '3.5rem',
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
              <span>Preserve Every Memory</span>
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
              Never Miss A Moment <br />
              <span className="gold-text">You Were A Part Of.</span>
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '520px' }}>
              Set up your face profile once in 30 seconds. Next time you attend an event, all your photos are ready waiting for you.
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
              <span>{isAuthenticated ? 'Open My Dashboard' : 'Find My Photos in 30s'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right: Optical Crystal Glass Camera Emblem */}
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
