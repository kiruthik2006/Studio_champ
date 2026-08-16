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
  ShieldCheck,
  Cpu,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';

/**
 * DashboardSidebar
 * Rich, informative, high-utility sidebar featuring:
 * - User VIP profile header & biometric readiness status
 * - Live family circle avatar stack & vector health gauge
 * - Navigation menu with dynamic count badges and liquid morphing indicator
 * - Google Drive radial storage capacity meter & cloud sync widget
 * - AI Neural Engine telemetry
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

  // Compute total faces enrolled across all circle members
  const totalFaces = circleMembers.reduce((acc, m) => {
    const count = m.face_count || (m.faces ? m.faces.length : 0);
    return acc + count;
  }, 0);

  // Compute average vector health score
  const membersWithScore = circleMembers.filter((m) => m.vector_health_score !== undefined);
  const avgHealth =
    membersWithScore.length > 0
      ? Math.round(
          membersWithScore.reduce((acc, m) => acc + (m.vector_health_score || 0), 0) /
            membersWithScore.length
        )
      : totalFaces > 0
      ? Math.min(100, totalFaces * 25)
      : 0;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Studio Member';
  const userRole = user?.role === 'admin' ? 'Master Admin' : 'VIP Studio Client';

  return (
    <>
      <aside className="dashboard-sidebar" style={{ width: '280px', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        {/* 1. User Profile Mini Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.85rem 1rem',
            background: 'var(--card-bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--border-radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--avatar-bg)',
              color: 'var(--avatar-text)',
              border: '2px solid var(--avatar-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              flexShrink: 0,
            }}
          >
            {getInitials(userName)}
            <span
              style={{
                position: 'absolute',
                bottom: '1px',
                right: '1px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid var(--card-bg)',
              }}
              title="Biometrics Engine Active"
            />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: 'var(--text-main)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userName}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={12} />
              <span>{userRole}</span>
            </div>
          </div>
        </div>

        {/* 2. Biometric Circle Readiness Glance Card */}
        <div
          style={{
            padding: '0.85rem',
            background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.08) 0%, rgba(201, 162, 39, 0.02) 100%)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--border-radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Circle Health
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: avgHealth >= 75 ? '#10b981' : avgHealth >= 50 ? 'var(--primary)' : '#f59e0b',
              }}
            >
              {avgHealth}% Ready
            </span>
          </div>

          {/* Health Progress Track */}
          <div
            style={{
              height: '5px',
              borderRadius: '999px',
              background: 'rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(5, avgHealth)}%`,
                background:
                  avgHealth >= 75
                    ? 'linear-gradient(90deg, #10b981, #34d399)'
                    : 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Member Avatar Stack & Quick Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {circleMembers.slice(0, 4).map((member, idx) => (
                <div
                  key={member.id}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: member.is_self ? 'var(--gradient-gold)' : 'var(--card-bg-elevated)',
                    color: member.is_self ? '#0d0d0d' : 'var(--text-main)',
                    border: '2px solid var(--sidebar-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    marginLeft: idx === 0 ? 0 : '-6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                  title={`${member.name} (${member.face_count || 0} faces)`}
                >
                  {member.name.charAt(0)}
                </div>
              ))}
              {circleMembers.length > 4 && (
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--border-subtle)',
                    color: 'var(--text-muted)',
                    border: '2px solid var(--sidebar-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    marginLeft: '-6px',
                  }}
                >
                  +{circleMembers.length - 4}
                </div>
              )}
            </div>

            {onStartJourney && (
              <button
                type="button"
                onClick={onStartJourney}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.72rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  padding: '0.18rem 0.45rem',
                  borderRadius: '6px',
                  background: 'rgba(201, 162, 39, 0.12)',
                  transition: 'all 0.18s ease',
                }}
              >
                <Sparkles size={11} />
                <span>Enroll</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Navigation Menu with Dynamic Counter Badges */}
        <div className="sidebar-menu">
          <LiquidSidebarIndicator activeTab={activeTab} tabRefs={tabRefs} />

          <button
            ref={(el) => (tabRefs.current['face-registration'] = el)}
            className={`sidebar-item ${activeTab === 'face-registration' ? 'active' : ''}`}
            onClick={() => setActiveTab('face-registration')}
          >
            <UserPlus size={18} />
            <span style={{ flex: 1 }}>Face & Circle</span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.15rem 0.45rem',
                borderRadius: '999px',
                background: activeTab === 'face-registration' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                color: 'inherit',
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
            <Calendar size={18} />
            <span style={{ flex: 1 }}>Browse Events</span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.15rem 0.45rem',
                borderRadius: '999px',
                background: activeTab === 'events' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)',
                color: 'inherit',
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
            <Images size={18} />
            <span style={{ flex: 1 }}>Matched Photos</span>
            {matchedPhotosCount > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
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
            <Settings size={18} />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Bottom Dock Group (Pinned directly to the bottom above sign out) */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingTop: '0.75rem' }}>
          {/* AI Engine Status */}
          <div
            style={{
              padding: '0.55rem 0.75rem',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Cpu size={12} color="var(--primary)" />
              <span>ArcFace 512-D Engine</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
              <span>Online</span>
            </div>
          </div>

          {/* Google Drive Radial Storage Meter & Cloud Sync Widget (Directly above Sign Out) */}
          <GoogleDriveStorageWidget onOpenSyncModal={() => setIsDriveModalOpen(true)} />

          {/* Footer & Quick Logout */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.45rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}
          >
            <span>Studio Champ v2.4</span>
            <button
              type="button"
              onClick={logout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: 'var(--text-muted)',
                transition: 'color 0.18s ease',
                cursor: 'pointer',
              }}
              title="Sign out of your session"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Google Drive Configuration & Auto-Sync Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
      />
    </>
  );
};
