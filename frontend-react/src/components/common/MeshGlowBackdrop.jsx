import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MeshGlowBackdrop - Variant 2: Prismatic Amber & Canary Aurora Wave
 * Exact visual fidelity restored with static GPU layer caching:
 * - Layer 1: Crimson-Coral Deep Halo (#FF3636 / #E11D48)
 * - Layer 2: Warm Amber Wave (#FB923C / #F59E0B)
 * - Layer 3: Radiant Canary Gold Luminescence (#FFE436 / #EAB308)
 * - Layer 4: Incandescent White Flare Core (#FFFFFF)
 * - Layer 5: Ambient Upper-Right Prismatic Glow
 * - Static GPU rasterization cache (isolation: isolate) eliminates continuous re-blur lag.
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
          opacity: isLight ? 0.75 : 0.88,
          background: isLight
            ? `
              radial-gradient(circle 260px at 40% 75%, rgba(255, 255, 255, 0.98) 0%, rgba(254, 243, 199, 0.75) 32%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 42% 70%, rgba(255, 228, 54, 0.7) 0%, rgba(245, 158, 11, 0.42) 42%, transparent 74%),
              radial-gradient(ellipse 70% 55% at 38% 62%, rgba(251, 146, 60, 0.55) 0%, rgba(234, 88, 12, 0.32) 45%, transparent 78%),
              radial-gradient(ellipse 85% 70% at 35% 55%, rgba(255, 54, 54, 0.4) 0%, rgba(225, 29, 72, 0.2) 50%, transparent 82%)
            `
            : `
              radial-gradient(circle 260px at 40% 75%, rgba(255, 255, 255, 0.98) 0%, rgba(254, 240, 138, 0.82) 32%, transparent 68%),
              radial-gradient(ellipse 55% 45% at 42% 70%, rgba(255, 228, 54, 0.82) 0%, rgba(245, 158, 11, 0.55) 42%, transparent 74%),
              radial-gradient(ellipse 70% 55% at 38% 62%, rgba(251, 146, 60, 0.68) 0%, rgba(234, 88, 12, 0.42) 45%, transparent 78%),
              radial-gradient(ellipse 85% 70% at 35% 55%, rgba(255, 54, 54, 0.58) 0%, rgba(225, 29, 72, 0.3) 50%, transparent 82%)
            `,
          filter: 'blur(48px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
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
          opacity: isLight ? 0.65 : 0.75,
          background: isLight
            ? `
              radial-gradient(circle 200px at 55% 45%, rgba(255, 255, 255, 0.9) 0%, rgba(254, 240, 138, 0.5) 35%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 228, 54, 0.45) 0%, rgba(251, 146, 60, 0.25) 45%, transparent 75%),
              radial-gradient(ellipse 80% 65% at 45% 55%, rgba(255, 54, 54, 0.28) 0%, transparent 80%)
            `
            : `
              radial-gradient(circle 200px at 55% 45%, rgba(255, 255, 255, 0.92) 0%, rgba(254, 240, 138, 0.6) 35%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 228, 54, 0.55) 0%, rgba(251, 146, 60, 0.35) 45%, transparent 75%),
              radial-gradient(ellipse 80% 65% at 45% 55%, rgba(255, 54, 54, 0.38) 0%, transparent 80%)
            `,
          filter: 'blur(52px)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

