import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles } from 'lucide-react';

export const BrandLogo = ({ size = 'normal', showBadge = true, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconDimension = isSmall ? 32 : isLarge ? 44 : 36;
  const fontSize = isSmall ? '1.15rem' : isLarge ? '1.65rem' : '1.35rem';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isSmall ? '0.65rem' : '0.8rem', userSelect: 'none' }}>
      {/* Precision AI Biometric Lens Emblem */}
      <div
        style={{
          width: iconDimension,
          height: iconDimension,
          borderRadius: isSmall ? '9px' : '11px',
          background: isLight
            ? 'linear-gradient(145deg, #1c1c1f 0%, #09090b 100%)'
            : 'linear-gradient(145deg, #24221e 0%, #0f0e0c 100%)',
          border: isLight
            ? '1px solid rgba(201, 162, 39, 0.45)'
            : '1px solid rgba(223, 185, 74, 0.5)',
          boxShadow: isLight
            ? '0 3px 12px rgba(0, 0, 0, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
            : '0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(223, 185, 74, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          transition: 'transform 0.2s ease',
        }}
      >
        <svg
          width={iconDimension * 0.58}
          height={iconDimension * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* High-tech biometric scan brackets */}
          <path
            d="M3.5 7.5V4.5C3.5 3.94772 3.94772 3.5 4.5 3.5H7.5"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16.5 3.5H19.5C20.0523 3.5 20.5 3.94772 20.5 4.5V7.5"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20.5 16.5V19.5C20.5 20.0523 20.0523 20.5 19.5 20.5H16.5"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7.5 20.5H4.5C3.94772 20.5 3.5 20.0523 3.5 19.5V16.5"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Glowing Aperture Core */}
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="#ffffff"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="1.75"
            fill="#f59e0b"
          />
        </svg>
      </div>

      {/* Modern Sans-Serif Typography */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: fontSize,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
              lineHeight: 1.1,
            }}
          >
            Face<span style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
            }}>Rec</span>
          </span>

          {showBadge && (
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px',
                background: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)',
                color: isLight ? '#1f2937' : '#e5e7eb',
                border: `1px solid ${isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.12)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
            >
              AI
            </span>
          )}

          {textSuffix && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {textSuffix}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
