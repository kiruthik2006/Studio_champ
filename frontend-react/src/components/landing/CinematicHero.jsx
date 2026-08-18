import React, { useState } from 'react';
import { Camera, Sparkles, ArrowRight, Search, Check, Heart, Shield, Image as ImageIcon } from 'lucide-react';

const EVENT_CHIPS = [
  { id: 'wedding', label: '💍 Amalfi Sunset Wedding', photos: 240, cover: '/covers/wedding.jpg', quote: 'Found 14 candid laughs' },
  { id: 'gala', label: '🥂 Elite Fashion Gala', photos: 450, cover: '/covers/gala.jpg', quote: 'Found 9 red-carpet shots' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Provence Family Reunion', photos: 180, cover: '/covers/family.jpg', quote: 'Found all 6 group smiles' },
  { id: 'summit', label: '🎤 Tech Keynote Summit', photos: 620, cover: '/covers/summit.jpg', quote: 'Found 11 stage portraits' },
];

export const CinematicHero = ({ onStart, onLogin, isAuthenticated }) => {
  const [selectedEvent, setSelectedEvent] = useState(EVENT_CHIPS[0]);
  const [isDemoActive, setIsDemoActive] = useState(false);

  return (
    <section
      style={{
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '7rem 1.5rem 4rem',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* 1. Centered Editorial Tagline */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            fontWeight: 700,
            background: 'rgba(201, 162, 39, 0.1)',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            border: '1px solid rgba(201, 162, 39, 0.3)',
          }}
        >
          ✦ Visual Memory Discovery
        </span>
      </div>

      {/* 2. Massive, Distinctive Editorial Headline */}
      <h1
        style={{
          fontSize: 'clamp(2.8rem, 6.5vw, 5.2rem)',
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: '-0.045em',
          color: 'var(--text-main)',
          margin: '0 auto 1.5rem',
          maxWidth: '960px',
        }}
      >
        You were there. <br />
        <span
          style={{
            background: 'linear-gradient(135deg, #b88a1b 0%, #e6b83b 50%, #b88a1b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Now find every photograph.
        </span>
      </h1>

      {/* 3. Human, Relatable Narrative */}
      <p
        style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: 1.6,
          margin: '0 auto 2.5rem',
        }}
      >
        Stop scrolling through 4,000 unorganized files on shared drives. Presence automatically finds every snapshot you appeared in and gathers them into your personal high-res storybook.
      </p>

      {/* 4. Interactive Live Event Discovery Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--card-bg-elevated)',
          border: '1.5px solid var(--border-gold)',
          borderRadius: '999px',
          padding: '0.5rem 0.5rem 0.5rem 1.4rem',
          boxShadow: 'var(--shadow-xl), 0 10px 40px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '3.5rem',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden', flex: 1 }}>
          <Search size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-main)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {selectedEvent.label}
          </span>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="btn btn-primary"
          style={{
            padding: '0.85rem 1.75rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--btn-primary-shadow)',
            cursor: 'pointer',
          }}
        >
          <span>Find My Photos</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 5. Cascading Floating Memory Cards Mosaic (Visually Rich, Not a Generic Card) */}
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          position: 'relative',
        }}
      >
        {EVENT_CHIPS.map((chip, idx) => {
          const isSelected = chip.id === selectedEvent.id;
          const tilts = ['-2deg', '2.5deg', '-1.5deg', '2deg'];
          const tilt = tilts[idx % tilts.length];

          return (
            <div
              key={chip.id}
              onClick={() => setSelectedEvent(chip)}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'var(--card-bg)',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? 'var(--shadow-xl), 0 0 30px rgba(201, 162, 39, 0.25)' : 'var(--shadow-md)',
                cursor: 'pointer',
                transform: isSelected ? 'scale(1.04) translateY(-6px)' : `rotate(${tilt}) scale(0.98)`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
              }}
            >
              {/* Photo Viewport */}
              <div style={{ height: '190px', width: '100%', position: 'relative' }}>
                <img
                  src={chip.cover}
                  alt={chip.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Event Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.75)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {chip.photos} Event Photos
                </div>

                {/* Bottom Discovery Pill */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '0.75rem',
                    right: '0.75rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '10px',
                    background: 'rgba(18, 17, 15, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(223, 185, 74, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={11} />
                    <span>{chip.quote}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Label */}
              <div style={{ padding: '0.95rem 1rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                  {chip.label}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
