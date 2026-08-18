import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, RefreshCw, CheckCircle2, Cloud, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { photosApi } from '../../api/photos';
import api from '../../api/client';

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
 * Official Google Drive 2020 SVG Vector Icon
 */
export const GoogleDriveIcon = ({ size = 18 }) => (
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

const formatRawBytes = (bytes) => {
  const tb = bytes / (1024 ** 4);
  const gb = bytes / (1024 ** 3);
  const mb = bytes / (1024 ** 2);
  if (tb >= 1.0) {
    const val = parseFloat(tb.toFixed(2));
    return { val, unit: 'TB', text: `${val} TB` };
  }
  if (gb >= 1.0) {
    const val = parseFloat(gb.toFixed(1));
    return { val, unit: 'GB', text: `${val} GB` };
  }
  const val = parseFloat(mb.toFixed(0));
  return { val, unit: 'MB', text: `${val} MB` };
};

/**
 * GoogleDriveStorageWidget
 * Sleek, clean, production-grade Google Cloud storage status widget.
 * Minimalist, polished layout tailored for clean navigation.
 */
export const GoogleDriveStorageWidget = ({ onOpenSyncModal }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [quota, setQuota] = useState(null);
  const [apiDisabledError, setApiDisabledError] = useState(null);

  const activeClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem('studio_google_client_id') ||
    '891854780153-ihlecsi9micu1qbp6791pp4uv1nilm2q.apps.googleusercontent.com';

  const userEmail = user?.email || 'user@gmail.com';

  // Query Google Drive about API directly with token
  const queryGoogleDriveDirectly = useCallback(async (token) => {
    if (!token) return false;
    try {
      const gRes = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=storageQuota,user',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const gData = await gRes.json();
      if (gRes.ok && gData?.storageQuota) {
        setApiDisabledError(null);
        const usageBytes = parseInt(gData.storageQuota.usage || '0', 10);
        const limitBytes = parseInt(gData.storageQuota.limit || '0', 10);

        const used = formatRawBytes(usageBytes);
        const total = limitBytes > 0 ? formatRawBytes(limitBytes) : { val: '∞', unit: '', text: 'Unlimited' };
        const pct =
          limitBytes > 0
            ? Math.min(100, Math.round((usageBytes / limitBytes) * 1000) / 10)
            : 0;

        setQuota({
          usedText: used.text,
          totalText: total.text,
          percent: pct,
          accountEmail: gData?.user?.emailAddress || userEmail,
        });
        setIsAuthorized(true);
        return true;
      } else if (gData?.error) {
        if (gData.error.code === 403 && gData.error.message?.includes('Google Drive API')) {
          setApiDisabledError(
            'https://console.developers.google.com/apis/api/drive.googleapis.com/overview?project=891854780153'
          );
        } else if (gData.error.status === 'UNAUTHENTICATED' || gData.error.code === 401) {
          localStorage.removeItem('google_access_token');
          setIsAuthorized(false);
        }
      }
    } catch (err) {
      console.warn('Google API query error:', err);
    }
    return false;
  }, [userEmail]);

  // Request fresh token via Google Identity Services Token Client
  const authorizeLiveGoogleToken = () => {
    if (!window.google?.accounts?.oauth2) {
      showToast('Google Identity Services SDK loading...', 'warning');
      return;
    }

    setSyncing(true);
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: activeClientId,
        hint: userEmail,
        scope:
          'openid email profile https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.file',
        callback: async (tokenResponse) => {
          if (tokenResponse?.access_token) {
            localStorage.setItem('google_access_token', tokenResponse.access_token);
            await queryGoogleDriveDirectly(tokenResponse.access_token);
            showToast('Google Cloud storage synchronized!', 'success');
          }
          setSyncing(false);
        },
        error_callback: () => {
          setSyncing(false);
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch {
      setSyncing(false);
    }
  };

  const fetchStorageQuota = useCallback(async () => {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      const success = await queryGoogleDriveDirectly(token);
      if (success) return;
    }

    try {
      const res = await api.post('/auth/google/quota', {
        access_token: token || null,
      });

      if (res?.data?.data && res.data.data.is_live_google) {
        const d = res.data.data;
        setQuota({
          usedText: d.used_text,
          totalText: d.total_text,
          percent: d.percent,
          accountEmail: userEmail,
        });
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch {
      setIsAuthorized(false);
    }
  }, [queryGoogleDriveDirectly, userEmail]);

  useEffect(() => {
    fetchStorageQuota();
  }, [fetchStorageQuota, user]);

  const handleSyncClick = async (e) => {
    e.stopPropagation();
    if (!isAuthorized) {
      authorizeLiveGoogleToken();
      return;
    }

    setSyncing(true);
    try {
      await fetchStorageQuota();
      await new Promise((r) => setTimeout(r, 600));
      showToast('Cloud storage synchronized!', 'success');
    } catch (err) {
      showToast('Sync error: ' + err.message, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const visualPercent = quota ? Math.max(3, quota.percent) : 0;

  return (
    <div
      style={{
        padding: '0.75rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--border-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      {/* Header: Service Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <GooglePhotosIcon size={16} />
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Google Cloud
        </span>
      </div>

      {/* Storage Progress Bar or Alert */}
      {apiDisabledError ? (
        <a
          href={apiDisabledError}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.4rem 0.6rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            color: '#ef4444',
            fontSize: '0.68rem',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Enable Drive API in GCP</span>
          <ExternalLink size={10} />
        </a>
      ) : isAuthorized && quota ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <span>{quota.usedText} of {quota.totalText} used</span>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{quota.percent}%</span>
          </div>

          <div style={{ width: '100%', height: '4px', background: 'var(--border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${visualPercent}%`,
                background: 'var(--gradient-gold)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={authorizeLiveGoogleToken}
          style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.2rem 0',
          }}
        >
          Click to connect Google Photos & Drive storage
        </div>
      )}

      {/* Quick Action Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingTop: '0.1rem' }}>
        <button
          type="button"
          onClick={handleSyncClick}
          disabled={syncing}
          className="btn btn-primary"
          style={{
            flex: 1,
            padding: '0.32rem 0.5rem',
            fontSize: '0.72rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
          }}
        >
          <RefreshCw size={11} className={syncing ? 'spin' : ''} />
          <span>{syncing ? 'Syncing...' : isAuthorized ? 'Sync' : 'Connect'}</span>
        </button>

        <a
          href="https://photos.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{
            flex: 1,
            padding: '0.32rem 0.5rem',
            fontSize: '0.72rem',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            color: 'var(--text-main)',
          }}
        >
          <span>Photos</span>
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
};
