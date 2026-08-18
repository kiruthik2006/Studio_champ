import React, { useState } from 'react';
import { Sliders, Sparkles, CheckCircle2, XCircle, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

const SIMULATION_PHOTOS = [
  {
    id: 1,
    title: 'Grand Entrance Toast',
    score: 0.96,
    img: '/covers/wedding.jpg',
    note: 'Clear frontal lighting',
  },
  {
    id: 2,
    title: 'Candid Gala Reception',
    score: 0.88,
    img: '/covers/gala.jpg',
    note: 'Motion & dynamic angle',
  },
  {
    id: 3,
    title: 'Family Garden Stroll',
    score: 0.76,
    img: '/covers/family.jpg',
    note: 'Distance & natural sunlight',
  },
  {
    id: 4,
    title: 'Crowded Keynote Background',
    score: 0.54,
    img: '/covers/summit.jpg',
    note: 'Background attendee',
  },
];

export const CosineSimulatorWidget = () => {
  const [threshold, setThreshold] = useState(0.65);

  const matchedCount = SIMULATION_PHOTOS.filter((p) => p.score >= threshold).length;

  return (
    <section
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
          background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.04) 50%, var(--card-bg) 100%)',
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span
            className="status-badge badge-gold"
            style={{
              marginBottom: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <Sliders size={14} />
            <span>Interactive Biometric Engine</span>
          </span>

          <h2
            style={{
              fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
              color: 'var(--text-main)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Experience The <span className="gold-text">512-D Precision</span>
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
            Adjust the live cosine similarity threshold below to see how our neural engine precisely separates your candid portraits from background attendees in seconds.
          </p>
        </div>

        {/* Live Threshold Control Bar */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto 3rem',
            padding: '1.5rem 2rem',
            borderRadius: '20px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-gold)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Cosine Similarity Cutoff Threshold:
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--primary)',
                padding: '0.2rem 0.75rem',
                borderRadius: '8px',
                background: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid rgba(201, 162, 39, 0.3)',
              }}
            >
              {threshold.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min="0.40"
            max="0.90"
            step="0.01"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--primary)',
              cursor: 'pointer',
              height: '8px',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>0.40 (Broad / More Matches)</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {matchedCount} of {SIMULATION_PHOTOS.length} Photos Match
            </span>
            <span>0.90 (Strict / Exact Only)</span>
          </div>
        </div>

        {/* Dynamic Interactive Photo Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {SIMULATION_PHOTOS.map((photo) => {
            const isMatch = photo.score >= threshold;

            return (
              <div
                key={photo.id}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: 'var(--card-bg)',
                  border: isMatch ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  boxShadow: isMatch ? '0 0 25px rgba(16, 185, 129, 0.2)' : 'none',
                  opacity: isMatch ? 1 : 0.45,
                  transform: isMatch ? 'scale(1.02)' : 'scale(0.98)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                }}
              >
                {/* Photo Thumbnail */}
                <div style={{ position: 'relative', height: '170px', width: '100%' }}>
                  <img
                    src={photo.img}
                    alt={photo.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Top Match Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '999px',
                      background: isMatch ? 'rgba(16, 185, 129, 0.9)' : 'rgba(0, 0, 0, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      backdropFilter: 'blur(6px)',
                    }}
                  >
                    {isMatch ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    <span>{isMatch ? 'MATCHED' : 'FILTERED'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.35rem', fontWeight: 700 }}>
                    {photo.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    {photo.note}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Similarity:
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        color: isMatch ? '#10b981' : 'var(--text-muted)',
                      }}
                    >
                      {(photo.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
