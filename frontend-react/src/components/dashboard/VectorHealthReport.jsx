import React from 'react';
import { Camera, Upload, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

/**
 * VectorHealthReport / FaceEnrollmentHero
 * Clean, welcoming, beginner-friendly hero for face registration.
 * Focuses on user benefits (finding event photos) without confusing tech jargon.
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
      className="glass-card"
      style={{
        padding: '2rem 2.25rem',
        border: '1px solid var(--border-gold)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '1.75rem',
        background: 'linear-gradient(145deg, var(--card-bg-elevated) 0%, var(--card-bg) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '680px' }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '999px',
            background: isEnrolled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(201, 162, 39, 0.12)',
            color: isEnrolled ? '#10b981' : 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.85rem',
          }}
        >
          {isEnrolled ? (
            <>
              <CheckCircle2 size={13} />
              <span>Face Profile Active • {faces.length} {faces.length === 1 ? 'Photo' : 'Photos'} Enrolled</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>Step 1: Set Up Your Face Profile</span>
            </>
          )}
        </div>

        {/* Hero Title */}
        <h2
          style={{
            fontSize: '1.65rem',
            color: 'var(--text-main)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            marginBottom: '0.6rem',
          }}
        >
          {isEnrolled
            ? `Ready to Find Photos for ${memberName}`
            : 'Find All Your Event Photos Automatically'}
        </h2>

        {/* Plain-English Pitch */}
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}
        >
          {isEnrolled
            ? `Your face profile is all set! You can browse any event album to automatically see photos of ${memberName}, or add more photos to improve recognition.`
            : `Take a quick 30-second scan with your camera or upload a clear photo of ${memberName}. Our AI will automatically find every photo of you across all events.`}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onStartJourney}
            className="btn btn-primary"
            style={{
              padding: '0.65rem 1.35rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--btn-primary-shadow)',
            }}
          >
            <Camera size={17} />
            <span>{isEnrolled ? 'Scan Face Again' : 'Start 30-Second Face Scan'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenUpload}
            className="btn btn-outline"
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Upload size={16} />
            <span>Upload Photo</span>
          </button>
        </div>

        {/* Trust & Privacy Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '1.25rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldCheck size={14} color="var(--primary)" />
          <span>Private & Secure • Your face data is only used to find your own event photos</span>
        </div>
      </div>
    </div>
  );
};
