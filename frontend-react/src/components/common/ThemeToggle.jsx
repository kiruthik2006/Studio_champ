import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '' }) => {
  const { isLight, toggleTheme } = useTheme();
  const isDarkOn = !isLight;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme(e);
      }}
      className={`theme-toggle-slider ${className}`}
      aria-label={`Switch to ${isDarkOn ? 'light' : 'dark'} mode`}
      title={`Dark Mode: ${isDarkOn ? 'ON (Click to turn off)' : 'OFF (Click to turn on)'}`}
      style={{
        position: 'relative',
        width: '56px',
        height: '28px',
        borderRadius: '999px',
        background: isDarkOn ? 'rgba(201, 162, 39, 0.15)' : 'rgba(0, 0, 0, 0.07)',
        border: `1px solid ${isDarkOn ? 'rgba(201, 162, 39, 0.4)' : 'rgba(0, 0, 0, 0.14)'}`,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
      }}
    >
      {/* Sliding Knob (ON = Right for Dark Mode, OFF = Left for Light Mode) */}
      <div
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: isDarkOn ? 'var(--gradient-gold)' : '#ffffff',
          color: isDarkOn ? '#0d0d0d' : '#8c640e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isDarkOn ? '0 2px 6px rgba(0,0,0,0.45)' : '0 2px 5px rgba(0,0,0,0.15)',
          transform: isDarkOn ? 'translateX(28px)' : 'translateX(0px)',
          transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease',
        }}
      >
        {isDarkOn ? (
          <Moon size={13} color="#0d0d0d" strokeWidth={2.5} />
        ) : (
          <Sun size={13} color="#8c640e" strokeWidth={2.5} />
        )}
      </div>
    </button>
  );
};
