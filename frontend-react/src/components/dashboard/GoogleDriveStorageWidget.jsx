import React, { useState, useEffect, useCallback } from 'react';
import { Folder, ExternalLink, RefreshCw, CheckCircle2, Cloud, UploadCloud, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { photosApi } from '../../api/photos';

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
 * Real Google Cloud Storage & Auto-Sync Widget.
 * Fetches live Google Drive quota in bytes and queries actual user matched photo counts.
 */
export const GoogleDriveStorageWidget = ({ onOpenSyncModal }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);
  const [loadingLiveQuota, setLoadingLiveQuota] = useState(false);

  // Live storage metrics
  const [quota, setQuota] = useState(() => {
    const saved = localStorage.getItem('google_real_quota');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      usedGB: 0.0,
      totalGB: 15.0,
      freeGB: 15.0,
      percent: 0,
      isRealGoogleData: false,
    };
  });

  const activeClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('studio_google_client_id') ||
    '891854780153-ihlecsi9micu1qbp6791pp4uv1nilm2q.apps.googleusercontent.com';

  // Fetch real Google Storage Quota from Google Drive API
  const fetchRealGoogleStorage = useCallback(async (tokenToUse) => {
    const token = tokenToUse || localStorage.getItem('google_access_token');
    if (!token) return;

    setLoadingLiveQuota(true);
    try {
      const res = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=storageQuota,user',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data?.storageQuota) {
          const usageBytes = parseInt(data.storageQuota.usage || '0', 10);
          const limitBytes = parseInt(data.storageQuota.limit || '16106127360', 10);

          const used = parseFloat((usageBytes / 1024 ** 3).toFixed(2));
          const total = parseFloat((limitBytes / 1024 ** 3).toFixed(1));
          const free = parseFloat(Math.max(0, total - used).toFixed(2));
          const percent = Math.min(100, Math.round((usageBytes / limitBytes) * 100));

          const realData = {
            usedGB: used,
            totalGB: total,
            freeGB: free,
            percent,
            isRealGoogleData: true,
          };

          setQuota(realData);
          localStorage.setItem('google_real_quota', JSON.stringify(realData));
        }
      }
    } catch (err) {
      console.warn('Could not query live Google Drive quota:', err);
    } finally {
      setLoadingLiveQuota(false);
    }
  }, []);

  // Request OAuth access token directly from Google if needed
  const requestGoogleTokenAndFetch = () => {
    if (!window.google?.accounts?.oauth2) {
      showToast('Google Identity Services loading...', 'info');
      return;
    }

    setSyncing(true);
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        scope:
          'openid email profile https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file',
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            localStorage.setItem('google_access_token', tokenResponse.access_token);
            await fetchRealGoogleStorage(tokenResponse.access_token);
            showToast('Live Google Drive quota loaded successfully!', 'success');
          }
          setSyncing(false);
        },
        error_callback: (error) => {
          console.error(error);
          showToast('Google authorization closed', 'warning');
          setSyncing(false);
        },
      });
      client.requestAccessToken({ prompt: '' });
    } catch (e) {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchRealGoogleStorage();
  }, [fetchRealGoogleStorage, user]);

  // Fetch real user photo count from backend
  useEffect(() => {
    const fetchUserPhotoCount = async () => {
      try {
        const res = await photosApi.getMyPhotos();
        if (res?.data && Array.isArray(res.data)) {
          setSyncedCount(res.data.length);
        }
      } catch {
        setSyncedCount(0);
      }
    };
    fetchUserPhotoCount();
  }, [user]);

  // Circular gauge math for radius 20 (circumference ~125.6)
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (quota.percent / 100) * circumference;

  const handleInstantSync = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('google_access_token')) {
      requestGoogleTokenAndFetch();
      return;
    }

    setSyncing(true);
    try {
      await fetchRealGoogleStorage();
      showToast(`Live Google Cloud Quota synchronized with ${user?.email || 'Google'}!`, 'success');
    } catch (err) {
      showToast('Cloud sync failed: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

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
      {/* Header with Google Pinwheel, User Account & Connected Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <GooglePhotosIcon size={18} />
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Google Cloud
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '120px',
              }}
              title={user?.email || 'kiruthikk911@gmail.com'}
            >
              {user?.email || 'kiruthikk911@gmail.com'}
            </span>
          </div>
        </div>

        {/* Live Auto-Sync Active Badge */}
        <span
          onClick={requestGoogleTokenAndFetch}
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '0.15rem 0.45rem',
            borderRadius: '999px',
            background: quota.isRealGoogleData ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)',
            color: quota.isRealGoogleData ? '#10b981' : '#eab308',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          title="Click to refresh live Google token"
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: quota.isRealGoogleData ? '#10b981' : '#eab308',
            }}
          />
          {quota.isRealGoogleData ? 'Live API' : 'Connect'}
        </span>
      </div>

      {/* Main Meter & Live Storage Telemetry */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          padding: '0.6rem 0.65rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--border-radius-sm)',
          boxSizing: 'border-box',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Radial Storage Gauge */}
          <div
            onClick={quota.isRealGoogleData ? onOpenSyncModal : requestGoogleTokenAndFetch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              minWidth: 0,
            }}
            title={quota.isRealGoogleData ? 'Click to configure cloud storage' : 'Click to fetch live quota from Google'}
          >
            <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
              <svg width="44" height="44" viewBox="0 0 50 50" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="25"
                  cy="25"
                  r={radius}
                  fill="transparent"
                  stroke="var(--border-subtle)"
                  strokeWidth="3.5"
                />
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

              {/* Inner text */}
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
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  {quota.usedGB}
                </span>
                <span style={{ fontSize: '0.45rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  GB
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
                Live Quota
              </span>
              <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap' }}>
                {quota.freeGB} GB Free
              </span>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                of {quota.totalGB} GB
              </span>
            </div>
          </div>

          {/* Right: Sync / Refresh Live Quota Button */}
          <button
            type="button"
            onClick={handleInstantSync}
            disabled={syncing || loadingLiveQuota}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: 'rgba(66, 133, 244, 0.12)',
              border: '1px solid rgba(66, 133, 244, 0.3)',
              color: '#4285F4',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Fetch and sync live Google Storage quota"
          >
            <RefreshCw size={12} className={syncing || loadingLiveQuota ? 'spin' : ''} />
            <span>{syncing || loadingLiveQuota ? 'Fetching...' : 'Sync Now'}</span>
          </button>
        </div>

        {/* Clean Footer Row: Synced Count & Open Photos Link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.4rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.65rem',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-main)' }}>{syncedCount}</strong> photos indexed
          </span>

          <a
            href="https://photos.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            title="Open your Google Photos library in browser"
          >
            <span>Open Photos</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};
