import React from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, ShieldCheck, Zap, Lock, Users, ArrowRight } from 'lucide-react';

/**
 * VectorHealthReport / BoldFaceEnrollmentHero
 * Big, bold, expressive hero designed for effortless onboarding.
 * Uses high-impact visual design, expressive iconography, and bold typography with minimal text.
 */
export const VectorHealthReport = ({
  member,
  faces = [],
  onStartJourney,
  onOpenUpload,
}) => {
  const memberName = member?.name || 'yourself';
  const isEnrolled = faces.length > 0;

  return (
    <div
      className="glass-card-elevated"
      style={{
        padding: '2.5rem 2.5rem',
        border: '1px solid var(--border-gold)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.04) 50%, var(--card-bg) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Ambient Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Bold Hero Typography & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: isEnrolled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(201, 162, 39, 0.14)',
                color: isEnrolled ? '#10b981' : 'var(--primary)',
                border: `1px solid ${isEnrolled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(201, 162, 39, 0.3)'}`,
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {isEnrolled ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Face Profile Active • {faces.length} {faces.length === 1 ? 'Photo' : 'Photos'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Smart Photo Discovery</span>
                </>
              )}
            </span>
          </div>

          {/* Big Bold Headline */}
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.15,
              color: 'var(--text-main)',
              margin: 0,
            }}
          >
            {isEnrolled ? (
              <>
                Ready to find photos for <span className="gold-text">{memberName}</span>.
              </>
            ) : (
              <>
                Never search for your photos manually again.
              </>
            )}
          </h2>

          {/* Punchy Subtitle */}
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: 0,
              maxWidth: '540px',
            }}
          >
            {isEnrolled
              ? `Your face profile is linked. Browse any event album to automatically see your matching portraits, or scan again to update your look.`
              : `Scan your face in 30 seconds. We'll automatically identify you and gather all your event memories in one private gallery.`}
          </p>

          {/* High-Impact Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <button
              type="button"
              onClick={onStartJourney}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: 'var(--btn-primary-shadow)',
                transform: 'translateZ(0)',
              }}
            >
              <Camera size={19} />
              <span>{isEnrolled ? 'Scan Face Again' : 'Scan Your Face (30s)'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenUpload}
              className="btn btn-outline"
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >
              <Upload size={18} />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Expressive Feature Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              marginTop: '0.5rem',
              flexWrap: 'wrap',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={14} color="var(--primary)" />
              <span>Instant Matching</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="var(--primary)" />
              <span>100% Private & Encrypted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} color="var(--primary)" />
              <span>Family Circle Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Expressive Graphic Showcase */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Stylized Interactive AI Scan Card Preview */}
          <div
            onClick={onStartJourney}
            style={{
              width: '100%',
              maxWidth: '300px',
              aspectRatio: '1 / 1',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.08) 0%, rgba(20, 20, 20, 0.9) 100%)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, border-color 0.25s ease',
            }}
            title="Click to start 30-second camera scan"
          >
            {/* Concentric Biometric Scanning Rings */}
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '1px dashed rgba(201, 162, 39, 0.3)',
                animation: 'spin 20s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                border: '1px solid rgba(201, 162, 39, 0.2)',
              }}
            />

            {/* Glowing Center Icon */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--gradient-gold)',
                color: '#0d0d0d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(201, 162, 39, 0.45)',
                zIndex: 2,
              }}
            >
              <Camera size={30} strokeWidth={2.2} />
            </div>

            {/* Bottom Label */}
            <span
              style={{
                marginTop: '1.25rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>{isEnrolled ? 'View Scanner' : 'Tap to Start Scan'}</span>
              <ArrowRight size={14} color="var(--primary)" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
