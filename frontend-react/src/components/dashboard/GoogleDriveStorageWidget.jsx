import React from 'react';
import { Folder, ExternalLink } from 'lucide-react';

/**
 * Official Google Drive 2020 SVG Vector Icon (from Wikimedia Commons)
 */
export const GoogleDriveIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 87.3 78"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
    <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
    <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
    <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.25z" fill="#00832d" />
    <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.25z" fill="#2684fc" />
    <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
  </svg>
);

/**
 * Official Google Photos Pinwheel SVG Icon
 */
export const GooglePhotosIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 192 192"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <path d="M96 96V36a36 36 0 10-36 36h36z" fill="#EA4335" />
    <path d="M96 96h60a36 36 0 10-36-36v36z" fill="#FBBC05" />
    <path d="M96 96v60a36 36 0 1036-36H96z" fill="#34A853" />
    <path d="M96 96H36a36 36 0 1036 36V96z" fill="#4285F4" />
  </svg>
);

/**
 * GoogleDriveStorageWidget
 * Matches reference layout with zero overflow, theme-adaptive surfaces,
 * authentic Google Drive vector geometry, and circular capacity meter.
 */
export const GoogleDriveStorageWidget = ({ onOpenSyncModal }) => {
  const usedGB = 10.4;
  const totalGB = 15.0;
  const freeGB = (totalGB - usedGB).toFixed(1);
  const percentage = Math.round((usedGB / totalGB) * 100);

  // Circular gauge math for radius 20 (circumference ~125.6)
  const radius = 20;
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
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      {/* Header with Title & Auto-Sync Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GoogleDriveIcon size={19} />
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
            flexShrink: 0,
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
          Auto-Sync
        </span>
      </div>

      {/* Main Meter & Add-ons (Fits snugly with zero overflow) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.6rem 0.65rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--border-radius-sm)',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Left: Radial Storage Meter */}
        <div
          onClick={onOpenSyncModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            minWidth: 0,
          }}
          title="Click to configure Google Drive storage"
        >
          <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
            <svg width="46" height="46" viewBox="0 0 50 50" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="transparent"
                stroke="var(--border-subtle)"
                strokeWidth="3.5"
              />
              {/* Active Arc */}
              <circle
                cx="25"
                cy="25"
                r={radius}
                fill="transparent"
                stroke="#2684FC"
                strokeWidth="3.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>

            {/* Inner Text */}
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
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {usedGB}
              </span>
              <span style={{ fontSize: '0.48rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                GB
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Storage
            </span>
            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap' }}>
              {freeGB} GB Free
            </span>
            <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              of {totalGB} GB
            </span>
          </div>
        </div>

        {/* Right: Connected Cloud Add-ons (Contained snugly) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            borderLeft: '1px solid var(--border-subtle)',
            paddingLeft: '0.5rem',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Add-ons
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Google Drive Icon Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '23px',
                height: '23px',
                borderRadius: '5px',
                background: 'rgba(66, 133, 244, 0.12)',
                border: '1px solid rgba(66, 133, 244, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Google Drive"
            >
              <GoogleDriveIcon size={13} />
            </div>

            {/* Google Photos Icon Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '23px',
                height: '23px',
                borderRadius: '5px',
                background: 'rgba(234, 67, 53, 0.10)',
                border: '1px solid rgba(234, 67, 53, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Google Photos"
            >
              <GooglePhotosIcon size={13} />
            </div>

            {/* Cloud Vault Folder Box */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '23px',
                height: '23px',
                borderRadius: '5px',
                background: 'rgba(201, 162, 39, 0.12)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Drive Folder: /StudioChamp"
            >
              <Folder size={11} color="var(--primary)" />
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSyncModal}
            style={{
              fontSize: '0.65rem',
              color: 'var(--primary)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              textAlign: 'left',
              padding: 0,
              marginTop: '0.05rem',
              cursor: 'pointer',
            }}
          >
            <span>Manage</span>
            <ExternalLink size={8} />
          </button>
        </div>
      </div>
    </div>
  );
};
