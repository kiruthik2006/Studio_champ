import React, { useState } from 'react';
import { GooglePhotosIcon } from './GoogleDriveStorageWidget';
import { googlePhotosExporter } from '../../services/googlePhotosExporter';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  CheckCircle2,
  ExternalLink,
  X,
  UploadCloud,
  FolderPlus,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

/**
 * GooglePhotosSyncModal
 * Export matched photos directly into a dedicated Google Photos album on the user's account
 */
export const GooglePhotosSyncModal = ({ isOpen, onClose, photos = [], defaultAlbumTitle }) => {
  const { showToast } = useToast();
  const [albumTitle, setAlbumTitle] = useState(
    defaultAlbumTitle || `Studio Champ • Event Portraits (${new Date().getFullYear()})`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: photos.length, percent: 0 });
  const [exportComplete, setExportComplete] = useState(false);
  const [googleAlbumUrl, setGoogleAlbumUrl] = useState('https://photos.google.com');

  if (!isOpen) return null;

  const handleStartExport = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
      showToast('No photos available to export', 'warning');
      return;
    }

    setIsExporting(true);
    setExportComplete(false);

    try {
      const res = await googlePhotosExporter.exportAlbum({
        photos,
        albumTitle,
        onProgress: (p) => setProgress(p),
      });

      setGoogleAlbumUrl(res.photosUrl || 'https://photos.google.com');
      setExportComplete(true);
      showToast(`Successfully uploaded ${photos.length} photos to your Google Photos album!`, 'success');
    } catch (err) {
      showToast('Upload to Google Photos failed: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-elevated"
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-gold)',
          padding: '2rem 1.75rem',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(66, 133, 244, 0.12)',
              border: '1px solid rgba(66, 133, 244, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GooglePhotosIcon size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
              Export to Google Photos
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Save all matched portraits directly to your personal Google Photos library
            </p>
          </div>
        </div>

        {!exportComplete ? (
          <form onSubmit={handleStartExport} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FolderPlus size={14} color="var(--primary)" />
                Google Photos Album Name
              </label>
              <input
                type="text"
                className="form-control"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
                style={{ fontSize: '0.88rem', padding: '0.65rem 0.85rem' }}
                disabled={isExporting}
              />
            </div>

            {/* Photo Count Card */}
            <div
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                <Layers size={16} color="var(--primary)" />
                <span>Photos Ready to Export</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {photos.length} High-Res Photos
              </span>
            </div>

            {/* Progress Bar while Exporting */}
            {isExporting && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>Uploading to Google Photos API...</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progress.percent}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--card-bg)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${progress.percent}%`,
                      background: 'var(--gradient-gold)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={isExporting}
                style={{ fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isExporting || photos.length === 0}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
              >
                <UploadCloud size={16} />
                <span>{isExporting ? `Uploading (${progress.completed}/${photos.length})...` : 'Start Google Photos Export'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Export Complete View */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem', padding: '1rem 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: '0 0 0.35rem', fontWeight: 700 }}>
                Photos Exported Successfully!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '360px' }}>
                All {photos.length} matched portraits have been saved to your Google Photos album: <strong style={{ color: 'var(--text-main)' }}>"{albumTitle}"</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ flex: 1, fontSize: '0.85rem' }}
              >
                Done
              </button>

              <a
                href={googleAlbumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
              >
                <span>Open in Google Photos</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
