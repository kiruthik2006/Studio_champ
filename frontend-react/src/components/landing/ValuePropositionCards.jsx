import React from 'react';
import { Camera, Users, Sparkles, ShieldCheck, Download, Heart, CheckCircle2 } from 'lucide-react';

const VALUES = [
  {
    icon: Camera,
    title: 'One 30-Second Selfie',
    subtitle: 'Never repeat the setup',
    description:
      'Enroll in 30 seconds from your phone. You are immediately ready to find your photos across every wedding, party, and event you attend.',
  },
  {
    icon: Users,
    title: 'Family & Friends Circles',
    subtitle: 'Keep your loved ones grouped',
    description:
      'Add family members or friends to your circle to instantly find moments where your children, spouse, or best friends are in the photo with you.',
  },
  {
    icon: Download,
    title: 'Original 4K Studio Quality',
    subtitle: 'Zero compression loss',
    description:
      'Download full-resolution, original camera files ready for framing, printing, or instant cloud backup to your personal Google Photos.',
  },
  {
    icon: ShieldCheck,
    title: '100% Private & In Your Control',
    subtitle: 'Your memories belong to you',
    description:
      'Your face representations are encrypted and strictly private. Only you can view your matched photos, and you can delete your profile anytime.',
  },
];

export const ValuePropositionCards = () => {
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
          <span>Why Guests & Hosts Love Presence</span>
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
          Effortless Memories. <span className="gold-text">Zero Hassle.</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Everything you need to enjoy, share, and preserve your special event moments without the stress.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {VALUES.map((v, i) => {
          const Icon = v.icon;

          return (
            <div
              key={i}
              className="glass-card-elevated"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '22px',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--badge-gold-bg)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 12px rgba(201, 162, 39, 0.15)',
                  }}
                >
                  <Icon size={22} />
                </div>

                <span style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {v.subtitle}
                </span>

                <h3
                  style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-main)',
                    fontWeight: 800,
                    margin: '0.3rem 0 0.75rem',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {v.title}
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
                  {v.description}
                </p>
              </div>

              <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>Included with all accounts</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
