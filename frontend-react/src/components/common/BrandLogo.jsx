import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo
 * "Presence" Brand Identity:
 * Encloses the pure white camera logo in a dedicated luxury obsidian badge box with gold trim,
 * paired with bold "Presence" typography and sleek slogan/subtitle.
 */
export const BrandLogo = ({ size = 'normal', showBadge = true, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  // Box dimensions
  const boxDimension = isSmall ? 35 : isLarge ? 48 : 40;
  const logoHeight = isSmall ? 18 : isLarge ? 26 : 21;
  const titleFontSize = isSmall ? '1.18rem' : isLarge ? '1.65rem' : '1.38rem';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isSmall ? '0.7rem' : '0.85rem',
        userSelect: 'none',
      }}
    >
      {/* High-Contrast Emblem Box */}
      <div
        style={{
          width: `${boxDimension}px`,
          height: `${boxDimension}px`,
          borderRadius: isSmall ? '9px' : '11px',
          background: 'linear-gradient(145deg, #1f1e1b 0%, #0d0c0a 100%)',
          border: '1px solid rgba(223, 185, 74, 0.5)',
          boxShadow: isLight
            ? '0 2px 8px rgba(0, 0, 0, 0.18), inset 0 1px 1px rgba(255, 255, 255, 0.15)'
            : '0 4px 14px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(223, 185, 74, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          padding: '2px',
        }}
      >
        <img
          src="/logo_visible_white.png"
          alt="Presence Logo"
          style={{
            height: `${logoHeight}px`,
            width: 'auto',
            maxWidth: `${boxDimension - 6}px`,
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Brand Name & Slogan */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: '-0.035em',
              color: 'var(--text-main)',
              lineHeight: 1.1,
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
            <span
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                paddingLeft: '0.35rem',
                borderLeft: '1px solid var(--border-subtle)',
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
              color: 'var(--text-muted)',
              marginTop: '0.22rem',
            }}
          >
            AI Event Discovery
          </span>
        )}
      </div>
    </div>
  );
};
