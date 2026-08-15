import React, { useState, useRef } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Trash2, Sparkles, X } from 'lucide-react';

export const BatchPhotoUploader = ({ events = [], selectedEvent, onUploadComplete, onCancel }) => {
  const safeEvents = Array.isArray(events) ? events : [];
  const [targetEventId, setTargetEventId] = useState(selectedEvent?.id || (safeEvents[0]?.id ?? ''));
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFiles = (files) => {
    const validImages = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!validImages.length) {
      showToast('Please select valid image files (JPG, PNG, WebP)', 'warning');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validImages]);
    showToast(`Added ${validImages.length} photo(s) to upload queue`, 'info');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearQueue = () => {
    setSelectedFiles([]);
    setProgress(0);
    setStatusMessage('');
  };

  const handleBatchUpload = async () => {
    if (!targetEventId) {
      showToast('Please select an event for photo ingestion', 'warning');
      return;
    }

    if (selectedFiles.length === 0) {
      showToast('Please add at least 1 photo to upload', 'warning');
      return;
    }

    setUploading(true);
    setProgress(10);
    setStatusMessage('Uploading and extracting facial vectors...');

    // Upload in batches of 15 files to ensure stability
    const BATCH_SIZE = 15;
    const totalFiles = selectedFiles.length;
    let uploadedCount = 0;
    let totalFacesDetected = 0;

    try {
      for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
        const chunk = selectedFiles.slice(i, i + BATCH_SIZE);
        const formData = new FormData();
        chunk.forEach((file) => {
          formData.append('photos', file);
        });

        setStatusMessage(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(totalFiles / BATCH_SIZE)}...`);
        const res = await adminApi.uploadEventPhotos(targetEventId, formData);
        uploadedCount += chunk.length;
        if (res?.data?.faces_detected) {
          totalFacesDetected += res.data.faces_detected;
        }

        const pct = Math.round((uploadedCount / totalFiles) * 100);
        setProgress(pct);
      }

      showToast(`Successfully uploaded ${totalFiles} photos! (${totalFacesDetected} faces indexed)`, 'success');
      clearQueue();
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      showToast(err.message || 'Upload failed during processing', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
      setStatusMessage('');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Upload size={20} color="#dfb94a" /> Bulk Event Photo Ingestion
          </h2>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem' }}>
            Upload album photos for automated face detection and 512-D embedding indexing.
          </p>
        </div>

        {onCancel && (
          <button onClick={onCancel} className="btn btn-outline btn-sm">
            <X size={14} /> Back to Events
          </button>
        )}
      </div>

      {/* Target Event Selector */}
      <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <label>Select Destination Event *</label>
        <select
          className="form-control"
          value={targetEventId}
          onChange={(e) => setTargetEventId(e.target.value)}
          disabled={uploading}
        >
          <option value="">-- Choose Event --</option>
          {safeEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name} ({ev.photo_count || 0} existing photos)
            </option>
          ))}
        </select>
      </div>

      {/* Drag and drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '3rem 2rem',
          border: `2px dashed ${isDragOver ? '#dfb94a' : 'rgba(201, 162, 39, 0.35)'}`,
          background: isDragOver ? 'rgba(201, 162, 39, 0.08)' : 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)'
        }}
      >
        <Upload size={44} color={isDragOver ? '#dfb94a' : 'var(--primary)'} style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.4rem' }}>
          Drag & Drop Event Photos Here
        </h3>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          Supports bulk multi-file uploads (JPG, PNG, WebP)
        </p>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        >
          Browse Local Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Queue Details */}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 'var(--border-radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
              Queue: {selectedFiles.length} photos ready
            </span>
            <button onClick={clearQueue} disabled={uploading} className="btn btn-outline btn-sm" style={{ color: '#ff8585' }}>
              <Trash2 size={13} /> Clear
            </button>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>
                <span>{statusMessage}</span>
                <span>{progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gradient-gold)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          <button
            onClick={handleBatchUpload}
            disabled={uploading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
          >
            {uploading ? (
              'Processing Embeddings with DeepFace...'
            ) : (
              <>
                <Sparkles size={16} /> Upload & Index {selectedFiles.length} Photos
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
