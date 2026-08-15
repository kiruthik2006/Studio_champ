import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BrandLogo = ({ size = 'normal', showText = true, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const iconDimension = isSmall ? 32 : isLarge ? 48 : 38;
  const fontSize = isSmall ? '1.3rem' : isLarge ? '2rem' : '1.55rem';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: isSmall ? '0.6rem' : '0.75rem' }}>
      {/* Precision AI Face-Lens Emblem */}
      <div
        style={{
          width: iconDimension,
          height: iconDimension,
          borderRadius: isSmall ? '8px' : '11px',
          background: isLight
            ? 'linear-gradient(135deg, #18181b 0%, #09090b 100%)'
            : 'linear-gradient(135deg, #1c1b18 0%, #121110 100%)',
          border: isLight
            ? '1px solid rgba(184, 138, 27, 0.35)'
            : '1px solid rgba(201, 162, 39, 0.4)',
          boxShadow: isLight
            ? '0 3px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 14px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(201, 162, 39, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          flexShrink: 0,
          transition: 'all var(--transition-normal)',
        }}
      >
        <svg
          width={iconDimension * 0.58}
          height={iconDimension * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Target Biometric Corner Brackets */}
          <path
            d="M4 8V5C4 4.44772 4.44772 4 5 4H8"
            stroke="#dfb94a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M16 4H19C19.5523 4 20 4.44772 20 5V8"
            stroke="#dfb94a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M20 16V19C20 19.5523 19.5523 20 19 20H16"
            stroke="#dfb94a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M8 20H5C4.44772 20 4 19.5523 4 19V16"
            stroke="#dfb94a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Aperture Lens & AI Node */}
          <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="#fef08a"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="1.8"
            fill="#dfb94a"
          />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <span
          className="font-display"
          style={{
            fontSize: fontSize,
            fontWeight: 700,
            letterSpacing: '0.01em',
            color: 'var(--text-main)',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          <span>Face</span>
          <span
            style={{
              color: isLight ? '#9e7515' : '#dfb94a',
              marginLeft: '1px',
              fontStyle: 'normal',
            }}
          >
            Rec
          </span>
          {textSuffix && (
            <span
              style={{
                fontSize: isSmall ? '0.9rem' : '1.05rem',
                fontWeight: 400,
                color: 'var(--text-muted)',
                marginLeft: '0.45rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              {textSuffix}
            </span>
          )}
        </span>
      )}
    </div>
  );
};
