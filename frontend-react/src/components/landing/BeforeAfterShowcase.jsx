import React from 'react';
import { XCircle, CheckCircle2, Sparkles, FolderX, Sparkle, ArrowRight } from 'lucide-react';

export const BeforeAfterShowcase = () => {
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
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
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
          <span>The Better Way</span>
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
          Never Lose A <span className="gold-text">Precious Memory</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          See how Presence completely eliminates the frustration of unorganized event photo folders.
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Card 1: The Old Way */}
        <div
          className="glass-card"
          style={{
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.03) 0%, var(--card-bg) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}
            >
              <XCircle size={15} />
              <span>THE OLD WAY</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '1.25rem' }}>
              Lost In 4,000 Unorganized Drive Files
            </h3>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                <span>Scrolling through thousands of blurry, uncompressed files trying to spot yourself.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                <span>Texting wedding hosts and friends weeks later asking "Did anyone capture that moment?".</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                <span>Missing out on stunning high-res candid portraits you never even knew were taken.</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Result: Hours wasted, memories lost.
          </div>
        </div>

        {/* Card 2: With Presence */}
        <div
          className="glass-card-elevated"
          style={{
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-xl), 0 0 40px rgba(201, 162, 39, 0.12)',
            background: 'linear-gradient(145deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.06) 50%, var(--card-bg) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={15} />
              <span>WITH PRESENCE</span>
            </div>

            <h3 style={{ fontSize: '1.45rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '1.25rem' }}>
              Your Personal Private Storybook In Seconds
            </h3>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.1rem', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Instant Recognition:</strong> One selfie automatically gathers every photo you appear in across the whole event.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Family Circle Ready:</strong> Easily find photos where you, your spouse, and your kids are all in the frame together.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Original 4K Downloads:</strong> Download full studio-resolution portraits or sync directly to Google Photos with one click.</span>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 700 }}>
            Result: All your memories, effortlessly delivered.
          </div>
        </div>
      </div>
    </section>
  );
};
