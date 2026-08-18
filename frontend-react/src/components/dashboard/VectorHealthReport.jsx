import React from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, ShieldCheck, Zap, Lock, Users, ArrowRight } from 'lucide-react';

/**
 * VectorHealthReport / GrandFaceEnrollmentHero
 * Extra-large, ultra-bold, expressive hero banner filling the primary canvas.
 * Designed with Apple/Linear level spaciousness, bold typography, and visual depth.
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
        padding: '3.5rem 3.5rem',
        border: '1px solid var(--border-gold)',
        borderRadius: '28px',
        boxShadow: 'var(--shadow-xl)',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, rgba(201, 162, 39, 0.05) 50%, var(--card-bg) 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.05) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
          gap: '3.5rem',
          alignItems: 'center',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Extra-Large Hero Headline & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 2 }}>
          {/* Top Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                background: isEnrolled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(201, 162, 39, 0.14)',
                color: isEnrolled ? '#10b981' : 'var(--primary)',
                border: `1px solid ${isEnrolled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(201, 162, 39, 0.3)'}`,
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {isEnrolled ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Face Profile Active • {faces.length} {faces.length === 1 ? 'Photo' : 'Photos'}</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Smart Photo Discovery</span>
                </>
              )}
            </span>
          </div>

          {/* Grand Headline */}
          <h2
            style={{
              fontSize: 'clamp(2.6rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
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
              fontSize: '1.15rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: '580px',
            }}
          >
            {isEnrolled
              ? `Your biometric face profile is actively linked. You can browse any event album to automatically see your matching portraits.`
              : `Scan your face in 30 seconds. We'll automatically identify you and gather all your event memories in one private gallery.`}
          </p>

          {/* Large Tactile Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onStartJourney}
              className="btn btn-primary"
              style={{
                padding: '1.05rem 2.25rem',
                fontSize: '1.08rem',
                fontWeight: 700,
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                boxShadow: 'var(--btn-primary-shadow)',
                cursor: 'pointer',
              }}
            >
              <Camera size={22} />
              <span>{isEnrolled ? 'Scan Face Again' : 'Scan Your Face (30s)'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenUpload}
              className="btn btn-outline"
              style={{
                padding: '1.05rem 1.85rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                borderRadius: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
              }}
            >
              <Upload size={20} />
              <span>Upload Photo</span>
            </button>
          </div>

          {/* Value Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              marginTop: '0.75rem',
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Zap size={16} color="var(--primary)" />
              <span>Instant AI Match</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Lock size={16} color="var(--primary)" />
              <span>100% Private & Encrypted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Users size={16} color="var(--primary)" />
              <span>Family Circle Ready</span>
            </div>
          </div>
        </div>

        {/* Right: Grand Interactive Visual Showcase */}
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
              maxWidth: '380px',
              aspectRatio: '1 / 1',
              borderRadius: '24px',
              background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.09) 0%, rgba(20, 20, 20, 0.95) 100%)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-xl), 0 0 45px rgba(201, 162, 39, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
            }}
            title="Click to start 30-second camera scan"
          >
            {/* Outer Concentric Biometric Pulse Rings */}
            <div
              style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                border: '1px dashed rgba(201, 162, 39, 0.35)',
                animation: 'spin 24s linear infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                border: '1px solid rgba(201, 162, 39, 0.25)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '1px dashed rgba(201, 162, 39, 0.2)',
                animation: 'spin 16s linear infinite reverse',
              }}
            />

            {/* Glowing Center Camera Lens */}
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'var(--gradient-gold)',
                color: '#0d0d0d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 35px rgba(201, 162, 39, 0.55)',
                zIndex: 2,
              }}
            >
              <Camera size={38} strokeWidth={2.2} />
            </div>

            {/* Bottom Interactive Pill */}
            <span
              style={{
                marginTop: '1.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span>{isEnrolled ? 'Open Face Scanner' : 'Tap to Start Scan'}</span>
              <ArrowRight size={15} color="var(--primary)" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
