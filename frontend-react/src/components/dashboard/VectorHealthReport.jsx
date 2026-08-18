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
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-xl), 0 0 50px rgba(201, 162, 39, 0.22)',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a0a0c',
            }}
            className="hero-lens-card"
            title="Click to start 30-second camera scan"
          >
            {/* Crystal Glass Camera Artwork */}
            <img
              src="/crystal_camera_hero.jpg"
              alt="Crystal Glass Camera"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                background: '#000000',
                transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {/* Bottom Interactive Glass Action Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.4rem',
                zIndex: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1.1rem',
                borderRadius: '999px',
                background: 'rgba(18, 17, 16, 0.75)',
                border: '1px solid rgba(223, 185, 74, 0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(201, 162, 39, 0.25)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
            >
              <Camera size={15} color="var(--primary)" />
              <span>{isEnrolled ? 'Open Face Scanner' : 'Tap to Start Scan'}</span>
              <ArrowRight size={14} color="var(--primary)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
