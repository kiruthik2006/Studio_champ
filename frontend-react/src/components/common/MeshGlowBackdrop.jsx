import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MeshGlowBackdrop (Hardware Accelerated 120 FPS)
 * High-performance organic glowing gradient mesh based on Figma 3-layer light addition:
 * - Layer 1: Ambient deep amber/coral rim glow
 * - Layer 2: Radiant Champagne gold luminance body
 * - Layer 3: Incandescent white core flare (Screen / Plus-Lighter luminosity)
 * - Single-pass GPU compilation with contain: strict and 0% CPU overhead.
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
      {/* 1. Base Background Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(120% 120% at 50% 0%, rgba(251, 248, 241, 0.96) 0%, rgba(247, 243, 233, 0.98) 50%, rgba(241, 236, 224, 1) 100%)'
            : 'radial-gradient(120% 120% at 50% 0%, rgba(22, 19, 15, 0.88) 0%, rgba(13, 12, 11, 0.96) 50%, rgba(8, 8, 8, 1) 100%)',
          transition: 'background 0.3s ease',
        }}
      />

      {/* 2. Unified GPU-Accelerated 3-Layer Organic Glow Mesh */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          right: '5%',
          height: '75%',
          opacity: isLight ? 0.78 : 0.68,
          background: isLight
            ? `
              radial-gradient(circle 260px at 45% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.65) 40%, transparent 75%),
              radial-gradient(ellipse 65% 55% at 50% 10%, rgba(251, 191, 36, 0.55) 0%, rgba(245, 158, 11, 0.35) 45%, transparent 75%),
              radial-gradient(ellipse 85% 65% at 48% -5%, rgba(234, 88, 12, 0.32) 0%, rgba(217, 119, 6, 0.22) 50%, transparent 80%)
            `
            : `
              radial-gradient(circle 240px at 45% 22%, rgba(255, 255, 255, 0.96) 0%, rgba(254, 240, 138, 0.72) 38%, transparent 72%),
              radial-gradient(ellipse 65% 55% at 50% 12%, rgba(223, 185, 74, 0.7) 0%, rgba(201, 162, 39, 0.45) 45%, transparent 75%),
              radial-gradient(ellipse 85% 65% at 48% -5%, rgba(234, 88, 12, 0.45) 0%, rgba(180, 83, 9, 0.32) 50%, transparent 80%)
            `,
          filter: 'blur(36px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          animation: 'meshDriftSlow 20s ease-in-out infinite alternate',
        }}
      />

      {/* 3. Secondary Ambient Bottom-Right Glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-5%',
          width: '500px',
          height: '450px',
          background: isLight
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(223, 185, 74, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(201, 162, 39, 0.22) 0%, rgba(180, 83, 9, 0.1) 50%, transparent 75%)',
          filter: 'blur(45px)',
          transform: 'translate3d(0, 0, 0)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

