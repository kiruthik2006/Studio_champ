import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const NeuralCanvas = () => {
  const canvasRef = useRef(null);
  const { isLight } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let width, height;
    let particles = [];
    let animationFrameId;
    let isScrollingTimeout;
    let isScrolling = false;

    // Optimized particle count: 35-45 is elegant & lightweight
    const count = window.innerWidth < 768 ? 24 : 42;
    const maxDist = 120;
    const maxDistSq = maxDist * maxDist;
    const color = isLight ? '158, 117, 21' : '201, 162, 39';

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.4 + 0.6,
          opacity: isLight ? (Math.random() * 0.18 + 0.05) : (Math.random() * 0.3 + 0.08),
        });
      }
    }

    resize();
    createParticles();

    const handleResize = () => {
      resize();
      createParticles();
    };

    // Pause heavy canvas re-renders during active touch/wheel scroll
    const handleScroll = () => {
      isScrolling = true;
      clearTimeout(isScrollingTimeout);
      isScrollingTimeout = setTimeout(() => {
        isScrolling = false;
      }, 80);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let lastTime = 0;
    const fpsInterval = 1000 / 45; // Smooth 45fps cap for background canvas saves CPU/battery

    function draw(currentTime) {
      animationFrameId = requestAnimationFrame(draw);

      // Skip background frame calculation during fast scroll gestures for max smoothness
      if (isScrolling) return;

      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;

      // Fast connection lines without Math.sqrt()
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - distSq / maxDistSq) * (isLight ? 0.08 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      }
    }

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(isScrollingTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLight]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          pointerEvents: 'none',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />
      <div className="ambient-bg">
        <div className="ambient-glow ambient-glow-1" />
        <div className="ambient-glow ambient-glow-2" />
        <div className="ambient-glow ambient-glow-3" />
      </div>
    </>
  );
};
