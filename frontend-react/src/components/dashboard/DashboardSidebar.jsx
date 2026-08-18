import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LiquidSidebarIndicator } from '../common/LiquidSidebarIndicator';
import { GoogleDriveStorageWidget } from './GoogleDriveStorageWidget';
import { GoogleDriveSyncModal } from './GoogleDriveSyncModal';
import {
  UserPlus,
  Calendar,
  Images,
  Settings,
  Sparkles,
  LogOut,
  Cpu,
} from 'lucide-react';

/**
 * DashboardSidebar
 * Polished, production-grade sidebar with clean hierarchy:
 * - User Profile Header (Google Avatar + Name)
 * - Circle Readiness Bar
 * - Navigation Tabs (Face & Circle, Events, Matched Photos, Settings)
 * - Minimalist Google Cloud storage bar
 * - Footer (Engine status + Sign Out)
 */
export const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  tabRefs,
  circleMembers = [],
  events = [],
  matchedPhotosCount = 0,
  onStartJourney,
}) => {
  const { user, logout } = useAuth();
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Compute total faces enrolled
  const totalFaces = circleMembers.reduce((acc, m) => {
    const count = m.face_count || (m.faces ? m.faces.length : 0);
    return acc + count;
  }, 0);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.full_name || user?.first_name || 'Studio Member';

  return (
    <>
      <aside
        className="dashboard-sidebar"
        style={{
          width: '270px',
          minWidth: '270px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        {/* 1. User Profile Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 0.85rem',
            background: 'var(--card-bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--avatar-bg)',
              color: 'var(--avatar-text)',
              border: '1px solid var(--avatar-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {user?.avatar_url || user?.picture ? (
              <img
                src={user.avatar_url || user.picture}
                alt={userName}
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getInitials(userName)
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Google Account
            </div>
          </div>
        </div>

        {/* 2. Navigation Menu */}
        <div className="sidebar-menu" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <LiquidSidebarIndicator activeTab={activeTab} tabRefs={tabRefs} />

          <button
            ref={(el) => (tabRefs.current['face-registration'] = el)}
            className={`sidebar-item ${activeTab === 'face-registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('face-registration')}
          >
            <UserPlus size={17} />
            <span style={{ flex: 1 }}>Face & Circle</span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                background: activeTab === 'face-registration' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              {totalFaces}
            </span>
          </button>

          <button
            ref={(el) => (tabRefs.current['events'] = el)}
            className={`sidebar-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={17} />
            <span style={{ flex: 1 }}>Browse Events</span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                background: activeTab === 'events' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              {events.length}
            </span>
          </button>

          <button
            ref={(el) => (tabRefs.current['my-photos'] = el)}
            className={`sidebar-item ${activeTab === 'my-photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-photos')}
          >
            <Images size={17} />
            <span style={{ flex: 1 }}>Matched Photos</span>
            {matchedPhotosCount > 0 && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: 'var(--gradient-gold)',
                  color: '#0d0d0d',
                }}
              >
                {matchedPhotosCount}
              </span>
            )}
          </button>

          <button
            ref={(el) => (tabRefs.current['settings'] = el)}
            className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={17} />
            <span>Account Settings</span>
          </button>
        </div>

        {/* 3. Bottom Dock: Google Cloud storage + Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Streamlined Google Storage Widget */}
          <GoogleDriveStorageWidget onOpenSyncModal={() => setIsDriveModalOpen(true)} />

          {/* Minimalist Footer: ArcFace Status + Sign Out */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.4rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>ArcFace AI</span>
            </div>

            <button
              type="button"
              onClick={logout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.7rem',
                padding: '0.15rem 0.3rem',
              }}
              title="Sign out"
            >
              <LogOut size={11} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Google Drive Configuration Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />
    </>
  );
};
