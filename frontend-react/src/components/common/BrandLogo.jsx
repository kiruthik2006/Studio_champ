import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo
 * Official Studio Champ brand logo with dynamic light & dark theme adaptation.
 * Ensures the logo is bold, clearly visible, and properly sized across all backgrounds.
 */
export const BrandLogo = ({ size = 'normal', textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const logoHeight = isSmall ? 22 : isLarge ? 36 : 28;
  const logoSrc = isLight ? '/logo_visible_dark.png' : '/logo_visible_white.png';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        userSelect: 'none',
      }}
    >
      <img
        src={logoSrc}
        alt="Studio Champ Logo"
        style={{
          height: `${logoHeight}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          filter: isLight
            ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))'
            : 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
        }}
      />

      {textSuffix && (
        <span
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            paddingLeft: '0.4rem',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          {textSuffix}
        </span>
      )}
    </div>
  );
};
