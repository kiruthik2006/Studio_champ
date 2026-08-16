import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SubtleBackground
 * Ultra-refined, hardware-accelerated ambient background with slow,
 * drifting Champagne Gold, Midnight Azure, and Sunset Amber auroras.
 * Fades out smoothly to 0% during theme switching, then fades back in.
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
          bottom: '-20%',
          right: '5%',
          width: '60vw',
          height: '60vw',
          maxWidth: '950px',
          maxHeight: '950px',
          borderRadius: '50%',
          background: 'var(--aurora-orb-2)',
          filter: 'blur(120px)',
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

      {/* Ultra-subtle Vignette Shade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.35) 100%)',
          opacity: 'var(--ambient-opacity, 0.3)',
        }}
      />
    </div>
  );
};
