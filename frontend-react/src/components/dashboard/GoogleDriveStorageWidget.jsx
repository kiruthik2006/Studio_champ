import React, { useState } from 'react';
import { HardDrive, Cloud, CheckCircle, RefreshCw, Folder, ExternalLink, Settings2, Sparkles } from 'lucide-react';

/**
 * GoogleDriveStorageWidget
 * Inspired by the reference design:
 * - Multi-color circular ring meter (Google Cloud branded or champagne gold)
 * - Consumed vs Available capacity stats (e.g. 10.4 GB / 15 GB, 4.6 GB Tersedia/Available)
 * - Cloud Add-ons & Connected Integrations (Google Drive, Google Photos, Cloud Vault)
 * - Clickable to open full Drive Sync configuration drawer/modal
 */
export const GoogleDriveStorageWidget = ({ onOpenSyncModal }) => {
  const usedGB = 10.4;
  const totalGB = 15.0;
  const freeGB = (totalGB - usedGB).toFixed(1);
  const percentage = Math.round((usedGB / totalGB) * 100);

  // Circular gauge math for radius 24 (circumference ~150.8)
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="google-drive-widget"
      style={{
        padding: '0.9rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
    >
      {/* Header with Title & Add-ons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px',
            }}
          >
            <Cloud size={12} color="#ffffff" />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Google Drive
          </span>
        </div>

        {/* Status Badge */}
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '0.15rem 0.45rem',
            borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
          Auto-Sync
        </span>
      </div>

      {/* Main Meter & Add-ons Grid (Matches Reference Layout) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          alignItems: 'center',
          padding: '0.6rem',
          background: 'rgba(0, 0, 0, 0.18)',
          borderRadius: '8px',
        }}
      >
        {/* Left Column: Radial Storage Meter */}
        <div
          onClick={onOpenSyncModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
          }}
          title="Click to manage Google Drive storage & auto-sync"
        >
          <div style={{ position: 'relative', width: '54px', height: '54px', flexShrink: 0 }}>
            <svg width="54" height="54" viewBox="0 0 58 58" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background Track */}
              <circle
                cx="29"
                cy="29"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="4.5"
              />
              {/* Multi-color Google Segment Arc */}
              <circle
                cx="29"
                cy="29"
                r={radius}
                fill="transparent"
                stroke="#4285F4"
                strokeWidth="4.5"
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
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                {usedGB}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                GB
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Storage
            </span>
            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Google Drive Icon */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(66, 133, 244, 0.15)',
                border: '1px solid rgba(66, 133, 244, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Google Drive (Active)"
            >
              <svg width="13" height="13" viewBox="0 0 87.3 78" fill="none">
                <path d="M6.6 66.85L0 55.4L29.1 5L35.7 16.45L6.6 66.85Z" fill="#0066DA" />
                <path d="M58.2 78H31.8L18.6 55.15L31.8 32.3H58.2L71.4 55.15L58.2 78Z" fill="#00AC47" />
                <path d="M80.7 66.85L51.6 16.45L58.2 5L87.3 55.4L80.7 66.85Z" fill="#EA4335" />
                <path d="M31.8 32.3L45 9.45L58.2 32.3H31.8Z" fill="#FFBA00" />
              </svg>
            </div>

            {/* Google Photos Icon */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(234, 67, 53, 0.12)',
                border: '1px solid rgba(234, 67, 53, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Google Photos Cloud Backup"
            >
              <Sparkles size={11} color="#EA4335" />
            </div>

            {/* Cloud Vault Folder */}
            <div
              onClick={onOpenSyncModal}
              style={{
                width: '24px',
                height: '24px',
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
              marginTop: '0.1rem',
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
