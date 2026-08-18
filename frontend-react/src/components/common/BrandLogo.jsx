import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo
 * Official Studio Champ brand logo using Logo.svg from root directory.
 */
export const BrandLogo = ({ size = 'normal', showBadge = false, textSuffix = '' }) => {
  const { isLight } = useTheme();

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const logoHeight = isSmall ? 32 : isLarge ? 48 : 38;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        userSelect: 'none',
      }}
    >
      <img
        src="/logo.svg"
        alt="Studio Champ Logo"
        style={{
          height: logoHeight,
          width: 'auto',
          maxWidth: isLarge ? '200px' : isSmall ? '130px' : '160px',
          objectFit: 'contain',
          display: 'block',
          transition: 'transform 0.2s ease',
        }}
      />

      {textSuffix && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            paddingLeft: '0.2rem',
            borderLeft: '1px solid var(--border-subtle)',
          }}
        >
          {textSuffix}
        </span>
      )}
    </div>
  );
};
