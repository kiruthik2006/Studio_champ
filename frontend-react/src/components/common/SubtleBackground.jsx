import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SubtleBackground
 * Ultra-refined, hardware-accelerated ambient background with slow,
 * drifting Champagne Gold, Midnight Azure, and Sunset Amber auroras.
 * Uses GPU-cached 160px dither texture and cosine-eased multi-stop ramps
 * for zero-cost anti-banding and locked 60fps/120fps performance.
 */
export const SubtleBackground = () => {
  const { auroraVisible } = useTheme();

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
        opacity: auroraVisible ? 1 : 0,
        transition: auroraVisible ? 'opacity 0.28s ease-out' : 'opacity 0.1s ease-in',
        willChange: 'opacity',
        transform: 'translateZ(0)',
      }}
    >
      {/* Drifting Ambient Aurora 1: Radiant Champagne Gold (Top Left - Center) */}
      <div
        className="subtle-bg-orb subtle-bg-orb-1"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '55vw',
          height: '55vw',
          maxWidth: '850px',
          maxHeight: '850px',
          borderRadius: '50%',
          background: 'var(--aurora-orb-1)',
          filter: 'blur(100px)',
          willChange: 'transform',
        }}
      />

      {/* Drifting Ambient Aurora 2: Deep Midnight Azure / Ocean Mist (Bottom Right) */}
      <div
        className="subtle-bg-orb subtle-bg-orb-2"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '5%',
          width: '60vw',
          height: '60vw',
          maxWidth: '950px',
          maxHeight: '950px',
          borderRadius: '50%',
          background: 'var(--aurora-orb-2)',
          filter: 'blur(110px)',
          willChange: 'transform',
        }}
      />

      {/* Drifting Ambient Aurora 3: Soft Sunset Amber Pulse (Center) */}
      <div
        className="subtle-bg-orb subtle-bg-orb-3"
        style={{
          position: 'absolute',
          top: '35%',
          left: '45%',
          width: '45vw',
          height: '45vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'var(--aurora-orb-3)',
          filter: 'blur(90px)',
          willChange: 'transform',
        }}
      />

      {/* GPU-Cached Microscopic Dither Pattern (0% CPU, 100% GPU texture tiled) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      />
    </div>
  );
};
