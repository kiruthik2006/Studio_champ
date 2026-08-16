import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SubtleBackground
 * Ultra-refined, hardware-accelerated ambient background with slow,
 * drifting Champagne Gold, Midnight Azure, and Sunset Amber auroras.
 * Incorporates a hardware-accelerated microscopic Perlin dither layer
 * and cosine-eased multi-stop ramps to completely eliminate 8-bit color banding.
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

      {/* Microscopic Anti-Banding Dither Noise Film (Scatters 8-bit quantization artifacts) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.038,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      >
        <filter id="anti-banding-dither">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#anti-banding-dither)" />
      </svg>
    </div>
  );
};
