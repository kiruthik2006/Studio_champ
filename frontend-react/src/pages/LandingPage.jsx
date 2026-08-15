import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { NeuralCanvas } from '../components/common/NeuralCanvas';
import { LoginModal } from '../components/auth/LoginModal';
import { RegisterModal } from '../components/auth/RegisterModal';
import {
  Camera,
  Cpu,
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const LandingPage = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleHeroCta = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setRegisterModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <NeuralCanvas />
      <Navbar
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
      />

      {/* Hero Section */}
      <section style={{
        padding: '10rem 2rem 6rem',
        maxWidth: 1200,
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Subtle pill badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'rgba(201, 162, 39, 0.12)',
          border: '1px solid rgba(201, 162, 39, 0.25)',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: '#dfb94a',
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} /> Powered by DeepFace & Facenet512 Neural Vectors
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.15,
          marginBottom: '1.5rem',
          maxWidth: '900px',
          fontWeight: 700
        }}>
          Find Every Event Photo of Yourself with <span className="gold-text">AI Precision</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--secondary)',
          maxWidth: '720px',
          lineHeight: 1.7,
          marginBottom: '2.5rem'
        }}>
          Register your face with a quick live snapshot, and our deep learning engine scans thousands of high-resolution event photos to discover all your moments instantly.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleHeroCta}
            className="btn btn-primary btn-lg"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Register Your Face'} <ArrowRight size={18} />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => setLoginModalOpen(true)}
              className="btn btn-outline btn-lg"
            >
              Sign In to Account
            </button>
          )}
        </div>

        {/* Feature Highlights Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          marginTop: '5rem'
        }}>
          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ color: '#dfb94a', marginBottom: '0.75rem' }}>
              <Camera size={26} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.3rem' }}>Live Multi-Angle Capture</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
              Direct webcam stream integration captures multiple face angles for 99%+ recognition accuracy.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ color: '#6ed696', marginBottom: '0.75rem' }}>
              <Cpu size={26} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.3rem' }}>512-D Facenet Vectors</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
              Deep neural embeddings compare cosine similarity across thousands of event album photos in seconds.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ color: '#dfb94a', marginBottom: '0.75rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.3rem' }}>Biometric Privacy First</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
              Your face representations are stored as encrypted mathematical embeddings and can be wiped anytime.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        padding: '6rem 2rem',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="status-badge badge-gold" style={{ marginBottom: '0.75rem' }}>Simple Workflow</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', marginBottom: '1rem' }}>
            How Face<span className="gold-text">Rec</span> Works
          </h2>
          <p style={{ color: 'var(--gray-light)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
            Three seamless steps from registration to downloading your full-resolution memories.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {/* Step 1 */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'rgba(201, 162, 39, 0.15)',
              fontFamily: 'var(--font-display)'
            }}>
              01
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'rgba(201, 162, 39, 0.15)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dfb94a',
              marginBottom: '1.5rem'
            }}>
              <Camera size={24} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.75rem' }}>1. Register Your Face</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Use your device's webcam to take 3–5 quick facial snapshots. Our system calculates lighting, clarity, and crop boundaries.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'rgba(201, 162, 39, 0.15)',
              fontFamily: 'var(--font-display)'
            }}>
              02
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'rgba(201, 162, 39, 0.15)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dfb94a',
              marginBottom: '1.5rem'
            }}>
              <Layers size={24} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.75rem' }}>2. Pick an Event</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Browse through weddings, galas, concerts, or conferences. Click "Find My Photos" to begin the deep learning scan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'rgba(201, 162, 39, 0.15)',
              fontFamily: 'var(--font-display)'
            }}>
              03
            </div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'rgba(201, 162, 39, 0.15)',
              border: '1px solid rgba(201, 162, 39, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dfb94a',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.75rem' }}>3. View & Download</h3>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              All matching photos are presented with confidence scores and face bounding boxes. Download high-resolution originals with one tap.
            </p>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" style={{
        padding: '6rem 2rem',
        background: 'rgba(15, 14, 13, 0.75)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="status-badge badge-gold" style={{ marginBottom: '0.75rem' }}>Advanced AI</span>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#fff', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                State of the Art Face Embeddings with <span className="gold-text">Facenet512</span>
              </h2>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Unlike legacy keyword tagging or manual albums, FaceRec calculates 512 distinct vector dimensions for every face detected. Even with varying angles, glasses, or event lighting changes, similarity matching provides uncanny precision.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="#6ed696" />
                  <span>Sub-second cosine distance vector ranking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="#6ed696" />
                  <span>Automated photo quality & sharpness assessment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="#6ed696" />
                  <span>Batch ingestion of thousands of high-res event photos</span>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(201, 162, 39, 0.25)' }}>
              <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Zap size={20} color="#dfb94a" /> Recognition Specs
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--gray-light)' }}>Model Architecture</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Facenet512 (DeepFace)</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--gray-light)' }}>Vector Embedding Size</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>512 Floating Point Values</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: '100%', height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--gray-light)' }}>Cosine Metric Distance</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Threshold: 0.60 (Adjustable)</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: '85%', height: '100%', background: 'var(--primary)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section style={{
        padding: '6rem 2rem',
        maxWidth: 1000,
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="glass-card" style={{
          padding: '4rem 2rem',
          border: '1px solid rgba(201, 162, 39, 0.3)',
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)'
        }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: '#fff', marginBottom: '1rem' }}>
            Ready to Find Your Event Photos?
          </h2>
          <p style={{ color: 'var(--gray-light)', maxWidth: '540px', margin: '0 auto 2rem', fontSize: '1rem' }}>
            Join thousands of event attendees and photographers using AI to instantly locate and preserve unforgettable memories.
          </p>
          <button
            onClick={handleHeroCta}
            className="btn btn-primary btn-lg"
          >
            {isAuthenticated ? 'Launch Dashboard' : 'Get Started Now'} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />

      {/* Auth Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </div>
  );
};
