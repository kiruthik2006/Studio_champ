import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { photosApi } from '../../api/photos';
import {
  Search,
  Calendar,
  Camera,
  Shield,
  LayoutDashboard,
  User,
  ExternalLink,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';

export const SpotlightSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { isLight } = useTheme();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadEvents();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const loadEvents = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await photosApi.getEvents();
      const raw = res?.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.events) ? raw.events : [];
      setEvents(list);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickActions = [
    ...(isAuthenticated ? [
      {
        id: 'capture',
        title: 'Register Face Biometrics',
        desc: 'Open webcam to capture reference vector embeddings',
        icon: <Camera size={16} color="#f59e0b" />,
        action: () => { onClose(); navigate('/dashboard'); },
      },
      {
        id: 'my-photos',
        title: 'Find My Matched Photos',
        desc: 'Scan albums with 512-D neural cosine similarity',
        icon: <Sparkles size={16} color="#10b981" />,
        action: () => { onClose(); navigate('/dashboard'); },
      },
    ] : [
      {
        id: 'home',
        title: 'Return to Home',
        desc: 'Explore FaceRec features & technology',
        icon: <Sparkles size={16} color="#f59e0b" />,
        action: () => { onClose(); navigate('/'); },
      }
    ]),
    ...(isAdmin ? [
      {
        id: 'admin',
        title: 'Admin Control Center',
        desc: 'Manage events, albums & batch photo ingestion',
        icon: <Shield size={16} color="#dfb94a" />,
        action: () => { onClose(); navigate('/admin'); },
      }
    ] : []),
    ...(isAuthenticated ? [
      {
        id: 'profile',
        title: 'Account & Security Settings',
        desc: 'Update email, name or password',
        icon: <User size={16} color="#60a5fa" />,
        action: () => { onClose(); navigate('/profile'); },
      }
    ] : []),
  ];

  const filteredEvents = events.filter((e) =>
    (e.name && e.name.toLowerCase().includes(query.toLowerCase())) ||
    (e.location && e.location.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{ zIndex: 3000, alignItems: 'flex-start', paddingTop: '12vh' }}
    >
      <div
        className="modal-content glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          padding: '0',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: isLight
            ? '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)'
            : '0 24px 70px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Search Header Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          padding: '1.1rem 1.4rem',
          borderBottom: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
          background: isLight ? '#ffffff' : '#181716',
        }}>
          <Search size={20} color="var(--primary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search events, quick actions, or jump to page... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: 'var(--text-main)',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '1rem' }}>
          {/* Quick Actions */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
              padding: '0.3rem 0.5rem 0.5rem',
            }}>
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {quickActions.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    background: isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'}`,
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </button>
              ))}
            </div>
          </div>

          {/* Events Search Result */}
          {events.length > 0 && (
            <div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-muted)',
                padding: '0.3rem 0.5rem 0.5rem',
              }}>
                Events ({filteredEvents.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {filteredEvents.slice(0, 5).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => { onClose(); navigate('/dashboard'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      background: 'transparent',
                      border: '1px solid transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                      <Calendar size={16} color="var(--primary)" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {ev.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ev.location || 'All Venues'} • {ev.photo_count || 0} photos
                        </div>
                      </div>
                    </div>
                    <span className="status-badge badge-gold" style={{ fontSize: '0.65rem' }}>
                      {ev.event_type || 'Event'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Tips */}
        <div style={{
          padding: '0.65rem 1.2rem',
          background: isLight ? '#f9fafb' : '#121110',
          borderTop: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <span>Navigate with mouse or quick click</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <kbd style={{
              background: isLight ? '#e5e7eb' : '#27272a',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}>ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
