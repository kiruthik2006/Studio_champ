import React, { useState } from 'react';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { Sparkles, Download, Eye, Image as ImageIcon, Sliders } from 'lucide-react';
import { photosApi } from '../../api/photos';

export const PhotoGallery = ({ photos, title = "Matched Photos", emptyMessage }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [minConfidence, setMinConfidence] = useState(50);

  const formatImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `http://localhost:5001${clean}`;
  };

  const filteredPhotos = photos.filter((p) => {
    const score = p.similarity_score || p.confidence || 0;
    return score * 100 >= minConfidence;
  });

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="#dfb94a" /> {title} ({filteredPhotos.length})
          </h2>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            AI-matched photos containing your face from event galleries.
          </p>
        </div>

        {photos.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'rgba(0,0,0,0.3)',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--border-radius-md)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <Sliders size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Min Match: {minConfidence}%</span>
            <input
              type="range"
              min="30"
              max="90"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              style={{ width: '90px', accentColor: 'var(--primary)' }}
            />
          </div>
        )}
      </div>

      {photos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem 1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <ImageIcon size={48} color="var(--gray)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>No Matched Photos Yet</h3>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto' }}>
            {emptyMessage || 'Select an event from the Events tab and click "Find My Photos" to scan through albums.'}
          </p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--gray-light)' }}>
          No photos meet the {minConfidence}% match threshold. Try lowering the threshold slider.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredPhotos.map((photo, idx) => {
            const confidencePercent = photo.similarity_score
              ? Math.round(photo.similarity_score * 100)
              : photo.confidence
              ? Math.round(photo.confidence * 100)
              : null;

            return (
              <div
                key={photo.id || idx}
                style={{
                  background: 'rgba(20, 19, 18, 0.8)',
                  border: '1px solid rgba(201, 162, 39, 0.2)',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)'
                }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
                  <img
                    src={formatImageUrl(photo.annotated_image_path || photo.image_path)}
                    alt={photo.filename || 'Matched photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    loading="lazy"
                  />
                  {confidencePercent && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(6px)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#dfb94a',
                      border: '1px solid rgba(201, 162, 39, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Sparkles size={11} /> {confidencePercent}%
                    </div>
                  )}

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    <span className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      <Eye size={14} /> View
                    </span>
                  </div>
                </div>

                <div style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                    {photo.filename || photo.event_name || 'Event photo'}
                  </div>

                  <a
                    href={photosApi.getDownloadUrl(photo.id)}
                    download
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    title="Download"
                  >
                    <Download size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPhoto && (
        <PhotoLightboxModal
          photo={selectedPhoto}
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  );
};
