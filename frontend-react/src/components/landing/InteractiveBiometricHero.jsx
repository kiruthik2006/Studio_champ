import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2, Lock, Users, RefreshCw } from 'lucide-react';

const SAMPLE_PROFILES = [
  {
    id: 'front',
    label: 'Studio Portrait',
    angle: 'Frontal (0°)',
    cosine: 0.996,
    confidence: '99.6%',
    status: 'Optimal Match',
    matchedPhotos: 18,
    img: '/covers/wedding.jpg',
  },
  {
    id: 'candid',
    label: 'Candid Motion',
    angle: 'Slight Turn (25°)',
    cosine: 0.984,
    confidence: '98.4%',
    status: 'Instant Match',
    matchedPhotos: 24,
    img: '/covers/gala.jpg',
  },
  {
    id: 'family',
    label: 'Group Circle',
    angle: 'Multi-Person',
    cosine: 0.978,
    confidence: '97.8%',
    status: 'All Present',
    matchedPhotos: 12,
    img: '/covers/family.jpg',
  },
  {
    id: 'event',
    label: 'Low-Light Stage',
    angle: 'Dynamic Lighting',
    cosine: 0.965,
    confidence: '96.5%',
    status: 'High Match',
    matchedPhotos: 31,
    img: '/covers/summit.jpg',
  },
];

export const InteractiveBiometricHero = ({ onStart, onLogin, isAuthenticated }) => {
  const [selectedProfile, setSelectedProfile] = useState(SAMPLE_PROFILES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + 25;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <section
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7rem 2rem 4rem',
        maxWidth: 1240,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: '3.5rem',
          alignItems: 'center',
          width: '100%',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Bold Value Proposition & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              className="status-badge badge-gold"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} />
              <span>Next-Gen Event Photo Discovery</span>
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.6rem, 4.5vw, 4.2rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-main)',
              margin: 0,
            }}
          >
            Never search for your photos <br />
            <span className="gold-text">manually again.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.05rem, 1.5vw, 1.22rem)',
              color: 'var(--text-muted)',
              maxWidth: 580,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Scan your face once in 30 seconds. Our 512-dimensional facial recognition engine automatically gathers and indexes every candid memory from large event albums into your private gallery.
          </p>

          {/* High-Impact Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onStart}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1.05rem 2.2rem',
                fontSize: '1.08rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: 'var(--btn-primary-shadow)',
                cursor: 'pointer',
              }}
            >
              <Camera size={21} />
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Find My Photos in 30s'}</span>
              <ArrowRight size={18} />
            </button>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={onLogin}
                className="btn btn-outline btn-lg"
                style={{
                  padding: '1.05rem 1.85rem',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  borderRadius: '14px',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Expressive Feature Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap size={16} color="var(--primary)" />
              <span>Instant AI Cosine Match</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Lock size={16} color="var(--primary)" />
              <span>100% Encrypted & Private</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Users size={16} color="var(--primary)" />
              <span>Family Circle Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Biometric HUD Sandbox */}
        <div style={{ position: 'relative' }}>
          <div
            className="glass-card-elevated"
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-xl), 0 0 45px rgba(201, 162, 39, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(145deg, var(--card-bg-elevated) 0%, rgba(20, 20, 22, 0.95) 100%)',
            }}
          >
            {/* Top HUD Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isScanning ? 'var(--primary)' : '#10b981',
                    boxShadow: isScanning ? '0 0 10px var(--primary)' : '0 0 10px #10b981',
                  }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.03em' }}>
                  {isScanning ? 'CALIBRATING 512-D VECTORS...' : 'LIVE BIOMETRIC SIMULATOR'}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                {selectedProfile.confidence} Confidence
              </span>
            </div>

            {/* Main Visual Photo Viewport with HUD Overlay */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '260px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border-gold)',
                background: '#000',
              }}
            >
              <img
                src={selectedProfile.img}
                alt={selectedProfile.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isScanning ? 'brightness(0.7) blur(1px)' : 'brightness(0.95)',
                  transition: 'filter 0.3s ease',
                }}
              />

              {/* HUD Face Scan Target Reticle */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  border: isScanning ? '2px dashed var(--primary)' : '2px solid rgba(16, 185, 129, 0.8)',
                  boxShadow: isScanning ? '0 0 25px rgba(201, 162, 39, 0.5)' : '0 0 20px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  animation: isScanning ? 'spin 8s linear infinite' : 'none',
                }}
              >
                <div
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
              </div>

              {/* Scanning Laser Line */}
              {isScanning && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${scanProgress}%`,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    boxShadow: '0 0 15px var(--primary)',
                    transition: 'top 0.08s linear',
                  }}
                />
              )}

              {/* Floating Bottom Detection Card */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.85rem',
                  left: '0.85rem',
                  right: '0.85rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '12px',
                  background: 'rgba(14, 13, 12, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(223, 185, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: '#fff',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <div>
                    <span style={{ fontWeight: 700 }}>{selectedProfile.label}</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem', fontSize: '0.75rem' }}>
                      ({selectedProfile.angle})
                    </span>
                  </div>
                </div>

                <span style={{ color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {selectedProfile.matchedPhotos} Portraits Found
                </span>
              </div>
            </div>

            {/* Interactive Scenario Selector Buttons */}
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600 }}>
                TRY DIFFERENT SAMPLE SCENARIOS:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {SAMPLE_PROFILES.map((p) => {
                  const isCurrent = p.id === selectedProfile.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectProfile(p)}
                      style={{
                        padding: '0.5rem 0.4rem',
                        borderRadius: '10px',
                        border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isCurrent ? 'rgba(201, 162, 39, 0.15)' : 'var(--input-bg)',
                        color: isCurrent ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      {p.label.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
