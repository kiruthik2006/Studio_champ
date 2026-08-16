import React, { useState } from 'react';
import {
  Cloud,
  CheckCircle,
  Folder,
  HardDrive,
  RefreshCw,
  X,
  Sparkles,
  Shield,
  ArrowUpRight,
  ToggleLeft,
  ToggleRight,
  DownloadCloud,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

/**
 * GoogleDriveSyncModal
 * Modal to configure Google Drive auto-sync, destination folder paths,
 * storage quotas, and instant manual sync triggers.
 */
export const GoogleDriveSyncModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [folderPath, setFolderPath] = useState('/StudioChamp/Events/2026/');
  const [syncing, setSyncing] = useState(false);
  const [syncResolution, setSyncResolution] = useState('original'); // 'original' | 'optimized'

  if (!isOpen) return null;

  const handleManualSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      showToast('All matched event photos synced to Google Drive!', 'success');
    }, 1800);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
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
          maxWidth: '540px',
          borderRadius: 'var(--border-radius-lg)',
          border: '1px solid var(--border-gold)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cloud size={20} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>
                Google Drive Storage & Sync
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Connected Account: <strong style={{ color: 'var(--text-main)' }}>alex.studiochamp@gmail.com</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drive Storage Meter Banner */}
        <div
          style={{
            padding: '1.1rem',
            background: 'linear-gradient(145deg, rgba(66, 133, 244, 0.08) 0%, rgba(52, 168, 83, 0.04) 100%)',
            border: '1px solid rgba(66, 133, 244, 0.25)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              10.4 GB of 15.0 GB used (69%)
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
              4.6 GB Available
            </span>
          </div>

          {/* Segmented multi-color storage track */}
          <div
            style={{
              height: '8px',
              borderRadius: '999px',
              background: 'rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div style={{ width: '52%', background: '#4285F4' }} title="Event Photos (7.8 GB)" />
            <div style={{ width: '9%', background: '#FBBC05' }} title="Biometric Profiles (1.4 GB)" />
            <div style={{ width: '8%', background: '#EA4335' }} title="RAW Embeddings (1.2 GB)" />
          </div>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4285F4' }} />
              Photos (7.8 GB)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#FBBC05' }} />
              Circle Archives (1.4 GB)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EA4335' }} />
              Biometrics (1.2 GB)
            </span>
          </div>
        </div>

        {/* Sync Settings Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {/* Auto-Sync Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--border-radius-md)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Auto-Save Matched Photos
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Automatically save all discovered event portraits to Google Drive
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAutoSyncEnabled(!autoSyncEnabled);
                showToast(`Auto-sync ${!autoSyncEnabled ? 'enabled' : 'paused'}`, 'info');
              }}
              style={{ cursor: 'pointer', color: autoSyncEnabled ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              {autoSyncEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {/* Destination Folder Path */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Drive Destination Folder
            </label>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--border-radius-md)',
                padding: '0.65rem 0.85rem',
              }}
            >
              <Folder size={16} color="var(--primary)" />
              <input
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={syncing}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} className={syncing ? 'spin' : ''} />
            <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              showToast('Google Drive settings saved!', 'success');
              onClose();
            }}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
