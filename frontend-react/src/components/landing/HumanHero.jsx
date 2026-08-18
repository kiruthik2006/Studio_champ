import React, { useState } from 'react';
import { Camera, Sparkles, ArrowRight, Check, Heart, Shield, Image as ImageIcon } from 'lucide-react';

const FLOATING_MEMORIES = [
  {
    id: 1,
    title: 'The Sunset Toast',
    event: 'Amalfi Coast Wedding',
    img: '/covers/wedding.jpg',
    tag: 'Found 14 Photos of You',
    pos: { top: '5%', right: '8%' },
  },
  {
    id: 2,
    title: 'Dance Floor Candid',
    event: 'Summer Gala Night',
    img: '/covers/gala.jpg',
    tag: 'Found 9 Photos of You',
    pos: { bottom: '8%', right: '22%' },
  },
  {
    id: 3,
    title: 'Family Garden Smile',
    event: 'Provence Gathering',
    img: '/covers/family.jpg',
    tag: 'Family Circle Match',
    pos: { top: '38%', right: '2%' },
  },
];

export const HumanHero = ({ onStart, onLogin, isAuthenticated }) => {
  const [activeMemory, setActiveMemory] = useState(FLOATING_MEMORIES[0]);

  return (
    <section
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7.5rem 2rem 4rem',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '3.5rem',
          alignItems: 'center',
          width: '100%',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Emotional & Human-Centric Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
          {/* Subtle Aesthetic Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.95rem',
                borderRadius: '999px',
                background: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} />
              <span>Effortless Event Photo Discovery</span>
            </span>
          </div>

          {/* Grand Emotive Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.7rem, 4.8vw, 4.3rem)',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-main)',
              margin: 0,
            }}
          >
            Every moment you were in. <br />
            <span className="gold-text">Instantly found.</span>
          </h1>

          {/* Human, Relatable Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1.08rem, 1.6vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: 580,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Attended a wedding, party, or celebration? Stop hunting through thousands of photos on unorganized shared drives. Take one quick selfie, and Presence instantly delivers all your memories into a private, high-resolution storybook.
          </p>

          {/* High-Impact Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onStart}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '1.1rem 2.3rem',
                fontSize: '1.08rem',
                fontWeight: 700,
                borderRadius: '14px',
                boxShadow: 'var(--btn-primary-shadow)',
                cursor: 'pointer',
              }}
            >
              <Camera size={21} />
              <span>{isAuthenticated ? 'Open My Dashboard' : 'Find My Photos Free'}</span>
              <ArrowRight size={18} />
            </button>

            {!isAuthenticated && (
              <button
                type="button"
                onClick={onLogin}
                className="btn btn-outline btn-lg"
                style={{
                  padding: '1.1rem 1.85rem',
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

          {/* Human Benefit Highlights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.6rem',
              marginTop: '0.75rem',
              flexWrap: 'wrap',
              fontSize: '0.88rem',
              color: 'var(--text-main)',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={13} color="#10b981" strokeWidth={3} />
              </div>
              <span>Ready in 30 Seconds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={13} color="#10b981" strokeWidth={3} />
              </div>
              <span>Original 4K Studio Quality</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={13} color="#10b981" strokeWidth={3} />
              </div>
              <span>100% Private to You</span>
            </div>
          </div>
        </div>

        {/* Right: Immersive Floating Memory Showcase */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '440px',
          }}
        >
          {/* Main Visual Memory Card */}
          <div
            className="glass-card-elevated"
            style={{
              width: '100%',
              maxWidth: '420px',
              borderRadius: '26px',
              overflow: 'hidden',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-xl), 0 20px 50px rgba(0, 0, 0, 0.25)',
              background: 'var(--card-bg-elevated)',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Top Event Photo */}
            <div style={{ position: 'relative', height: '280px', width: '100%' }}>
              <img
                src={activeMemory.img}
                alt={activeMemory.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Floating Instant Found Tag */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                <Sparkles size={13} />
                <span>{activeMemory.tag}</span>
              </div>

              {/* Bottom Vignette */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '1.5rem 1.25rem 0.85rem',
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activeMemory.event}
                </span>
                <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: '0.2rem 0 0' }}>
                  {activeMemory.title}
                </h3>
              </div>
            </div>

            {/* Bottom Memory Selector Ribbon */}
            <div style={{ padding: '1.25rem' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.6rem' }}>
                EXPLORE EVENT DISCOVERIES:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {FLOATING_MEMORIES.map((m) => {
                  const isCurrent = m.id === activeMemory.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActiveMemory(m)}
                      style={{
                        padding: '0.45rem 0.3rem',
                        borderRadius: '10px',
                        border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isCurrent ? 'rgba(201, 162, 39, 0.15)' : 'var(--input-bg)',
                        color: isCurrent ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {m.event.split(' ')[0]}
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
