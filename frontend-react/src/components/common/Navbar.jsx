import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { SpotlightSearchModal } from './SpotlightSearchModal';
import { photosApi } from '../../api/photos';
import {
  Camera,
  User,
  LogOut,
  Shield,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Search,
  CheckCircle,
  Plus,
  Upload,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onOpenLogin, onOpenRegister }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isLight } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [facesCount, setFacesCount] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for glass navbar with hysteresis to prevent bounce stutter
  useEffect(() => {
    let ticking = false;
    let isScrolled = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          // Hysteresis: turn on at > 40px, turn off only when fully at top (<= 5px)
          // Completely eliminates re-render flutter during macOS rubber-band bounce
          if (currentY > 40 && !isScrolled) {
            isScrolled = true;
            setScrolled(true);
          } else if (currentY <= 5 && isScrolled) {
            isScrolled = false;
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch live biometric registration count if logged in
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      photosApi.getMyFaces()
        .then((res) => {
          if (!isMounted) return;
          const faces = res?.data;
          const list = Array.isArray(faces) ? faces : Array.isArray(faces?.faces) ? faces.faces : [];
          setFacesCount(list.length);
        })
        .catch(() => {
          if (isMounted) setFacesCount(0);
        });
    } else {
      setFacesCount(null);
    }
    return () => { isMounted = false; };
  }, [isAuthenticated, location.pathname]);

  // Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Left: Brand Identity */}
        <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
          <BrandLogo size="normal" showBadge={false} />
        </Link>

        {/* Center: Search & Practical Context Actions */}
        <div className="nav-center-creative" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}>
          {/* Spotlight Search Trigger */}
          <button
            onClick={() => setSpotlightOpen(true)}
            className="spotlight-trigger-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.2rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '999px',
              background: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
              color: 'var(--text-muted)',
              fontSize: '0.83rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              minWidth: '210px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.09)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={14} color="var(--primary)" />
              <span>Search events & actions...</span>
            </span>
            <kbd style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
              border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '5px',
              padding: '0.1rem 0.35rem',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-main)',
            }}>
              ⌘K
            </kbd>
          </button>

          {/* Practical Live Context Badge */}
          {isAuthenticated ? (
            isAdmin ? (
              <button
                onClick={() => navigate('/admin')}
                className="practical-nav-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  background: isLight ? 'rgba(201, 162, 39, 0.09)' : 'rgba(201, 162, 39, 0.14)',
                  border: '1px solid rgba(201, 162, 39, 0.3)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: isLight ? '#9e7515' : '#dfb94a',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                title="Open Admin Control Center"
              >
                <Shield size={13} />
                <span>Admin Hub</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="practical-nav-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '999px',
                  background: facesCount && facesCount > 0
                    ? (isLight ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)')
                    : (isLight ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)'),
                  border: facesCount && facesCount > 0
                    ? '1px solid rgba(16, 185, 129, 0.25)'
                    : '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: facesCount && facesCount > 0
                    ? (isLight ? '#047857' : '#34d399')
                    : (isLight ? '#b45309' : '#fbbf24'),
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                title={facesCount && facesCount > 0 ? 'Face vectors active in matcher' : 'Register your face to discover photos'}
              >
                {facesCount && facesCount > 0 ? (
                  <>
                    <CheckCircle size={13} />
                    <span>{facesCount} {facesCount === 1 ? 'Face Registered' : 'Faces Registered'}</span>
                  </>
                ) : (
                  <>
                    <Camera size={13} />
                    <span>Register Face</span>
                  </>
                )}
              </button>
            )
          ) : (
            <button
              onClick={() => {
                if (isHome) {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/');
                }
              }}
              className="practical-nav-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                background: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Sparkles size={13} color="var(--primary)" />
              <span>Event Photo AI</span>
            </button>
          )}
        </div>

        {/* Right: Actions, Theme & Profile */}
        <div className="nav-actions">
          {/* Landing Nav Links */}
          {isHome && (
            <div className="nav-links-desktop" style={{ display: 'flex', gap: '1.2rem', marginRight: '0.4rem' }}>
              <a href="#how-it-works" className="nav-link" style={{ fontSize: '0.875rem' }}>How it Works</a>
              <a href="#technology" className="nav-link" style={{ fontSize: '0.875rem' }}>AI Tech</a>
            </div>
          )}

          {/* Theme Toggle Slider */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                }}
              >
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: 'var(--avatar-bg)',
                  color: 'var(--avatar-text)',
                  border: '1px solid var(--avatar-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  overflow: 'hidden',
                }}>
                  {user?.avatar_url || user?.picture ? (
                    <img
                      src={user.avatar_url || user.picture}
                      alt={user?.first_name || 'User'}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    user?.first_name ? user.first_name[0].toUpperCase() : 'U'
                  )}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {user?.first_name || 'Account'}
                </span>
                <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>

              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '220px',
                    background: 'var(--card-bg-elevated)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--border-radius-md)',
                    boxShadow: 'var(--shadow-xl)',
                    padding: '0.5rem',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {user?.full_name || `${user?.first_name} ${user?.last_name}`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {user?.email}
                    </div>
                    <span className="status-badge badge-gold" style={{ marginTop: '0.35rem', fontSize: '0.65rem' }}>
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="sidebar-item"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
                  >
                    <LayoutDashboard size={15} />
                    <span>User Dashboard</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="sidebar-item"
                      style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem', color: 'var(--primary)' }}
                    >
                      <Shield size={15} />
                      <span>Admin Control</span>
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="sidebar-item"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem' }}
                  >
                    <User size={15} />
                    <span>Profile Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="sidebar-item"
                    style={{ padding: '0.55rem 0.75rem', fontSize: '0.88rem', color: '#ef4444' }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={onOpenLogin}
                className="btn btn-outline btn-sm"
              >
                Sign In
              </button>
              <button
                onClick={onOpenRegister}
                className="btn btn-primary btn-sm"
              >
                <Camera size={14} /> Register Face
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '70px',
              left: 0,
              right: 0,
              background: 'var(--card-bg-elevated)',
              borderBottom: '1px solid var(--border-gold)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              zIndex: 999,
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <button
              onClick={() => { setMobileMenuOpen(false); setSpotlightOpen(true); }}
              className="btn btn-outline"
              style={{ justifyContent: 'flex-start', gap: '0.6rem', fontSize: '0.9rem' }}
            >
              <Search size={16} /> Quick Search Actions (⌘K)
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Theme Mode</span>
              <ThemeToggle />
            </div>

            {isHome && (
              <>
                <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', padding: '0.3rem 0' }}>How it Works</a>
                <a href="#technology" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', padding: '0.3rem 0' }}>AI Tech</a>
              </>
            )}

            {!isAuthenticated && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.3rem' }}>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="btn btn-outline"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRegister(); }}
                  className="btn btn-primary"
                >
                  <Camera size={15} /> Register Face
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spotlight Command Modal */}
      <SpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />
    </>
  );
};
