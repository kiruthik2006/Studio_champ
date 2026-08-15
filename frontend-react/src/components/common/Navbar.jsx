import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { Camera, User, LogOut, Shield, LayoutDashboard, Menu, X, ChevronDown } from 'lucide-react';

export const Navbar = ({ onOpenLogin, onOpenRegister }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <BrandLogo size="normal" />
      </Link>

      {/* Center Links (on Landing) */}
      {isHome && (
        <ul className="nav-links">
          <li>
            <a href="#how-it-works" className="nav-link">How it Works</a>
          </li>
          <li>
            <a href="#features" className="nav-link">Features</a>
          </li>
          <li>
            <a href="#technology" className="nav-link">AI Tech</a>
          </li>
        </ul>
      )}

      {/* Right Side Actions */}
      <div className="nav-actions">
        {/* Theme Toggle Slider */}
        <ThemeToggle />

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
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
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
              </div>
              <span style={{ fontWeight: 600 }}>{user?.first_name || 'Account'}</span>
              <ChevronDown size={14} />
            </button>

            {userDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '210px',
                  background: 'var(--card-bg-elevated)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: '0.5rem',
                  zIndex: 1100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {user?.full_name || `${user?.first_name} ${user?.last_name}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>
                    {user?.email}
                  </div>
                  <span className="status-badge badge-gold" style={{ marginTop: '0.3rem', fontSize: '0.65rem' }}>
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setUserDropdownOpen(false)}
                  className="sidebar-item"
                  style={{ padding: '0.6rem 0.75rem' }}
                >
                  <LayoutDashboard size={16} />
                  <span>User Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserDropdownOpen(false)}
                    className="sidebar-item"
                    style={{ padding: '0.6rem 0.75rem', color: 'var(--primary)' }}
                  >
                    <Shield size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="sidebar-item"
                  style={{ padding: '0.6rem 0.75rem' }}
                >
                  <User size={16} />
                  <span>Profile Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="sidebar-item"
                  style={{ padding: '0.6rem 0.75rem', color: '#ff8585' }}
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
              Register Face
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>Theme Mode</span>
            <ThemeToggle />
          </div>

          {isHome && (
            <>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', padding: '0.5rem 0' }}>How it Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', padding: '0.5rem 0' }}>Features</a>
              <a href="#technology" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-main)', padding: '0.5rem 0' }}>AI Tech</a>
            </>
          )}

          {!isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
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
                Register Face
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
