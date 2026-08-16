import React from 'react';
import { Cloud, Folder, ExternalLink } from 'lucide-react';

/**
 * GoogleDriveIcon
 * Official Google Drive 3-color brand geometry
 */
export const GoogleDriveIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 512 443.3" fill="none" style={{ flexShrink: 0 }}>
    <path d="M165.7 443.3H0l173.3-300h165.7L165.7 443.3z" fill="#00AC47" />
    <path d="M512 295.6L429.2 443.3H165.7l82.8-147.7H512z" fill="#0066DA" />
    <path d="M339 143.3L256.2 0H82.9l82.8 143.3H339z" fill="#FFBA00" />
    <path d="M256.2 0l173 300H263.5L90.5 0H256.2z" fill="#EA4335" />
  </svg>
);

/**
 * GooglePhotosIcon
 * Official Google Photos 4-pinwheel brand geometry
 */
export const GooglePhotosIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M12 2a4 4 0 00-4 4v2h4a4 4 0 004-4 4 4 0 00-4-4z" fill="#EA4335" />
    <path d="M22 12a4 4 0 00-4-4h-2v4a4 4 0 004 4 4 4 0 002-4z" fill="#FBBC05" />
    <path d="M12 22a4 4 0 004-4v-2h-4a4 4 0 00-4 4 4 4 0 004 4z" fill="#34A853" />
    <path d="M2 12a4 4 0 004 4h2v-4a4 4 0 00-4-4 4 4 0 00-2 4z" fill="#4285F4" />
  </svg>
);

/**
 * GoogleDriveStorageWidget
 * Inspired by the reference design:
 * - Clean theme-adaptive surface (never dark in light mode)
 * - Authentic Google Drive & Photos brand iconography
 * - Multi-color circular ring meter
 * - Consumed vs Available storage stats (10.4 GB / 15 GB, 4.6 GB Free)
 * - Cloud Add-ons & Connected Folder integration
 */
export const GoogleDriveStorageWidget = ({ onOpenSyncModal }) => {
  const usedGB = 10.4;
  const totalGB = 15.0;
  const freeGB = (totalGB - usedGB).toFixed(1);
  const percentage = Math.round((usedGB / totalGB) * 100);

  // Circular gauge math for radius 22 (circumference ~138.2)
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="google-drive-widget"
      style={{
        padding: '0.85rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Header with Title & Auto-Sync Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GoogleDriveIcon size={18} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Google Drive
          </span>
        </div>

        {/* Status Badge */}
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
          Auto-Sync
        </span>
      </div>

      {/* Main Meter & Add-ons Grid (Clean Theme-Adaptive Box) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '0.5rem',
          alignItems: 'center',
          padding: '0.65rem 0.75rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--border-radius-sm)',
          transition: 'background-color 0.25s ease',
        }}
      >
        {/* Left Column: Radial Storage Meter */}
        <div
          onClick={onOpenSyncModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            cursor: 'pointer',
          }}
          title="Click to configure Google Drive storage"
        >
          <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
            <svg width="50" height="50" viewBox="0 0 54 54" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle
                cx="27"
                cy="27"
                r={radius}
                fill="transparent"
                stroke="var(--border-subtle)"
                strokeWidth="4"
              />
              {/* Active Segment Arc */}
              <circle
                cx="27"
                cy="27"
                r={radius}
                fill="transparent"
                stroke="#2684FC"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>

            {/* Inner Text Center */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {usedGB}
              </span>
              <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                GB
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              Storage
            </span>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
              {freeGB} GB Free
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              of {totalGB} GB
            </span>
          </div>
        </div>

        {/* Right Column: Connected Cloud Add-ons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.6rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Add-ons
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* Google Drive Icon Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(66, 133, 244, 0.12)',
                border: '1px solid rgba(66, 133, 244, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Google Drive (Active)"
            >
              <GoogleDriveIcon size={14} />
            </div>

            {/* Google Photos Icon Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(234, 67, 53, 0.10)',
                border: '1px solid rgba(234, 67, 53, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Google Photos Backup"
            >
              <GooglePhotosIcon size={14} />
            </div>

            {/* Cloud Vault Folder Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Drive Folder: /StudioChamp/Events"
            >
              <Folder size={12} color="var(--primary)" />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSyncModal}
            style={{
              fontSize: '0.68rem',
              color: 'var(--primary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              textAlign: 'left',
              padding: 0,
              marginTop: '0.1rem',
              cursor: 'pointer',
            }}
          >
            <span>Manage Sync</span>
            <ExternalLink size={9} />
          </button>
        </div>
      </div>
    </div>
  );
};
