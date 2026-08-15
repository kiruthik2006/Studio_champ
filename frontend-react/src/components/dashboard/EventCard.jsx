import React from 'react';
import { Calendar, MapPin, Image as ImageIcon, Search, Sparkles } from 'lucide-react';

export const EventCard = ({ event, onSearch, searching }) => {
  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(201, 162, 39, 0.18)',
        transition: 'all var(--transition-normal)',
      }}
    >
      {/* Cover / Header */}
      <div
        style={{
          height: '140px',
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.25) 0%, rgba(20, 20, 20, 0.9) 100%)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="status-badge badge-gold" style={{ fontSize: '0.7rem' }}>
            {event.event_type || 'Event'}
          </span>
          <span
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ImageIcon size={13} color="#dfb94a" /> {event.photo_count || 0} Photos
          </span>
        </div>

        <h3 style={{ fontSize: '1.3rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
          {event.name}
        </h3>
      </div>

      {/* Body Info */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {event.description && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
              {event.description}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} color="var(--primary)" />
              <span>{formattedDate}</span>
            </div>
            {event.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--primary)" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onSearch(event.id)}
          disabled={searching || (event.photo_count === 0)}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.25rem', fontSize: '0.88rem', padding: '0.65rem' }}
        >
          {searching ? (
            'Searching Faces...'
          ) : (
            <>
              <Sparkles size={16} /> Find My Photos
            </>
          )}
        </button>
      </div>
    </div>
  );
};
