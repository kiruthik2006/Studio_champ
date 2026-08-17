import React, { useState } from 'react';
import { PhotoLightboxModal } from './PhotoLightboxModal';
import { GooglePhotosSyncModal } from './GooglePhotosSyncModal';
import { GooglePhotosIcon } from './GoogleDriveStorageWidget';
import { Sparkles, Download, Eye, Image as ImageIcon, Sliders, Users, Award, Shield, UploadCloud } from 'lucide-react';
import { photosApi } from '../../api/photos';
import { formatImageUrl } from '../../utils/imageUrl';

export const PhotoGallery = ({ photos = [], title = "Matched Photos", emptyMessage }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [minConfidence, setMinConfidence] = useState(50);
  const [showGooglePhotosModal, setShowGooglePhotosModal] = useState(false);

  const safePhotos = Array.isArray(photos) ? photos : [];

  const filteredPhotos = safePhotos.filter((p) => {
    const score = p.similarity_score || p.confidence || (p.match_confidence ? p.match_confidence / 100 : 0);
    return score * 100 >= minConfidence;
  });

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="var(--primary)" /> {title} ({filteredPhotos.length})
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            High-precision 512-D cosine similarity matched event photos.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Export to Google Photos Album */}
          {filteredPhotos.length > 0 && (
            <button
              type="button"
              onClick={() => setShowGooglePhotosModal(true)}
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                padding: '0.45rem 0.85rem',
                border: '1px solid var(--border-gold)',
                color: 'var(--text-main)',
              }}
            >
              <GooglePhotosIcon size={16} />
              <span>Export to Google Photos ({filteredPhotos.length})</span>
            </button>
          )}

          {/* Confidence Filter Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--input-bg)', padding: '0.4rem 0.8rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-subtle)' }}>
            <Sliders size={14} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '100px' }}>
              Min Match: <strong style={{ color: 'var(--primary)' }}>{minConfidence}%</strong>
            </span>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              style={{ width: '100px', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: 'var(--input-bg)',
          borderRadius: 'var(--border-radius-md)',
          border: '1px dashed var(--border-gold)'
        }}>
          <ImageIcon size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.4rem' }}>No Photos Match This Filter</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto' }}>
            {emptyMessage || 'Try lowering the confidence slider or choosing different circle members.'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredPhotos.map((photo, idx) => {
            const confidencePercent = photo.match_confidence
              ? Math.round(photo.match_confidence)
              : photo.similarity_score
              ? Math.round(photo.similarity_score * 100)
              : photo.confidence
              ? Math.round(photo.confidence * 100)
              : null;

            const matchedMembers = photo.matched_members || [];

            return (
              <div
                key={photo.id || idx}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#000' }}>
                  <img
                    src={formatImageUrl(photo.annotated_image_path || photo.file_path || photo.image_path)}
                    alt={photo.file_name || photo.filename || 'Matched photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    loading="lazy"
                  />

                  {/* Confidence Badge */}
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
                      color: 'var(--primary)',
                      border: '1px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Sparkles size={11} /> {confidencePercent}%
                    </div>
                  )}

                  {/* AI Curation / Best Shot Badge */}
                  {photo.ai_curation_badge && photo.ai_curation_badge !== 'Standard' && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(201, 162, 39, 0.9)',
                      color: '#121110',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    }}>
                      <Award size={11} /> {photo.ai_curation_badge}
                    </div>
                  )}

                  {/* Group Portrait Pill */}
                  {photo.is_group_portrait && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: '#68d391',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      border: '1px solid rgba(104, 211, 145, 0.3)',
                    }}>
                      <Users size={12} /> Family Portrait
                    </div>
                  )}

                  {/* Hover Overlay */}
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
                      <Eye size={14} /> View Lightbox
                    </span>
                  </div>
                </div>

                {/* Card Body with Detected Member Tags */}
                <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {matchedMembers.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                      {matchedMembers.map((m, mIdx) => (
                        <span
                          key={mIdx}
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            background: 'var(--badge-gold-bg)',
                            border: '1px solid var(--badge-gold-border)',
                            color: 'var(--primary)',
                            fontWeight: 600,
                          }}
                        >
                          {m.member_name} ({Math.round(m.confidence * 100)}%)
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photo.file_name || photo.filename || 'Event Photo'}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {photo.capture_date ? new Date(photo.capture_date).toLocaleDateString() : 'Matched Photo'}
                    </span>

                    <a
                      href={photosApi.getDownloadUrl(photo.id)}
                      download
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      title="Download full quality photo"
                    >
                      <Download size={12} />
                    </a>
                  </div>
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

      {/* Google Photos Dedicated Album Exporter Modal */}
      <GooglePhotosSyncModal
        isOpen={showGooglePhotosModal}
        onClose={() => setShowGooglePhotosModal(false)}
        photos={filteredPhotos}
        defaultAlbumTitle={`Studio Champ • ${title} (${new Date().getFullYear()})`}
      />
    </div>
  );
};
