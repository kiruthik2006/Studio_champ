import React from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Info, CheckCircle2, ArrowRight, Camera, Upload, Users, Award, SunMedium, RotateCcw } from 'lucide-react';
import { calculateMemberVectorHealth, calculateCircleHealthSummary } from '../../utils/imageDiagnostics';

export const VectorHealthReport = ({
  member,
  members = [],
  faces = [],
  onStartJourney,
  onOpenUpload,
  onSelectMember,
}) => {
  const memberHealth = calculateMemberVectorHealth(faces);
  const circleSummary = calculateCircleHealthSummary(members);

  const memberName = member?.name || 'Your';

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.75rem 2rem',
        border: '1px solid var(--border-gold)',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem',
      }}
    >
      {/* Top Header & CTAs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.45rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
              Biometric Vector Health: <span className="gold-text">{memberName}</span>
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontWeight: 700,
                background: memberHealth.bgBadge,
                color: memberHealth.badgeColor,
                border: `1px solid ${memberHealth.badgeColor}`,
              }}
            >
              {memberHealth.score}% • {memberHealth.healthStatus}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.3rem', marginBottom: 0 }}>
            AI image quality, lighting diagnostic, and multi-angle biometric readiness audit.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={onOpenUpload}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Upload size={15} /> Upload Files
          </button>

          <button
            onClick={onStartJourney}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Camera size={16} /> Start Guided 4-Step Journey
          </button>
        </div>
      </div>

      {/* Circle-Wide Family Readiness Overview Strip */}
      {members.length > 1 && (
        <div
          style={{
            background: 'var(--input-bg)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Circle Readiness ({circleSummary.readyCount}/{circleSummary.totalMembers} Members Ready):
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {circleSummary.memberScores.map((m) => (
              <div
                key={m.memberId}
                onClick={() => onSelectMember && onSelectMember(m.memberId)}
                style={{
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  background: m.health.bgBadge,
                  color: m.health.badgeColor,
                  border: `1px solid ${m.health.badgeColor}`,
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
                title={`Switch to ${m.name}`}
              >
                <span>{m.name}</span>
                <span>({m.health.score}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar & 4-Angle Vector Coverage Badges */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Angle Calibration & Vector Density ({memberHealth.capturedSlots.length}/4 Angles Covered)
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: memberHealth.badgeColor }}>
            {memberHealth.score}% Health Rating
          </span>
        </div>

        <div style={{ width: '100%', height: '6px', background: 'var(--input-bg)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
          <div
            style={{
              width: `${memberHealth.score}%`,
              height: '100%',
              background: memberHealth.score >= 90
                ? 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)'
                : memberHealth.score >= 70
                ? 'linear-gradient(90deg, var(--primary) 0%, #dfb94a 100%)'
                : 'linear-gradient(90deg, #ecc94b 0%, #f56565 100%)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* 4 Angle Slot Readiness Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.65rem' }}>
          {[
            { id: 'front', title: 'Front Facing', icon: '👤', present: memberHealth.hasFront },
            { id: 'left', title: 'Left Profile (30°)', icon: '👈', present: memberHealth.hasLeft },
            { id: 'right', title: 'Right Profile (30°)', icon: '👉', present: memberHealth.hasRight },
            { id: 'smile', title: 'Smile / Candid', icon: '😄', present: memberHealth.hasSmile },
          ].map((slot) => (
            <div
              key={slot.id}
              style={{
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--border-radius-sm)',
                background: slot.present ? 'rgba(72, 187, 120, 0.08)' : 'var(--input-bg)',
                border: slot.present ? '1px solid rgba(72, 187, 120, 0.3)' : '1px dashed var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  background: slot.present ? '#48bb78' : 'var(--card-bg)',
                  color: slot.present ? '#fff' : 'var(--text-muted)',
                }}
              >
                {slot.present ? <CheckCircle2 size={14} /> : slot.icon}
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: slot.present ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {slot.title}
                </div>
                <div style={{ fontSize: '0.68rem', color: slot.present ? '#48bb78' : 'var(--text-muted)' }}>
                  {slot.present ? 'Calibrated' : 'Missing'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable AI Suggestions & Diagnostic Warnings */}
      {memberHealth.tips.length > 0 && (
        <div
          style={{
            padding: '0.9rem 1.1rem',
            background: 'var(--input-bg)',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
            <Award size={14} />
            <span>AI BIOMETRIC OPTIMIZATION TIPS</span>
          </div>

          {memberHealth.tips.map((tip, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span style={{ color: tip.type === 'warning' ? '#f56565' : 'var(--primary)', marginTop: '2px' }}>•</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
