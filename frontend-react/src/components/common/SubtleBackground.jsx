import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * SubtleBackground (Upgraded Luxury Liquid Aurora System)
 * Features:
 * - 4 Asynchronous Liquid Morphing Emitters with undulating organic geometry
 * - Inertial mouse-follow parallax drift
 * - Micro-film grain satin texture to eliminate gradient banding
 * - Theme-reactive luminance and silky smooth opacity transitions
 */
export const SubtleBackground = () => {
  const { auroraVisible, isLight } = useTheme();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const animFrameId = useRef(null);

  // Smooth lerp mouse parallax listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yPercent = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
      targetOffset.current = {
        x: xPercent * 24, // 24px max parallax range
        y: yPercent * 20, // 20px max parallax range
      };
    };

    let isRunning = true;
    const updateParallax = () => {
      if (!isRunning) return;
      // Spring lerp interpolation (0.05 factor for ultra-smooth inertia)
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.05;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.05;

      setMouseOffset({
        x: Math.round(currentOffset.current.x * 100) / 100,
        y: Math.round(currentOffset.current.y * 100) / 100,
      });

      animFrameId.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animFrameId.current = requestAnimationFrame(updateParallax);

    return () => {
      isRunning = false;
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

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
        transition: auroraVisible ? 'opacity 0.45s ease-out' : 'opacity 0.15s ease-in',
        willChange: 'opacity',
      }}
    >
      {/* Aurora Emitter Layer (Shifted gently by mouse parallax) */}
      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)',
          willChange: 'transform',
        }}
      >
        {/* Emitter 1: Radiant 24K Liquid Champagne Gold (North-West Flow) */}
        <div
          className="subtle-bg-orb subtle-aurora-emitter-1"
          style={{
            position: 'absolute',
            top: '-10%',
            left: '5%',
            width: '60vw',
            height: '55vw',
            maxWidth: '920px',
            maxHeight: '860px',
            background: isLight
              ? 'radial-gradient(ellipse at 40% 40%, rgba(197, 155, 39, 0.08) 0%, rgba(224, 185, 84, 0.03) 45%, transparent 70%)'
              : 'radial-gradient(ellipse at 40% 40%, rgba(218, 175, 55, 0.12) 0%, rgba(184, 138, 34, 0.04) 50%, transparent 72%)',
            filter: 'blur(95px)',
            willChange: 'transform, border-radius',
          }}
        />

        {/* Emitter 2: Deep Smoked Amber & Warm Bronze Luminescence (South-East Flow) */}
        <div
          className="subtle-bg-orb subtle-aurora-emitter-2"
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '2%',
            width: '65vw',
            height: '60vw',
            maxWidth: '1000px',
            maxHeight: '920px',
            background: isLight
              ? 'radial-gradient(ellipse at 60% 60%, rgba(184, 142, 42, 0.07) 0%, rgba(150, 115, 45, 0.025) 55%, transparent 72%)'
              : 'radial-gradient(ellipse at 60% 60%, rgba(176, 128, 38, 0.09) 0%, rgba(115, 82, 30, 0.03) 55%, transparent 75%)',
            filter: 'blur(110px)',
            willChange: 'transform, border-radius',
          }}
        />

        {/* Emitter 3: Center-Floating Luminous Ethereal Pulse */}
        <div
          className="subtle-bg-orb subtle-aurora-emitter-3"
          style={{
            position: 'absolute',
            top: '30%',
            left: '38%',
            width: '50vw',
            height: '50vw',
            maxWidth: '780px',
            maxHeight: '780px',
            background: isLight
              ? 'radial-gradient(circle, rgba(238, 202, 102, 0.06) 0%, rgba(200, 165, 75, 0.02) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(238, 202, 102, 0.07) 0%, rgba(160, 120, 30, 0.025) 55%, transparent 72%)',
            filter: 'blur(85px)',
            willChange: 'transform, border-radius',
          }}
        />

        {/* Emitter 4: Lateral Rose-Gold Whispering Drift (South-West Accent) */}
        <div
          className="subtle-bg-orb subtle-aurora-emitter-4"
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '-10%',
            width: '45vw',
            height: '45vw',
            maxWidth: '680px',
            maxHeight: '680px',
            background: isLight
              ? 'radial-gradient(circle, rgba(197, 140, 50, 0.05) 0%, rgba(180, 130, 60, 0.015) 60%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168, 115, 45, 0.06) 0%, rgba(95, 65, 25, 0.02) 60%, transparent 75%)',
            filter: 'blur(100px)',
            willChange: 'transform, border-radius',
          }}
        />
      </div>

      {/* Luxury Fine Satin Grain Texture Overlay (Removes digital gradient banding) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: isLight ? 0.022 : 0.035,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      >
        <filter id="aurora-satin-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-satin-noise)" />
      </svg>

      {/* Atmospheric Vignette Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isLight
            ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.04) 100%)'
            : 'radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.45) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
