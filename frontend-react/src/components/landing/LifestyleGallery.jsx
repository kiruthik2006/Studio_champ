import React, { useState } from 'react';
import { Sparkles, Heart, Users, Calendar, ArrowRight, ShieldCheck, Download, Cloud } from 'lucide-react';

const EVENTS = [
  {
    id: 'weddings',
    category: 'Weddings & Receptions',
    title: 'The Sunset Wedding Toast',
    quote: '“We didn’t even know this candid laugh was captured until Presence found it in our album.”',
    author: 'Elena & Marcus • Amalfi Coast',
    img: '/covers/wedding.jpg',
    stats: '240 Portraits Instantly Delivered',
    features: ['Bride & Groom instant albums', 'Guest self-discovery', 'Original 4K downloads'],
  },
  {
    id: 'galas',
    category: 'Galas & Celebrations',
    title: 'The Annual Fashion Awards',
    quote: '“Guests received their red carpet entrances and table candids before dessert was even served.”',
    author: 'Studio Champ Event Director',
    img: '/covers/gala.jpg',
    stats: '600+ Guests Matched in Real-Time',
    features: ['Instant VIP delivery', 'Zero manual tagging', 'Direct Google Drive sync'],
  },
  {
    id: 'family',
    category: 'Family Reunions & Circles',
    title: 'Provence Countryside Reunion',
    quote: '“Filtering for shots where both my daughter and her grandparents are together was magic.”',
    author: 'Claire D. • Family Circle Member',
    img: '/covers/family.jpg',
    stats: 'Group Photos Found Effortlessly',
    features: ['Multi-person family circles', 'Child & partner profiles', 'Private family sharing'],
  },
  {
    id: 'summits',
    category: 'Conferences & Summits',
    title: 'Build The Future Summit 2026',
    quote: '“Keynote speakers downloaded their stage moments right from their phones in seconds.”',
    author: 'Tech Summit Lead Organizer',
    img: '/covers/summit.jpg',
    stats: '1,200 Attendees Connected',
    features: ['Multi-stage coverage', 'Speaker stage moments', 'High-speed cloud processing'],
  },
];

export const LifestyleGallery = () => {
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);

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
          <Heart size={14} />
          <span>Moments That Matter</span>
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
          Designed For <span className="gold-text">Every Life Event</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          From intimate weddings to grand reunions and galas, Presence preserves the moments you will treasure forever.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        {EVENTS.map((e) => {
          const isSelected = e.id === selectedEvent.id;

          return (
            <button
              key={e.id}
              type="button"
              onClick={() => setSelectedEvent(e)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '999px',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--card-bg-elevated)' : 'var(--card-bg)',
                color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {e.category}
            </button>
          );
        })}
      </div>

      {/* Featured Large Event Showcase Card */}
      <div
        className="glass-card-elevated"
        style={{
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-xl)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
          background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, var(--card-bg) 100%)',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Event Photo with Atmospheric Vignette */}
        <div style={{ position: 'relative', minHeight: '400px', width: '100%' }}>
          <img
            src={selectedEvent.img}
            alt={selectedEvent.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                alignSelf: 'flex-start',
                padding: '0.4rem 0.95rem',
                borderRadius: '999px',
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(223, 185, 74, 0.4)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
              }}
            >
              {selectedEvent.category}
            </span>

            <div>
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#10b981',
                  fontWeight: 700,
                  background: 'rgba(0,0,0,0.8)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                }}
              >
                ✓ {selectedEvent.stats}
              </span>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 800,
                  margin: 0,
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                {selectedEvent.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Right: Emotional Story & Features */}
        <div style={{ padding: '3.5rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <blockquote
            style={{
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: 'var(--text-main)',
              lineHeight: 1.6,
              marginBottom: '1rem',
              paddingLeft: '1rem',
              borderLeft: '3px solid var(--primary)',
              margin: 0,
            }}
          >
            {selectedEvent.quote}
          </blockquote>

          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.75rem', marginBottom: '2rem' }}>
            — {selectedEvent.author}
          </span>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.85rem', fontWeight: 700 }}>
            HIGHLIGHTS:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {selectedEvent.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(201, 162, 39, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={11} color="var(--primary)" />
                </div>
                <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
