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
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Image as ImageIcon
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

  const handleHeroCTA = () => {
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

      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 2rem 4rem',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          background: 'var(--badge-gold-bg)',
          border: '1px solid var(--badge-gold-border)',
          borderRadius: '999px',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.75rem',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <Sparkles size={15} />
          <span>Next-Gen Event Photo Retrieval • DeepFace AI</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text-main)',
        }}>
          Find Every Photo of You <br />
          <span className="gold-text">In Seconds with AI</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: 680,
          lineHeight: 1.7,
          marginBottom: '2.5rem'
        }}>
          Upload your face or scan in real-time. Our 512-dimensional facial recognition engine automatically matches and indexes every candid shot from large event galleries.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleHeroCTA} className="btn btn-primary btn-lg">
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Find My Photos Now'}</span>
            <ArrowRight size={18} />
          </button>

          {!isAuthenticated && (
            <button onClick={handleOpenLogin} className="btn btn-outline btn-lg">
              <span>Sign In</span>
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
            <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
              <Camera size={26} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '0.3rem' }}>Live Multi-Angle Capture</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Direct webcam stream integration captures multiple face angles for 99%+ recognition accuracy.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>
              <Cpu size={26} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '0.3rem' }}>512-D Facenet Vectors</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Deep neural embeddings compare cosine similarity across thousands of event album photos in seconds.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'left' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.15rem', marginBottom: '0.3rem' }}>Biometric Privacy First</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
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
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-main)', marginBottom: '1rem' }}>
            How Face<span className="gold-text">Rec</span> Works
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem' }}>
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
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--border-subtle)',
              lineHeight: 1
            }}>01</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'var(--badge-gold-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.5rem'
            }}>
              <Camera size={24} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>1. Register Your Face</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Use your device camera or upload a few clear selfies. Our AI extracts mathematical facial feature vectors in real time.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--border-subtle)',
              lineHeight: 1
            }}>02</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'rgba(74, 157, 107, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
              marginBottom: '1.5rem'
            }}>
              <Layers size={24} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>2. Pick an Event</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Select the wedding, concert, or gala you attended. The system compares your biometric vector against the album.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card" style={{ padding: '2.5rem 2rem', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              fontSize: '3rem',
              fontWeight: 800,
              color: 'var(--border-subtle)',
              lineHeight: 1
            }}>03</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'var(--badge-gold-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.5rem'
            }}>
              <ImageIcon size={24} />
            </div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', marginBottom: '0.75rem' }}>3. View & Download</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Instantly view all detected photos with interactive confidence scores, face bounding boxes, and 1-click batch download.
            </p>
          </div>
        </div>
      </section>

      {/* AI Technology Deep Dive */}
      <section id="technology" style={{
        padding: '6rem 2rem',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="glass-card-elevated" style={{
          padding: '4rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span className="status-badge badge-gold" style={{ marginBottom: '1rem' }}>Architecture</span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Powered by Facenet512 & Deep Learning
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              Unlike basic thumbnail tagging, Studio Champ uses 512-dimensional Euclidean space representations to capture facial contours, distances, and angles resilient to lighting, sunglasses, and expressions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Cosine Similarity Thresholding:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>Dynamic slider lets you filter out false positives instantly.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>On-Device MTCNN/RetinaFace Detection:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>High accuracy even in crowded group portraits.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Encrypted Vector Storage:</strong>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.3rem' }}>Zero raw facial biometric images are stored persistently without consent.</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Zap size={20} color="var(--primary)" /> Real-Time Metrics
            </h3>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Model Architecture</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Facenet512 (DeepFace)</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--btn-primary-bg)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Embedding Dimension</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>512 Floating Point Values</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--btn-primary-bg)', borderRadius: '3px' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cosine Similarity Cutoff</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Threshold: 0.60 (Adjustable)</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px' }}>
                <div style={{ width: '60%', height: '100%', background: 'var(--btn-primary-bg)', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        maxWidth: 900,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="glass-card" style={{ padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--text-main)', marginBottom: '1rem' }}>
            Ready to Find Your Event Memories?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 2rem' }}>
            Register your face once in 30 seconds and let AI do the searching across all your favorite moments.
          </p>
          <button onClick={handleHeroCTA} className="btn btn-primary btn-lg">
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}</span>
            <ArrowRight size={18} />
          </button>
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
