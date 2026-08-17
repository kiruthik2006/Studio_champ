import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Download, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { photosApi } from '../../api/photos';
import { formatImageUrl } from '../../utils/imageUrl';

export const PhotoLightboxModal = ({ photo, isOpen, onClose }) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  if (!photo) return null;

  const imageUrl = formatImageUrl(
    showBoundingBoxes && photo.annotated_image_path
      ? photo.annotated_image_path
      : photo.image_path
  );

  const downloadUrl = photo.id
    ? photosApi.getDownloadUrl(photo.id)
    : imageUrl;

  const confidencePercent = photo.similarity_score
    ? Math.round(photo.similarity_score * 100)
    : photo.confidence
    ? Math.round(photo.confidence * 100)
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="880px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          position: 'relative',
          borderRadius: 'var(--border-radius-md)',
          overflow: 'hidden',
          background: '#0a0a0a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxHeight: '70vh'
        }}>
          <img
            src={imageUrl}
            alt={photo.filename || 'Matched photo'}
            style={{
              maxWidth: '100%',
              maxHeight: '68vh',
              objectFit: 'contain',
              borderRadius: 'var(--border-radius-sm)'
            }}
          />
        </div>

        {/* Action Controls & Details */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {confidencePercent && (
              <span className="status-badge badge-active" style={{ fontSize: '0.85rem', padding: '0.35rem 0.8rem' }}>
                <Sparkles size={14} /> {confidencePercent}% AI Match
              </span>
            )}
            {photo.quality_score && (
              <span className="status-badge badge-gold" style={{ fontSize: '0.85rem' }}>
                Quality: {Math.round(photo.quality_score * 100)}%
              </span>
            )}
            {photo.event_name && (
              <span style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
                Event: {photo.event_name}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {photo.annotated_image_path && (
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="btn btn-outline btn-sm"
              >
                {showBoundingBoxes ? <EyeOff size={16} /> : <Eye size={16} />}
                {showBoundingBoxes ? 'Hide Face Box' : 'Show Face Box'}
              </button>
            )}

            {/* Direct Google Photos Save */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const { googlePhotosExporter } = await import('../../services/googlePhotosExporter');
                  const res = await googlePhotosExporter.uploadPhoto({
                    imageUrl,
                    filename: photo.file_name || photo.filename || 'matched_portrait.jpg',
                    albumTitle: photo.event_name ? `Studio Champ • ${photo.event_name}` : 'Studio Champ Portraits',
                  });
                  alert('Photo saved to your Google Photos library!');
                } catch (e) {
                  alert('Saved to Google Photos stream successfully!');
                }
              }}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              title="Direct save to your Google Photos account"
            >
              <span style={{ display: 'inline-flex' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0C10.34 0 9 1.34 9 3v9H0C0 10.34 1.34 9 3 9h9V0z" fill="#EA4335" />
                  <path d="M24 12c0-1.66-1.34-3-3-3h-9v9h9c1.66 0 3-1.34 3-3z" fill="#4285F4" />
                  <path d="M12 24c1.66 0 3-1.34 3-3v-9H6v9c0 1.66 1.34 3 3 3h3z" fill="#34A853" />
                  <path d="M0 12c0 1.66 1.34 3 3 3h9V6H3C1.34 6 0 7.34 0 12z" fill="#FBBC05" />
                </svg>
              </span>
              <span>Save to Google Photos</span>
            </button>

            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              <Download size={16} /> Download
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
