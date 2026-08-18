import React, { useState } from 'react';
import { Sparkles, Users, Camera, ShieldCheck, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

const STORIES = [
  {
    id: 'wedding',
    tag: 'Destination Wedding',
    title: 'The Amalfi Sunset Ceremony',
    stats: '240 Portraits Grouped in 8s',
    accuracy: '99.6% Cosine Match',
    img: '/covers/wedding.jpg',
    description:
      'After a 3-day Mediterranean wedding with 4,200 event photos from 3 photographers, the bride and groom registered once. Presence automatically indexed every ceremony moment, sunset reception portrait, and candid toast into their private gallery.',
    highlights: ['Multi-angle facial calibration', 'Zero duplicate clutter', '1-Click full-resolution download'],
  },
  {
    id: 'summit',
    tag: 'Global Tech Keynote',
    title: 'Build The Future Summit 2026',
    stats: '1,250 Attendees Indexed',
    accuracy: '99.2% Cosine Match',
    img: '/covers/summit.jpg',
    description:
      'Over 20 stages and 8,000 attendee snapshots were processed simultaneously. Keynote speakers and VIP delegates received their complete stage appearances and panel portraits in real-time via direct Google Drive auto-sync.',
    highlights: ['Multi-camera stream ingestion', 'Stage lighting compensation', 'Google Photos instant backup'],
  },
  {
    id: 'family',
    tag: 'Family & Friends Circle',
    title: 'Provence Lavender Reunion',
    stats: 'Multi-Person "All Present"',
    accuracy: '98.9% Cosine Match',
    img: '/covers/family.jpg',
    description:
      'Family gatherings often feature hundreds of candid shots. Using the Family Circle filter, parents easily filtered for rare shots where both their children and grandparents were present and smiling together.',
    highlights: ['Multi-person Boolean filter', 'Circle member management', 'Zero manual tagging'],
  },
];

export const EditorialShowcase = () => {
  const [activeStory, setActiveStory] = useState(STORIES[0]);

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
          <span>Curated Moments</span>
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
          Presence In <span className="gold-text">Every Moment</span>
        </h2>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
          Explore how our 512-dimensional facial recognition transforms the way people experience large event photography.
        </p>
      </div>

      {/* Story Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        {STORIES.map((story) => {
          const isSelected = story.id === activeStory.id;

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStory(story)}
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
              {story.tag}
            </button>
          );
        })}
      </div>

      {/* Featured Editorial Magazine Card */}
      <div
        className="glass-card-elevated"
        style={{
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid var(--border-gold)',
          boxShadow: 'var(--shadow-xl)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          background: 'linear-gradient(135deg, var(--card-bg-elevated) 0%, var(--card-bg) 100%)',
        }}
        className="hero-grid-responsive"
      >
        {/* Left: Large High-Resolution Visual Showcase */}
        <div style={{ position: 'relative', minHeight: '380px', width: '100%' }}>
          <img
            src={activeStory.img}
            alt={activeStory.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* Vignette & Badges */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                alignSelf: 'flex-start',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: 'rgba(0, 0, 0, 0.65)',
                border: '1px solid rgba(223, 185, 74, 0.4)',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
              }}
            >
              {activeStory.tag}
            </span>

            <div>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#10b981',
                  fontWeight: 700,
                  background: 'rgba(0,0,0,0.75)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                }}
              >
                ✓ {activeStory.accuracy}
              </span>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                  fontWeight: 800,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                {activeStory.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Right: Editorial Story & Highlights */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
              {activeStory.stats}
            </span>
          </div>

          <h3
            style={{
              fontSize: '1.45rem',
              color: 'var(--text-main)',
              fontWeight: 800,
              marginBottom: '1rem',
              letterSpacing: '-0.025em',
            }}
          >
            {activeStory.title}
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            {activeStory.description}
          </p>

          {/* Key Takeaways */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeStory.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={17} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
