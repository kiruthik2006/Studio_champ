import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MeshGlowBackdrop - Iteration Variant 2: Prismatic Amber & Canary Aurora Wave
 * Creates an organic S-curve illuminated lightwave sweeping from bottom-left through the viewport:
 * - Layer 1: Crimson-Coral Deep Halo (#FF3636 / #E11D48)
 * - Layer 2: Warm Amber Wave (#FB923C / #F59E0B)
 * - Layer 3: Radiant Canary Gold Luminescence (#FFE436 / #EAB308)
 * - Layer 4: Incandescent White Flare Core (#FFFFFF)
 * - Layer 5: Ambient Upper-Right Prismatic Glow
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
      }}
    >
      {/* 1. Base Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(130% 130% at 50% 20%, #faf8f5 0%, #f4eee1 50%, #e9dfcc 100%)'
            : 'radial-gradient(130% 130% at 50% 20%, #151412 0%, #0d0c0b 55%, #050505 100%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* 2. Main S-Curve Aurora Lightwave (Rising Bottom-Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-18%',
          left: '-10%',
          width: '90vw',
          height: '80vh',
          opacity: isLight ? 0.72 : 0.52,
          background: isLight
            ? `
              radial-gradient(circle 260px at 40% 75%, rgba(255, 255, 255, 0.98) 0%, rgba(254, 249, 215, 0.8) 32%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 42% 70%, rgba(255, 228, 54, 0.58) 0%, rgba(245, 190, 35, 0.38) 42%, transparent 74%),
              radial-gradient(ellipse 70% 55% at 38% 62%, rgba(223, 185, 74, 0.42) 0%, rgba(201, 162, 39, 0.25) 45%, transparent 78%),
              radial-gradient(ellipse 85% 70% at 35% 55%, rgba(180, 130, 20, 0.18) 0%, rgba(146, 100, 12, 0.08) 50%, transparent 82%)
            `
            : `
              radial-gradient(circle 250px at 40% 75%, rgba(255, 248, 220, 0.6) 0%, rgba(251, 191, 36, 0.38) 30%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 42% 70%, rgba(223, 185, 74, 0.5) 0%, rgba(201, 140, 39, 0.32) 40%, transparent 74%),
              radial-gradient(ellipse 70% 55% at 38% 62%, rgba(217, 119, 6, 0.38) 0%, rgba(180, 83, 9, 0.22) 45%, transparent 78%),
              radial-gradient(ellipse 85% 70% at 35% 55%, rgba(225, 29, 72, 0.25) 0%, rgba(159, 18, 57, 0.12) 50%, transparent 82%)
            `,
          filter: isLight ? 'blur(48px)' : 'blur(58px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          animation: 'meshDriftSlow 22s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Secondary Diagonal Ambient Counter-Glow (Top-Right) */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '650px',
          height: '550px',
          opacity: isLight ? 0.6 : 0.42,
          background: isLight
            ? `
              radial-gradient(circle 200px at 55% 45%, rgba(255, 255, 255, 0.9) 0%, rgba(254, 249, 215, 0.5) 35%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 228, 54, 0.38) 0%, rgba(223, 185, 74, 0.22) 45%, transparent 75%),
              radial-gradient(ellipse 80% 65% at 45% 55%, rgba(201, 162, 39, 0.14) 0%, transparent 80%)
            `
            : `
              radial-gradient(circle 200px at 55% 45%, rgba(255, 248, 220, 0.4) 0%, rgba(223, 185, 74, 0.25) 35%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(217, 119, 6, 0.22) 0%, rgba(180, 83, 9, 0.14) 45%, transparent 75%),
              radial-gradient(ellipse 80% 65% at 45% 55%, rgba(225, 29, 72, 0.15) 0%, transparent 80%)
            `,
          filter: isLight ? 'blur(52px)' : 'blur(62px)',
          transform: 'translate3d(0, 0, 0)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

