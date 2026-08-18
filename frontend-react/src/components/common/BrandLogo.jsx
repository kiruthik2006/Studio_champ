import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo
 * "Presence." Brand Identity:
 * Renders the crisp white camera logo directly alongside the bold "Presence." typography and slogan,
 * designed to sit seamlessly within a smooth fading dark gradient.
 */
export const BrandLogo = ({ size = 'normal', showBadge = false, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const logoHeight = isSmall ? 22 : isLarge ? 32 : 26;
  const titleFontSize = isSmall ? '1.15rem' : isLarge ? '1.65rem' : '1.38rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.75rem' : '0.9rem',
        userSelect: 'none',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Pure White Logo Icon (Direct, No Hard Box) */}
      <img
        src="/logo_visible_white.png"
        alt="Presence Logo"
        style={{
          height: `${logoHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
          transition: 'transform 0.2s ease',
        }}
      />

      {/* Brand Name & Slogan */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
            }}
          >
            Presence<span style={{ color: 'var(--primary)' }}>.</span>
          </span>

          {showBadge && (
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.12rem 0.4rem',
                borderRadius: '5px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                display: 'inline-flex',
                alignItems: 'center',
                lineHeight: 1,
              }}
            >
              AI
            </span>
          )}

          {textSuffix && (
            <span
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.75)',
                fontWeight: 600,
                paddingLeft: '0.35rem',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {textSuffix}
            </span>
          )}
        </div>

        {/* Brand Slogan */}
        {!isSmall && (
          <span
            style={{
              fontSize: '0.64rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '0.22rem',
              textShadow: '0 1px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            AI Event Discovery
          </span>
        )}
      </div>
    </div>
  );
};
