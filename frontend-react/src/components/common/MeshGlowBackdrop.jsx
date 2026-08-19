import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * MeshGlowBackdrop
 * Generates an artistic, multi-layer organic mesh gradient glow
 * based on the Figma 3-layer graduated blur + plus-lighter technique:
 * - Layer 1: Ambient deep amber/coral rim wave with 100px blur
 * - Layer 2: Radiant Champagne gold luminance body wave with 80px blur
 * - Layer 3: Incandescent core light flare with 50px blur + plus-lighter blend mode
 * - Subtle film grain overlay to eliminate 8-bit color banding
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
      }}
    >
      {/* 1. Ambient Background Atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(120% 120% at 50% 0%, rgba(251, 247, 238, 0.9) 0%, rgba(246, 241, 230, 0.95) 50%, rgba(240, 233, 218, 1) 100%)'
            : 'radial-gradient(120% 120% at 50% 0%, rgba(24, 21, 17, 0.75) 0%, rgba(13, 12, 11, 0.95) 50%, rgba(8, 8, 8, 1) 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* 2. Multi-Layer Organic Mesh Wave Glow Container */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          right: '5%',
          height: '80%',
          opacity: isLight ? 0.72 : 0.62,
          transition: 'opacity 0.4s ease',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Layer 1: Deep Amber / Coral Base Ambient Wave (Blur: 100px) */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '90%',
            height: '75%',
            borderRadius: '45% 55% 65% 35% / 40% 60% 40% 60%',
            background: isLight
              ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.38) 0%, rgba(245, 158, 11, 0.32) 50%, rgba(217, 119, 6, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(234, 88, 12, 0.48) 0%, rgba(180, 83, 9, 0.42) 50%, rgba(120, 53, 15, 0.25) 100%)',
            filter: 'blur(100px)',
            transform: 'scale(1.1)',
            animation: 'meshDriftSlow 24s ease-in-out infinite alternate',
          }}
        />

        {/* Layer 2: Radiant Champagne Gold Luminescence Wave (Blur: 80px) */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '75%',
            height: '65%',
            borderRadius: '55% 45% 40% 60% / 60% 35% 65% 40%',
            background: isLight
              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.6) 0%, rgba(245, 158, 11, 0.45) 60%, rgba(223, 185, 74, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(223, 185, 74, 0.75) 0%, rgba(201, 162, 39, 0.55) 60%, rgba(166, 133, 32, 0.35) 100%)',
            filter: 'blur(80px)',
            transform: 'scale(1.05)',
            animation: 'meshDriftMedium 18s ease-in-out infinite alternate',
          }}
        />

        {/* Layer 3: Incandescent Core Light Flare (Blur: 50px + Plus Lighter Blend) */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '30%',
            width: '45%',
            height: '45%',
            borderRadius: '50%',
            background: isLight
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 247, 224, 0.75) 45%, rgba(251, 191, 36, 0) 100%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(254, 240, 138, 0.8) 40%, rgba(223, 185, 74, 0) 100%)',
            filter: 'blur(52px)',
            mixBlendMode: isLight ? 'multiply' : 'plus-lighter',
            opacity: isLight ? 0.65 : 0.88,
            animation: 'meshDriftCore 14s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* 3. Secondary Bottom-Right Subtle Glow Wave */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '500px',
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(223, 185, 74, 0.12) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(201, 162, 39, 0.28) 0%, rgba(180, 83, 9, 0.14) 50%, transparent 80%)',
          filter: 'blur(90px)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* 4. Velvet Film Grain Overlay (Eliminates color banding on high-DPI displays) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: isLight ? 0.022 : 0.038,
          pointerEvents: 'none',
        }}
      >
        <filter id="meshGlowNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#meshGlowNoise)" />
      </svg>
    </div>
  );
};
