import React from 'react';
import { Calendar, MapPin, Image as ImageIcon, Sparkles } from 'lucide-react';

export const EventCard = ({ event, onSearch, onFindPhotos, searching, isLoading }) => {
  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  const isSearching = searching || isLoading;

  const handleClick = () => {
    if (typeof onFindPhotos === 'function') {
      onFindPhotos(event);
    } else if (typeof onSearch === 'function') {
      onSearch(event.id);
    }
  };

  // Resolve high-resolution photography cover based on event type or name
  const getCoverImage = () => {
    if (event.cover_url || event.cover_image) return event.cover_url || event.cover_image;
    const nameLower = (event.name || '').toLowerCase();
    const typeLower = (event.event_type || '').toLowerCase();
    if (nameLower.includes('wedding') || typeLower.includes('wedding')) return '/covers/wedding.jpg';
    if (nameLower.includes('gala') || nameLower.includes('award') || typeLower.includes('gala')) return '/covers/gala.jpg';
    if (nameLower.includes('family') || nameLower.includes('reunion') || typeLower.includes('family')) return '/covers/family.jpg';
    if (nameLower.includes('summit') || nameLower.includes('conf') || nameLower.includes('tech')) return '/covers/summit.jpg';
    return '/covers/wedding.jpg';
  };

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
      {/* Cover / Header with Real Photography & Gradient Scrim */}
      <div
        style={{
          height: '160px',
          backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.85) 100%), url(${getCoverImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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

        <h3 style={{ fontSize: '1.3rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
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
          onClick={handleClick}
          disabled={isSearching || (event.photo_count === 0)}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1.25rem', fontSize: '0.88rem', padding: '0.65rem' }}
        >
          {isSearching ? (
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
