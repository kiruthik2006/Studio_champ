import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Download, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { photosApi } from '../../api/photos';

export const PhotoLightboxModal = ({ photo, isOpen, onClose }) => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);

  if (!photo) return null;

  const formatImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `http://localhost:5001${clean}`;
  };

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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {photo.annotated_image_path && (
              <button
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="btn btn-outline btn-sm"
              >
                {showBoundingBoxes ? <EyeOff size={16} /> : <Eye size={16} />}
                {showBoundingBoxes ? 'Hide Face Box' : 'Show Face Box'}
              </button>
            )}

            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm"
            >
              <Download size={16} /> Download Photo
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
