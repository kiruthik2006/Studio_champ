import React from 'react';

/**
 * SubtleBackground
 * Ultra-refined, hardware-accelerated ambient background with slow,
 * drifting warm gold and luxury umber auroras and breathing luminosity.
 */
export const SubtleBackground = () => {
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
      }}
    >
      {/* Drifting Ambient Aurora 1: Warm Champagne Gold (Top Left - Center) */}
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
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.09) 0%, rgba(223, 185, 74, 0.03) 45%, transparent 70%)',
          filter: 'blur(100px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Drifting Ambient Aurora 2: Deep Warm Amber / Bronze (Bottom Right) */}
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
          background: 'radial-gradient(circle, rgba(166, 133, 32, 0.08) 0%, rgba(139, 115, 85, 0.03) 50%, transparent 70%)',
          filter: 'blur(120px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Drifting Ambient Aurora 3: Soft Central Glow Pulse */}
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
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.05) 0%, rgba(26, 24, 21, 0.02) 60%, transparent 75%)',
          filter: 'blur(90px)',
          willChange: 'transform, opacity',
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
