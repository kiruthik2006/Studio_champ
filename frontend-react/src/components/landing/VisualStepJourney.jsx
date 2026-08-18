import React from 'react';
import { Camera, Layers, Image as ImageIcon, Sparkles, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Camera,
    title: '30s Face Calibration',
    headline: 'Capture 4 Smart Angles',
    description:
      'Use your camera or upload a few selfies. Our on-device neural model extracts mathematical facial vectors in real time.',
    tag: 'Quick Enrollment',
  },
  {
    step: '02',
    icon: Layers,
    title: 'Neural Vector Match',
    headline: '512-D Cosine Similarity',
    description:
      'The engine automatically compares your biometric vector across all photos in the event album, impervious to lighting and angle changes.',
    tag: 'DeepFace AI',
  },
  {
    step: '03',
    icon: ImageIcon,
    title: 'Private Curated Gallery',
    headline: 'Instant 1-Click Export',
    description:
      'Browse your personal matched album with interactive confidence scores, or export directly to Google Drive in full original resolution.',
    tag: 'Full Resolution',
  },
];

export const VisualStepJourney = () => {
  return (
    <section
      id="how-it-works"
      style={{
        padding: '5rem 2rem',
        maxWidth: 1240,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
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
          <Sparkles size={14} />
          <span>Simple 3-Step Path</span>
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
          How <span className="gold-text">Presence.</span> Works
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Three frictionless steps from 30-second enrollment to discovering your full-resolution event memories.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {STEPS.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className="glass-card-elevated"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '22px',
                border: '1px solid var(--border-gold)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {/* Giant Step Number Watermark */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.5rem',
                  fontSize: '3.2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--border-subtle)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  opacity: 0.7,
                }}
              >
                {s.step}
              </div>

              <div>
                {/* Icon Badge */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'var(--badge-gold-bg)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 12px rgba(201, 162, 39, 0.18)',
                  }}
                >
                  <Icon size={24} />
                </div>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.tag}
                </span>

                <h3
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    marginTop: '0.35rem',
                    marginBottom: '0.65rem',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {s.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}>
                  {s.description}
                </p>
              </div>

              {/* Bottom Subtle Status Pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '1.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={15} color="#10b981" />
                <span>{s.headline}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
