import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }) => {
  const { isLight, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-slider ${className}`}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      style={{
        position: 'relative',
        width: '56px',
        height: '28px',
        borderRadius: '999px',
        background: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
        border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(201, 162, 39, 0.35)'}`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
      }}
    >
      {/* Sliding Knob */}
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: isLight ? '#ffffff' : 'var(--gradient-gold)',
          color: isLight ? '#b88a1b' : '#0d0d0d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isLight ? '0 2px 6px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.4)',
          transform: isLight ? 'translateX(28px)' : 'translateX(0px)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease',
        }}
      >
        {isLight ? <Sun size={13} color="#b88a1b" strokeWidth={2.5} /> : <Moon size={13} color="#0d0d0d" strokeWidth={2.5} />}
      </div>
    </button>
  );
};
