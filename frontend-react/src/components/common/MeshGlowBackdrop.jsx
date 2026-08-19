import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MeshGlowBackdrop
 * - Light Mode: Preserved exact original S-curve radiant aurora wave.
 * - Dark Mode: Refined luxury Champagne & Cognac Amber palette positioned at lower-right/mid-zone,
 *   completely clearing the top title bar zone to prevent collision with the navbar dark fade.
 */
export const MeshGlowBackdrop = () => {
  const { isLight } = useTheme();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        contain: 'strict',
        isolation: 'isolate',
      }}
    >
      {/* 1. Base Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(130% 130% at 50% 20%, #faf8f5 0%, #f4eee1 50%, #e9dfcc 100%)'
            : 'radial-gradient(140% 140% at 50% 0%, #121110 0%, #0a0a09 60%, #040404 100%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* 2. Main Aurora Mesh Glow (Positioned in Lower-Right for Dark Mode, Bottom-Left for Light Mode) */}
      <div
        style={{
          position: 'absolute',
          bottom: isLight ? '-18%' : '-22%',
          left: isLight ? '-10%' : '15%',
          right: isLight ? 'auto' : '-10%',
          width: isLight ? '90vw' : '85vw',
          height: isLight ? '80vh' : '75vh',
          opacity: isLight ? 0.75 : 0.82,
          background: isLight
            ? `
              radial-gradient(circle 260px at 40% 75%, rgba(255, 255, 255, 0.98) 0%, rgba(254, 243, 199, 0.75) 32%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 42% 70%, rgba(255, 228, 54, 0.7) 0%, rgba(245, 158, 11, 0.42) 42%, transparent 74%),
              radial-gradient(ellipse 70% 55% at 38% 62%, rgba(251, 146, 60, 0.55) 0%, rgba(234, 88, 12, 0.32) 45%, transparent 78%),
              radial-gradient(ellipse 85% 70% at 35% 55%, rgba(255, 54, 54, 0.4) 0%, rgba(225, 29, 72, 0.2) 50%, transparent 82%)
            `
            : `
              radial-gradient(ellipse 45% 35% at 65% 78%, rgba(255, 248, 220, 0.92) 0%, rgba(245, 218, 130, 0.65) 30%, transparent 65%),
              radial-gradient(ellipse 65% 50% at 60% 72%, rgba(223, 185, 74, 0.62) 0%, rgba(194, 65, 12, 0.38) 42%, transparent 74%),
              radial-gradient(ellipse 80% 65% at 55% 65%, rgba(180, 83, 9, 0.45) 0%, rgba(124, 45, 18, 0.22) 48%, transparent 78%),
              radial-gradient(ellipse 95% 75% at 50% 58%, rgba(153, 27, 27, 0.25) 0%, transparent 82%)
            `,
          filter: isLight ? 'blur(48px)' : 'blur(58px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      />

      {/* 3. Ambient Counter-Glow (Repositioned to Mid-Left in Dark Mode to completely clear the Title Bar) */}
      <div
        style={{
          position: 'absolute',
          top: isLight ? '-20%' : '35%',
          right: isLight ? '-10%' : 'auto',
          left: isLight ? 'auto' : '-12%',
          width: isLight ? '650px' : '520px',
          height: isLight ? '550px' : '480px',
          opacity: isLight ? 0.65 : 0.55,
          background: isLight
            ? `
              radial-gradient(circle 200px at 55% 45%, rgba(255, 255, 255, 0.9) 0%, rgba(254, 240, 138, 0.5) 35%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 228, 54, 0.45) 0%, rgba(251, 146, 60, 0.25) 45%, transparent 75%),
              radial-gradient(ellipse 80% 65% at 45% 55%, rgba(255, 54, 54, 0.28) 0%, transparent 80%)
            `
            : `
              radial-gradient(ellipse 55% 45% at 40% 50%, rgba(223, 185, 74, 0.35) 0%, rgba(180, 83, 9, 0.2) 45%, transparent 75%),
              radial-gradient(ellipse 75% 60% at 35% 55%, rgba(154, 52, 18, 0.18) 0%, transparent 80%)
            `,
          filter: isLight ? 'blur(52px)' : 'blur(64px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      />

      {/* 4. Top-Left Peripheral Corner Glow (Subtle accent flanking brand logo) */}
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          left: '-8%',
          width: '450px',
          height: '380px',
          opacity: isLight ? 0.6 : 0.5,
          background: isLight
            ? 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(251, 191, 36, 0.28) 0%, rgba(245, 158, 11, 0.12) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 60% 50% at 30% 30%, rgba(223, 185, 74, 0.25) 0%, rgba(180, 83, 9, 0.1) 45%, transparent 75%)',
          filter: 'blur(52px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      />

      {/* 5. Top-Right Peripheral Corner Glow (Subtle accent flanking profile controls) */}
      <div
        style={{
          position: 'absolute',
          top: '-12%',
          right: '-8%',
          width: '460px',
          height: '390px',
          opacity: isLight ? 0.65 : 0.52,
          background: isLight
            ? 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(255, 228, 54, 0.32) 0%, rgba(251, 146, 60, 0.14) 45%, transparent 75%)'
            : 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(201, 162, 39, 0.28) 0%, rgba(194, 65, 12, 0.12) 45%, transparent 75%)',
          filter: 'blur(54px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

