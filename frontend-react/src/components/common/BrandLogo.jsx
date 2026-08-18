import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo
 * "Presence." Enveloped Rounded Rectangle Badge:
 * Unifies the white camera logo, bold "Presence." typography, and slogan inside a single
 * luxury obsidian rounded badge with gold trim, matching the rounded card aesthetic of the app.
 */
export const BrandLogo = ({ size = 'normal', showBadge = false, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const logoHeight = isSmall ? 18 : isLarge ? 26 : 21;
  const titleFontSize = isSmall ? '1.08rem' : isLarge ? '1.45rem' : '1.24rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.65rem' : '0.75rem',
        padding: isSmall ? '0.35rem 0.8rem' : isLarge ? '0.55rem 1.25rem' : '0.45rem 1rem',
        borderRadius: isSmall ? '10px' : '12px',
        background: 'linear-gradient(145deg, #1d1c1a 0%, #0e0d0b 100%)',
        border: '1px solid rgba(223, 185, 74, 0.45)',
        boxShadow: isLight
          ? '0 2px 10px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          : '0 4px 14px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(223, 185, 74, 0.2)',
        userSelect: 'none',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
      className="brand-capsule"
    >
      {/* Pure White Logo Icon */}
      <img
        src="/logo_visible_white.png"
        alt="Presence Logo"
        style={{
          height: `${logoHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />

      {/* Brand Name & Slogan */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            Presence<span style={{ color: 'var(--primary)' }}>.</span>
          </span>

          {showBadge && (
            <span
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              AI
            </span>
          )}

          {textSuffix && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                paddingLeft: '0.3rem',
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
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.65)',
              marginTop: '0.18rem',
            }}
          >
            AI Event Discovery
          </span>
        )}
      </div>
    </div>
  );
};
