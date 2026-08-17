import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SubtleBackground
 * Ultra-lightweight, high-performance ambient background.
 * Uses hardware-accelerated CSS radial mesh without heavy blur filters or SVG noise,
 * keeping memory usage near 0 MB and preventing browser lag.
 */
export const SubtleBackground = () => {
  const { auroraVisible } = useTheme();

  if (!auroraVisible) return null;

  return (
    <div
      className="subtle-bg-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        background: `
          radial-gradient(circle at 15% 10%, rgba(201, 162, 39, 0.08) 0%, transparent 45%),
          radial-gradient(circle at 85% 90%, rgba(38, 132, 252, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(234, 67, 53, 0.03) 0%, transparent 60%)
        `,
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
    />
  );
};
